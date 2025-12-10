/**
 * Animation Utilities
 * 타이핑, 하이라이트, 페이드 등 애니메이션 효과
 */

const Animations = {
    // 타이핑 애니메이션
    typeText: function(element, text, speed = 30, callback = null) {
        element.innerHTML = '';
        let idx = 0;
        
        const type = () => {
            if (idx < text.length) {
                element.innerHTML = text.slice(0, idx + 1);
                idx++;
                setTimeout(type, speed);
            } else if (callback) {
                callback();
            }
        };
        
        type();
    },

    // 점진적 표시 (리스트 아이템 등)
    fadeInSequence: function(elements, delay = 200) {
        elements.forEach((el, idx) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(10px)';
            el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, idx * delay);
        });
    },

    // 숫자 카운트업 애니메이션
    countUp: function(element, target, duration = 1000, prefix = '', suffix = '') {
        const start = 0;
        const startTime = performance.now();
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * eased);
            
            element.textContent = prefix + current.toLocaleString() + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        
        requestAnimationFrame(update);
    },

    // 프로그레스 바 애니메이션
    animateProgress: function(element, target, duration = 500) {
        element.style.transition = `width ${duration}ms ease`;
        element.style.width = target + '%';
    },

    // 펄스 애니메이션 추가
    addPulse: function(element) {
        element.classList.add('btn-pulse');
    },

    // 펄스 애니메이션 제거
    removePulse: function(element) {
        element.classList.remove('btn-pulse');
    },

    // 노드 하이라이트 애니메이션
    highlightNode: function(nodeId) {
        const node = document.getElementById(`node-${nodeId}`);
        if (node) {
            node.classList.add('active');
            
            // 스크롤하여 노드가 보이도록
            const container = document.getElementById('workflow-container');
            const nodeRect = node.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            
            if (nodeRect.left < containerRect.left || nodeRect.right > containerRect.right) {
                const scrollLeft = nodeRect.left - containerRect.left - containerRect.width / 2 + nodeRect.width / 2;
                container.scrollBy({ left: scrollLeft, behavior: 'smooth' });
            }
        }
    },

    // 노드 하이라이트 제거
    clearNodeHighlight: function(nodeId) {
        const node = document.getElementById(`node-${nodeId}`);
        if (node) {
            node.classList.remove('active');
        }
    },

    // Zone 하이라이트
    highlightZone: function(zoneId) {
        const zoneBg = document.getElementById(`zone-bg-${zoneId}`);
        if (zoneBg) {
            zoneBg.classList.add('highlight');
        }
    },

    // Zone 하이라이트 제거
    clearZoneHighlight: function(zoneId) {
        const zoneBg = document.getElementById(`zone-bg-${zoneId}`);
        if (zoneBg) {
            zoneBg.classList.remove('highlight');
        }
    },

    // 슬라이드 인 애니메이션
    slideIn: function(element, direction = 'right') {
        element.style.opacity = '0';
        element.style.transform = direction === 'right' ? 'translateX(50px)' : 'translateX(-50px)';
        element.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    },

    // 페이드 아웃 후 교체
    fadeOutAndReplace: function(element, newContent, callback = null) {
        element.style.transition = 'opacity 0.3s ease';
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.innerHTML = newContent;
            element.style.opacity = '1';
            if (callback) callback();
        }, 300);
    },

    // 로딩 스피너 표시
    showLoading: function(container, message = '처리 중...') {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full">
                <div class="loading-spinner mb-4"></div>
                <p class="text-gray-400">${message}</p>
            </div>
        `;
    },

    // 성공 체크 표시
    showSuccess: function(container, message = '완료') {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full">
                <div class="completion-check mb-4">
                    <i class="fas fa-check"></i>
                </div>
                <p class="text-green-400 font-semibold">${message}</p>
            </div>
        `;
    },

    // 차트 애니메이션 (데이터 추가)
    animateChartData: function(chart, newData, duration = 1000) {
        const steps = 20;
        const stepDuration = duration / steps;
        let currentStep = 0;
        
        const originalData = [...chart.data.datasets[0].data];
        const targetData = newData;
        
        const animate = () => {
            if (currentStep <= steps) {
                const progress = currentStep / steps;
                const eased = 1 - Math.pow(1 - progress, 3);
                
                chart.data.datasets[0].data = originalData.map((val, idx) => {
                    const target = targetData[idx] || val;
                    return val + (target - val) * eased;
                });
                
                chart.update('none');
                currentStep++;
                setTimeout(animate, stepDuration);
            }
        };
        
        animate();
    },

    // 테이블 행 하이라이트
    highlightTableRow: function(row, duration = 2000) {
        row.style.transition = 'background-color 0.3s ease';
        row.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
        
        setTimeout(() => {
            row.style.backgroundColor = '';
        }, duration);
    },

    // 경고 아이콘 점멸
    blinkWarning: function(element, times = 3) {
        let count = 0;
        const blink = () => {
            if (count < times * 2) {
                element.style.opacity = count % 2 === 0 ? '0.3' : '1';
                count++;
                setTimeout(blink, 300);
            }
        };
        blink();
    },

    // 스크롤 애니메이션
    smoothScrollTo: function(element, container) {
        const elementRect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        container.scrollTo({
            top: element.offsetTop - containerRect.height / 2,
            behavior: 'smooth'
        });
    },

    // 리플 이펙트
    createRipple: function(event, element) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${event.clientX - rect.left - size / 2}px;
            top: ${event.clientY - rect.top - size / 2}px;
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
};

// CSS for ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Animations;
}
