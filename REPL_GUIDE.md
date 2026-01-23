# ClojureScript REPL 交互指南

本项目支持多种方式使用 ClojureScript REPL 与浏览器中的应用交互。

## 方式一：简单浏览器 REPL（推荐新手）

最简单的方式，直接在终端中与浏览器交互：

### 步骤

1. **启动 REPL**：
   ```bash
   ./start-repl.sh
   ```

2. **等待编译完成**，看到类似输出：
   ```
   ClojureScript 1.12.134
   cljs.user=>
   ```

3. **打开浏览器**，访问显示的 URL（通常是 http://localhost:9000）

4. **在 REPL 中开始编程**：
   ```clojure
   ;; 显示一个警告框
   (js/alert "Hello from REPL!")

   ;; 获取 DOM 元素
   (def btn (js/document.getElementById "click-me"))

   ;; 修改按钮文本
   (set! (.-textContent btn) "Changed from REPL!")

   ;; 修改样式
   (set! (.-color (.-style btn)) "red")

   ;; 调用你的函数
   (require '[demo.core :as demo])
   (demo/scene1-init)

   ;; 直接操作数据
   @demo/ledger-data  ;; 查看总账数据
   (count @demo/ledger-data)  ;; 数据行数
   ```

## 方式二：使用编辑器 REPL（适合日常开发）

使用 VSCode + Calva、Emacs + CIDER、或 Vim + Conjure 等编辑器集成。

### 使用 VSCode + Calva

1. **安装 Calva 插件**（如果还没有）

2. **启动 nREPL 服务器**：
   ```bash
   ./repl.sh
   ```

   看到输出：
   ```
   nREPL server started on port 8777
   ```

3. **在另一个终端启动 HTTP 服务器**：
   ```bash
   ./serve.sh
   ```

4. **在 VSCode 中连接**：
   - 按 `Ctrl+Alt+C Ctrl+Alt+C`（或 `Cmd+Option+C Cmd+Option+C`）
   - 选择 "Connect to a running REPL"
   - 选择 "Clojure CLI"
   - 输入端口：`8777`

5. **启动 ClojureScript REPL**：
   在编辑器中打开 `src/demo/core.cljs`，然后在 REPL 中执行：
   ```clojure
   (require '[cider.piggieback :as piggieback])
   (require '[cljs.repl.browser :as browser])
   (piggieback/cljs-repl (browser/repl-env))
   ```

6. **打开浏览器**：
   访问 http://localhost:8000/dev.html

7. **在编辑器中开始编程**：
   - 将光标放在任何表达式上
   - 按 `Ctrl+Enter`（或 `Cmd+Enter`）执行
   - 结果会显示在编辑器中，也会反映在浏览器中

### 使用 Emacs + CIDER

1. **启动 nREPL**：
   ```bash
   ./repl.sh
   ```

2. **启动 HTTP 服务器**（另一个终端）：
   ```bash
   ./serve.sh
   ```

3. **在 Emacs 中连接**：
   ```
   M-x cider-connect
   localhost
   8777
   ```

4. **启动 ClojureScript REPL**：
   ```clojure
   (require '[cider.piggieback :as piggieback])
   (require '[cljs.repl.browser :as browser])
   (piggieback/cljs-repl (browser/repl-env))
   ```

5. **打开浏览器**：http://localhost:8000/dev.html

6. **使用 `C-x C-e` 或 `C-c C-k` 执行代码**

## 常用 REPL 命令和技巧

### 基础操作

```clojure
;; 引入命名空间
(require '[demo.core :as demo])
(require '[goog.dom :as gdom])
(require '[goog.style :as gstyle])

;; 重新加载命名空间（修改代码后）
(require '[demo.core :as demo] :reload)

;; 查看文档
(doc map)
(source filter)
```

### DOM 操作

```clojure
;; 获取元素
(def btn (gdom/getElement "click-me"))

;; 修改文本
(set! (.-textContent btn) "Hello REPL!")

;; 修改样式
(gstyle/setStyle btn #js {:background "red" :color "white"})

;; 添加事件监听
(.addEventListener btn "click"
  (fn [e] (js/console.log "Clicked from REPL!")))

;; 创建新元素
(def div (.createElement js/document "div"))
(set! (.-innerHTML div) "<h1>From REPL!</h1>")
(.appendChild (.-body js/document) div)
```

### 调试技巧

```clojure
;; 打印到浏览器控制台
(js/console.log "Debug info" some-value)

;; 查看数据结构
(cljs.pprint/pprint demo/ledger-data)

;; 查看当前命名空间的所有定义
(keys (ns-publics 'demo.core))

;; 查看变量的值
demo/ledger-data

;; 性能测试
(time (dotimes [i 1000] (demo/render-ledger 0)))
```

### 实时修改应用

```clojure
;; 修改场景一的按钮样式
(when-let [btn (gdom/getElement "click-me")]
  (gstyle/setStyle btn
    #js {:fontSize "30px"
         :background "linear-gradient(to right, #ff6b6b, #4ecdc4)"
         :padding "20px 40px"
         :borderRadius "50px"}))

;; 修改虚拟总账的数据
(def demo/ledger-data
  (vec (for [i (range 100)]
         {:id i
          :date "2026-01-23"
          :account (str "Test-" i)
          :description (str "REPL Transaction #" i)
          :debit (str "$" (* i 100))
          :credit ""})))
(demo/render-ledger 0)

;; 添加新的场景
(defn my-new-scene []
  (when-let [container (gdom/getElement "scene3-container")]
    (let [div (.createElement js/document "div")]
      (set! (.-innerHTML div) "<h3>我的新场景！</h3>")
      (.appendChild container div))))

(my-new-scene)
```

## 常见问题

### Q: REPL 连接不上浏览器？

A: 确保：
1. HTTP 服务器正在运行（`./serve.sh`）
2. 浏览器已打开相应页面（dev.html）
3. 浏览器控制台没有错误

### Q: 修改代码后没有反应？

A: 需要重新加载命名空间：
```clojure
(require '[demo.core :as demo] :reload)
```

### Q: 如何退出 REPL？

A:
- 简单 REPL：`:cljs/quit` 或 `Ctrl+C`
- 编辑器 REPL：断开连接或关闭编辑器

### Q: REPL 响应很慢？

A: 浏览器 REPL 通过 HTTP 轮询通信，有一定延迟。对于更快的反馈，建议：
1. 使用 Figwheel Main 或 shadow-cljs（生产项目）
2. 保持浏览器控制台打开查看实时日志

## 进阶：热重载开发

如果你想要文件保存时自动重载，可以使用 watch 模式：

```bash
./watch.sh
```

然后在编辑器中修改 `src/demo/core.cljs`，保存后浏览器会自动更新。

## 参考资源

- [ClojureScript REPL 官方文档](https://clojurescript.org/reference/repl)
- [Calva 用户指南](https://calva.io/)
- [CIDER 文档](https://docs.cider.mx/)
- [Google Closure Library API](https://google.github.io/closure-library/api/)
