"""
AI 기자재 발주 Workflow - FastAPI Backend
메인 애플리케이션 엔트리포인트
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from config import settings
from routers import zone1, zone2, zone3

# FastAPI 앱 생성
app = FastAPI(
    title="AI 기자재 발주 Workflow API",
    description="GPT 기반 기자재 발주 프로세스 자동화 API",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(zone1.router, prefix="/api/zone1", tags=["Zone 1: RFQ 자동 준비"])
app.include_router(zone2.router, prefix="/api/zone2", tags=["Zone 2: 견적 검토"])
app.include_router(zone3.router, prefix="/api/zone3", tags=["Zone 3: 계약/PO 생성"])


@app.get("/")
async def root():
    """API 루트"""
    return {
        "message": "AI 기자재 발주 Workflow API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/api/health")
async def health_check():
    """헬스 체크"""
    return {"status": "ok", "api_mode": "live"}


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug
    )
