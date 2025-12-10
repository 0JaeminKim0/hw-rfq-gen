/**
 * Workflow SVG Diagram Generator
 * PDF의 기자재 발주 Workflow를 SVG로 시각화
 */

const WorkflowDiagram = {
    // 노드 정의
    nodes: [
        // 시작 단계
        { id: 'pr', label: 'PR 발생', x: 50, y: 140, width: 90, height: 45, type: 'process' },
        { id: 'receive', label: '구매 요청\n접수 및 확인', x: 160, y: 140, width: 90, height: 45, type: 'process' },
        
        // Agent Zone 1: RFQ 자동 준비
        { id: 'spec_analysis', label: '자재 사양\n분석', x: 280, y: 60, width: 85, height: 40, type: 'agent', zone: 1 },
        { id: 'supplier_pool', label: 'Supplier Pool\n선정', x: 280, y: 115, width: 85, height: 40, type: 'agent', zone: 1 },
        { id: 'rfq_target', label: 'RFQ 대상\n협력사 선별', x: 280, y: 170, width: 85, height: 40, type: 'agent', zone: 1 },
        { id: 'rfq_check', label: 'RFQ/발송 대상\n적절성 검토', x: 280, y: 225, width: 85, height: 40, type: 'agent', zone: 1 },
        { id: 'rfq_context', label: 'RFQ 항목 별\nContext 검토', x: 390, y: 60, width: 85, height: 40, type: 'agent', zone: 1 },
        { id: 'rfq_design', label: 'RFQ 세부내용\n자동 설계', x: 390, y: 115, width: 85, height: 40, type: 'agent', zone: 1 },
        { id: 'rfq_goal', label: 'RFQ 목표\n셋업', x: 390, y: 170, width: 85, height: 40, type: 'agent', zone: 1 },
        { id: 'rfq_send', label: '대상 협력사\nRFQ 자동 발송', x: 390, y: 225, width: 85, height: 40, type: 'agent', zone: 1 },
        
        // Agent Zone 2: 견적 접수·검토
        { id: 'supplier_submit', label: '협력사 RFQ\n제출', x: 520, y: 60, width: 85, height: 40, type: 'process' },
        { id: 'rfq_receive', label: 'RFQ 자동 접수\n및 검토', x: 520, y: 115, width: 85, height: 40, type: 'agent', zone: 2 },
        { id: 'review_result', label: '검토 결과', x: 520, y: 170, width: 85, height: 40, type: 'agent', zone: 2 },
        { id: 'price_factor', label: '가격 요소', x: 630, y: 60, width: 75, height: 35, type: 'agent', zone: 2 },
        { id: 'price_review', label: '가격 적정성\n검토', x: 630, y: 105, width: 75, height: 40, type: 'agent', zone: 2 },
        { id: 'tech_factor', label: '기술 요소', x: 630, y: 155, width: 75, height: 35, type: 'agent', zone: 2 },
        { id: 'tech_request', label: '기술 검토 의뢰\n메일 발송', x: 630, y: 200, width: 75, height: 40, type: 'agent', zone: 2 },
        { id: 'tech_review', label: '기술 검토', x: 720, y: 115, width: 75, height: 40, type: 'process' },
        { id: 'tech_result', label: '기술 검토\n결과 송부', x: 720, y: 170, width: 75, height: 40, type: 'process' },
        { id: 'pool_change', label: 'Supplier Pool\n변경', x: 720, y: 225, width: 75, height: 40, type: 'agent', zone: 2 },
        
        // 의사결정 노드
        { id: 'supplier_count', label: '대상\nSupplier 수', x: 830, y: 90, width: 75, height: 50, type: 'decision' },
        { id: 'review_needed', label: '재검토\n필요여부', x: 830, y: 170, width: 75, height: 50, type: 'decision' },
        
        // Agent Zone 3: 계약/PO 자동 생성
        { id: 'single_quote', label: '최종 견적 입수\n(수의 계약)', x: 940, y: 55, width: 85, height: 40, type: 'process' },
        { id: 'multi_quote', label: '견적 입찰', x: 940, y: 115, width: 85, height: 40, type: 'process' },
        { id: 'final_review', label: '기술/공급 조건\n최종 검토', x: 940, y: 170, width: 85, height: 40, type: 'agent', zone: 3 },
        { id: 'supplier_select', label: '협력사 선정', x: 1050, y: 60, width: 80, height: 40, type: 'agent', zone: 3 },
        { id: 'approval', label: '품의 실행', x: 1050, y: 115, width: 80, height: 40, type: 'agent', zone: 3 },
        { id: 'contract_review', label: '계약 검토', x: 1050, y: 170, width: 80, height: 40, type: 'agent', zone: 3 },
        { id: 'po_approval', label: 'PO 생성 품의', x: 1150, y: 60, width: 80, height: 40, type: 'agent', zone: 3 },
        { id: 'po_create', label: 'PO 생성\n및 발송', x: 1150, y: 115, width: 80, height: 40, type: 'agent', zone: 3 },
        { id: 'po_receive', label: 'PO 접수 및\nCounter Sign', x: 1150, y: 170, width: 80, height: 40, type: 'agent', zone: 3 },
        { id: 'contract_auto', label: '서명된 계약서\n자동 생성', x: 1150, y: 225, width: 80, height: 40, type: 'agent', zone: 3 },
        
        // 종료
        { id: 'complete', label: '업무 종료', x: 1260, y: 140, width: 80, height: 45, type: 'end' }
    ],

    // 연결선 정의
    connections: [
        { from: 'pr', to: 'receive' },
        { from: 'receive', to: 'spec_analysis' },
        { from: 'spec_analysis', to: 'supplier_pool' },
        { from: 'supplier_pool', to: 'rfq_target' },
        { from: 'rfq_target', to: 'rfq_check' },
        { from: 'spec_analysis', to: 'rfq_context' },
        { from: 'rfq_context', to: 'rfq_design' },
        { from: 'rfq_design', to: 'rfq_goal' },
        { from: 'rfq_goal', to: 'rfq_send' },
        { from: 'rfq_send', to: 'supplier_submit' },
        { from: 'supplier_submit', to: 'rfq_receive' },
        { from: 'rfq_receive', to: 'review_result' },
        { from: 'review_result', to: 'price_factor' },
        { from: 'price_factor', to: 'price_review' },
        { from: 'review_result', to: 'tech_factor' },
        { from: 'tech_factor', to: 'tech_request' },
        { from: 'tech_request', to: 'tech_review' },
        { from: 'tech_review', to: 'tech_result' },
        { from: 'tech_result', to: 'pool_change' },
        { from: 'price_review', to: 'supplier_count' },
        { from: 'pool_change', to: 'review_needed' },
        { from: 'supplier_count', to: 'single_quote', label: '단수' },
        { from: 'supplier_count', to: 'multi_quote', label: '복수' },
        { from: 'review_needed', to: 'rfq_target', label: 'Yes' },
        { from: 'review_needed', to: 'final_review', label: 'No' },
        { from: 'single_quote', to: 'final_review' },
        { from: 'multi_quote', to: 'final_review' },
        { from: 'final_review', to: 'supplier_select' },
        { from: 'supplier_select', to: 'approval' },
        { from: 'approval', to: 'contract_review' },
        { from: 'contract_review', to: 'po_approval' },
        { from: 'po_approval', to: 'po_create' },
        { from: 'po_create', to: 'po_receive' },
        { from: 'po_receive', to: 'contract_auto' },
        { from: 'contract_auto', to: 'complete' }
    ],

    // Zone 영역 정의
    zones: [
        { id: 1, label: 'Agent Zone 1\nRFQ 자동 준비', x: 265, y: 45, width: 225, height: 235, color: '#f97316' },
        { id: 2, label: 'Agent Zone 2\n견적 접수·검토', x: 505, y: 45, width: 305, height: 235, color: '#f97316' },
        { id: 3, label: 'Agent Zone 3\n계약/PO 자동 생성', x: 925, y: 40, width: 320, height: 240, color: '#f97316' }
    ],

    // SVG 생성
    render: function(containerId) {
        const container = document.getElementById(containerId);
        const svgWidth = 1380;
        const svgHeight = 290;

        let svg = `
        <svg id="workflow-svg" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280"/>
                </marker>
                <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#fbbf24"/>
                </marker>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                <linearGradient id="agentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#f97316;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#ea580c;stop-opacity:1" />
                </linearGradient>
                <linearGradient id="processGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#2563eb;stop-opacity:1" />
                </linearGradient>
            </defs>
        `;

        // Zone 배경 그리기
        this.zones.forEach(zone => {
            svg += `
            <g class="zone-wrapper" data-zone="${zone.id}">
                <rect class="zone-group" id="zone-bg-${zone.id}" 
                    x="${zone.x}" y="${zone.y}" 
                    width="${zone.width}" height="${zone.height}"
                    rx="12" ry="12"/>
                <text x="${zone.x + zone.width/2}" y="${zone.y - 8}" 
                    fill="#f97316" font-size="10" font-weight="600" 
                    text-anchor="middle" opacity="0.8">
                    ${zone.label.split('\n')[0]}
                </text>
            </g>
            `;
        });

        // 연결선 그리기
        this.connections.forEach((conn, idx) => {
            const from = this.nodes.find(n => n.id === conn.from);
            const to = this.nodes.find(n => n.id === conn.to);
            
            if (from && to) {
                const startX = from.x + from.width;
                const startY = from.y + from.height / 2;
                const endX = to.x;
                const endY = to.y + to.height / 2;
                
                // 복잡한 경로를 위한 간단한 처리
                let path;
                if (Math.abs(startY - endY) < 10) {
                    // 수평선
                    path = `M ${startX} ${startY} L ${endX} ${endY}`;
                } else {
                    // 곡선 연결
                    const midX = (startX + endX) / 2;
                    path = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
                }
                
                svg += `
                <path class="connector" id="conn-${idx}" 
                    d="${path}" 
                    stroke="#6b7280" stroke-width="1.5" fill="none"
                    marker-end="url(#arrowhead)"/>
                `;
            }
        });

        // 노드 그리기
        this.nodes.forEach(node => {
            let fill = 'url(#processGradient)';
            let nodeClass = 'node-rect';
            
            if (node.type === 'agent') {
                fill = 'url(#agentGradient)';
                nodeClass += ' agent';
            } else if (node.type === 'decision') {
                fill = '#8b5cf6';
                nodeClass += ' decision';
            } else if (node.type === 'end') {
                fill = '#22c55e';
            }

            // 다이아몬드 형태 (의사결정 노드)
            if (node.type === 'decision') {
                const cx = node.x + node.width / 2;
                const cy = node.y + node.height / 2;
                const rx = node.width / 2;
                const ry = node.height / 2;
                
                svg += `
                <g class="workflow-node" data-id="${node.id}" data-zone="${node.zone || ''}" onclick="WorkflowDiagram.onNodeClick('${node.id}')">
                    <polygon class="${nodeClass}" id="node-${node.id}"
                        points="${cx},${node.y} ${node.x + node.width},${cy} ${cx},${node.y + node.height} ${node.x},${cy}"
                        fill="${fill}"/>
                    <text class="node-text" x="${cx}" y="${cy}" font-size="8">
                        ${this.wrapText(node.label, 8)}
                    </text>
                </g>
                `;
            } else {
                // 일반 사각형 노드
                svg += `
                <g class="workflow-node" data-id="${node.id}" data-zone="${node.zone || ''}" onclick="WorkflowDiagram.onNodeClick('${node.id}')">
                    <rect class="${nodeClass}" id="node-${node.id}"
                        x="${node.x}" y="${node.y}" 
                        width="${node.width}" height="${node.height}"
                        rx="6" ry="6" fill="${fill}"/>
                    <text class="node-text" x="${node.x + node.width/2}" y="${node.y + node.height/2}">
                        ${this.wrapText(node.label, node.width - 10)}
                    </text>
                </g>
                `;
            }
        });

        svg += '</svg>';
        container.innerHTML = svg;

        // 텍스트 줄바꿈 처리
        this.applyTextWrap();
    },

    // 텍스트 줄바꿈 처리
    wrapText: function(text, maxWidth) {
        const lines = text.split('\n');
        let result = '';
        lines.forEach((line, idx) => {
            const dy = idx === 0 ? (lines.length > 1 ? '-0.3em' : '0.35em') : '1.1em';
            result += `<tspan x="0" dy="${dy}">${line}</tspan>`;
        });
        return result;
    },

    applyTextWrap: function() {
        document.querySelectorAll('.node-text').forEach(text => {
            const node = text.closest('.workflow-node');
            const nodeId = node.dataset.id;
            const nodeData = this.nodes.find(n => n.id === nodeId);
            
            if (nodeData) {
                const tspans = text.querySelectorAll('tspan');
                const centerX = nodeData.type === 'decision' 
                    ? nodeData.x + nodeData.width / 2 
                    : nodeData.x + nodeData.width / 2;
                
                tspans.forEach(tspan => {
                    tspan.setAttribute('x', centerX);
                });
            }
        });
    },

    // 노드 클릭 핸들러
    onNodeClick: function(nodeId) {
        const node = this.nodes.find(n => n.id === nodeId);
        if (node && node.zone) {
            // Agent Zone 클릭 시 해당 Zone으로 이동
            if (typeof ScenarioController !== 'undefined') {
                ScenarioController.goToZone(node.zone);
            }
        }
    },

    // 노드 활성화
    activateNode: function(nodeId) {
        // 모든 노드 비활성화
        document.querySelectorAll('.node-rect').forEach(rect => {
            rect.classList.remove('active');
        });
        
        // 해당 노드 활성화
        const nodeRect = document.getElementById(`node-${nodeId}`);
        if (nodeRect) {
            nodeRect.classList.add('active');
        }
    },

    // Zone 하이라이트
    highlightZone: function(zoneId) {
        document.querySelectorAll('.zone-group').forEach(zone => {
            zone.classList.remove('highlight');
        });
        
        const zoneBg = document.getElementById(`zone-bg-${zoneId}`);
        if (zoneBg) {
            zoneBg.classList.add('highlight');
        }
    },

    // Zone 내 모든 노드 하이라이트
    highlightZoneNodes: function(zoneId) {
        document.querySelectorAll('.workflow-node').forEach(node => {
            const nodeZone = node.dataset.zone;
            if (nodeZone == zoneId) {
                node.querySelector('.node-rect').style.filter = 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.8))';
            }
        });
    },

    // 모든 하이라이트 제거
    clearHighlights: function() {
        document.querySelectorAll('.node-rect').forEach(rect => {
            rect.classList.remove('active');
            rect.style.filter = '';
        });
        document.querySelectorAll('.zone-group').forEach(zone => {
            zone.classList.remove('highlight');
        });
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WorkflowDiagram;
}
