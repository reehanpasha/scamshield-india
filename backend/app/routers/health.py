from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import get_db
from app.core.config import settings
from app.engine.ai_adapter import ThreatIntelligenceAdapter

router = APIRouter(prefix="/api/health", tags=["System Health"])

@router.get("")
def health_check(db: Session = Depends(get_db)):
    # Verify DB connectivity
    db_ok = True
    try:
        db.execute(text("SELECT 1"))
    except Exception:
        db_ok = False

    provider_status = ThreatIntelligenceAdapter.get_provider_status()

    return {
        "status": "HEALTHY" if db_ok else "DEGRADED",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "rules_version": settings.RULES_VERSION,
        "database_connected": db_ok,
        "providers": provider_status,
        "ssrf_protection": "ACTIVE",
        "indian_cyber_ruleset": "LOADED"
    }
