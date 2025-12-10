"""
Zone 2 Agents: 견적 접수·검토
- 견적 비교 분석
- 기술 검토 의뢰
- 가격 적정성 평가
"""

from typing import Any, Dict, List
from .base_agent import BaseAgent


class QuoteAnalysisAgent(BaseAgent):
    """
    견적 분석 에이전트
    여러 협력사 견적을 비교 분석하고 이슈 식별
    """
    
    def __init__(self):
        super().__init__(
            name="QuoteAnalysisAgent",
            description="협력사 견적을 비교 분석하고 이슈를 식별합니다"
        )
    
    def get_system_prompt(self) -> str:
        return """당신은 조달 분석 전문가입니다.
여러 공급업체의 견적서를 비교 분석하여 다음을 수행합니다:

1. 견적 항목 정합성 검토 (누락 항목, 이상값 식별)
2. 가격 비교 분석
3. 납기 조건 비교
4. 결제 조건 비교
5. 특이사항 및 리스크 식별
6. 종합 추천 의견 제시

객관적이고 데이터에 기반한 분석을 제공해주세요.
응답은 반드시 JSON 형식으로 제공하세요."""

    def get_user_prompt(self, input_data: Dict[str, Any]) -> str:
        quotes = input_data.get("quotes", [])
        pr_info = input_data.get("pr_info", {})
        
        quotes_text = ""
        for i, q in enumerate(quotes, 1):
            quotes_text += f"""
### 견적 {i}: {q.get('supplier', 'N/A')}
- 단가: {q.get('currency', '')} {q.get('unit_price', 'N/A')}
- 총액: {q.get('currency', '')} {q.get('total_price', 'N/A')}
- 납기: {q.get('delivery_date', 'N/A')} ({q.get('delivery_days', 'N/A')}일)
- 결제조건: {q.get('payment_terms', 'N/A')}
- 보증기간: {q.get('warranty', 'N/A')}
- 비고: {q.get('notes', 'N/A')}
"""
        
        return f"""다음 견적들을 비교 분석해주세요.

## 요청 품목 정보
- 품목: {pr_info.get('item_name', 'N/A')}
- 수량: {pr_info.get('quantity', 'N/A')}
- 희망 납기: {pr_info.get('desired_delivery_date', 'N/A')}

## 접수된 견적
{quotes_text}

## 응답 형식 (JSON)
{{
    "summary": "전체 분석 요약 (2-3문장)",
    "comparison": [
        {{
            "supplier": "공급업체명",
            "unit_price_krw": 원화 환산 단가,
            "delivery_days": 납기일수,
            "issues": ["이슈1", "이슈2"],
            "strengths": ["장점1", "장점2"]
        }}
    ],
    "recommendations": [
        {{
            "supplier": "공급업체명",
            "status": "추천/대안/조건부/제외",
            "reason": "추천 사유"
        }}
    ],
    "risk_factors": ["리스크1", "리스크2"]
}}"""


class TechReviewAgent(BaseAgent):
    """
    기술 검토 의뢰 에이전트
    기술팀에 검토 의뢰할 이메일 및 체크리스트 생성
    """
    
    def __init__(self):
        super().__init__(
            name="TechReviewAgent",
            description="기술 검토 의뢰 문서를 자동 생성합니다"
        )
    
    def get_system_prompt(self) -> str:
        return """당신은 기술 검토 프로세스 전문가입니다.
조달팀에서 기술팀에 견적 기술검토를 의뢰하는 문서를 작성합니다.

다음 항목을 포함해야 합니다:
1. 검토 요청 배경 및 목적
2. 검토 대상 품목 및 사양
3. 각 공급업체별 검토 요청 사항
4. 검토 체크리스트
5. 회신 기한

전문적이고 명확한 문서를 작성해주세요.
응답은 반드시 JSON 형식으로 제공하세요."""

    def get_user_prompt(self, input_data: Dict[str, Any]) -> str:
        quotes = input_data.get("quotes", [])
        pr_info = input_data.get("pr_info", {})
        
        suppliers = [q.get('supplier', '') for q in quotes]
        
        return f"""다음 정보를 기반으로 기술팀 검토 의뢰 이메일을 작성해주세요.

## 품목 정보
- 품목명: {pr_info.get('item_name', 'N/A')}
- 품목 코드: {pr_info.get('item_code', 'N/A')}
- 수량: {pr_info.get('quantity', 'N/A')}

## 기술 사양
{chr(10).join(['- ' + spec for spec in pr_info.get('specifications', [])])}

## 검토 대상 공급업체
{chr(10).join(['- ' + s for s in suppliers])}

## 응답 형식 (JSON)
{{
    "to": "수신자 (예: engineering@company.com)",
    "subject": "이메일 제목",
    "body": "이메일 본문",
    "checklist": [
        "검토 항목 1",
        "검토 항목 2"
    ],
    "attachments": [
        "첨부 파일 1",
        "첨부 파일 2"
    ],
    "deadline": "검토 기한"
}}"""


class PriceEvaluationAgent(BaseAgent):
    """
    가격 적정성 평가 에이전트
    과거 데이터와 비교하여 가격 적정성을 평가
    """
    
    def __init__(self):
        super().__init__(
            name="PriceEvaluationAgent",
            description="견적 가격의 적정성을 평가합니다"
        )
    
    def get_system_prompt(self) -> str:
        return """당신은 가격 분석 전문가입니다.
과거 거래 데이터와 시장 정보를 기반으로 견적 가격의 적정성을 평가합니다.

평가 기준:
1. 과거 동일/유사 품목 거래 가격 대비
2. 시장 평균 가격 대비
3. 가격 변동 추세
4. 환율 영향 (해외 업체의 경우)

각 공급업체별 가격 적정성 점수와 권장 조치를 제시해주세요.
응답은 반드시 JSON 형식으로 제공하세요."""

    def get_user_prompt(self, input_data: Dict[str, Any]) -> str:
        quotes = input_data.get("quotes", [])
        historical_data = input_data.get("historical_data", [])
        
        quotes_text = ""
        for q in quotes:
            quotes_text += f"- {q.get('supplier', 'N/A')}: {q.get('currency', '')} {q.get('unit_price', 'N/A')}\n"
        
        return f"""다음 견적 가격의 적정성을 평가해주세요.

## 현재 견적 단가
{quotes_text}

## 과거 거래 이력 (최근 4분기)
{chr(10).join([f"- {h.get('date', '')}: 평균 {h.get('avg_price', 0):,}원" for h in historical_data[-4:]])}

## 응답 형식 (JSON)
{{
    "market_average": 시장 평균 가격 (원),
    "evaluation": [
        {{
            "supplier": "공급업체명",
            "price_krw": 원화 환산 가격,
            "fairness_score": 적정성 점수 (0-100),
            "status": "적정/고가/저가",
            "deviation_percent": 시장가 대비 편차 (%),
            "recommendation": "권장 조치"
        }}
    ],
    "trend_analysis": "가격 추세 분석 설명",
    "overall_recommendation": "종합 권장 사항"
}}"""


class PoolChangeAgent(BaseAgent):
    """
    Supplier Pool 변경 제안 에이전트
    견적 평가 결과를 기반으로 Pool 조정을 제안
    """
    
    def __init__(self):
        super().__init__(
            name="PoolChangeAgent",
            description="Supplier Pool 변경을 제안합니다"
        )
    
    def get_system_prompt(self) -> str:
        return """당신은 공급업체 관리 전문가입니다.
견적 평가 결과를 바탕으로 Supplier Pool 조정을 제안합니다.

Pool 등급:
- Pool A: 우선 거래 대상 (높은 신뢰도, 우수한 실적)
- Pool B: 일반 거래 대상
- Pool C: 제한적 거래 (관찰 필요)

변경 유형:
- 승격: 하위 Pool에서 상위 Pool로
- 유지: 현재 등급 유지
- 조정: 상위 Pool에서 하위 Pool로
- 신규: Pool에 신규 등록
- 제외: Pool에서 제외

응답은 반드시 JSON 형식으로 제공하세요."""

    def get_user_prompt(self, input_data: Dict[str, Any]) -> str:
        evaluation_result = input_data.get("evaluation_result", {})
        quote_analysis = input_data.get("quote_analysis", {})
        
        return f"""견적 평가 결과를 바탕으로 Supplier Pool 변경을 제안해주세요.

## 가격 평가 결과
{evaluation_result}

## 견적 분석 결과
{quote_analysis}

## 응답 형식 (JSON)
{{
    "suggestions": [
        {{
            "supplier": "공급업체명",
            "current_pool": "현재 Pool 등급",
            "suggested_pool": "제안 Pool 등급",
            "change_type": "승격/유지/조정/신규/제외",
            "reason": "변경 사유",
            "performance_summary": "실적 요약"
        }}
    ],
    "summary": "전체 Pool 변경 요약"
}}"""
