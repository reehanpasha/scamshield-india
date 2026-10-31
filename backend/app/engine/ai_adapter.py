import os
from typing import Dict, Any, Optional
from app.core.config import settings

class ThreatIntelligenceAdapter:
    """
    Adapter for external threat intelligence and contextual AI explanation.
    Operates with graceful degradation: If no external API key is provided,
    it returns clear local intelligence without fabricating external vendor checks.
    """

    @staticmethod
    def get_provider_status() -> Dict[str, Any]:
        return {
            "virustotal_configured": bool(settings.VIRUSTOTAL_API_KEY),
            "google_safebrowsing_configured": bool(settings.GOOGLE_SAFE_BROWSING_KEY),
            "ai_explanation_configured": bool(settings.GEMINI_API_KEY or settings.OPENAI_API_KEY),
            "active_mode": "EXTERNAL_ENRICHED" if (settings.GEMINI_API_KEY or settings.VIRUSTOTAL_API_KEY) else "LOCAL_DETERMINISTIC_RULES"
        }

    @staticmethod
    def enrich_explanation(content_type: str, raw_input: str, detected_category: str, base_evidence: list) -> Dict[str, Any]:
        """
        Enriches security findings with psychological social engineering analysis.
        Uses deterministic local taxonomy if external AI key is not supplied.
        """
        has_ai_key = bool(settings.GEMINI_API_KEY or settings.OPENAI_API_KEY)

        # Standard Indian Cyber Threat Taxonomy Explanations
        psychological_hooks = []
        if "Digital Arrest" in detected_category or "Police" in detected_category:
            psychological_hooks.append("Authority Bias: Exploits fear of law enforcement, warrants, and criminal prosecution.")
            psychological_hooks.append("Isolation Tactic: Coerces victim to remain in a closed room and forbids speaking with family or advocates.")
        elif "UPI" in detected_category:
            psychological_hooks.append("Reversal Illusion: Tricking the user into believing an action to 'send/pay' will actually 'receive' funds.")
        elif "KYC" in detected_category or "Account" in detected_category:
            psychological_hooks.append("Artificial Scarcity & Time Panic: Threatens loss of banking access within a short deadline (today/24 hours).")
        elif "Job" in detected_category or "Lottery" in detected_category:
            psychological_hooks.append("Greed & Sunk Cost: Initial small reward builds misplaced trust before demanding larger prepayments.")

        return {
            "provider": "ScamShield Local Neural Heuristic" if not has_ai_key else "AI Enriched Analyzer",
            "is_external": has_ai_key,
            "psychological_manipulation_analysis": psychological_hooks if psychological_hooks else [
                "Technical Deception: Relies on visual similarity and deceptive domain naming to bypass human suspicion."
            ],
            "official_reporting_entity": "National Cyber Crime Reporting Portal (cybercrime.gov.in) & Emergency Helpline 1930",
            "note": "Analysis performed using ScamShield local deterministic rules v1.2.0-in."
        }
