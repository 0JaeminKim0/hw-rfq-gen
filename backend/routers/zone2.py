"""
Zone 2 Router: 견적 접수·검토 API
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from agents.zone2_agents import (
    QuoteAnalysisAgent, 
    TechReviewAgent, 
    PriceEvaluationAgent,
    PoolChangeAgent
)

router = APIRouter()


# ============================================
# Request/Response Models
# ============================================

class Quote(BaseModel):
    """견적 정보"""
    id: str
    supplier: str
    file_name: Optional[str] = None
    file_type: Optional[str] = None
    submitted_date: str
    unit_price: float
    currency: str
    total_price: float
    delivery_date: str
    delivery_days: int
    payment_terms: str
    warranty: str
    notes: Optional[str] = None
    issues: List[str] = []


class PrInfo(BaseModel):
    """PR 정보 (간략)"""
    item_name: str
    item_code: str
    quantity: int
    unit: str = "EA"
    desired_delivery_date: str
    specifications: List[str] = []


class HistoricalPrice(BaseModel):
    """과거 가격 데이터"""
    date: str
    avg_price: float
    min_price: Optional[float] = None
    max_price: Optional[float] = None


class ParseQuotesRequest(BaseModel):
    """견적서 파싱 요청"""
    files: List[Dict[str, Any]]


class CompareQuotesRequest(BaseModel):
    """견적 비교 요청"""
    quotes: List[Quote]
    pr_info: PrInfo


class GenerateTechReviewRequest(BaseModel):
    """기술 검토 의뢰 요청"""
    quotes: List[Quote]
    pr_info: PrInfo


class EvaluatePriceRequest(BaseModel):
    """가격 평가 요청"""
    quotes: List[Quote]
    historical_data: List[HistoricalPrice] = []


class SuggestPoolChangesRequest(BaseModel):
    """Pool 변경 제안 요청"""
    quotes: List[Quote]
    evaluation_result: Dict[str, Any]
    quote_analysis: Dict[str, Any]


# ============================================
# API Endpoints
# ============================================

@router.post("/parse-quotes")
async def parse_quotes(request: ParseQuotesRequest):
    """
    견적서 파싱
    
    업로드된 견적서 파일을 분석하여 구조화된 데이터로 변환합니다.
    (현재는 시뮬레이션)
    """
    try:
        # 실제 구현 시 PDF/Excel 파싱 로직 추가
        parsed_quotes = []
        for i, file in enumerate(request.files):
            parsed_quotes.append({
                "id": f"Q{i+1:03d}",
                "supplier": file.get("supplier", f"공급업체 {i+1}"),
                "file_name": file.get("name", f"quote_{i+1}.pdf"),
                "status": "parsed"
            })
        
        return {
            "success": True,
            "parsed_count": len(parsed_quotes),
            "quotes": parsed_quotes
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/compare-quotes")
async def compare_quotes(request: CompareQuotesRequest):
    """
    견적 비교 분석
    
    GPT를 활용하여 여러 견적을 비교 분석하고 이슈를 식별합니다.
    """
    try:
        agent = QuoteAnalysisAgent()
        result = await agent.execute({
            "quotes": [q.model_dump() for q in request.quotes],
            "pr_info": request.pr_info.model_dump()
        })
        return {
            "success": True,
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-tech-review")
async def generate_tech_review(request: GenerateTechReviewRequest):
    """
    기술 검토 의뢰 생성
    
    GPT를 활용하여 기술팀 검토 의뢰 이메일을 생성합니다.
    """
    try:
        agent = TechReviewAgent()
        result = await agent.execute({
            "quotes": [q.model_dump() for q in request.quotes],
            "pr_info": request.pr_info.model_dump()
        })
        return {
            "success": True,
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/evaluate-price")
async def evaluate_price(request: EvaluatePriceRequest):
    """
    가격 적정성 평가
    
    GPT를 활용하여 견적 가격의 적정성을 평가합니다.
    """
    try:
        agent = PriceEvaluationAgent()
        result = await agent.execute({
            "quotes": [q.model_dump() for q in request.quotes],
            "historical_data": [h.model_dump() for h in request.historical_data]
        })
        return {
            "success": True,
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/suggest-pool-changes")
async def suggest_pool_changes(request: SuggestPoolChangesRequest):
    """
    Supplier Pool 변경 제안
    
    GPT를 활용하여 견적 평가 결과를 기반으로 Pool 조정을 제안합니다.
    """
    try:
        agent = PoolChangeAgent()
        result = await agent.execute({
            "quotes": [q.model_dump() for q in request.quotes],
            "evaluation_result": request.evaluation_result,
            "quote_analysis": request.quote_analysis
        })
        return {
            "success": True,
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
