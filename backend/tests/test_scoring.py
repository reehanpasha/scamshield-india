import pytest
from app.engine.scoring import aggregate_risk_score

def test_aggregate_empty_indicators():
    res = aggregate_risk_score([])
    assert res["score"] == 0
    assert res["level"] == "LOW"
    assert res["indicators_evaluated"] == 0

def test_aggregate_deduplication():
    # If the same indicator type appears multiple times, it shouldn't inflate repeatedly
    indicators = [
        {"type": "SUSPICIOUS_TLD", "score_impact": 25},
        {"type": "SUSPICIOUS_TLD", "score_impact": 25},
        {"type": "BRAND_IMPERSONATION", "score_impact": 45}
    ]
    res = aggregate_risk_score(indicators)
    assert res["score"] == 70 # 25 + 45, not 25+25+45
    assert res["indicators_evaluated"] == 2

def test_aggregate_score_ceiling():
    indicators = [
        {"type": "DIRECT_IP_HOST", "score_impact": 45},
        {"type": "HOMOGLYPH_SPOOFING", "score_impact": 40},
        {"type": "BRAND_IMPERSONATION", "score_impact": 45},
        {"type": "UPI_PIN_RECEIVE_FRAUD", "score_impact": 50}
    ]
    res = aggregate_risk_score(indicators)
    assert res["score"] == 100 # capped at 100
    assert res["level"] == "CRITICAL"
