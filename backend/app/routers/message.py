import json
import re
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import ScanRecord, AuditLog
from app.schemas.schemas import MessageAnalysisResponse
from app.engine.message_detector import analyze_message_content

router = APIRouter(prefix="/api/message", tags=["Message Intelligence"])

@router.post("/analyze", response_model=MessageAnalysisResponse)
async def analyze_message(request: Request, db: Session = Depends(get_db)):
    """
    Analyzes message content for Indian cybersecurity threat indicators.
    Accepts standard JSON (`{"content": "...", "message_type": "SMS"}`), unquoted curl payloads, or raw text.
    """
    content = ""
    message_type = "SMS"
    language = "AUTO"

    try:
        data = await request.json()
        if isinstance(data, dict):
            content = data.get("content", "").strip()
            message_type = data.get("message_type", "SMS")
            language = data.get("language", "AUTO")
        elif isinstance(data, str):
            content = data.strip()
    except Exception:
        try:
            raw_body = (await request.body()).decode("utf-8", errors="ignore").strip()
            match = re.search(r'["\']?content["\']?\s*[:=]\s*["\']?([^"\'}]+)', raw_body)
            if match:
                content = match.group(1).strip()
            else:
                content = raw_body
        except Exception:
            pass

    if not content:
        raise HTTPException(status_code=400, detail="Message content cannot be empty.")

    result = analyze_message_content(
        content=content,
        message_type=message_type,
        declared_lang=language
    )

    if not result.get("valid", False):
        raise HTTPException(status_code=400, detail=result.get("error", "Failed to analyze message"))

    category = result["categories"][0] if result.get("categories") else "General Communication"

    scan = ScanRecord(
        scan_type="message",
        input_target=content[:200] + ("..." if len(content) > 200 else ""),
        risk_score=result["risk_score"],
        risk_level=result["risk_level"],
        confidence=result["confidence"],
        category=category,
        details_json=json.dumps({
            "message_type": message_type,
            "detected_language": result["detected_language"],
            "categories": result.get("categories", []),
            "triggered_rules_count": result.get("triggered_rules_count", 0)
        })
    )
    db.add(scan)

    audit = AuditLog(
        action="MESSAGE_SCAN",
        target_type="MESSAGE",
        target_id=scan.id,
        actor="Client Analyst",
        details=f"Analyzed {message_type} ({result['detected_language']}) - Score {result['risk_score']}"
    )
    db.add(audit)
    db.commit()
    db.refresh(scan)

    result["scan_id"] = scan.id
    return result
