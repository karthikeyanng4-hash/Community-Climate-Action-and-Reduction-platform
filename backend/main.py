import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import ensure_tables_exist, ensure_default_data, check_mysql_health
from app.crud import init_demo_user_password
from app.routers import (
    status,
    auth,
    user,
    submissions,
    communities,
    challenges,
    leaderboard,
    events,
    reports,
    map,
    chat,
    notifications
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("climate_backend")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing EcoCommunity Climate Backend with pure MySQL...")
    try:
        ensure_tables_exist()
        init_demo_user_password()
        health = check_mysql_health()
        if health.get("connected"):
            logger.info(f"Connected to MySQL database '{health.get('database')}' on {health.get('host')}")
        else:
            logger.warning(f"MySQL connection warning: {health.get('error')}")
    except Exception as e:
        logger.error(f"Error during MySQL table verification: {e}")
    yield
    logger.info("Shutting down EcoCommunity Climate Backend...")

app = FastAPI(
    title="EcoCommunity Climate Platform API",
    description="Python FastAPI backend powered exclusively by local MySQL database (climate_platform_db).",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all routers under /api
app.include_router(status.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(user.router, prefix="/api")
app.include_router(submissions.router, prefix="/api")
app.include_router(communities.router, prefix="/api")
app.include_router(challenges.router, prefix="/api")
app.include_router(leaderboard.router, prefix="/api")
app.include_router(events.router, prefix="/api")
app.include_router(reports.router, prefix="/api")
app.include_router(map.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(notifications.router, prefix="/api")

@app.get("/")
def root():
    return {
        "service": settings.APP_NAME,
        "database": "MySQL (climate_platform_db)",
        "status": "operational",
        "docs": "/docs",
        "api_base": "/api"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
