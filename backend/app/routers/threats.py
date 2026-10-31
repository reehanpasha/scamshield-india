from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.db.session import get_db
from app.db.models import ThreatIndicator
from app.schemas.schemas import ThreatIndicatorItem

router = APIRouter(prefix="/api/threats", tags=["Threat Explorer"])

@router.get("", response_model=List[ThreatIndicatorItem])
def get_threats(
    query: Optional[str] = Query(None, description="Search term for domain, indicator, or category"),
    category: Optional[str] = Query(None, description="Filter by scam category"),
    risk_level: Optional[str] = Query(None, description="Filter by risk level"),
    verified_only: Optional[bool] = Query(None, description="Only show verified threats"),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    q = db.query(ThreatIndicator)
    if query:
        search_filter = or_(
            ThreatIndicator.indicator_value.ilike(f"%{query}%"),
            ThreatIndicator.scam_category.ilike(f"%{query}%"),
            ThreatIndicator.description.ilike(f"%{query}%")
        )
        q = q.filter(search_filter)

    if category:
        q = q.filter(ThreatIndicator.scam_category == category)
    if risk_level:
        q = q.filter(ThreatIndicator.risk_level == risk_level.upper())
    if verified_only is not None:
        q = q.filter(ThreatIndicator.verified == verified_only)

    return q.order_by(ThreatIndicator.last_seen.desc()).limit(limit).all()

@router.get("/graph", response_model=Dict[str, Any])
def get_threat_relationship_graph(db: Session = Depends(get_db)):
    """
    Generates genuine graph nodes and edges from stored threat indicators,
    connecting categories to specific indicators and threat origins.
    """
    threats = db.query(ThreatIndicator).limit(30).all()

    nodes = []
    edges = []
    category_nodes = set()
    node_ids = set()

    # Root hub
    nodes.append({
        "id": "hub-india",
        "label": "National Cyber Threat Mesh",
        "type": "hub",
        "color": "#06b6d4"
    })
    node_ids.add("hub-india")

    for t in threats:
        cat_id = f"cat-{t.scam_category}"
        if cat_id not in category_nodes:
            category_nodes.add(cat_id)
            nodes.append({
                "id": cat_id,
                "label": t.scam_category.replace("_", " "),
                "type": "category",
                "color": "#818cf8"
            })
            node_ids.add(cat_id)
            edges.append({
                "source": "hub-india",
                "target": cat_id,
                "label": "monitors"
            })

        t_id = f"ind-{t.id[:8]}"
        if t_id not in node_ids:
            nodes.append({
                "id": t_id,
                "label": t.indicator_value,
                "type": "indicator",
                "risk": t.risk_level,
                "color": "#ef4444" if t.risk_level == "CRITICAL" else "#f59e0b"
            })
            node_ids.add(t_id)
            edges.append({
                "source": cat_id,
                "target": t_id,
                "label": t.indicator_type
            })

    return {
        "nodes": nodes,
        "edges": edges,
        "verified_count": len([t for t in threats if t.verified]),
        "total_relationships": len(edges)
    }
