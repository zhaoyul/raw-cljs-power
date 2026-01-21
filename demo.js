// =============================================================================
// Scene 1: Basic Styling with GCL
// =============================================================================

function scene1Init() {
    const btn = goog.dom.getElement('click-me');
    if (btn) {
        btn.addEventListener('click', function(e) {
            // 使用 GCL 的 setStyle 函数，传入 JS Object
            goog.style.setStyle(btn, {
                'fontSize': '25px',
                'borderRadius': '8px',
                'margin': '20px',
                'padding': '15px 30px',
                'background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'color': 'white',
                'border': 'none',
                'boxShadow': '0 4px 15px rgba(102, 126, 234, 0.4)',
                'transform': 'scale(1.05)',
                'transition': 'all 0.3s ease',
                'webkitTextStroke': '1px rgba(255,255,255,0.3)'
            });
            btn.textContent = 'Styled by GCL! 🎨';
            console.log('✅ Scene 1: Styled with GCL setStyle');
        });
    }
}

// =============================================================================
// Scene 2: Impossible Positioning
// =============================================================================

function scene2Init() {
    const anchorBtn = goog.dom.getElement('anchor-button');
    const popover = goog.dom.getElement('popover');
    
    if (anchorBtn && popover) {
        anchorBtn.addEventListener('click', function(e) {
            // 显示弹出层
            popover.style.display = 'block';
            
            // 使用 GCL positioning 进行精确定位
            // 将弹出层的左下角对齐到按钮的左上角
            goog.positioning.positionAtAnchor(
                anchorBtn,
                goog.positioning.Corner.TOP_LEFT,
                popover,
                goog.positioning.Corner.BOTTOM_LEFT
            );
            
            console.log('✅ Scene 2: Positioned popover with GCL positioning');
            
            // 3秒后自动隐藏
            setTimeout(function() {
                popover.style.display = 'none';
            }, 3000);
        });
    }
}

// =============================================================================
// Scene 3: Web Components Lifecycle
// =============================================================================

function scene3Init() {
    // 定义自定义元素
    if (!customElements.get('my-element')) {
        class MyElement extends HTMLElement {
            connectedCallback() {
                console.log('✅ Scene 3: Component connected');
                this.innerHTML = '<p style="color: #4CAF50; font-size: 18px;">👋 Hello World from Web Component!</p>';
            }
            
            disconnectedCallback() {
                console.log('👋 Scene 3: Component goodbye/removed');
            }
        }
        
        customElements.define('my-element', MyElement);
    }
    
    // 添加切换按钮功能
    const toggleBtn = goog.dom.getElement('toggle-component');
    const mountPoint = goog.dom.getElement('component-mount');
    
    if (toggleBtn && mountPoint) {
        toggleBtn.addEventListener('click', function(e) {
            const existing = mountPoint.querySelector('my-element');
            if (existing) {
                // 如果存在则移除
                mountPoint.removeChild(existing);
            } else {
                // 如果不存在则添加
                const el = document.createElement('my-element');
                mountPoint.appendChild(el);
            }
        });
    }
}

// =============================================================================
// Scene 4: HTML-over-the-wire Morphing
// =============================================================================

function scene4Init() {
    const morphBtn = goog.dom.getElement('morph-button');
    
    if (morphBtn) {
        let counter = 1;
        morphBtn.addEventListener('click', function(e) {
            const container = goog.dom.getElement('morph-container');
            if (container) {
                // 模拟从后端接收的新 HTML
                const newHtml = `
                    <div>
                        <h3>内容已更新 #${counter}！ ${new Date().toLocaleTimeString()}</h3>
                        <p>这是通过 morphlex 变形更新的内容，焦点和状态都被保持。</p>
                        <input type='text' placeholder='输入一些文本...' value='测试焦点保持'>
                        <ul>
                            <li>项目 ${counter * 3 - 2}</li>
                            <li>项目 ${counter * 3 - 1}</li>
                            <li>项目 ${counter * 3}</li>
                        </ul>
                    </div>
                `;
                
                // 使用 morphlex 进行 DOM 变形
                if (window.morphlex) {
                    window.morphlex(container, newHtml);
                    console.log('✅ Scene 4: Morphed content with morphlex');
                } else {
                    container.innerHTML = newHtml;
                    console.warn('⚠️ morphlex not loaded, using innerHTML');
                }
                
                counter++;
            }
        });
    }
}

// =============================================================================
// Scene 5: High-Performance Virtual Ledger
// =============================================================================

// 生成模拟的总账数据
function generateLedgerData(count) {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push({
            id: i,
            date: `2026-01-${String((i % 28) + 1).padStart(2, '0')}`,
            account: `Account-${i % 50}`,
            description: `Transaction #${i}`,
            debit: i % 2 === 0 ? `$${(i * 12.34).toFixed(2)}` : '',
            credit: i % 2 === 1 ? `$${(i * 9.87).toFixed(2)}` : ''
        });
    }
    return data;
}

const ledgerData = generateLedgerData(1000);

function renderLedgerRow(row) {
    return `
        <div class='ledger-row' data-id='${row.id}'>
            <div class='ledger-cell'>${row.date}</div>
            <div class='ledger-cell'>${row.account}</div>
            <div class='ledger-cell'>${row.description}</div>
            <div class='ledger-cell'>${row.debit}</div>
            <div class='ledger-cell'>${row.credit}</div>
        </div>
    `;
}

function getVisibleRange(scrollTop, viewportHeight, rowHeight, totalRows) {
    const start = Math.max(0, Math.floor(scrollTop / rowHeight) - 5);
    const end = Math.min(totalRows, start + Math.ceil(viewportHeight / rowHeight) + 10);
    return [start, end];
}

function renderLedger(scrollTop) {
    const container = goog.dom.getElement('ledger-rows');
    if (!container) return;
    
    const viewportHeight = 400;
    const rowHeight = 40;
    const [start, end] = getVisibleRange(scrollTop, viewportHeight, rowHeight, ledgerData.length);
    
    const visibleRows = ledgerData.slice(start, end);
    const html = visibleRows.map(renderLedgerRow).join('');
    
    // 设置偏移以实现虚拟滚动
    container.style.paddingTop = `${start * rowHeight}px`;
    container.style.paddingBottom = `${(ledgerData.length - end) * rowHeight}px`;
    
    // 使用 morphlex 更新（如果可用），否则使用 innerHTML
    if (window.morphlex) {
        window.morphlex(container, html);
    } else {
        container.innerHTML = html;
    }
}

function scene5Init() {
    const container = goog.dom.getElement('ledger-container');
    if (!container) return;
    
    // 初始渲染
    renderLedger(0);
    
    // 监听滚动事件（使用节流优化性能）
    let scrollTimeout;
    container.addEventListener('scroll', function(e) {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(function() {
            const scrollTop = container.scrollTop;
            renderLedger(scrollTop);
        }, 16); // ~60fps
    });
    
    // 显示内存信息（如果可用）
    if (performance.memory) {
        function updateMemory() {
            const infoEl = goog.dom.getElement('memory-info');
            if (infoEl) {
                const usedMB = (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2);
                infoEl.textContent = `${usedMB} MB`;
            }
        }
        updateMemory();
        setInterval(updateMemory, 2000);
    } else {
        const infoEl = goog.dom.getElement('memory-info');
        if (infoEl) {
            infoEl.textContent = 'N/A (需要 Chrome 浏览器)';
        }
    }
    
    console.log(`✅ Scene 5: Virtual ledger initialized with ${ledgerData.length} rows`);
}

// =============================================================================
// Main Initialization
// =============================================================================

function init() {
    console.log('🚀 Initializing all scenes...');
    scene1Init();
    scene2Init();
    scene3Init();
    scene4Init();
    scene5Init();
    console.log('✅ All scenes initialized!');
    console.log('💡 Tip: Open the browser console to see lifecycle logs');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
