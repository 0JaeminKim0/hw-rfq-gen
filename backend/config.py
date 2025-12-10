"""
Application Configuration
환경변수 및 설정 관리
"""

import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()


class Settings(BaseSettings):
    """Application Settings"""
    
    # OpenAI Configuration
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    openai_model: str = os.getenv("OPENAI_MODEL", "gpt-4-turbo-preview")
    
    # Server Configuration
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8000"))
    debug: bool = os.getenv("DEBUG", "true").lower() == "true"
    
    # CORS Settings
    cors_origins: list = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    
    # Agent Settings
    agent_temperature: float = float(os.getenv("AGENT_TEMPERATURE", "0.7"))
    agent_max_tokens: int = int(os.getenv("AGENT_MAX_TOKENS", "4096"))
    
    class Config:
        env_file = ".env"


settings = Settings()
