import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "ScamShield India"
    PROJECT_DESCRIPTION: str = "Advanced AI Cybersecurity & Digital Fraud Intelligence Platform"
    VERSION: str = "1.2.0"
    RULES_VERSION: str = "v1.2.0-in"
    ENVIRONMENT: str = "development"
    
    # Database
    DATABASE_URL: str = "sqlite:///./scamshield.db"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    
    # External Threat Intelligence Integrations (Optional)
    ENABLE_EXTERNAL_PROVIDERS: bool = False
    VIRUSTOTAL_API_KEY: str = os.getenv("VIRUSTOTAL_API_KEY", "")
    GOOGLE_SAFE_BROWSING_KEY: str = os.getenv("GOOGLE_SAFE_BROWSING_KEY", "")
    
    # AI Engine (Optional - will use robust heuristic/NLP deterministic rules if not configured)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Rate Limiting & Safety
    MAX_URL_LENGTH: int = 2048
    MAX_MESSAGE_LENGTH: int = 50000
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # Safety: Disallow internal/private network scanning
    ALLOW_PRIVATE_IP_SCAN: bool = False

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
