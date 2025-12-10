"""
Zone 3 Router: 계약/PO 자동 생성 API
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from agents.zone3_agents import ContractAgent, PoAgent, CountersignEmailAgent

router = APIRouter()


# ============================================
# Request/Response Models
# ============================================

class SelectedSupplier(BaseModel):
    """선정 공급업체 정보"""
    name: str
    business_number: Optional[str] = None
    address: Optional[str] = None
    ceo: Optional[str] = None
    contact_person: Optional[str] = None
    contact: Optional[str] = None
    unit_price: int
    total_price: int
    delivery_date: str
    payment_terms: str
    warranty: str
    special_conditions: List[str] = []


class PrInfo(BaseModel):
    """PR 정보"""
    item_name: str
    item_code: str
    quantity: int
    unit: str = "EA"
    specifications: List[str] = []


class ContractTerms(BaseModel):
    """계약 조건"""
    delivery_address: str
    penalty_rate: float = 0.1  # 지체상금율 (%)
    inspection_period: int = 10  # 검수기간 (일)


class GenerateContractRequest(BaseModel):
    """계약서 생성 요청"""
    selected_supplier: SelectedSupplier
    pr_info: PrInfo
    terms: ContractTerms


class GeneratePoRequest(BaseModel):
    """PO 생성 요청"""
    supplier_info: SelectedSupplier
    pr_info: PrInfo
    contract_info: Optional[Dict[str, Any]] = None


class GenerateCountersignEmailRequest(BaseModel):
    """카운터사인 이메일 생성 요청"""
    po_info: Dict[str, Any]
    supplier_info: SelectedSupplier


# ============================================
# API Endpoints
# ============================================

@router.post("/generate-contract")
async def generate_contract(request: GenerateContractRequest):
    """
    계약서 생성
    
    GPT를 활용하여 물품공급 계약서를 자동 생성합니다.
    """
    try:
        agent = ContractAgent()
        result = await agent.execute({
            "selected_supplier": request.selected_supplier.model_dump(),
            "pr_info": request.pr_info.model_dump(),
            "terms": request.terms.model_dump()
        })
        return {
            "success": True,
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-po")
async def generate_po(request: GeneratePoRequest):
    """
    PO 생성
    
    GPT를 활용하여 발주서(PO)를 자동 생성합니다.
    """
    try:
        agent = PoAgent()
        result = await agent.execute({
            "supplier_info": request.supplier_info.model_dump(),
            "pr_info": request.pr_info.model_dump(),
            "contract_info": request.contract_info or {}
        })
        return {
            "success": True,
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-countersign-email")
async def generate_countersign_email(request: GenerateCountersignEmailRequest):
    """
    카운터사인 요청 이메일 생성
    
    GPT를 활용하여 공급업체에 발송할 카운터사인 요청 이메일을 생성합니다.
    """
    try:
        agent = CountersignEmailAgent()
        result = await agent.execute({
            "po_info": request.po_info,
            "supplier_info": request.supplier_info.model_dump()
        })
        return {
            "success": True,
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
