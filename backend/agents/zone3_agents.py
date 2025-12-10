"""
Zone 3 Agents: 계약/PO 자동 생성
- 계약서 생성
- PO 생성
- 카운터사인 이메일
"""

from typing import Any, Dict
from .base_agent import BaseAgent


class ContractAgent(BaseAgent):
    """
    계약서 생성 에이전트
    선정된 공급업체와의 계약서 초안 자동 생성
    """
    
    def __init__(self):
        super().__init__(
            name="ContractAgent",
            description="물품공급 계약서를 자동 생성합니다"
        )
    
    def get_system_prompt(self) -> str:
        return """당신은 계약서 작성 전문가입니다.
물품공급 계약서를 작성하며, 다음 조항들을 포함합니다:

1. 목적
2. 물품 내역 (품목, 수량, 단가, 총액)
3. 납품 기한 및 장소
4. 대금 지급 조건
5. 품질 보증
6. 지체상금
7. 계약 해지
8. 분쟁 해결
9. 일반 조항

법적으로 유효하고 명확한 계약서를 작성해주세요.
응답은 반드시 JSON 형식으로 제공하세요."""

    def get_user_prompt(self, input_data: Dict[str, Any]) -> str:
        selected_supplier = input_data.get("selected_supplier", {})
        pr_info = input_data.get("pr_info", {})
        terms = input_data.get("terms", {})
        
        return f"""다음 정보를 기반으로 물품공급 계약서를 생성해주세요.

## 선정 공급업체
- 업체명: {selected_supplier.get('name', 'N/A')}
- 사업자등록번호: {selected_supplier.get('business_number', 'N/A')}
- 주소: {selected_supplier.get('address', 'N/A')}
- 대표자: {selected_supplier.get('ceo', 'N/A')}

## 물품 정보
- 품목명: {pr_info.get('item_name', 'N/A')}
- 품목 코드: {pr_info.get('item_code', 'N/A')}
- 수량: {pr_info.get('quantity', 'N/A')} {pr_info.get('unit', 'EA')}
- 단가: {selected_supplier.get('unit_price', 'N/A'):,}원
- 총액: {selected_supplier.get('total_price', 'N/A'):,}원

## 계약 조건
- 납기: {selected_supplier.get('delivery_date', 'N/A')}
- 결제조건: {selected_supplier.get('payment_terms', 'N/A')}
- 보증기간: {selected_supplier.get('warranty', 'N/A')}
- 납품장소: {terms.get('delivery_address', 'N/A')}

## 특수 조건
{chr(10).join(['- ' + cond for cond in selected_supplier.get('special_conditions', [])])}

## 응답 형식 (JSON)
{{
    "title": "물품공급계약서",
    "contract_number": "계약번호",
    "contract_date": "계약일자",
    "parties": {{
        "buyer": {{
            "name": "구매자 회사명",
            "address": "주소",
            "representative": "대표자"
        }},
        "seller": {{
            "name": "공급자 회사명",
            "address": "주소", 
            "representative": "대표자"
        }}
    }},
    "clauses": [
        {{
            "number": "제1조 (목적)",
            "content": "조항 내용"
        }}
    ],
    "signatures": {{
        "buyer": "갑 (구매자)",
        "seller": "을 (공급자)"
    }}
}}

계약서는 최소 6개 이상의 조항을 포함해주세요."""


class PoAgent(BaseAgent):
    """
    PO (Purchase Order) 생성 에이전트
    발주서를 자동 생성
    """
    
    def __init__(self):
        super().__init__(
            name="PoAgent",
            description="발주서(PO)를 자동 생성합니다"
        )
    
    def get_system_prompt(self) -> str:
        return """당신은 발주 문서 작성 전문가입니다.
Purchase Order (발주서)를 작성하며, 다음 정보를 포함합니다:

1. PO 번호 및 발행일
2. 공급업체 정보
3. 품목 상세 (Line Items)
4. 금액 (공급가액, 부가세, 총액)
5. 납기 및 납품장소
6. 결제 조건
7. 특기사항

공식적인 발주서 형식으로 작성해주세요.
응답은 반드시 JSON 형식으로 제공하세요."""

    def get_user_prompt(self, input_data: Dict[str, Any]) -> str:
        contract_info = input_data.get("contract_info", {})
        supplier_info = input_data.get("supplier_info", {})
        pr_info = input_data.get("pr_info", {})
        
        return f"""다음 정보를 기반으로 발주서(PO)를 생성해주세요.

## 공급업체 정보
- 업체명: {supplier_info.get('name', 'N/A')}
- 주소: {supplier_info.get('address', 'N/A')}
- 담당자: {supplier_info.get('contact_person', 'N/A')}
- 연락처: {supplier_info.get('contact', 'N/A')}

## 품목 정보
- 품목명: {pr_info.get('item_name', 'N/A')}
- 품목 코드: {pr_info.get('item_code', 'N/A')}
- 수량: {pr_info.get('quantity', 'N/A')} {pr_info.get('unit', 'EA')}
- 단가: {supplier_info.get('unit_price', 0):,}원
- 공급가액: {supplier_info.get('total_price', 0):,}원

## 조건
- 납기: {supplier_info.get('delivery_date', 'N/A')}
- 납품장소: {contract_info.get('delivery_address', 'N/A')}
- 결제조건: {supplier_info.get('payment_terms', 'N/A')}

## 응답 형식 (JSON)
{{
    "po_number": "PO-YYYY-XXXXXX",
    "issue_date": "YYYY-MM-DD",
    "supplier": {{
        "name": "공급업체명",
        "address": "주소",
        "contact_person": "담당자",
        "contact": "연락처"
    }},
    "items": [
        {{
            "line_no": 1,
            "item_code": "품목코드",
            "description": "품목 설명",
            "quantity": 수량,
            "unit": "단위",
            "unit_price": 단가,
            "amount": 금액
        }}
    ],
    "subtotal": 공급가액,
    "vat": 부가세,
    "total": 총액,
    "delivery_date": "납기일",
    "delivery_address": "납품장소",
    "payment_terms": "결제조건",
    "notes": "특기사항"
}}"""


class CountersignEmailAgent(BaseAgent):
    """
    카운터사인 요청 이메일 에이전트
    공급업체에 PO 확인 및 서명을 요청하는 이메일 생성
    """
    
    def __init__(self):
        super().__init__(
            name="CountersignEmailAgent",
            description="카운터사인 요청 이메일을 자동 생성합니다"
        )
    
    def get_system_prompt(self) -> str:
        return """당신은 비즈니스 커뮤니케이션 전문가입니다.
공급업체에 발주서(PO) 확인 및 카운터사인을 요청하는 공식 이메일을 작성합니다.

이메일은 다음 내용을 포함해야 합니다:
1. 공급업체 선정 통보
2. 발주 개요 (품목, 수량, 금액, 납기)
3. 카운터사인 요청 및 회신 기한
4. 계약금 지급 안내 (해당 시)
5. 문의 연락처

전문적이고 정중한 어조로 작성해주세요.
응답은 반드시 JSON 형식으로 제공하세요."""

    def get_user_prompt(self, input_data: Dict[str, Any]) -> str:
        po_info = input_data.get("po_info", {})
        supplier_info = input_data.get("supplier_info", {})
        
        return f"""다음 정보를 기반으로 카운터사인 요청 이메일을 작성해주세요.

## PO 정보
- PO 번호: {po_info.get('po_number', 'N/A')}
- 발행일: {po_info.get('issue_date', 'N/A')}
- 총액: {po_info.get('total', 0):,}원 (VAT 포함)
- 납기: {po_info.get('delivery_date', 'N/A')}

## 공급업체 정보
- 업체명: {supplier_info.get('name', 'N/A')}
- 담당자 이메일: {supplier_info.get('contact', 'N/A')}

## 품목 요약
- 품목: {po_info.get('items', [{}])[0].get('description', 'N/A')}
- 수량: {po_info.get('items', [{}])[0].get('quantity', 'N/A')}

## 응답 형식 (JSON)
{{
    "to": "수신자 이메일",
    "cc": ["참조 이메일"],
    "subject": "이메일 제목",
    "body": "이메일 본문 (한국어)",
    "body_english": "이메일 본문 (영어, 해외업체용)",
    "attachments": ["첨부 파일 목록"],
    "deadline": "카운터사인 기한"
}}"""
