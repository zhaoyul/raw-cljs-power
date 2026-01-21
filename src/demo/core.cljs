(ns demo.core
  (:require [goog.style :as gstyle]
            [goog.positioning :as gpos]
            [goog.positioning.Corner :as Corner]
            [goog.dom :as gdom]))

;; =============================================================================
;; Scene 1: Basic Styling with GCL
;; =============================================================================

(defn scene1-init []
  (when-let [btn (gdom/getElement "click-me")]
    (.addEventListener btn "click"
      (fn [e]
        ;; 使用 GCL 的 setStyle 函数，传入 ClojureScript Map (转为 JS Object)
        (gstyle/setStyle btn
          #js {:fontSize "25px"
               :borderRadius "8px"
               :margin "20px"
               :padding "15px 30px"
               :background "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
               :color "white"
               :border "none"
               :boxShadow "0 4px 15px rgba(102, 126, 234, 0.4)"
               :transform "scale(1.05)"
               :transition "all 0.3s ease"
               :textStroke "1px white"
               :-webkitTextStroke "1px rgba(255,255,255,0.3)"})
        (set! (.-textContent btn) "Styled by GCL! 🎨")
        (js/console.log "Scene 1: Styled with GCL setStyle")))))

;; =============================================================================
;; Scene 2: Impossible Positioning
;; =============================================================================

(defn scene2-init []
  (when-let [anchor-btn (gdom/getElement "anchor-button")]
    (when-let [popover (gdom/getElement "popover")]
      (.addEventListener anchor-btn "click"
        (fn [e]
          ;; 显示弹出层
          (set! (.-display (.-style popover)) "block")

          ;; 使用 GCL positioning 进行精确定位
          ;; 将弹出层的左下角对齐到按钮的左上角
          (gpos/positionAtAnchor
            anchor-btn
            (.-TOP_LEFT Corner)
            popover
            (.-BOTTOM_LEFT Corner))

          (js/console.log "Scene 2: Positioned popover with GCL positioning")

          ;; 3秒后自动隐藏
          (js/setTimeout
            (fn []
              (set! (.-display (.-style popover)) "none"))
            3000))))))

;; =============================================================================
;; Scene 3: Web Components Lifecycle
;; =============================================================================

;; 定义一个简单的宏来简化 Web Components 定义
(defmacro defel [tag-name & body]
  `(let [ctor# (fn []
                 (this-as this#
                   (.call js/HTMLElement this#)
                   this#))]
     (set! (.-prototype ctor#) (.create js/Object (.-prototype js/HTMLElement)))
     (set! (.. ctor# -prototype -constructor) ctor#)
     ~@body
     (.define js/customElements ~tag-name ctor#)))

(defn scene3-init []
  ;; 定义自定义元素
  (when-not (.get js/customElements "my-element")
    (let [MyElement (fn []
                      (this-as this
                        (.call js/Reflect.construct js/HTMLElement #js [] MyElement)
                        this))]

      ;; 设置原型链
      (set! (.-prototype MyElement) (.create js/Object (.-prototype js/HTMLElement)))
      (set! (.. MyElement -prototype -constructor) MyElement)

      ;; connectedCallback - 组件挂载时调用
      (set! (.. MyElement -prototype -connectedCallback)
            (fn []
              (this-as this
                (js/console.log "✅ Scene 3: Component connected")
                (set! (.-innerHTML this) "<p style='color: #4CAF50; font-size: 18px;'>👋 Hello World from Web Component!</p>"))))

      ;; disconnectedCallback - 组件卸载时调用
      (set! (.. MyElement -prototype -disconnectedCallback)
            (fn []
              (js/console.log "👋 Scene 3: Component goodbye/removed")))

      ;; 定义自定义元素
      (.define js/customElements "my-element" MyElement)))

  ;; 添加切换按钮功能
  (when-let [toggle-btn (gdom/getElement "toggle-component")]
    (when-let [mount-point (gdom/getElement "component-mount")]
      (.addEventListener toggle-btn "click"
                         (fn [e]
                           (if-let [existing (.querySelector mount-point "my-element")]
                             ;; 如果存在则移除
                             (.removeChild mount-point existing)
                             ;; 如果不存在则添加
                             (let [el (.createElement js/document "my-element")]
                               (.appendChild mount-point el))))))))

;; =============================================================================
;; Scene 4: HTML-over-the-wire Morphing
;; =============================================================================

(defn scene4-init []
  (when-let [morph-btn (gdom/getElement "morph-button")]
    (.addEventListener morph-btn "click"
                       (fn [e]
                         (when-let [container (gdom/getElement "morph-container")]
                           ;; 模拟从后端接收的新 HTML
                           (let [new-html (str "<div>"
                                               "<h3>内容已更新！ " (js/Date.) "</h3>"
                                               "<p>这是通过 morphlex 变形更新的内容，焦点和状态都被保持。</p>"
                                               "<input type='text' placeholder='输入一些文本...' value='测试焦点保持'>"
                                               "<ul>"
                                               "<li>项目 1</li>"
                                               "<li>项目 2</li>"
                                               "<li>项目 3</li>"
                                               "</ul>"
                                               "</div>")]

                             ;; 使用 morphlex 进行 DOM 变形
                             (when js/window.morphlex
                               (js/window.morphlex container new-html)
                               (js/console.log "Scene 4: Morphed content with morphlex"))))))))

;; =============================================================================
;; Scene 5: High-Performance Virtual Ledger
;; =============================================================================

(def ledger-data
  "模拟的总账数据"
  (vec
    (for [i (range 1000)]
      {:id i
       :date (str "2026-01-" (inc (mod i 28)))
       :account (str "Account-" (mod i 50))
       :description (str "Transaction #" i)
       :debit (when (even? i) (str "$" (* i 12.34)))
       :credit (when (odd? i) (str "$" (* i 9.87)))})))

(defn render-ledger-row [row]
  (str "<div class='ledger-row' data-id='" (:id row) "'>"
       "<div class='ledger-cell'>" (:date row) "</div>"
       "<div class='ledger-cell'>" (:account row) "</div>"
       "<div class='ledger-cell'>" (:description row) "</div>"
       "<div class='ledger-cell'>" (or (:debit row) "") "</div>"
       "<div class='ledger-cell'>" (or (:credit row) "") "</div>"
       "</div>"))

(defn get-visible-range [scroll-top viewport-height row-height]
  "计算当前可见的行范围"
  (let [start (max 0 (- (js/Math.floor (/ scroll-top row-height)) 5))
        end (min (count ledger-data)
                 (+ start (js/Math.ceil (/ viewport-height row-height)) 10))]
    [start end]))

(defn render-ledger [scroll-top]
  "根据滚动位置渲染虚拟滚动的总账"
  (when-let [container (gdom/getElement "ledger-rows")]
    (let [viewport-height 400
          row-height 40
          [start end] (get-visible-range scroll-top viewport-height row-height)
          visible-rows (subvec ledger-data start end)
          html (apply str (map render-ledger-row visible-rows))]

      ;; 使用 morphlex 更新（如果可用），否则使用 innerHTML
      (if js/window.morphlex
        (js/window.morphlex container html)
        (set! (.-innerHTML container) html)))))

(defn scene5-init []
  (when-let [container (gdom/getElement "ledger-container")]
    ;; 初始渲染
    (render-ledger 0)

    ;; 监听滚动事件
    (.addEventListener container "scroll"
                       (fn [e]
                         (let [scroll-top (.-scrollTop container)]
                           (render-ledger scroll-top))))

    ;; 设置虚拟滚动的总高度
    (when-let [rows (gdom/getElement "ledger-rows")]
      (set! (.-minHeight (.-style rows))
            (str (* (count ledger-data) 40) "px")))

    ;; 显示内存信息（如果可用）
    (when (.-memory js/performance)
      (let [update-memory (fn []
                            (when-let [info-el (gdom/getElement "memory-info")]
                              (let [used (/ (.. js/performance -memory -usedJSHeapSize) 1024 1024)]
                                (set! (.-textContent info-el)
                                      (str (.toFixed used 2) " MB")))))]
        (update-memory)
        (js/setInterval update-memory 2000)))

    (js/console.log "Scene 5: Virtual ledger initialized with" (count ledger-data) "rows")))

;; =============================================================================
;; Main Initialization
;; =============================================================================

(defn ^:export init []
  (js/console.log "🚀 Initializing all scenes...")
  (scene1-init)
  (scene2-init)
  (scene3-init)
  (scene4-init)
  (scene5-init)
  (js/console.log "✅ All scenes initialized!"))

;; Auto-initialize when DOM is ready
(when (= (.-readyState js/document) "loading")
  (.addEventListener js/document "DOMContentLoaded" init))

(when (or (= (.-readyState js/document) "interactive")
          (= (.-readyState js/document) "complete"))
  (init))
