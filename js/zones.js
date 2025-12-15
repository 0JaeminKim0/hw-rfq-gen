/**
 * Zone Panel Renderers
 * 각 Agent Zone의 상세 UI 컴포넌트 생성
 */

const ZonePanels = {
    // Zone 1: RFQ 자동 준비
    renderZone1: function() {
        const panel = document.getElementById('zone1-panel');
        panel.innerHTML = `
        <div class="h-full flex flex-col">
            <!-- Header -->
            <div class="mb-4">
                <h2 class="text-xl font-bold text-orange-400 flex items-center gap-2">
                    <i class="fas fa-robot"></i>
                    Agent Zone 1 – RFQ 자동 설계 및 발송
                </h2>
                <p class="text-gray-400 text-sm mt-1">
                    PR/사양 정보만 입력하면 AI가 Supplier Pool 및 RFQ 문서를 자동으로 구성합니다
                </p>
            </div>
            
            <!-- Main Content -->
            <div class="zone-panel flex-1">
                <!-- Input Panel -->
                <div class="input-panel slide-in-left">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-semibold text-blue-400">
                            <i class="fas fa-clipboard-list mr-2"></i>Input – PR/사양 정보
                        </h3>
                        <button id="btn-load-pr" class="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded transition">
                            예시 PR 불러오기
                        </button>
                    </div>
                    
                    <div id="pr-info-container">
                        <!-- PR Info will be loaded here -->
                        <div class="text-center text-gray-500 py-8">
                            <i class="fas fa-file-alt text-4xl mb-2"></i>
                            <p>"예시 PR 불러오기"를 클릭하세요</p>
                        </div>
                    </div>
                </div>
                
                <!-- Output Panel -->
                <div class="output-panel slide-in-right">
                    <div class="tab-container">
                        <div class="tab-btn active" data-tab="tab1-1">
                            <i class="fas fa-building mr-1"></i>
                            Supplier Pool 추천
                        </div>
                        <div class="tab-btn" data-tab="tab1-2">
                            <i class="fas fa-file-invoice mr-1"></i>
                            RFQ 문서 자동 생성
                        </div>
                        <div class="tab-btn" data-tab="tab1-3">
                            <i class="fas fa-envelope mr-1"></i>
                            RFQ 발송 대상 및 이메일
                        </div>
                    </div>
                    
                    <div class="tab-content">
                        <!-- Tab 1-1: Supplier Pool -->
                        <div id="tab1-1" class="tab-pane active">
                            <div id="supplier-pool-container">
                                <div class="flex items-center justify-center h-full text-gray-500">
                                    <div class="text-center">
                                        <div class="loading-spinner mx-auto mb-4" style="display: none;" id="supplier-loading"></div>
                                        <i class="fas fa-users text-4xl mb-2" id="supplier-placeholder"></i>
                                        <p>AI가 Supplier Pool을 분석 중입니다...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Tab 1-2: RFQ Document -->
                        <div id="tab1-2" class="tab-pane">
                            <div id="rfq-document-container">
                                <div class="flex items-center justify-center h-full text-gray-500">
                                    <div class="text-center">
                                        <i class="fas fa-file-alt text-4xl mb-2"></i>
                                        <p>RFQ 문서 생성 대기 중...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Tab 1-3: Email -->
                        <div id="tab1-3" class="tab-pane">
                            <div id="rfq-email-container">
                                <div class="flex items-center justify-center h-full text-gray-500">
                                    <div class="text-center">
                                        <i class="fas fa-envelope text-4xl mb-2"></i>
                                        <p>이메일 내용 생성 대기 중...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        
        this.setupZone1Events();
    },

    setupZone1Events: function() {
        // Tab switching
        document.querySelectorAll('#zone1-panel .tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                document.querySelectorAll('#zone1-panel .tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('#zone1-panel .tab-pane').forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });

        // Load PR button
        const loadBtn = document.getElementById('btn-load-pr');
        if (loadBtn) {
            loadBtn.addEventListener('click', () => {
                this.loadPRInfo();
            });
        }
    },

    // 현재 로드된 데이터 캐시
    cachedData: {
        prInfo: null,
        supplierPool: null,
        rfqDocument: null,
        quotes: null,
        quoteAnalysis: null,
        priceFairness: null,
        selectedSupplier: null,
        contract: null,
        poInfo: null
    },

    loadPRInfo: async function() {
        const container = document.getElementById('pr-info-container');
        
        // API 호출 또는 Mock 데이터 사용
        let pr;
        if (Config.API_MODE === 'live') {
            try {
                const result = await ApiService.analyzeSpec({ pr_info: MockData.prInfo });
                pr = result.pr_info || MockData.prInfo;
            } catch (error) {
                console.error('API Error:', error);
                pr = MockData.prInfo;
            }
        } else {
            pr = MockData.prInfo;
        }
        
        // 캐시에 저장
        this.cachedData.prInfo = pr;
        
        container.innerHTML = `
            <div class="info-card">
                <div class="info-card-header">PR 번호</div>
                <div class="info-card-value text-blue-400 font-mono">${pr.prNumber}</div>
            </div>
            <div class="info-card">
                <div class="info-card-header">품목명</div>
                <div class="info-card-value">${pr.itemName}</div>
            </div>
            <div class="info-card">
                <div class="info-card-header">품목 코드</div>
                <div class="info-card-value font-mono text-sm">${pr.itemCode}</div>
            </div>
            <div class="grid grid-cols-2 gap-2">
                <div class="info-card">
                    <div class="info-card-header">수량</div>
                    <div class="info-card-value">${pr.quantity} ${pr.unit}</div>
                </div>
                <div class="info-card">
                    <div class="info-card-header">희망 납기</div>
                    <div class="info-card-value">${pr.desiredDeliveryDate}</div>
                </div>
            </div>
            <div class="info-card">
                <div class="info-card-header">주요 사양</div>
                <div class="info-card-value text-sm">
                    <ul class="list-disc list-inside space-y-1">
                        ${pr.specifications.map(spec => `<li class="text-gray-300">${spec}</li>`).join('')}
                    </ul>
                </div>
            </div>
            <div class="info-card">
                <div class="info-card-header">요청자</div>
                <div class="info-card-value text-sm">${pr.requester}</div>
            </div>
            <div class="info-card">
                <div class="info-card-header">프로젝트</div>
                <div class="info-card-value text-sm">${pr.project}</div>
            </div>
        `;
        
        showToast('PR 정보가 로드되었습니다', 'success');
    },

    loadSupplierPool: async function() {
        const container = document.getElementById('supplier-pool-container');
        
        // 로딩 표시
        container.innerHTML = `
            <div class="flex items-center justify-center h-full text-gray-500">
                <div class="text-center">
                    <div class="loading-spinner mx-auto mb-4"></div>
                    <p>AI가 Supplier Pool을 분석 중입니다...</p>
                </div>
            </div>
        `;
        
        // API 호출 또는 Mock 데이터 사용
        let suppliers, criteria;
        if (Config.API_MODE === 'live') {
            try {
                const prInfo = this.cachedData.prInfo || MockData.prInfo;
                const result = await ApiService.generateSupplierPool({ pr_info: prInfo });
                suppliers = result.suppliers || MockData.supplierPool;
                criteria = result.criteria || '최근 3년간 동일 품목 발주 이력, 품질 등급 A 이상';
            } catch (error) {
                console.error('API Error:', error);
                suppliers = MockData.supplierPool;
                criteria = '최근 3년간 동일 품목 발주 이력, 품질 등급 A 이상';
            }
        } else {
            suppliers = MockData.supplierPool;
            criteria = '최근 3년간 동일 품목 발주 이력, 품질 등급 A 이상, 납기 준수율 95% 이상 기준';
        }
        
        // 캐시에 저장
        this.cachedData.supplierPool = suppliers;
        
        container.innerHTML = `
            <div class="mb-4 p-3 bg-blue-900/30 rounded-lg border border-blue-500/30">
                <div class="flex items-center gap-2 text-blue-400 text-sm font-semibold mb-1">
                    <i class="fas fa-lightbulb"></i>
                    추천 기준 요약
                </div>
                <p class="text-gray-300 text-sm">${criteria}</p>
            </div>
            
            <div class="overflow-x-auto">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>공급사명</th>
                            <th>국가</th>
                            <th>발주건수</th>
                            <th>적합성</th>
                            <th>상세</th>
                        </tr>
                    </thead>
                    <tbody id="supplier-table-body">
                    </tbody>
                </table>
            </div>
        `;
        
        // Animate table rows
        const tbody = document.getElementById('supplier-table-body');
        suppliers.forEach((supplier, idx) => {
            setTimeout(() => {
                const scoreClass = supplier.score >= 90 ? 'high' : supplier.score >= 80 ? 'medium' : 'low';
                const row = document.createElement('tr');
                row.style.animation = 'fadeIn 0.3s ease';
                row.innerHTML = `
                    <td class="font-medium">${supplier.name}</td>
                    <td>
                        <span class="flex items-center gap-1">
                            <i class="fas fa-globe-asia text-gray-400"></i>
                            ${supplier.country}
                        </span>
                    </td>
                    <td>${supplier.orderCount}건</td>
                    <td>
                        <span class="score-badge ${scoreClass}">
                            ${supplier.score}%
                        </span>
                    </td>
                    <td>
                        <button class="text-blue-400 hover:text-blue-300 text-sm" onclick="ZonePanels.showSupplierDetail('${supplier.id}')">
                            <i class="fas fa-info-circle"></i> 근거 보기
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            }, idx * 200);
        });
    },

    showSupplierDetail: function(supplierId) {
        const suppliers = this.cachedData.supplierPool || MockData.supplierPool;
        const supplier = suppliers.find(s => s.id === supplierId);
        if (supplier) {
            showToast(`${supplier.name}: ${supplier.rationale}`, 'info');
        }
    },

    loadRFQDocument: async function() {
        const container = document.getElementById('rfq-document-container');
        
        // 로딩 표시
        container.innerHTML = `
            <div class="flex items-center justify-center h-full text-gray-500">
                <div class="text-center">
                    <div class="loading-spinner mx-auto mb-4"></div>
                    <p>RFQ 문서를 생성 중입니다...</p>
                </div>
            </div>
        `;
        
        // API 호출 또는 Mock 데이터 사용
        let doc;
        if (Config.API_MODE === 'live') {
            try {
                const prInfo = this.cachedData.prInfo || MockData.prInfo;
                const result = await ApiService.generateRfqDocument({ pr_info: prInfo });
                doc = result;
            } catch (error) {
                console.error('API Error:', error);
                doc = MockData.rfqDocument;
            }
        } else {
            doc = MockData.rfqDocument;
        }
        
        // 캐시에 저장
        this.cachedData.rfqDocument = doc;
        
        container.innerHTML = `
            <div class="grid grid-cols-2 gap-4 h-full">
                <!-- Left: Document Info -->
                <div class="space-y-3">
                    <div class="info-card">
                        <div class="info-card-header">RFQ 번호</div>
                        <div class="info-card-value text-blue-400 font-mono">${doc.rfqNumber}</div>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <div class="info-card">
                            <div class="info-card-header">발행일</div>
                            <div class="info-card-value">${doc.issueDate}</div>
                        </div>
                        <div class="info-card">
                            <div class="info-card-header">마감일</div>
                            <div class="info-card-value text-red-400">${doc.dueDate}</div>
                        </div>
                    </div>
                    <div class="info-card flex-1">
                        <div class="info-card-header">문서 구성</div>
                        <div class="space-y-2 mt-2">
                            ${doc.sections.map((section, idx) => `
                                <div class="flex items-center gap-2 text-sm">
                                    <span class="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs">${idx + 1}</span>
                                    <span class="text-gray-300">${section.title}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <!-- Right: Document Preview -->
                <div class="flex flex-col">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm text-gray-400">문서 미리보기</span>
                        <span class="text-xs text-green-400 flex items-center gap-1" id="rfq-status">
                            <i class="fas fa-spinner fa-spin"></i>
                            AI가 작성 중...
                        </span>
                    </div>
                    <div class="document-preview flex-1" id="rfq-preview">
                    </div>
                </div>
            </div>
        `;
        
        // Animate document typing
        this.typeDocument();
    },

    typeDocument: function() {
        const preview = document.getElementById('rfq-preview');
        const doc = this.cachedData.rfqDocument || MockData.rfqDocument;
        const status = document.getElementById('rfq-status');
        
        let content = `<h1>${doc.title}</h1>`;
        doc.sections.forEach(section => {
            content += `<h2>${section.title}</h2>`;
            content += `<p>${section.content.replace(/\n/g, '<br>')}</p>`;
        });
        
        preview.innerHTML = '';
        let idx = 0;
        const chars = content.split('');
        
        const typeInterval = setInterval(() => {
            if (idx < chars.length) {
                preview.innerHTML = chars.slice(0, idx + 1).join('');
                idx += 3; // Type 3 chars at a time for speed
                preview.scrollTop = preview.scrollHeight;
            } else {
                clearInterval(typeInterval);
                status.innerHTML = '<i class="fas fa-check-circle"></i> 생성 완료';
                showToast('RFQ 문서가 자동 생성되었습니다', 'success');
            }
        }, 10);
    },

    loadRFQEmail: async function() {
        const container = document.getElementById('rfq-email-container');
        
        // API 호출 또는 Mock 데이터 사용
        let email;
        if (Config.API_MODE === 'live') {
            try {
                const prInfo = this.cachedData.prInfo || MockData.prInfo;
                const rfqDocument = this.cachedData.rfqDocument || MockData.rfqDocument;
                const result = await ApiService.generateRfqEmail({ 
                    pr_info: prInfo,
                    rfq_document: rfqDocument
                });
                email = result;
            } catch (error) {
                console.error('API Error:', error);
                email = MockData.rfqEmail;
            }
        } else {
            email = MockData.rfqEmail;
        }
        
        const suppliers = (this.cachedData.supplierPool || MockData.supplierPool).slice(0, 3);
        
        container.innerHTML = `
            <div class="grid grid-cols-2 gap-4 h-full">
                <!-- Left: Supplier Selection -->
                <div>
                    <h4 class="font-semibold text-sm mb-3 text-gray-400">
                        <i class="fas fa-check-square mr-1"></i>발송 대상 선택
                    </h4>
                    <div class="space-y-2" id="supplier-checkboxes">
                        ${suppliers.map((s, idx) => `
                            <label class="flex items-center gap-3 p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition">
                                <input type="checkbox" checked class="w-4 h-4 rounded text-blue-600">
                                <div class="flex-1">
                                    <div class="font-medium">${s.name}</div>
                                    <div class="text-xs text-gray-400">${s.contact}</div>
                                </div>
                                <span class="score-badge ${s.score >= 90 ? 'high' : 'medium'}">${s.score}%</span>
                            </label>
                        `).join('')}
                    </div>
                    
                    <button id="btn-send-rfq" class="w-full mt-4 bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-semibold transition btn-pulse">
                        <i class="fas fa-paper-plane mr-2"></i>
                        발송 시뮬레이션
                    </button>
                </div>
                
                <!-- Right: Email Preview -->
                <div class="flex flex-col">
                    <h4 class="font-semibold text-sm mb-3 text-gray-400">
                        <i class="fas fa-envelope-open-text mr-1"></i>자동 생성된 RFQ 이메일
                    </h4>
                    <div class="email-preview flex-1">
                        <div class="email-header">
                            <div class="email-field">
                                <span class="email-label">제목:</span>
                                <span>${email.subject}</span>
                            </div>
                            <div class="email-field">
                                <span class="email-label">수신:</span>
                                <span class="text-gray-500">(선택된 공급사)</span>
                            </div>
                        </div>
                        <div class="email-body" id="email-body-content">
                            ${email.body}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Send simulation button
        document.getElementById('btn-send-rfq').addEventListener('click', () => {
            const checked = document.querySelectorAll('#supplier-checkboxes input:checked').length;
            showToast(`${checked}개 협력사에 RFQ가 발송되었습니다`, 'success');
        });
    },

    // Zone 2: 견적 접수·검토
    renderZone2: function() {
        const panel = document.getElementById('zone2-panel');
        panel.innerHTML = `
        <div class="h-full flex flex-col">
            <!-- Header -->
            <div class="mb-4">
                <h2 class="text-xl font-bold text-orange-400 flex items-center gap-2">
                    <i class="fas fa-robot"></i>
                    Agent Zone 2 – 견적 자동 정리 및 기술·가격 검토 지원
                </h2>
                <p class="text-gray-400 text-sm mt-1">
                    여러 협력사가 제출한 견적서를 자동으로 분석·정리하고, 기술 검토 의뢰 및 가격 적정성 평가까지 수행합니다
                </p>
            </div>
            
            <!-- Main Content -->
            <div class="zone-panel flex-1">
                <!-- Input Panel -->
                <div class="input-panel slide-in-left">
                    <h3 class="font-semibold text-blue-400 mb-4">
                        <i class="fas fa-file-upload mr-2"></i>Input – 협력사 제출 견적서
                    </h3>
                    
                    <div class="upload-area mb-4" id="upload-area">
                        <i class="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                        <p class="text-gray-400">견적서 파일을 드래그하거나 클릭하여 업로드</p>
                        <p class="text-xs text-gray-500 mt-1">PDF, Excel 지원</p>
                    </div>
                    
                    <div id="file-list" class="space-y-2">
                        <!-- Files will be loaded here -->
                    </div>
                </div>
                
                <!-- Output Panel -->
                <div class="output-panel slide-in-right">
                    <div class="tab-container">
                        <div class="tab-btn active" data-tab="tab2-1">
                            <i class="fas fa-balance-scale mr-1"></i>
                            견적 비교 및 검토
                        </div>
                        <div class="tab-btn" data-tab="tab2-2">
                            <i class="fas fa-cogs mr-1"></i>
                            기술 검토 의뢰
                        </div>
                        <div class="tab-btn" data-tab="tab2-3">
                            <i class="fas fa-chart-line mr-1"></i>
                            가격 적정성 평가
                        </div>
                    </div>
                    
                    <div class="tab-content">
                        <!-- Tab 2-1: Quote Comparison -->
                        <div id="tab2-1" class="tab-pane active">
                            <div id="quote-comparison-container">
                                <div class="flex items-center justify-center h-full text-gray-500">
                                    <div class="text-center">
                                        <i class="fas fa-table text-4xl mb-2"></i>
                                        <p>견적서 분석 대기 중...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Tab 2-2: Tech Review -->
                        <div id="tab2-2" class="tab-pane">
                            <div id="tech-review-container">
                                <div class="flex items-center justify-center h-full text-gray-500">
                                    <div class="text-center">
                                        <i class="fas fa-microscope text-4xl mb-2"></i>
                                        <p>기술 검토 의뢰 대기 중...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Tab 2-3: Price Fairness -->
                        <div id="tab2-3" class="tab-pane">
                            <div id="price-fairness-container">
                                <div class="flex items-center justify-center h-full text-gray-500">
                                    <div class="text-center">
                                        <i class="fas fa-chart-bar text-4xl mb-2"></i>
                                        <p>가격 분석 대기 중...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        
        this.setupZone2Events();
    },

    setupZone2Events: function() {
        // Tab switching
        document.querySelectorAll('#zone2-panel .tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                document.querySelectorAll('#zone2-panel .tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('#zone2-panel .tab-pane').forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });

        // Upload area click simulation
        const uploadArea = document.getElementById('upload-area');
        if (uploadArea) {
            uploadArea.addEventListener('click', () => {
                this.loadQuoteFiles();
            });
        }
    },

    loadQuoteFiles: async function() {
        const fileList = document.getElementById('file-list');
        const quotes = MockData.submittedQuotes;
        
        // 캐시에 저장
        this.cachedData.quotes = quotes;
        
        fileList.innerHTML = '';
        quotes.forEach((quote, idx) => {
            setTimeout(() => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.style.animation = 'fadeIn 0.3s ease';
                fileItem.innerHTML = `
                    <div class="file-icon ${quote.fileType}">
                        <i class="fas fa-file-${quote.fileType === 'pdf' ? 'pdf' : 'excel'}"></i>
                    </div>
                    <div class="flex-1">
                        <div class="font-medium text-sm">${quote.fileName}</div>
                        <div class="text-xs text-gray-400">${quote.supplier} · ${quote.submittedDate}</div>
                    </div>
                    <i class="fas fa-check-circle text-green-500"></i>
                `;
                fileList.appendChild(fileItem);
            }, idx * 500);
        });
        
        setTimeout(() => {
            showToast('3개 견적서가 업로드되었습니다', 'success');
        }, 1500);
    },

    loadQuoteComparison: async function() {
        const container = document.getElementById('quote-comparison-container');
        
        // 로딩 표시
        container.innerHTML = `
            <div class="flex items-center justify-center h-full text-gray-500">
                <div class="text-center">
                    <div class="loading-spinner mx-auto mb-4"></div>
                    <p>AI가 견적을 분석 중입니다...</p>
                </div>
            </div>
        `;
        
        // API 호출 또는 Mock 데이터 사용
        let quotes, analysis;
        if (Config.API_MODE === 'live') {
            try {
                const prInfo = this.cachedData.prInfo || MockData.prInfo;
                const cachedQuotes = this.cachedData.quotes || MockData.submittedQuotes;
                const result = await ApiService.compareQuotes(cachedQuotes);
                quotes = result.quotes || MockData.submittedQuotes;
                analysis = result.analysis || MockData.quoteAnalysis;
            } catch (error) {
                console.error('API Error:', error);
                quotes = MockData.submittedQuotes;
                analysis = MockData.quoteAnalysis;
            }
        } else {
            quotes = MockData.submittedQuotes;
            analysis = MockData.quoteAnalysis;
        }
        
        // 캐시에 저장
        this.cachedData.quoteAnalysis = analysis;
        
        container.innerHTML = `
            <!-- AI Summary -->
            <div class="mb-4 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
                <div class="flex items-center gap-2 text-blue-400 font-semibold mb-2">
                    <i class="fas fa-robot"></i>
                    AI 검토 요약
                </div>
                <p class="text-gray-300 text-sm">${analysis.summary}</p>
            </div>
            
            <!-- Comparison Table -->
            <div class="overflow-x-auto">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>공급사</th>
                            <th>단가</th>
                            <th>총액</th>
                            <th>납기</th>
                            <th>결제조건</th>
                            <th>보증</th>
                            <th>이슈</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${quotes.map(q => `
                            <tr>
                                <td class="font-medium">${q.supplier}</td>
                                <td class="font-mono">${q.currency} ${q.unitPrice.toLocaleString()}</td>
                                <td class="font-mono">${q.currency} ${q.totalPrice.toLocaleString()}</td>
                                <td>${q.deliveryDate}<br><span class="text-xs text-gray-400">(${q.deliveryDays}일)</span></td>
                                <td class="text-sm">${q.paymentTerms}</td>
                                <td>${q.warranty}</td>
                                <td>
                                    ${q.issues.length > 0 
                                        ? `<span class="text-red-400 flex items-center gap-1">
                                            <i class="fas fa-exclamation-triangle"></i>
                                            ${q.issues[0]}
                                           </span>`
                                        : '<span class="text-green-400"><i class="fas fa-check"></i> 양호</span>'}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <!-- Recommendations -->
            <div class="mt-4 grid grid-cols-3 gap-3">
                ${analysis.recommendations.map(rec => `
                    <div class="p-3 rounded-lg ${rec.status === '추천' ? 'bg-green-900/30 border border-green-500/30' : rec.status === '대안' ? 'bg-yellow-900/30 border border-yellow-500/30' : 'bg-gray-700'}">
                        <div class="flex items-center justify-between mb-1">
                            <span class="font-medium text-sm">${rec.supplier}</span>
                            <span class="text-xs px-2 py-0.5 rounded-full ${rec.status === '추천' ? 'bg-green-600' : rec.status === '대안' ? 'bg-yellow-600' : 'bg-gray-600'}">${rec.status}</span>
                        </div>
                        <p class="text-xs text-gray-400">${rec.reason}</p>
                    </div>
                `).join('')}
            </div>
        `;
    },

    loadTechReview: async function() {
        const container = document.getElementById('tech-review-container');
        
        // API 호출 또는 Mock 데이터 사용
        let email;
        if (Config.API_MODE === 'live') {
            try {
                const prInfo = this.cachedData.prInfo || MockData.prInfo;
                const quotes = this.cachedData.quotes || MockData.submittedQuotes;
                const result = await ApiService.generateTechReview({ quotes, pr_info: prInfo });
                email = result;
            } catch (error) {
                console.error('API Error:', error);
                email = MockData.techReviewEmail;
            }
        } else {
            email = MockData.techReviewEmail;
        }
        
        container.innerHTML = `
            <div class="grid grid-cols-2 gap-4 h-full">
                <!-- Email Preview -->
                <div class="flex flex-col">
                    <h4 class="font-semibold text-sm mb-3 text-gray-400">
                        <i class="fas fa-envelope mr-1"></i>기술 검토 요청 이메일 초안
                    </h4>
                    <div class="email-preview flex-1">
                        <div class="email-header">
                            <div class="email-field">
                                <span class="email-label">수신:</span>
                                <span>${email.to}</span>
                            </div>
                            <div class="email-field">
                                <span class="email-label">제목:</span>
                                <span>${email.subject}</span>
                            </div>
                        </div>
                        <div class="email-body" id="tech-email-body">
                        </div>
                    </div>
                    <button class="mt-3 bg-gray-600 hover:bg-gray-500 py-2 rounded-lg text-sm transition">
                        <i class="fas fa-copy mr-1"></i>이메일 복사
                    </button>
                </div>
                
                <!-- Related Documents -->
                <div>
                    <h4 class="font-semibold text-sm mb-3 text-gray-400">
                        <i class="fas fa-file-alt mr-1"></i>관련 도면/사양 요약
                    </h4>
                    <div class="space-y-3">
                        <div class="info-card">
                            <div class="info-card-header">검토 대상 품목</div>
                            <div class="info-card-value">고압 밸브 (HPV-316SS-4IN)</div>
                        </div>
                        <div class="info-card">
                            <div class="info-card-header">주요 검토 항목</div>
                            <ul class="list-disc list-inside text-sm text-gray-300 space-y-1 mt-2">
                                <li>재질 적합성 (SUS316)</li>
                                <li>압력 등급 충족 (Class 600)</li>
                                <li>인증 유효성 (API 600, ASME)</li>
                                <li>도면 치수 정합성</li>
                            </ul>
                        </div>
                        <div class="info-card">
                            <div class="info-card-header">첨부 파일</div>
                            <div class="space-y-2 mt-2">
                                <div class="flex items-center gap-2 text-sm">
                                    <i class="fas fa-file-pdf text-red-400"></i>
                                    <span>한국밸브_기술자료.pdf</span>
                                </div>
                                <div class="flex items-center gap-2 text-sm">
                                    <i class="fas fa-file-pdf text-red-400"></i>
                                    <span>KITZ_Datasheet.pdf</span>
                                </div>
                                <div class="flex items-center gap-2 text-sm">
                                    <i class="fas fa-file-pdf text-red-400"></i>
                                    <span>Flowserve_Specs.pdf</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Type email body
        this.typeEmailBody('tech-email-body', email.body);
    },

    typeEmailBody: function(elementId, text) {
        const element = document.getElementById(elementId);
        element.innerHTML = '';
        let idx = 0;
        
        const typeInterval = setInterval(() => {
            if (idx < text.length) {
                element.innerHTML = text.slice(0, idx + 1).replace(/\n/g, '<br>');
                idx += 5;
            } else {
                clearInterval(typeInterval);
            }
        }, 10);
    },

    loadPriceFairness: async function() {
        const container = document.getElementById('price-fairness-container');
        
        // 로딩 표시
        container.innerHTML = `
            <div class="flex items-center justify-center h-full text-gray-500">
                <div class="text-center">
                    <div class="loading-spinner mx-auto mb-4"></div>
                    <p>가격 적정성을 분석 중입니다...</p>
                </div>
            </div>
        `;
        
        // API 호출 또는 Mock 데이터 사용
        let fairness, poolSuggestions;
        if (Config.API_MODE === 'live') {
            try {
                const quotes = this.cachedData.quotes || MockData.submittedQuotes;
                const result = await ApiService.evaluatePrice({ 
                    quotes, 
                    historical_data: MockData.priceFairness.historicalPrices 
                });
                fairness = result;
                
                const poolResult = await ApiService.suggestPoolChanges({
                    quotes,
                    evaluation_result: result,
                    quote_analysis: this.cachedData.quoteAnalysis || MockData.quoteAnalysis
                });
                poolSuggestions = poolResult.suggestions || MockData.poolSuggestions;
            } catch (error) {
                console.error('API Error:', error);
                fairness = MockData.priceFairness;
                poolSuggestions = MockData.poolSuggestions;
            }
        } else {
            fairness = MockData.priceFairness;
            poolSuggestions = MockData.poolSuggestions;
        }
        
        // 캐시에 저장
        this.cachedData.priceFairness = fairness;
        
        container.innerHTML = `
            <div class="grid grid-cols-2 gap-4 h-full">
                <!-- Left: Chart and Table -->
                <div class="space-y-4">
                    <div>
                        <h4 class="font-semibold text-sm mb-3 text-gray-400">
                            <i class="fas fa-star mr-1"></i>가격 적정성 평가
                        </h4>
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>공급사</th>
                                    <th>단가</th>
                                    <th>적정성</th>
                                    <th>상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${fairness.currentQuotes.map(q => `
                                    <tr>
                                        <td>${q.supplier}</td>
                                        <td class="font-mono">₩${q.price.toLocaleString()}</td>
                                        <td>
                                            <span class="score-badge ${q.fairnessScore >= 90 ? 'high' : q.fairnessScore >= 80 ? 'medium' : 'low'}">
                                                ${q.fairnessScore}%
                                            </span>
                                        </td>
                                        <td>
                                            <span class="${q.status === '적정' ? 'text-green-400' : 'text-red-400'}">
                                                ${q.status}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <!-- Right: Pool Suggestions -->
                <div>
                    <div class="mb-4 p-3 bg-green-900/30 rounded-lg border border-green-500/30">
                        <div class="flex items-center gap-2 text-green-400 font-semibold mb-1">
                            <i class="fas fa-lightbulb"></i>
                            AI 권장 사항
                        </div>
                        <p class="text-gray-300 text-sm">${fairness.recommendation}</p>
                    </div>
                    
                    <h4 class="font-semibold text-sm mb-3 text-gray-400">
                        <i class="fas fa-exchange-alt mr-1"></i>Supplier Pool 변경 제안
                    </h4>
                    <div class="space-y-3">
                        ${poolSuggestions.map(s => `
                            <div class="p-3 rounded-lg bg-gray-700">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="font-medium">${s.supplier}</span>
                                    <span class="text-xs">
                                        <span class="text-gray-400">${s.currentStatus}</span>
                                        <i class="fas fa-arrow-right mx-1 text-gray-500"></i>
                                        <span class="${s.suggestedStatus.includes('승격') ? 'text-green-400' : s.suggestedStatus.includes('조정') ? 'text-yellow-400' : 'text-blue-400'}">${s.suggestedStatus}</span>
                                    </span>
                                </div>
                                <p class="text-xs text-gray-400">${s.reason}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        // Render chart
        // this.renderPriceChart(fairness);
    },

    renderPriceChart: function(fairness) {
        const ctx = document.getElementById('price-chart');
        if (!ctx) return;
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [...fairness.historicalPrices.map(h => h.date), '현재 견적'],
                datasets: [{
                    label: '평균 단가 (원)',
                    data: [...fairness.historicalPrices.map(h => h.avgPrice), fairness.currentQuotes[0].price],
                    backgroundColor: [
                        'rgba(107, 114, 128, 0.7)',
                        'rgba(107, 114, 128, 0.7)',
                        'rgba(107, 114, 128, 0.7)',
                        'rgba(107, 114, 128, 0.7)',
                        'rgba(59, 130, 246, 0.7)'
                    ],
                    borderColor: [
                        'rgba(107, 114, 128, 1)',
                        'rgba(107, 114, 128, 1)',
                        'rgba(107, 114, 128, 1)',
                        'rgba(107, 114, 128, 1)',
                        'rgba(59, 130, 246, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 700000,
                        ticks: {
                            color: '#9ca3af',
                            callback: function(value) {
                                return '₩' + value.toLocaleString();
                            }
                        },
                        grid: {
                            color: 'rgba(75, 85, 99, 0.3)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#9ca3af'
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    },

    // Zone 3: 계약/PO 자동 생성
    renderZone3: function() {
        const panel = document.getElementById('zone3-panel');
        panel.innerHTML = `
        <div class="h-full flex flex-col">
            <!-- Header -->
            <div class="mb-4">
                <h2 class="text-xl font-bold text-orange-400 flex items-center gap-2">
                    <i class="fas fa-robot"></i>
                    Agent Zone 3 – 계약서 및 PO 자동 생성
                </h2>
                <p class="text-gray-400 text-sm mt-1">
                    입찰·검토 결과를 바탕으로 계약서 및 PO 초안을 자동 작성하고, 카운터사인 요청까지 생성합니다
                </p>
            </div>
            
            <!-- Main Content -->
            <div class="zone-panel flex-1">
                <!-- Input Panel -->
                <div class="input-panel slide-in-left" style="flex: 0 0 30%;">
                    <h3 class="font-semibold text-blue-400 mb-4">
                        <i class="fas fa-check-double mr-2"></i>Input – 선정 결과 및 조건 요약
                    </h3>
                    <div id="selection-summary">
                        <!-- Will be loaded -->
                    </div>
                </div>
                
                <!-- Output Panel -->
                <div class="output-panel slide-in-right">
                    <div class="flex flex-col h-full">
                        <!-- Contract Document -->
                        <div class="flex-1 p-4 border-b border-gray-700">
                            <div class="flex items-center justify-between mb-3">
                                <h4 class="font-semibold text-gray-400">
                                    <i class="fas fa-file-contract mr-1"></i>계약서 자동 초안
                                </h4>
                                <span class="text-xs text-green-400 flex items-center gap-1" id="contract-status">
                                    <i class="fas fa-spinner fa-spin"></i>
                                    대기 중...
                                </span>
                            </div>
                            <div class="document-preview h-48" id="contract-preview">
                                <div class="flex items-center justify-center h-full text-gray-400">
                                    <div class="text-center">
                                        <i class="fas fa-file-signature text-4xl mb-2"></i>
                                        <p>계약서 생성 대기 중...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- PO and Email -->
                        <div class="flex-1 p-4">
                            <div class="grid grid-cols-2 gap-4 h-full">
                                <!-- PO Info -->
                                <div>
                                    <h4 class="font-semibold text-sm mb-3 text-gray-400">
                                        <i class="fas fa-file-invoice-dollar mr-1"></i>PO 정보
                                    </h4>
                                    <div id="po-info-container">
                                        <div class="flex items-center justify-center h-32 text-gray-500">
                                            <p>PO 생성 대기 중...</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Counter Sign Email -->
                                <div class="flex flex-col">
                                    <h4 class="font-semibold text-sm mb-3 text-gray-400">
                                        <i class="fas fa-signature mr-1"></i>카운터사인 요청 이메일
                                    </h4>
                                    <div class="email-preview flex-1 text-xs" id="countersign-email">
                                        <div class="flex items-center justify-center h-full text-gray-400">
                                            <p>이메일 생성 대기 중...</p>
                                        </div>
                                    </div>
                                    <button id="btn-export-pdf" class="mt-3 bg-green-600 hover:bg-green-500 py-2 rounded-lg text-sm transition btn-pulse" style="display: none;">
                                        <i class="fas fa-file-pdf mr-1"></i>PDF로 내보내기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    },

    loadSelectionSummary: function() {
        const container = document.getElementById('selection-summary');
        const selected = MockData.selectedSupplier;
        
        // 캐시에 저장
        this.cachedData.selectedSupplier = selected;
        
        container.innerHTML = `
            <div class="info-card">
                <div class="info-card-header">선정 협력사</div>
                <div class="info-card-value text-green-400">${selected.name}</div>
            </div>
            <div class="grid grid-cols-2 gap-2">
                <div class="info-card">
                    <div class="info-card-header">단가</div>
                    <div class="info-card-value font-mono text-sm">₩${selected.unitPrice.toLocaleString()}</div>
                </div>
                <div class="info-card">
                    <div class="info-card-header">총액</div>
                    <div class="info-card-value font-mono text-sm">₩${selected.totalPrice.toLocaleString()}</div>
                </div>
            </div>
            <div class="info-card">
                <div class="info-card-header">납기</div>
                <div class="info-card-value">${selected.deliveryDate}</div>
            </div>
            <div class="info-card">
                <div class="info-card-header">결제 조건</div>
                <div class="info-card-value text-sm">${selected.paymentTerms}</div>
            </div>
            <div class="info-card">
                <div class="info-card-header">특수 조건</div>
                <ul class="list-disc list-inside text-xs text-gray-300 mt-1 space-y-1">
                    ${selected.specialConditions.map(c => `<li>${c}</li>`).join('')}
                </ul>
            </div>
        `;
    },

    loadContract: async function() {
        const preview = document.getElementById('contract-preview');
        const status = document.getElementById('contract-status');
        
        status.innerHTML = '<i class="fas fa-spinner fa-spin"></i> AI가 작성 중...';
        
        // API 호출 또는 Mock 데이터 사용
        let clauses;
        if (Config.API_MODE === 'live') {
            try {
                const prInfo = this.cachedData.prInfo || MockData.prInfo;
                const selectedSupplier = this.cachedData.selectedSupplier || MockData.selectedSupplier;
                const result = await ApiService.generateContract({
                    selected_supplier: selectedSupplier,
                    pr_info: prInfo,
                    terms: { delivery_address: '충남 서산시 대산읍 신규플랜트 현장' }
                });
                clauses = result.clauses || MockData.contractClauses;
            } catch (error) {
                console.error('API Error:', error);
                clauses = MockData.contractClauses;
            }
        } else {
            clauses = MockData.contractClauses;
        }
        
        // 캐시에 저장
        this.cachedData.contract = { clauses };
        
        preview.innerHTML = '<h1>물품공급계약서</h1>';
        
        let clauseIdx = 0;
        const typeClause = () => {
            if (clauseIdx < clauses.length) {
                const clause = clauses[clauseIdx];
                preview.innerHTML += `
                    <h2 class="mt-4">${clause.number}</h2>
                    <p>${clause.content.replace(/\n/g, '<br>')}</p>
                `;
                preview.scrollTop = preview.scrollHeight;
                clauseIdx++;
                setTimeout(typeClause, 800);
            } else {
                status.innerHTML = '<i class="fas fa-check-circle"></i> 생성 완료';
                showToast('계약서 초안이 자동 생성되었습니다', 'success');
            }
        };
        
        setTimeout(typeClause, 500);
    },

    loadPOInfo: async function() {
        const container = document.getElementById('po-info-container');
        
        // API 호출 또는 Mock 데이터 사용
        let po;
        if (Config.API_MODE === 'live') {
            try {
                const prInfo = this.cachedData.prInfo || MockData.prInfo;
                const supplierInfo = this.cachedData.selectedSupplier || MockData.selectedSupplier;
                const result = await ApiService.generatePo({
                    supplier_info: supplierInfo,
                    pr_info: prInfo,
                    contract_info: this.cachedData.contract || {}
                });
                po = result;
            } catch (error) {
                console.error('API Error:', error);
                po = MockData.poInfo;
            }
        } else {
            po = MockData.poInfo;
        }
        
        // 캐시에 저장
        this.cachedData.poInfo = po;
        
        container.innerHTML = `
            <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                    <span class="text-gray-400">PO 번호</span>
                    <span class="font-mono text-blue-400">${po.poNumber}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">발행일</span>
                    <span>${po.issueDate}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">공급가액</span>
                    <span class="font-mono">₩${po.subtotal.toLocaleString()}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">부가세</span>
                    <span class="font-mono">₩${po.vat.toLocaleString()}</span>
                </div>
                <div class="flex justify-between border-t border-gray-600 pt-2">
                    <span class="text-gray-400 font-semibold">총액</span>
                    <span class="font-mono font-bold text-green-400">₩${po.total.toLocaleString()}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">납품장소</span>
                    <span class="text-xs">${po.deliveryAddress}</span>
                </div>
            </div>
        `;
    },

    loadCounterSignEmail: async function() {
        const container = document.getElementById('countersign-email');
        
        // API 호출 또는 Mock 데이터 사용
        let email;
        if (Config.API_MODE === 'live') {
            try {
                const poInfo = this.cachedData.poInfo || MockData.poInfo;
                const supplierInfo = this.cachedData.selectedSupplier || MockData.selectedSupplier;
                const result = await ApiService.generateCountersignEmail({
                    po_info: poInfo,
                    supplier_info: supplierInfo
                });
                email = result;
            } catch (error) {
                console.error('API Error:', error);
                email = MockData.counterSignEmail;
            }
        } else {
            email = MockData.counterSignEmail;
        }
        
        container.innerHTML = `
            <div class="email-header">
                <div class="email-field">
                    <span class="email-label">수신:</span>
                    <span>${email.to}</span>
                </div>
                <div class="email-field">
                    <span class="email-label">제목:</span>
                    <span>${email.subject}</span>
                </div>
            </div>
            <div class="email-body text-xs" style="white-space: pre-wrap; font-size: 11px;">${email.body}</div>
        `;
        
        document.getElementById('btn-export-pdf').style.display = 'block';
        document.getElementById('btn-export-pdf').addEventListener('click', () => {
            showToast('PDF 파일이 생성되었습니다 (시뮬레이션)', 'success');
        });
    },

    // Summary Screen
    renderSummary: function() {
        const panel = document.getElementById('summary-screen');
        panel.innerHTML = `
        <div class="h-full flex flex-col items-center justify-center">
            <div class="completion-check mb-6">
                <i class="fas fa-check"></i>
            </div>
            
            <h2 class="text-2xl font-bold mb-2">워크플로우 시연 완료</h2>
            <p class="text-gray-400 mb-8">AI 기반 기자재 발주 프로세스가 성공적으로 완료되었습니다</p>
            
            <div class="grid grid-cols-4 gap-6 mb-8">
                <div class="summary-stat">
                    <div class="summary-stat-value">3</div>
                    <div class="summary-stat-label">처리된 Agent Zone</div>
                </div>
                <div class="summary-stat">
                    <div class="summary-stat-value">5</div>
                    <div class="summary-stat-label">분석된 협력사</div>
                </div>
                <div class="summary-stat">
                    <div class="summary-stat-value">3</div>
                    <div class="summary-stat-label">검토된 견적</div>
                </div>
                <div class="summary-stat">
                    <div class="summary-stat-value">₩46.7M</div>
                    <div class="summary-stat-label">총 계약 금액</div>
                </div>
            </div>
            
            <div class="summary-card max-w-2xl w-full">
                <h3 class="font-semibold mb-4 text-blue-400">
                    <i class="fas fa-list-check mr-2"></i>처리 요약
                </h3>
                <div class="space-y-3">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                            <i class="fas fa-check text-sm"></i>
                        </div>
                        <div>
                            <div class="font-medium">RFQ 자동 생성 및 발송</div>
                            <div class="text-sm text-gray-400">5개 협력사에 RFQ 발송 완료</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                            <i class="fas fa-check text-sm"></i>
                        </div>
                        <div>
                            <div class="font-medium">견적 접수 및 분석</div>
                            <div class="text-sm text-gray-400">3개 협력사 견적 비교 분석 완료</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                            <i class="fas fa-check text-sm"></i>
                        </div>
                        <div>
                            <div class="font-medium">계약서 및 PO 생성</div>
                            <div class="text-sm text-gray-400">(주)한국밸브산업 선정, PO-2024-001234 발행</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <button id="btn-restart" class="mt-8 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-semibold transition">
                <i class="fas fa-redo mr-2"></i>
                처음부터 다시 시작
            </button>
        </div>
        `;
        
        document.getElementById('btn-restart').addEventListener('click', () => {
            if (typeof ScenarioController !== 'undefined') {
                ScenarioController.reset();
            }
        });
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ZonePanels;
}
