# AI 기반 기자재 발주 Workflow PoC

AI(GPT) 기반 기자재 발주 프로세스를 시각화하는 데모 웹 애플리케이션입니다.

## 프로젝트 개요

### 목적
- PDF 1페이지 발주 Workflow 전체를 타임라인처럼 보여주기
- Agent 표기된 구간에서 AI가 문서/정보를 자동 생성·가공하는 과정 시각화
- Python 백엔드 + GPT API 연동을 통한 실제 AI 기능 구현 가능

### 아키텍처
```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (HTML/JS)                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Zone 1    │  │   Zone 2    │  │   Zone 3    │     │
│  │ RFQ 자동준비 │  │ 견적 검토   │  │ 계약/PO생성 │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                          │                              │
│                    js/api.js                            │
│              (Mock / Live 모드 전환)                     │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                Python FastAPI Backend                    │
│  ┌─────────────────────────────────────────────────┐   │
│  │                   Agents                         │   │
│  │  ┌───────────────┐  ┌───────────────┐           │   │
│  │  │ Zone1 Agents  │  │ Zone2 Agents  │  ...      │   │
│  │  │ - SupplierPool│  │ - QuoteAnalysis│          │   │
│  │  │ - RfqDocument │  │ - TechReview  │           │   │
│  │  │ - RfqEmail    │  │ - PriceEval   │           │   │
│  │  └───────────────┘  └───────────────┘           │   │
│  └─────────────────────────────────────────────────┘   │
│                          │                              │
│                     OpenAI API                          │
└─────────────────────────────────────────────────────────┘
```

---

## 파일 구조

```
├── index.html                  # 메인 HTML
├── css/
│   └── style.css               # 스타일시트
├── js/
│   ├── config.js               # 설정 (API 모드, 엔드포인트)
│   ├── api.js                  # API 서비스 레이어
│   ├── main.js                 # 메인 컨트롤러
│   ├── workflow.js             # SVG 워크플로우 다이어그램
│   ├── zones.js                # Agent Zone 패널 렌더링
│   ├── animations.js           # 애니메이션 유틸리티
│   └── mockData.js             # Mock 데이터
├── backend/                    # Python FastAPI 백엔드
│   ├── main.py                 # FastAPI 앱 엔트리포인트
│   ├── config.py               # 설정 관리
│   ├── requirements.txt        # Python 의존성
│   ├── .env.example            # 환경변수 예시
│   ├── agents/                 # AI 에이전트 모듈
│   │   ├── __init__.py
│   │   ├── base_agent.py       # 기본 에이전트 클래스
│   │   ├── zone1_agents.py     # Zone 1 에이전트들
│   │   ├── zone2_agents.py     # Zone 2 에이전트들
│   │   └── zone3_agents.py     # Zone 3 에이전트들
│   └── routers/                # API 라우터
│       ├── __init__.py
│       ├── zone1.py            # Zone 1 API
│       ├── zone2.py            # Zone 2 API
│       └── zone3.py            # Zone 3 API
├── server.js                   # Node.js 정적 파일 서버
├── package.json
└── README.md
```

---

## 실행 방법

### 1. 프론트엔드만 실행 (Mock 모드)

```bash
# Node.js 서버 실행
npm install
npm start

# 브라우저에서 http://localhost:3000 접속
```

Mock 모드에서는 Python 백엔드 없이 하드코딩된 데이터로 데모가 실행됩니다.

### 2. Python 백엔드 실행 (Live 모드)

```bash
# 백엔드 디렉토리로 이동
cd backend

# 가상환경 생성 및 활성화
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 환경변수 설정
cp .env.example .env
# .env 파일에서 OPENAI_API_KEY 설정

# 서버 실행
python main.py
# 또는
uvicorn main:app --reload --port 8000
```

프론트엔드에서 API 모드를 'Live'로 전환하면 Python 백엔드 API를 호출합니다.

---

## API 모드 전환

### 방법 1: UI에서 전환
헤더의 "API: Mock/Live" 버튼 클릭

### 방법 2: URL 파라미터
```
http://localhost:3000?api_mode=live
```

### 방법 3: 코드에서 직접 설정
```javascript
// js/config.js
Config.API_MODE = 'live';  // 'mock' 또는 'live'
Config.API_BASE_URL = 'http://localhost:8000/api';
```

---

## Agent 커스터마이징

### 에이전트 구조

모든 에이전트는 `BaseAgent` 클래스를 상속받습니다:

```python
# backend/agents/base_agent.py

class BaseAgent(ABC):
    def __init__(self, name: str, description: str):
        self.client = OpenAI(api_key=settings.openai_api_key)
        self.model = settings.openai_model
        
    @abstractmethod
    def get_system_prompt(self) -> str:
        """시스템 프롬프트 반환"""
        pass
    
    @abstractmethod  
    def get_user_prompt(self, input_data: Dict) -> str:
        """사용자 프롬프트 생성"""
        pass
    
    async def execute(self, input_data: Dict) -> Dict:
        """에이전트 실행"""
        user_prompt = self.get_user_prompt(input_data)
        result = self.call_gpt_json(user_prompt)
        return result
```

### 새 에이전트 추가 예시

```python
# backend/agents/zone1_agents.py

class CustomAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="CustomAgent",
            description="커스텀 기능을 수행합니다"
        )
    
    def get_system_prompt(self) -> str:
        return """당신은 전문가입니다.
        다음 작업을 수행합니다:
        1. ...
        2. ...
        응답은 JSON 형식으로 제공하세요."""

    def get_user_prompt(self, input_data: Dict) -> str:
        return f"""다음 데이터를 분석해주세요:
        {input_data}
        
        응답 형식:
        {{
            "result": "분석 결과",
            "recommendations": ["권장1", "권장2"]
        }}"""
```

### 프롬프트 수정

각 에이전트의 `get_system_prompt()` 및 `get_user_prompt()` 메서드를 수정하여 GPT 동작을 커스터마이징할 수 있습니다.

---

## API 엔드포인트

### Zone 1: RFQ 자동 준비
| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/api/zone1/analyze-spec` | POST | PR 사양 분석 |
| `/api/zone1/generate-supplier-pool` | POST | Supplier Pool 추천 |
| `/api/zone1/generate-rfq-document` | POST | RFQ 문서 생성 |
| `/api/zone1/generate-rfq-email` | POST | RFQ 이메일 생성 |
| `/api/zone1/send-rfq` | POST | RFQ 발송 (시뮬레이션) |

### Zone 2: 견적 접수·검토
| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/api/zone2/parse-quotes` | POST | 견적서 파싱 |
| `/api/zone2/compare-quotes` | POST | 견적 비교 분석 |
| `/api/zone2/generate-tech-review` | POST | 기술 검토 의뢰 생성 |
| `/api/zone2/evaluate-price` | POST | 가격 적정성 평가 |
| `/api/zone2/suggest-pool-changes` | POST | Pool 변경 제안 |

### Zone 3: 계약/PO 자동 생성
| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/api/zone3/generate-contract` | POST | 계약서 생성 |
| `/api/zone3/generate-po` | POST | PO 생성 |
| `/api/zone3/generate-countersign-email` | POST | 카운터사인 이메일 생성 |

### API 문서
백엔드 실행 후 `http://localhost:8000/docs`에서 Swagger UI로 API 문서를 확인할 수 있습니다.

---

## 환경변수 설정

`backend/.env` 파일:

```env
# OpenAI API Configuration
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=true

# CORS Settings
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Agent Settings
AGENT_TEMPERATURE=0.7
AGENT_MAX_TOKENS=4096
```

---

## 기술 스택

### 프론트엔드
- HTML5 / CSS3 / JavaScript (ES6+)
- Tailwind CSS
- Font Awesome
- Chart.js

### 백엔드
- Python 3.10+
- FastAPI
- OpenAI API (GPT-4)
- Pydantic
- Uvicorn

---

## 배포

### Railway 배포

1. GitHub에 코드 Push
2. Railway에서 GitHub 저장소 연결
3. 환경변수 설정 (OPENAI_API_KEY 등)
4. 자동 배포

### 로컬 개발

```bash
# 프론트엔드
npm start

# 백엔드 (별도 터미널)
cd backend
python main.py
```

---

## 참고사항

- **해상도**: 1920×1080 기준 최적화
- **브라우저**: Chrome, Edge, Firefox 최신 버전 권장
- **시연 시간**: 전체 자동 재생 약 5-7분

---

## 라이선스

PoC 데모용 - 내부 사용 목적

---

*Last Updated: 2024-01-15*
