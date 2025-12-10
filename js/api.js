/**
 * API Service Layer
 * Python 백엔드와 통신하는 API 클라이언트
 * Mock 모드와 Live 모드 지원
 */

const ApiService = {
    /**
     * 공통 API 호출 메서드
     */
    async request(endpoint, method = 'GET', data = null) {
        // Mock 모드일 경우 Mock 데이터 반환
        if (Config.API_MODE === 'mock') {
            return this.getMockResponse(endpoint, data);
        }

        // Live 모드: 실제 API 호출
        try {
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            if (data && method !== 'GET') {
                options.body = JSON.stringify(data);
            }

            if (Config.DEBUG) {
                console.log(`[API] ${method} ${endpoint}`, data);
            }

            const response = await fetch(endpoint, options);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            
            if (Config.DEBUG) {
                console.log(`[API] Response:`, result);
            }

            return result;
        } catch (error) {
            console.error(`[API] Error:`, error);
            throw error;
        }
    },

    /**
     * Mock 응답 생성 (개발/테스트용)
     */
    getMockResponse(endpoint, data) {
        return new Promise((resolve) => {
            // 실제 API 응답 시간 시뮬레이션
            const delay = Math.random() * 500 + 500;
            
            setTimeout(() => {
                if (Config.DEBUG) {
                    console.log(`[API-Mock] ${endpoint}`, data);
                }
                
                // 엔드포인트별 Mock 데이터 반환
                if (endpoint.includes('analyze-spec')) {
                    resolve(MockData.prInfo);
                } else if (endpoint.includes('generate-supplier-pool')) {
                    resolve({ suppliers: MockData.supplierPool, criteria: '최근 3년간 동일 품목 발주 이력, 품질 등급 A 이상' });
                } else if (endpoint.includes('generate-rfq-document')) {
                    resolve(MockData.rfqDocument);
                } else if (endpoint.includes('generate-rfq-email')) {
                    resolve(MockData.rfqEmail);
                } else if (endpoint.includes('parse-quotes') || endpoint.includes('compare-quotes')) {
                    resolve({ quotes: MockData.submittedQuotes, analysis: MockData.quoteAnalysis });
                } else if (endpoint.includes('generate-tech-review')) {
                    resolve(MockData.techReviewEmail);
                } else if (endpoint.includes('evaluate-price')) {
                    resolve(MockData.priceFairness);
                } else if (endpoint.includes('suggest-pool-changes')) {
                    resolve({ suggestions: MockData.poolSuggestions });
                } else if (endpoint.includes('generate-contract')) {
                    resolve({ clauses: MockData.contractClauses, selectedSupplier: MockData.selectedSupplier });
                } else if (endpoint.includes('generate-po')) {
                    resolve(MockData.poInfo);
                } else if (endpoint.includes('generate-countersign-email')) {
                    resolve(MockData.counterSignEmail);
                } else {
                    resolve({ success: true });
                }
            }, delay);
        });
    },

    // ============================================
    // Agent Zone 1: RFQ 자동 준비 API
    // ============================================

    /**
     * PR 사양 분석
     * @param {Object} prData - PR 정보
     */
    async analyzeSpec(prData) {
        const endpoint = Config.getEndpoint('ZONE1', 'ANALYZE_SPEC');
        return this.request(endpoint, 'POST', prData);
    },

    /**
     * Supplier Pool 생성
     * @param {Object} params - { prInfo, specifications }
     */
    async generateSupplierPool(params) {
        const endpoint = Config.getEndpoint('ZONE1', 'GENERATE_SUPPLIER_POOL');
        return this.request(endpoint, 'POST', params);
    },

    /**
     * RFQ 문서 생성
     * @param {Object} params - { prInfo, selectedSuppliers }
     */
    async generateRfqDocument(params) {
        const endpoint = Config.getEndpoint('ZONE1', 'GENERATE_RFQ_DOCUMENT');
        return this.request(endpoint, 'POST', params);
    },

    /**
     * RFQ 이메일 생성
     * @param {Object} params - { rfqDocument, suppliers }
     */
    async generateRfqEmail(params) {
        const endpoint = Config.getEndpoint('ZONE1', 'GENERATE_RFQ_EMAIL');
        return this.request(endpoint, 'POST', params);
    },

    /**
     * RFQ 발송 (시뮬레이션)
     * @param {Object} params - { suppliers, emailContent }
     */
    async sendRfq(params) {
        const endpoint = Config.getEndpoint('ZONE1', 'SEND_RFQ');
        return this.request(endpoint, 'POST', params);
    },

    // ============================================
    // Agent Zone 2: 견적 접수·검토 API
    // ============================================

    /**
     * 견적서 파싱
     * @param {Array} files - 업로드된 견적서 파일들
     */
    async parseQuotes(files) {
        const endpoint = Config.getEndpoint('ZONE2', 'PARSE_QUOTES');
        return this.request(endpoint, 'POST', { files });
    },

    /**
     * 견적 비교 분석
     * @param {Array} quotes - 파싱된 견적 데이터
     */
    async compareQuotes(quotes) {
        const endpoint = Config.getEndpoint('ZONE2', 'COMPARE_QUOTES');
        return this.request(endpoint, 'POST', { quotes });
    },

    /**
     * 기술 검토 의뢰 이메일 생성
     * @param {Object} params - { quotes, specifications }
     */
    async generateTechReview(params) {
        const endpoint = Config.getEndpoint('ZONE2', 'GENERATE_TECH_REVIEW');
        return this.request(endpoint, 'POST', params);
    },

    /**
     * 가격 적정성 평가
     * @param {Object} params - { quotes, historicalData }
     */
    async evaluatePrice(params) {
        const endpoint = Config.getEndpoint('ZONE2', 'EVALUATE_PRICE');
        return this.request(endpoint, 'POST', params);
    },

    /**
     * Supplier Pool 변경 제안
     * @param {Object} params - { quotes, evaluationResult }
     */
    async suggestPoolChanges(params) {
        const endpoint = Config.getEndpoint('ZONE2', 'SUGGEST_POOL_CHANGES');
        return this.request(endpoint, 'POST', params);
    },

    // ============================================
    // Agent Zone 3: 계약/PO 자동 생성 API
    // ============================================

    /**
     * 계약서 생성
     * @param {Object} params - { selectedSupplier, terms }
     */
    async generateContract(params) {
        const endpoint = Config.getEndpoint('ZONE3', 'GENERATE_CONTRACT');
        return this.request(endpoint, 'POST', params);
    },

    /**
     * PO 생성
     * @param {Object} params - { contractInfo, supplierInfo }
     */
    async generatePo(params) {
        const endpoint = Config.getEndpoint('ZONE3', 'GENERATE_PO');
        return this.request(endpoint, 'POST', params);
    },

    /**
     * 카운터사인 요청 이메일 생성
     * @param {Object} params - { poInfo, supplierInfo }
     */
    async generateCountersignEmail(params) {
        const endpoint = Config.getEndpoint('ZONE3', 'GENERATE_COUNTERSIGN_EMAIL');
        return this.request(endpoint, 'POST', params);
    },

    // ============================================
    // 유틸리티
    // ============================================

    /**
     * API 헬스 체크
     */
    async healthCheck() {
        try {
            const endpoint = Config.API_BASE_URL + Config.ENDPOINTS.HEALTH;
            const response = await fetch(endpoint);
            return response.ok;
        } catch {
            return false;
        }
    },

    /**
     * API 모드 전환
     */
    async switchToLiveMode() {
        const isHealthy = await this.healthCheck();
        if (isHealthy) {
            Config.setApiMode('live');
            localStorage.setItem('api_mode', 'live');
            showToast('Live API 모드로 전환되었습니다', 'success');
            return true;
        } else {
            showToast('백엔드 서버에 연결할 수 없습니다', 'warning');
            return false;
        }
    },

    switchToMockMode() {
        Config.setApiMode('mock');
        localStorage.setItem('api_mode', 'mock');
        showToast('Mock 모드로 전환되었습니다', 'info');
    }
};
