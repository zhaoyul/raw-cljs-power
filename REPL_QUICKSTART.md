# ClojureScript REPL 快速开始

## 最简单的方式（推荐）

### 1. 启动 REPL

在终端中运行：

```bash
clojure -M -m cljs.main --repl
```

### 2. 等待 REPL 启动

看到这个提示符就可以开始了：

```
ClojureScript 1.12.134
cljs.user=>
```

### 3. 尝试一些命令

```clojure
;; 基础 ClojureScript
(+ 1 2 3)
;; => 6

(map inc [1 2 3 4 5])
;; => (2 3 4 5 6)

;; 引入项目代码
(require '[demo.core :as demo])

;; 查看数据
(count demo/ledger-data)
;; => 1000

(first demo/ledger-data)
;; => {:id 0, :date "2026-01-1", :account "Account-0", ...}

;; 调用函数
(demo/render-ledger-row (first demo/ledger-data))
;; => "<div class='ledger-row' ...
```

## 与浏览器交互的 REPL

如果你想在 REPL 中操作浏览器页面，需要使用浏览器 REPL：

### 1. 启动浏览器 REPL

```bash
clojure -M -m cljs.main \
  --compile demo.core \
  --repl
```

### 2. 打开浏览器

REPL 会自动启动一个 HTTP 服务器，打开显示的 URL（通常是 http://localhost:9000）

### 3. 在 REPL 中与浏览器交互

```clojure
;; 显示警告框
(js/alert "Hello from REPL!")

;; 获取 DOM 元素
(def btn (js/document.getElementById "click-me"))

;; 修改按钮文本
(set! (.-textContent btn) "Changed from REPL!")

;; 修改按钮样式
(set! (.. btn -style -background) "red")
(set! (.. btn -style -color) "white")
(set! (.. btn -style -fontSize) "24px")

;; 使用 Google Closure Library
(require '[goog.dom :as gdom])
(require '[goog.style :as gstyle])

(def my-btn (gdom/getElement "click-me"))
(gstyle/setStyle my-btn
  #js {:background "linear-gradient(to right, #667eea, #764ba2)"
       :padding "20px 40px"
       :borderRadius "10px"
       :fontSize "20px"})

;; 调用项目函数
(require '[demo.core :as demo])
(demo/scene1-init)  ;; 初始化场景一
(demo/scene2-init)  ;; 初始化场景二
```

## 实时开发示例

### 修改总账数据

```clojure
;; 引入命名空间
(require '[demo.core :as demo])
(require '[goog.dom :as gdom])

;; 创建新的测试数据
(def new-data
  (vec (for [i (range 50)]
         {:id i
          :date "2026-01-23"
          :account (str "REPL-Account-" i)
          :description (str "REPL Transaction #" i)
          :debit (str "$" (* i 100))
          :credit ""})))

;; 替换数据（注意：这只在当前会话有效）
(alter-var-root #'demo/ledger-data (constantly new-data))

;; 重新渲染
(demo/render-ledger 0)
```

### 创建新的交互功能

```clojure
;; 为所有按钮添加彩虹效果
(defn rainbow-effect []
  (let [buttons (.querySelectorAll js/document "button")]
    (doseq [btn (array-seq buttons)]
      (.addEventListener btn "mouseenter"
        (fn [e]
          (let [colors ["#FF6B6B" "#4ECDC4" "#45B7D1" "#96CEB4" "#FFEAA7"]]
            (set! (.. btn -style -background) (rand-nth colors))))))))

(rainbow-effect)
```

### 动态添加新元素

```clojure
(require '[goog.dom :as gdom])

(defn add-greeting []
  (let [div (.createElement js/document "div")
        body (.-body js/document)]
    (set! (.-innerHTML div)
          "<h2 style='color: #4CAF50; text-align: center;'>Hello from REPL! 👋</h2>")
    (.appendChild body div)))

(add-greeting)
```

## 使用编辑器连接（高级）

如果你使用 VSCode/Emacs/Vim 等编辑器：

### VSCode (Calva)

1. 启动 nREPL：`./repl.sh`
2. 在 VSCode 中：`Ctrl+Alt+C Ctrl+Alt+C`
3. 选择 "Connect to running REPL"
4. 端口：`8777`
5. 在 REPL 中启动 ClojureScript：
   ```clojure
   (require '[cider.piggieback :as piggieback])
   (require '[cljs.repl.browser :as browser])
   (piggieback/cljs-repl (browser/repl-env))
   ```
6. 打开浏览器：http://localhost:8000/dev.html

现在你可以在编辑器中使用 `Ctrl+Enter` 执行代码！

## 常用快捷操作

```clojure
;; 查看文档
(doc map)

;; 查看源码
(source filter)

;; 查看命名空间中的所有函数
(keys (ns-publics 'demo.core))

;; 重新加载命名空间
(require '[demo.core :as demo] :reload)

;; 清空 REPL 输出（仅某些 REPL）
:cljs/quit  ;; 退出 REPL
```

## 提示

1. **修改代码后记得重新加载**：`(require '... :reload)`
2. **使用 `js/console.log` 调试**：输出会显示在浏览器控制台
3. **善用 `def`**：保存中间结果方便调试
4. **Tab 补全**：输入部分函数名后按 Tab 键

享受交互式开发的乐趣！🎉
