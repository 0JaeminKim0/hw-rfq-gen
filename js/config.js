/**
 * Application Configuration
 * API 모드 및 엔드포인트 설정
 */

const Config = {
    // API 모드: 'mock' (프론트엔드 Mock 데이터) 또는 'live' (Python 백엔드 API)
    API_MODE: 'mock',  // 'mock' | 'live'
    
    // Python 백엔드 API Base URL
    API_BASE_URL: 'http://localhost:8000/api',
    
    // API 타임아웃 (ms)
    API_TIMEOUT: 30000,
    
    // 디버그 모드
    DEBUG: true,
    
    // API 엔드포인트 정의
    ENDPOINTS: {
        // Agent Zone 1: RFQ 자동 준비
        ZONE1: {
            ANALYZE_SPEC: '/zone1/analyze-spec',
            GENERATE_SUPPLIER_POOL: '/zone1/generate-supplier-pool',
            GENERATE_RFQ_DOCUMENT: '/zone1/generate-rfq-document',
            GENERATE_RFQ_EMAIL: '/zone1/generate-rfq-email',
            SEND_RFQ: '/zone1/send-rfq'
        },
        // Agent Zone 2: 견적 접수·검토
        ZONE2: {
            PARSE_QUOTES: '/zone2/parse-quotes',
            COMPARE_QUOTES: '/zone2/compare-quotes',
            GENERATE_TECH_REVIEW: '/zone2/generate-tech-review',
            EVALUATE_PRICE: '/zone2/evaluate-price',
            SUGGEST_POOL_CHANGES: '/zone2/suggest-pool-changes'
        },
        // Agent Zone 3: 계약/PO 자동 생성
        ZONE3: {
            GENERATE_CONTRACT: '/zone3/generate-contract',
            GENERATE_PO: '/zone3/generate-po',
            GENERATE_COUNTERSIGN_EMAIL: '/zone3/generate-countersign-email'
        },
        // 공통
        HEALTH: '/health'
    },

    // 설정 변경 메서드
    setApiMode: function(mode) {
        if (mode === 'mock' || mode === 'live') {
            this.API_MODE = mode;
            console.log(`[Config] API Mode changed to: ${mode}`);
        }
    },

    setApiBaseUrl: function(url) {
        this.API_BASE_URL = url;
        console.log(`[Config] API Base URL changed to: ${url}`);
    },

    getEndpoint: function(zone, action) {
        const endpoint = this.ENDPOINTS[zone]?.[action];
        return endpoint ? this.API_BASE_URL + endpoint : null;
    }
};

// 환경에 따른 자동 설정
(function() {
    // URL 파라미터로 API 모드 변경 가능: ?api_mode=live
    const urlParams = new URLSearchParams(window.location.search);
    const apiMode = urlParams.get('api_mode');
    if (apiMode) {
        Config.setApiMode(apiMode);
    }

    // 로컬 스토리지에서 설정 로드
    const savedMode = localStorage.getItem('api_mode');
    if (savedMode && !apiMode) {
        Config.setApiMode(savedMode);
    }

    const savedUrl = localStorage.getItem('api_base_url');
    if (savedUrl) {
        Config.setApiBaseUrl(savedUrl);
    }
})();
