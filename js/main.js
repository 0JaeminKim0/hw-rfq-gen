/**
 * Main Application Controller
 * 시나리오 재생, 상태 관리, 이벤트 핸들링
 */

// Toast Notification
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    
    toast.innerHTML = `
        <i class="fas ${icon} text-${type === 'success' ? 'green' : type === 'warning' ? 'yellow' : 'blue'}-400"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Scenario Controller
const ScenarioController = {
    currentStep: -1,
    isPlaying: false,
    isPaused: false,
    currentZone: 0,
    timers: [],

    // 시나리오 단계 정의
    steps: [
        { id: 'intro', zone: 0, duration: 1000, nodeIds: [] },
        { id: 'pr', zone: 0, duration: 1500, nodeIds: ['pr'] },
        { id: 'receive', zone: 0, duration: 1500, nodeIds: ['receive'] },
        { id: 'zone1_enter', zone: 1, duration: 500, nodeIds: [] },
        { id: 'zone1_supplier', zone: 1, duration: 4000, nodeIds: ['spec_analysis', 'supplier_pool', 'rfq_target'] },
        { id: 'zone1_rfq', zone: 1, duration: 5000, nodeIds: ['rfq_context', 'rfq_design', 'rfq_goal'] },
        { id: 'zone1_send', zone: 1, duration: 3000, nodeIds: ['rfq_check', 'rfq_send'] },
        { id: 'zone2_enter', zone: 2, duration: 500, nodeIds: [] },
        { id: 'zone2_receive', zone: 2, duration: 4000, nodeIds: ['supplier_submit', 'rfq_receive', 'review_result'] },
        { id: 'zone2_tech', zone: 2, duration: 4000, nodeIds: ['price_factor', 'tech_factor', 'price_review', 'tech_request'] },
        { id: 'zone2_price', zone: 2, duration: 4000, nodeIds: ['tech_review', 'tech_result', 'pool_change'] },
        { id: 'zone3_enter', zone: 3, duration: 500, nodeIds: [] },
        { id: 'zone3_select', zone: 3, duration: 3000, nodeIds: ['supplier_count', 'single_quote', 'multi_quote', 'final_review', 'supplier_select'] },
        { id: 'zone3_contract', zone: 3, duration: 5000, nodeIds: ['approval', 'contract_review', 'po_approval'] },
        { id: 'zone3_po', zone: 3, duration: 4000, nodeIds: ['po_create', 'po_receive', 'contract_auto'] },
        { id: 'complete', zone: 0, duration: 1000, nodeIds: ['complete'] }
    ],

    init: function() {
        this.bindEvents();
        WorkflowDiagram.render('workflow-container');
        this.updateUI();
    },

    bindEvents: function() {
        document.getElementById('btn-play').addEventListener('click', () => this.play());
        document.getElementById('btn-pause').addEventListener('click', () => this.pause());
        document.getElementById('btn-prev').addEventListener('click', () => this.prev());
        document.getElementById('btn-next').addEventListener('click', () => this.next());
    },

    play: function() {
        if (this.currentStep < 0) {
            this.currentStep = 0;
        }
        
        this.isPlaying = true;
        this.isPaused = false;
        this.updateUI();
        this.executeStep();
    },

    pause: function() {
        this.isPaused = true;
        this.isPlaying = false;
        this.clearTimers();
        this.updateUI();
    },

    prev: function() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.clearTimers();
            this.executeStep();
        }
    },

    next: function() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.clearTimers();
            this.executeStep();
        }
    },

    goToZone: function(zoneId) {
        // Find first step of the zone
        const stepIdx = this.steps.findIndex(s => s.zone === zoneId && s.id.includes('enter'));
        if (stepIdx >= 0) {
            this.currentStep = stepIdx;
            this.clearTimers();
            this.executeStep();
        }
    },

    reset: function() {
        this.currentStep = -1;
        this.isPlaying = false;
        this.isPaused = false;
        this.currentZone = 0;
        this.clearTimers();
        
        // Clear highlights
        WorkflowDiagram.clearHighlights();
        
        // Show welcome screen
        this.hideAllPanels();
        document.getElementById('welcome-screen').classList.remove('hidden');
        
        // Reset progress
        document.getElementById('progress-bar').style.width = '0%';
        document.getElementById('progress-text').textContent = '0%';
        document.getElementById('current-step-label').textContent = '대기 중';
        
        this.updateUI();
    },

    clearTimers: function() {
        this.timers.forEach(t => clearTimeout(t));
        this.timers = [];
    },

    executeStep: function() {
        const step = this.steps[this.currentStep];
        if (!step) return;

        // Update current step label
        this.updateStepLabel(step.id);
        
        // Update progress
        const progress = ((this.currentStep + 1) / this.steps.length) * 100;
        document.getElementById('progress-bar').style.width = progress + '%';
        document.getElementById('progress-text').textContent = Math.round(progress) + '%';

        // Clear previous highlights
        WorkflowDiagram.clearHighlights();

        // Highlight current nodes
        step.nodeIds.forEach(nodeId => {
            Animations.highlightNode(nodeId);
        });

        // Handle zone change
        if (step.zone !== this.currentZone) {
            this.currentZone = step.zone;
            this.showZonePanel(step.zone);
        }

        // Execute step-specific actions
        this.executeStepAction(step);

        // Auto-advance if playing
        if (this.isPlaying && !this.isPaused) {
            const timer = setTimeout(() => {
                if (this.currentStep < this.steps.length - 1) {
                    this.currentStep++;
                    this.executeStep();
                } else {
                    this.isPlaying = false;
                    this.updateUI();
                }
            }, step.duration);
            this.timers.push(timer);
        }

        this.updateUI();
    },

    executeStepAction: function(step) {
        switch (step.id) {
            case 'zone1_enter':
                WorkflowDiagram.highlightZone(1);
                ZonePanels.renderZone1();
                showToast('Agent Zone 1 진입: RFQ 자동 설계 시작', 'info');
                break;

            case 'zone1_supplier':
                ZonePanels.loadPRInfo();
                setTimeout(() => {
                    ZonePanels.loadSupplierPool();
                }, 1000);
                break;

            case 'zone1_rfq':
                // Switch to RFQ tab
                document.querySelector('[data-tab="tab1-2"]').click();
                setTimeout(() => {
                    ZonePanels.loadRFQDocument();
                }, 500);
                break;

            case 'zone1_send':
                // Switch to Email tab
                document.querySelector('[data-tab="tab1-3"]').click();
                setTimeout(() => {
                    ZonePanels.loadRFQEmail();
                }, 500);
                break;

            case 'zone2_enter':
                WorkflowDiagram.highlightZone(2);
                ZonePanels.renderZone2();
                showToast('Agent Zone 2 진입: 견적 접수 및 검토 시작', 'info');
                break;

            case 'zone2_receive':
                ZonePanels.loadQuoteFiles();
                setTimeout(() => {
                    ZonePanels.loadQuoteComparison();
                }, 2000);
                break;

            case 'zone2_tech':
                document.querySelector('[data-tab="tab2-2"]').click();
                setTimeout(() => {
                    ZonePanels.loadTechReview();
                }, 500);
                break;

            case 'zone2_price':
                document.querySelector('[data-tab="tab2-3"]').click();
                setTimeout(() => {
                    ZonePanels.loadPriceFairness();
                }, 500);
                break;

            case 'zone3_enter':
                WorkflowDiagram.highlightZone(3);
                ZonePanels.renderZone3();
                showToast('Agent Zone 3 진입: 계약/PO 자동 생성 시작', 'info');
                break;

            case 'zone3_select':
                ZonePanels.loadSelectionSummary();
                break;

            case 'zone3_contract':
                ZonePanels.loadContract();
                break;

            case 'zone3_po':
                ZonePanels.loadPOInfo();
                setTimeout(() => {
                    ZonePanels.loadCounterSignEmail();
                }, 1500);
                break;

            case 'complete':
                WorkflowDiagram.clearHighlights();
                Animations.highlightNode('complete');
                this.showZonePanel(4); // Summary
                showToast('워크플로우 시연이 완료되었습니다', 'success');
                break;
        }
    },

    showZonePanel: function(zoneId) {
        this.hideAllPanels();
        
        switch (zoneId) {
            case 0:
                document.getElementById('welcome-screen').classList.remove('hidden');
                break;
            case 1:
                document.getElementById('zone1-panel').classList.remove('hidden');
                break;
            case 2:
                document.getElementById('zone2-panel').classList.remove('hidden');
                break;
            case 3:
                document.getElementById('zone3-panel').classList.remove('hidden');
                break;
            case 4:
                ZonePanels.renderSummary();
                document.getElementById('summary-screen').classList.remove('hidden');
                break;
        }
    },

    hideAllPanels: function() {
        document.getElementById('welcome-screen').classList.add('hidden');
        document.getElementById('zone1-panel').classList.add('hidden');
        document.getElementById('zone2-panel').classList.add('hidden');
        document.getElementById('zone3-panel').classList.add('hidden');
        document.getElementById('summary-screen').classList.add('hidden');
    },

    updateStepLabel: function(stepId) {
        const labels = {
            'intro': '시작 준비 중...',
            'pr': 'PR 발생',
            'receive': '구매 요청 접수 및 확인',
            'zone1_enter': 'Agent Zone 1 진입',
            'zone1_supplier': 'Supplier Pool 분석 중',
            'zone1_rfq': 'RFQ 문서 자동 생성 중',
            'zone1_send': 'RFQ 발송 준비 중',
            'zone2_enter': 'Agent Zone 2 진입',
            'zone2_receive': '견적서 접수 및 분석 중',
            'zone2_tech': '기술 검토 의뢰 생성 중',
            'zone2_price': '가격 적정성 평가 중',
            'zone3_enter': 'Agent Zone 3 진입',
            'zone3_select': '협력사 선정 처리 중',
            'zone3_contract': '계약서 자동 생성 중',
            'zone3_po': 'PO 생성 및 발송 중',
            'complete': '업무 완료'
        };
        
        document.getElementById('current-step-label').textContent = labels[stepId] || stepId;
    },

    updateUI: function() {
        const playBtn = document.getElementById('btn-play');
        const pauseBtn = document.getElementById('btn-pause');
        const prevBtn = document.getElementById('btn-prev');
        const nextBtn = document.getElementById('btn-next');

        // Play/Pause buttons
        if (this.isPlaying && !this.isPaused) {
            playBtn.classList.add('hidden');
            pauseBtn.classList.remove('hidden');
        } else {
            playBtn.classList.remove('hidden');
            pauseBtn.classList.add('hidden');
        }

        // Update play button text
        if (this.currentStep >= 0 && this.isPaused) {
            playBtn.innerHTML = '<i class="fas fa-play"></i><span>계속 재생</span>';
        } else if (this.currentStep >= this.steps.length - 1) {
            playBtn.innerHTML = '<i class="fas fa-redo"></i><span>다시 시작</span>';
        } else {
            playBtn.innerHTML = '<i class="fas fa-play"></i><span>시나리오 재생</span>';
        }

        // Navigation buttons
        prevBtn.disabled = this.currentStep <= 0;
        nextBtn.disabled = this.currentStep >= this.steps.length - 1;
    }
};

// API Mode Toggle
function toggleApiMode() {
    if (Config.API_MODE === 'mock') {
        ApiService.switchToLiveMode();
    } else {
        ApiService.switchToMockMode();
    }
    updateApiModeUI();
}

function updateApiModeUI() {
    const label = document.getElementById('api-mode-label');
    const btn = document.getElementById('btn-api-mode');
    if (label && btn) {
        label.textContent = Config.API_MODE === 'mock' ? 'Mock' : 'Live';
        btn.className = Config.API_MODE === 'mock' 
            ? 'text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 transition'
            : 'text-xs px-2 py-1 rounded bg-green-700 hover:bg-green-600 transition';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    ScenarioController.init();
    updateApiModeUI();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case ' ':
                e.preventDefault();
                if (ScenarioController.isPlaying) {
                    ScenarioController.pause();
                } else {
                    ScenarioController.play();
                }
                break;
            case 'ArrowLeft':
                ScenarioController.prev();
                break;
            case 'ArrowRight':
                ScenarioController.next();
                break;
            case 'r':
                ScenarioController.reset();
                break;
        }
    });
});
