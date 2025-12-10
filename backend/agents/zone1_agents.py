"""
Zone 1 Agents: RFQ 자동 준비
- Supplier Pool 추천
- RFQ 문서 생성
- RFQ 이메일 생성
"""

from typing import Any, Dict
from .base_agent import BaseAgent


class SupplierPoolAgent(BaseAgent):
    """
    Supplier Pool 추천 에이전트
    PR/사양 정보를 분석하여 적합한 공급업체를 추천
    """
    
    def __init__(self):
        super().__init__(
            name="SupplierPoolAgent",
            description="PR 사양을 분석하여 최적의 Supplier Pool을 추천합니다"
        )
    
    def get_system_prompt(self) -> str:
        return """당신은 기자재 조달 전문가입니다. 
PR(Purchase Request) 정보와 기술 사양을 분석하여 최적의 공급업체(Supplier)를 추천하는 역할을 합니다.

다음 기준으로 공급업체를 평가합니다:
1. 해당 품목 공급 이력 및 경험
2. 품질 등급 및 인증 현황
3. 납기 준수율
4. 가격 경쟁력
5. 기술 지원 능력

응답은 반드시 JSON 형식으로 제공하세요."""

    def get_user_prompt(self, input_data: Dict[str, Any]) -> str:
        pr_info = input_data.get("pr_info", {})
        
        return f"""다음 PR 정보를 분석하여 추천 Supplier Pool을 생성해주세요.

## PR 정보
- PR 번호: {pr_info.get('pr_number', 'N/A')}
- 품목명: {pr_info.get('item_name', 'N/A')}
- 품목 코드: {pr_info.get('item_code', 'N/A')}
- 수량: {pr_info.get('quantity', 'N/A')} {pr_info.get('unit', 'EA')}
- 희망 납기: {pr_info.get('desired_delivery_date', 'N/A')}

## 기술 사양
{chr(10).join(['- ' + spec for spec in pr_info.get('specifications', [])])}

## 응답 형식 (JSON)
{{
    "criteria": "추천 기준 요약 설명",
    "suppliers": [
        {{
            "id": "SUP001",
            "name": "공급업체명",
            "country": "국가",
            "order_count": 이전 발주 건수,
            "score": 적합성 점수 (0-100),
            "quality_grade": "품질 등급 (A+, A, B+ 등)",
            "delivery_rate": 납기 준수율 (%),
            "rationale": "추천 근거 상세 설명",
            "contact": "연락처/이메일"
        }}
    ]
}}

최소 3개, 최대 5개의 공급업체를 추천해주세요. 점수가 높은 순으로 정렬해주세요."""


class RfqDocumentAgent(BaseAgent):
    """
    RFQ 문서 생성 에이전트
    PR 정보를 기반으로 공식 RFQ 문서를 자동 생성
    """
    
    def __init__(self):
        super().__init__(
            name="RfqDocumentAgent",
            description="PR 정보를 기반으로 RFQ 문서를 자동 생성합니다"
        )
    
    def get_system_prompt(self) -> str:
        return """당신은 조달 문서 작성 전문가입니다.
PR(Purchase Request) 정보를 기반으로 공식적인 RFQ(Request for Quotation) 문서를 작성합니다.

RFQ 문서는 다음 구조를 따릅니다:
1. 개요
2. 품목 상세
3. 기술 사양
4. 견적 조건
5. 제출 서류
6. 일정

전문적이고 명확한 문서를 작성해주세요.
응답은 반드시 JSON 형식으로 제공하세요."""

    def get_user_prompt(self, input_data: Dict[str, Any]) -> str:
        pr_info = input_data.get("pr_info", {})
        
        return f"""다음 PR 정보를 기반으로 RFQ 문서를 생성해주세요.

## PR 정보
- PR 번호: {pr_info.get('pr_number', 'N/A')}
- 품목명: {pr_info.get('item_name', 'N/A')}
- 품목 코드: {pr_info.get('item_code', 'N/A')}
- 수량: {pr_info.get('quantity', 'N/A')} {pr_info.get('unit', 'EA')}
- 희망 납기: {pr_info.get('desired_delivery_date', 'N/A')}
- 프로젝트: {pr_info.get('project', 'N/A')}

## 기술 사양
{chr(10).join(['- ' + spec for spec in pr_info.get('specifications', [])])}

## 응답 형식 (JSON)
{{
    "title": "견적요청서 (Request for Quotation)",
    "rfq_number": "RFQ-YYYY-XXXXXX",
    "issue_date": "YYYY-MM-DD",
    "due_date": "YYYY-MM-DD",
    "sections": [
        {{
            "title": "섹션 제목",
            "content": "섹션 내용"
        }}
    ]
}}"""


class RfqEmailAgent(BaseAgent):
    """
    RFQ 이메일 생성 에이전트
    공급업체에 발송할 RFQ 안내 이메일 작성
    """
    
    def __init__(self):
        super().__init__(
            name="RfqEmailAgent",
            description="공급업체에 발송할 RFQ 이메일을 자동 생성합니다"
        )
    
    def get_system_prompt(self) -> str:
        return """당신은 비즈니스 커뮤니케이션 전문가입니다.
공급업체에 RFQ(견적요청)를 안내하는 공식 이메일을 작성합니다.

이메일은 다음 특성을 갖춰야 합니다:
1. 전문적이고 정중한 어조
2. 핵심 정보를 명확하게 전달
3. 견적 제출에 필요한 모든 정보 포함
4. 마감일 및 연락처 명시

한국어로 작성하되, 해외 업체의 경우 영어 버전도 함께 제공해주세요.
응답은 반드시 JSON 형식으로 제공하세요."""

    def get_user_prompt(self, input_data: Dict[str, Any]) -> str:
        rfq_document = input_data.get("rfq_document", {})
        pr_info = input_data.get("pr_info", {})
        
        return f"""다음 RFQ 정보를 기반으로 공급업체 발송용 이메일을 작성해주세요.

## RFQ 정보
- RFQ 번호: {rfq_document.get('rfq_number', 'N/A')}
- 품목명: {pr_info.get('item_name', 'N/A')}
- 수량: {pr_info.get('quantity', 'N/A')} {pr_info.get('unit', 'EA')}
- 희망 납기: {pr_info.get('desired_delivery_date', 'N/A')}
- 견적 마감일: {rfq_document.get('due_date', 'N/A')}

## 주요 사양
{chr(10).join(['- ' + spec for spec in pr_info.get('specifications', [])[:3]])}

## 응답 형식 (JSON)
{{
    "subject": "이메일 제목",
    "body": "이메일 본문 (한국어)",
    "body_english": "이메일 본문 (영어, 해외 업체용)"
}}"""
