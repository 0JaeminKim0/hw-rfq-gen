"""
Zone 1 Router: RFQ 자동 준비 API
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from agents.zone1_agents import SupplierPoolAgent, RfqDocumentAgent, RfqEmailAgent

router = APIRouter()


# ============================================
# Request/Response Models
# ============================================

class Specification(BaseModel):
    """기술 사양"""
    text: str


class PrInfo(BaseModel):
    """PR 정보"""
    pr_number: str
    item_name: str
    item_code: str
    quantity: int
    unit: str = "EA"
    request_date: Optional[str] = None
    desired_delivery_date: str
    specifications: List[str]
    requester: Optional[str] = None
    project: Optional[str] = None


class AnalyzeSpecRequest(BaseModel):
    """사양 분석 요청"""
    pr_info: PrInfo


class GenerateSupplierPoolRequest(BaseModel):
    """Supplier Pool 생성 요청"""
    pr_info: PrInfo


class GenerateRfqDocumentRequest(BaseModel):
    """RFQ 문서 생성 요청"""
    pr_info: PrInfo
    selected_suppliers: Optional[List[str]] = None


class GenerateRfqEmailRequest(BaseModel):
    """RFQ 이메일 생성 요청"""
    pr_info: PrInfo
    rfq_document: dict
    suppliers: List[str]


class SendRfqRequest(BaseModel):
    """RFQ 발송 요청"""
    suppliers: List[str]
    email_content: dict


# ============================================
# API Endpoints
# ============================================

@router.post("/analyze-spec")
async def analyze_spec(request: AnalyzeSpecRequest):
    """
    PR 사양 분석
    
    PR 정보를 분석하여 주요 기술 요구사항을 추출합니다.
    """
    try:
        # 현재는 입력 데이터를 그대로 반환 (향후 AI 분석 추가)
        return {
            "success": True,
            "pr_info": request.pr_info.model_dump(),
            "analysis": {
                "category": "산업용 밸브",
                "complexity": "중간",
                "key_requirements": request.pr_info.specifications[:3]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-supplier-pool")
async def generate_supplier_pool(request: GenerateSupplierPoolRequest):
    """
    Supplier Pool 생성
    
    GPT를 활용하여 PR 사양에 적합한 공급업체를 추천합니다.
    """
    try:
        agent = SupplierPoolAgent()
        result = await agent.execute({
            "pr_info": request.pr_info.model_dump()
        })
        return {
            "success": True,
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-rfq-document")
async def generate_rfq_document(request: GenerateRfqDocumentRequest):
    """
    RFQ 문서 생성
    
    GPT를 활용하여 RFQ 문서를 자동 생성합니다.
    """
    try:
        agent = RfqDocumentAgent()
        result = await agent.execute({
            "pr_info": request.pr_info.model_dump()
        })
        return {
            "success": True,
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-rfq-email")
async def generate_rfq_email(request: GenerateRfqEmailRequest):
    """
    RFQ 이메일 생성
    
    GPT를 활용하여 공급업체 발송용 RFQ 이메일을 생성합니다.
    """
    try:
        agent = RfqEmailAgent()
        result = await agent.execute({
            "pr_info": request.pr_info.model_dump(),
            "rfq_document": request.rfq_document
        })
        return {
            "success": True,
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/send-rfq")
async def send_rfq(request: SendRfqRequest):
    """
    RFQ 발송 (시뮬레이션)
    
    실제 이메일 발송 대신 발송 시뮬레이션 결과를 반환합니다.
    """
    try:
        return {
            "success": True,
            "sent_count": len(request.suppliers),
            "recipients": request.suppliers,
            "message": f"{len(request.suppliers)}개 협력사에 RFQ가 발송되었습니다"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
