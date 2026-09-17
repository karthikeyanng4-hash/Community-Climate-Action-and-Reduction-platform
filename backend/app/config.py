import os
from pathlib import Path
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# Automatically load backend/.env if present
env_file_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_file_path)

class Settings(BaseSettings):
    # MySQL Database Configuration
    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_PORT: int = int(os.getenv("DB_PORT", "3306"))
    DB_USER: str = os.getenv("DB_USER", "root")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "root")
    DB_NAME: str = os.getenv("DB_NAME", "climate_platform_db")

    # App Settings
    APP_NAME: str = "EcoCommunity Climate Backend"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "*"
    ]

    # JWT Authentication Settings
    JWT_SECRET: str = os.getenv("JWT_SECRET", "eco_community_jwt_secret_key_2025_climate_action")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_DAYS: int = 7

    # Ollama Vision Service Settings
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "gemma3:latest")
    OLLAMA_TIMEOUT_SECONDS: int = int(os.getenv("OLLAMA_TIMEOUT_SECONDS", "45"))

settings = Settings()
