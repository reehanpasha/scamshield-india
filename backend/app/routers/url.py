import json
import re
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import ScanRecord, AuditLog
from app.schemas.schemas import UrlAnalysisResponse
from app.engine.url_detector import analyze_url_structure

router = APIRouter(prefix="/api/url", tags=["URL Intelligence"])

@router.post("/analyze", response_model=UrlAnalysisResponse)
async def analyze_url(request: Request, db: Session = Depends(get_db)):
    """
    Analyzes suspicious URLs against lookalike domains, homoglyphs, and SSRF restrictions.
    Accepts standard JSON (`{"url": "..."}`), unquoted terminal curl payloads, or plain text.
    """
    url = ""
    content_type = request.headers.get("content-type", "")

    # 1. Try standard JSON parsing
    try:
        data = await request.json()
        if isinstance(data, dict):
            url = data.get("url", "").strip()
        elif isinstance(data, str):
            url = data.strip()
    except Exception:
        # 2. Resilient fallback for terminal curl / Windows PowerShell unquoted keys
        try:
            raw_body = (await request.body()).decode("utf-8", errors="ignore").strip()
            # If payload is like: {url: http://...} or {"url": ...} with stripped quotes
            match = re.search(r'["\']?url["\']?\s*[:=]\s*["\']?([^"\'}\s]+)', raw_body)
            if match:
                url = match.group(1).strip()
            elif raw_body.startswith(("http://", "https://")) or ("." in raw_body and not raw_body.startswith("{")):
                url = raw_body.strip()
        except Exception:
            pass

    if not url:
        raise HTTPException(
            status_code=400,
            detail="URL cannot be empty. Please provide a target URL in JSON payload: {\"url\": \"https://...\"}"
        )

    result = analyze_url_structure(url)
    if not result.get("valid", False):
        raise HTTPException(status_code=400, detail=result.get("error", "Invalid URL structure"))

    # Determine primary category
    category = "General Threat"
    if result.get("detected_brand"):
        category = f"Brand Impersonation ({result['detected_brand'].upper()})"
    elif result.get("is_ip_host"):
        category = "Direct IP Host Phishing"
    elif result.get("is_shortener"):
        category = "Obfuscated Shortener"
    elif result.get("risk_score", 0) < 25:
        category = "Low Risk / Clean URL"

    # Save to database
    scan = ScanRecord(
        scan_type="url",
        input_target=url,
        risk_score=result["risk_score"],
        risk_level=result["risk_level"],
        confidence=result["confidence"],
        category=category,
        details_json=json.dumps({
            "hostname": result.get("hostname"),
            "apex_domain": result.get("apex_domain"),
            "findings": result.get("findings", []),
            "evidence_count": len(result.get("evidence", [])),
            "stages": result.get("stages", [])
        })
    )
    db.add(scan)

    audit = AuditLog(
        action="URL_SCAN",
        target_type="URL",
        target_id=result.get("hostname", url)[:64],
        actor="Client Analyst",
        details=f"Analyzed URL: {url[:100]} with score {result['risk_score']}"
    )
    db.add(audit)
    db.commit()
    db.refresh(scan)

    result["scan_id"] = scan.id
    return result
