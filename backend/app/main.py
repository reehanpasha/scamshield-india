from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from app.core.config import settings
from app.db.init_db import init_database
from app.routers import url, message, scans, threats, reports, investigations, analytics, health

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables and seed realistic Indian cybersecurity demonstration data
    init_database()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.VERSION,
    lifespan=lifespan
)

# Custom handler for validation errors to provide clean, helpful error messages
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=400,
        content={
            "valid": False,
            "error": "Invalid request payload format. Please provide a standard JSON object, e.g. {\"url\": \"https://example.com\"}",
            "details": str(exc)
        }
    )

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(url.router)
app.include_router(message.router)
app.include_router(scans.router)
app.include_router(threats.router)
app.include_router(reports.router)
app.include_router(investigations.router)
app.include_router(analytics.router)
app.include_router(health.router)

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "description": "Production-grade cybersecurity intelligence platform detecting Indian digital fraud vectors.",
        "version": settings.VERSION,
        "rules_version": settings.RULES_VERSION,
        "documentation": "/docs"
    }
