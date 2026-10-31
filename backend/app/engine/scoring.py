from typing import List, Dict, Any, Optional

RULES_ENGINE_VERSION = "v1.2.0-in"

# Weight definitions for risk scoring
INDICATOR_WEIGHTS = {
    "DIRECT_IP_HOST": 45,
    "HOMOGLYPH_SPOOFING": 40,
    "BRAND_IMPERSONATION": 45,
    "DECEPTIVE_SUBDOMAIN": 35,
    "SUSPICIOUS_TLD": 25,
    "URL_SHORTENER": 20,
    "HIGH_ENTROPY": 15,
    "UPI_PIN_RECEIVE_FRAUD": 50,
    "DIGITAL_ARREST_SCAM": 55,
    "BANK_KYC_SUSPENSION": 45,
    "REMOTE_ACCESS_APP": 45,
    "ARTIFICIAL_URGENCY": 15,
    "UNENCRYPTED_HTTP": 10
}

def aggregate_risk_score(indicators: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Computes aggregated risk score with duplicate mitigation, confidence estimation,
    and false-positive awareness.
    
    LIMITATION NOTE:
    Risk scores represent a heuristic estimation based on observed digital fraud signatures
    and domain heuristics. They do not constitute an infallible mathematical guarantee or
    formal legal proof of fraudulent intent.
    """
    if not indicators:
        return {
            "score": 0,
            "level": "LOW",
            "confidence": 95.0,
            "indicators_evaluated": 0,
            "rule_version": RULES_ENGINE_VERSION,
            "limitations": "Zero indicators matched known heuristic database; novel or polymorphic phishing patterns may still exist."
        }

    seen_types = set()
    total_score = 0
    weights_applied = []

    for ind in indicators:
        ind_type = ind.get("type", "UNKNOWN")
        # Prevent double-counting the exact same category
        if ind_type in seen_types:
            continue
        seen_types.add(ind_type)

        weight = ind.get("score_impact", INDICATOR_WEIGHTS.get(ind_type, 15))
        total_score += weight
        weights_applied.append({"indicator": ind_type, "weight": weight})

    # Normalized ceiling of 100
    final_score = min(100, max(0, total_score))

    if final_score >= 80:
        level = "CRITICAL"
        confidence = 92.0
    elif final_score >= 50:
        level = "HIGH"
        confidence = 88.0
    elif final_score >= 25:
        level = "MEDIUM"
        confidence = 82.0
    else:
        level = "LOW"
        confidence = 90.0

    return {
        "score": final_score,
        "level": level,
        "confidence": confidence,
        "indicators_evaluated": len(weights_applied),
        "breakdown": weights_applied,
        "rule_version": RULES_ENGINE_VERSION,
        "limitations": "Heuristic model evaluated against Indian threat taxonomy. False positives are possible for legitimate developers testing on raw IPs or new vanity TLDs."
    }
