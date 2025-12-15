/**
 * Mock Data for AI 기자재 발주 Workflow PoC
 * 향후 수정 필요 영역: 실제 API 연동 시 이 파일의 데이터를 API 응답으로 대체
 */

const MockData = {
    // PR (Purchase Request) 정보
    prInfo: {
        prNumber: "PR-2024-001234",
        itemName: "항법 통신 장비 (Radio Navigation System)",
        itemCode: "HPV-316SS-4IN",
        quantity: 50,
        unit: "EA",
        requestDate: "2024-01-15",
        desiredDeliveryDate: "2024-03-15",
        specifications: [
            "장비 유형: 항공용 VHF 통신 장비",
            "주파수 범위: 118.000 MHz ~ 136.975 MHz",
            "채널 간격: 8.33 kHz / 25 kHz 듀얼 지원",
            "송신 출력: 10 W ~ 16 W (조절 가능)",
            "전원 규격: 28 V DC 항공기 표준 전원",
            "인터페이스: ARINC 429 / RS-422 지원",
            "설치 방식: 항공기 랙 마운트 (Standard ATR Tray)",
            "기능: 6W Audio Output, DSB-AM Modulation, Built-in Self-Test(BIT)"
        ],
        requester: "김철수 (기계설계팀)",
        project: "신규 LNG선 구축 프로젝트"
    },

    // Supplier Pool 추천 결과
    // 향후 수정 필요 영역: POST /api/rfq/generate-supplier-pool 응답으로 대체
    supplierPool: [
        {
            id: "SUP001",
            name: "(주)한국통신산업",
            country: "대한민국",
            orderCount: 127,
            score: 95,
            rationale: "최근 3년간 동일 사양 통신 장비 127건 납품, 품질 등급 A+, 평균 납기 준수율 98.5%",
            qualityGrade: "A+",
            deliveryRate: 98.5,
            contact: "sales@korvalve.co.kr"
        },
        {
            id: "SUP002",
            name: "Flowserve Corporation",
            country: "미국",
            orderCount: 89,
            score: 92,
            rationale: "글로벌 네비게이션 제조사, API 600 인증 보유, 대형 프로젝트 경험 다수",
            qualityGrade: "A",
            deliveryRate: 96.2,
            contact: "asia@flowserve.com"
        },
        {
            id: "SUP003",
            name: "KITZ Corporation",
            country: "일본",
            orderCount: 64,
            score: 88,
            rationale: "고품질 일본 제조사, VHF 통신 전문, 기술 지원 우수",
            qualityGrade: "A",
            deliveryRate: 97.8,
            contact: "export@kitz.co.jp"
        },
        {
            id: "SUP004",
            name: "(주)동양통신",
            country: "대한민국",
            orderCount: 45,
            score: 82,
            rationale: "국내 중견 통신사, 가격 경쟁력 우수, 납기 유연성 확보",
            qualityGrade: "B+",
            deliveryRate: 94.1,
            contact: "inquiry@dongyang-valve.com"
        },
        {
            id: "SUP005",
            name: "Velan Inc.",
            country: "캐나다",
            orderCount: 31,
            score: 78,
            rationale: "항법 통신 기기 전문사, API 인증 다수 보유, 신규 거래처 후보",
            qualityGrade: "A-",
            deliveryRate: 95.3,
            contact: "sales@velan.com"
        }
    ],

    // RFQ 문서 템플릿
    // 향후 수정 필요 영역: POST /api/rfq/generate-document 응답으로 대체
    rfqDocument: {
        title: "견적요청서 (Request for Quotation)",
        rfqNumber: "RFQ-2024-001234",
        issueDate: "2024-01-16",
        dueDate: "2024-01-30",
        sections: [
            {
                title: "1. 개요",
                content: "당사는 신규 LNG선 구축 프로젝트에 필요한 항법 통신 장비에 대한 견적을 요청드립니다."
            },
            {
                title: "2. 품목 상세",
                content: "품목: 항법 통신 장비 (HPV-316SS-4IN)\n수량: 50 EA\n납기: 2024년 3월 15일"
            },
            {
                title: "3. 기술 사양",
                content: "인터페이스: ARINC 429 / RS-422 지원"
            },
            {
                title: "4. 견적 조건",
                content: "- 가격 조건: FOB 또는 CIF 인천항\n- 결제 조건: 제시 요청\n- 견적 유효기간: 30일 이상"
            },
            {
                title: "5. 제출 서류",
                content: "- 견적서\n- 기술 자료 및 도면\n- 납기 확약서\n- 품질 인증서 사본"
            }
        ]
    },

    // RFQ 이메일 템플릿
    // 향후 수정 필요 영역: POST /api/rfq/generate-email 응답으로 대체
    rfqEmail: {
        subject: "[RFQ-2024-001234] 항법 통신 장비 견적 요청의 건",
        body: `안녕하십니까,

당사 신규 LNG선 구축 프로젝트와 관련하여, 아래 품목에 대한 견적을 요청드립니다.

■ 품목: 항법 통신 장비
■ 품번: HPV-316SS-4IN
■ 수량: 50 EA
■ 희망 납기: 2024년 3월 15일
■ 견적 마감일: 2024년 1월 30일

상세 사양 및 견적요청서는 첨부 파일을 참조해 주시기 바랍니다.

견적서 제출 시 아래 사항을 포함해 주시면 감사하겠습니다:
1. 단가 및 총액 (USD 또는 KRW)
2. 납기 일정
3. 결제 조건
4. 기술 자료 및 인증서

문의사항이 있으시면 아래 연락처로 연락 주시기 바랍니다.

감사합니다.

---
조달팀 이영희
Tel: 02-1234-5678
Email: procurement@hanwhaocean.com`
    },

    // 협력사 제출 견적서 데이터
    // 향후 수정 필요 영역: POST /api/quote/parse-and-compare 응답으로 대체
    submittedQuotes: [
        {
            id: "Q001",
            supplier: "(주)한국통신산업",
            fileName: "견적서_한국통신_20240125.pdf",
            fileType: "pdf",
            submittedDate: "2024-01-25",
            unitPrice: 850000,
            currency: "KRW",
            totalPrice: 42500000,
            deliveryDate: "2024-03-10",
            deliveryDays: 54,
            paymentTerms: "선급금 30%, 납품 후 70% (30일)",
            warranty: "24개월",
            notes: "API 600 인증 제품, 국내 재고 보유",
            issues: []
        },
        {
            id: "Q002",
            supplier: "Flowserve Corporation",
            fileName: "Quotation_Flowserve_20240123.xlsx",
            fileType: "excel",
            submittedDate: "2024-01-23",
            unitPrice: 920,
            currency: "USD",
            totalPrice: 46000,
            deliveryDate: "2024-04-01",
            deliveryDays: 76,
            paymentTerms: "L/C at sight",
            warranty: "18개월",
            notes: "미국 본사 직접 생산, 프리미엄 라인",
            issues: ["납기 2주 초과"]
        },
        {
            id: "Q003",
            supplier: "KITZ Corporation",
            fileName: "견적서_KITZ_20240128.pdf",
            fileType: "pdf",
            submittedDate: "2024-01-28",
            unitPrice: 118000,
            currency: "JPY",
            totalPrice: 5900000,
            deliveryDate: "2024-03-12",
            deliveryDays: 56,
            paymentTerms: "T/T 선급금 20%, 납품 후 80%",
            warranty: "24개월",
            notes: "일본 공장 생산, JIS 추가 인증",
            issues: []
        }
    ],

    // 견적 비교 분석 결과
    // 향후 수정 필요 영역: POST /api/quote/parse-and-compare 응답으로 대체
    quoteAnalysis: {
        summary: "총 3개 협력사 견적 접수 완료. A사(한국통신)가 가격 및 납기 면에서 가장 우수하며, B사(Flowserve)는 납기가 2주 초과됩니다.",
        recommendations: [
            { supplier: "한국통신산업", status: "추천", reason: "최저가, 납기 준수, 국내 A/S 용이" },
            { supplier: "KITZ Corporation", status: "대안", reason: "품질 우수, 납기 양호, 가격 중간" },
            { supplier: "Flowserve", status: "조건부", reason: "품질 최우수, 단 납기 초과 협의 필요" }
        ]
    },

    // 기술 검토 의뢰 이메일
    // 향후 수정 필요 영역: POST /api/quote/generate-tech-review-mail 응답으로 대체
    techReviewEmail: {
        to: "engineering@company.com",
        subject: "[기술검토요청] 항법 통신 장비 (HPV-316SS-4IN) 견적 검토",
        body: `기술팀 담당자님께,

조달팀에서 아래 품목에 대한 기술 검토를 요청드립니다.

■ 품목: 항법 통신 장비 (HPV-316SS-4IN)
■ 관련 RFQ: RFQ-2024-001234
■ 접수 견적: 3건 (한국통신, Flowserve, KITZ)

[검토 요청 사항]
1. 각 협력사 제안 사양의 기술적 적합성
2. 도면 및 기술자료 검토
3. 프로젝트 요구사항 충족 여부
4. 추가 기술 요구사항 유무

첨부: 각 협력사 기술자료 및 도면

검토 결과는 2024년 2월 5일까지 회신 부탁드립니다.

감사합니다.
조달팀`
    },

    // 가격 적정성 평가 데이터
    // 향후 수정 필요 영역: POST /api/quote/price-fairness 응답으로 대체
    priceFairness: {
        historicalPrices: [
            { date: "2023-Q1", avgPrice: 780000, minPrice: 750000, maxPrice: 820000 },
            { date: "2023-Q2", avgPrice: 795000, minPrice: 760000, maxPrice: 830000 },
            { date: "2023-Q3", avgPrice: 810000, minPrice: 780000, maxPrice: 850000 },
            { date: "2023-Q4", avgPrice: 830000, minPrice: 800000, maxPrice: 870000 },
            { date: "2024-Q1", avgPrice: 850000, minPrice: 820000, maxPrice: 900000 }
        ],
        currentQuotes: [
            { supplier: "한국통신", price: 850000, fairnessScore: 95, status: "적정" },
            { supplier: "KITZ", price: 885000, fairnessScore: 88, status: "적정" },
            { supplier: "Flowserve", price: 1196000, fairnessScore: 62, status: "고가" }
        ],
        marketAverage: 860000,
        recommendation: "한국통신산업의 견적가가 시장 평균 대비 1.2% 저렴하며, 과거 거래 이력 대비 적정 수준입니다."
    },

    // Supplier Pool 변경 제안
    // 향후 수정 필요 영역: POST /api/supplier/pool-suggestion 응답으로 대체
    poolSuggestions: [
        {
            supplier: "한국통신산업",
            currentStatus: "Pool A",
            suggestedStatus: "Pool A (유지)",
            reason: "지속적인 가격 경쟁력 및 품질 유지"
        },
        {
            supplier: "KITZ Corporation",
            currentStatus: "Pool B",
            suggestedStatus: "Pool A (승격)",
            reason: "최근 3회 연속 우수 평가, 기술력 인정"
        },
        {
            supplier: "Flowserve",
            currentStatus: "Pool A",
            suggestedStatus: "Pool B (조정)",
            reason: "가격 경쟁력 하락, 납기 지연 이력"
        }
    ],

    // 최종 선정 결과
    selectedSupplier: {
        name: "(주)한국통신산업",
        unitPrice: 850000,
        totalPrice: 42500000,
        deliveryDate: "2024-03-10",
        paymentTerms: "선급금 30%, 납품 후 70% (30일)",
        warranty: "24개월",
        specialConditions: [
            "품질 보증 기간 24개월",
            "무상 A/S 제공",
            "납기 지연 시 일당 0.1% 지체상금 적용",
            "검수 후 10일 이내 하자 시 무상 교체"
        ]
    },

    // 계약서 조항
    // 향후 수정 필요 영역: 실제 계약서 생성 API 연동
    contractClauses: [
        {
            number: "제1조 (목적)",
            content: "본 계약은 갑(구매자)이 을(공급자)로부터 아래 명시된 물품을 구매함에 있어 필요한 제반 사항을 정함을 목적으로 한다."
        },
        {
            number: "제2조 (물품 내역)",
            content: "품명: 항법 통신 장비 (HPV-316SS-4IN)\n수량: 50 EA\n단가: 850,000원 (부가세 별도)\n총액: 42,500,000원"
        },
        {
            number: "제3조 (납품 기한)",
            content: "을은 2024년 3월 10일까지 갑이 지정하는 장소에 물품을 납품하여야 한다."
        },
        {
            number: "제4조 (대금 지급)",
            content: "갑은 을에게 다음과 같이 대금을 지급한다.\n- 계약 체결 시: 계약금 30% (12,750,000원)\n- 납품 완료 후 30일 이내: 잔금 70% (29,750,000원)"
        },
        {
            number: "제5조 (품질 보증)",
            content: "을은 납품일로부터 24개월간 물품의 품질을 보증하며, 해당 기간 내 하자 발생 시 무상으로 수리 또는 교체한다."
        },
        {
            number: "제6조 (지체상금)",
            content: "을이 납기를 지체할 경우, 지체일수 1일당 계약금액의 0.1%에 해당하는 금액을 지체상금으로 갑에게 지급한다."
        }
    ],

    // PO (Purchase Order) 정보
    poInfo: {
        poNumber: "PO-2024-001234",
        issueDate: "2024-02-01",
        supplier: "(주)한국통신산업",
        supplierAddress: "경기도 안산시 단원구 산업로 123",
        items: [
            {
                lineNo: 1,
                itemCode: "HPV-316SS-4IN",
                description: "항법 통신 장비 (VHF, ARINC 429 / RS-422 지원)",
                quantity: 50,
                unit: "EA",
                unitPrice: 850000,
                amount: 42500000
            }
        ],
        subtotal: 42500000,
        vat: 4250000,
        total: 46750000,
        deliveryDate: "2024-03-10",
        deliveryAddress: "충남 서산시 대산읍 신규플랜트 현장",
        paymentTerms: "선급금 30%, 납품 후 70% (30일)",
        notes: "API 600 인증서 및 MTR(Material Test Report) 납품 시 제출 필수"
    },

    // 카운터사인 요청 이메일
    counterSignEmail: {
        to: "sales@korvalve.co.kr",
        subject: "[PO-2024-001234] 발주서 송부 및 카운터사인 요청",
        body: `(주)한국통신산업 영업팀 귀하,

당사의 RFQ-2024-001234 건에 대하여 귀사를 최종 공급업체로 선정하게 되었음을 알려드립니다.

첨부된 발주서(PO-2024-001234)를 검토하시고, 동의하시면 카운터사인하여 회신 부탁드립니다.

[발주 개요]
- 품목: 항법 통신 장비 (HPV-316SS-4IN)
- 수량: 1 EA
- 총액: 46,750,000원 (VAT 포함)
- 납기: 2024년 3월 10일

카운터사인 완료 후 계약금(30%)을 송금할 예정입니다.

문의사항이 있으시면 연락 주시기 바랍니다.

감사합니다.

---
조달팀 이영희
Tel: 02-1234-5678
Email: procurement@company.com`
    },

    // 시나리오 타임라인
    scenarioTimeline: [
        { step: "pr", name: "PR 발생", duration: 1500, isAgent: false },
        { step: "receive", name: "구매 요청 접수 및 확인", duration: 1500, isAgent: false },
        { step: "zone1_start", name: "Agent Zone 1 시작", duration: 500, isAgent: true },
        { step: "supplier_pool", name: "Supplier Pool 선정", duration: 3000, isAgent: true },
        { step: "rfq_design", name: "RFQ 세부내용 자동 설계", duration: 4000, isAgent: true },
        { step: "rfq_send", name: "RFQ 자동 발송", duration: 2000, isAgent: true },
        { step: "zone2_start", name: "Agent Zone 2 시작", duration: 500, isAgent: true },
        { step: "quote_receive", name: "견적 접수 및 검토", duration: 3000, isAgent: true },
        { step: "tech_review", name: "기술 검토 의뢰", duration: 3000, isAgent: true },
        { step: "price_review", name: "가격 적정성 검토", duration: 3000, isAgent: true },
        { step: "zone3_start", name: "Agent Zone 3 시작", duration: 500, isAgent: true },
        { step: "contract", name: "계약서 자동 생성", duration: 4000, isAgent: true },
        { step: "po", name: "PO 생성 및 발송", duration: 3000, isAgent: true },
        { step: "complete", name: "업무 완료", duration: 1000, isAgent: false }
    ]
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MockData;
}
