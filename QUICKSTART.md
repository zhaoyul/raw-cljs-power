# 快速开始指南

## 运行演示

有两种方式运行这个项目：

### 方式 1：直接打开 HTML 文件（最简单）

1. 在浏览器中直接打开 `demo.html` 文件
2. 所有场景都可以直接运行，无需编译或服务器

**注意**：某些浏览器可能因为 CORS 限制而无法加载外部资源。如果遇到问题，请使用方式 2。

### 方式 2：使用 HTTP 服务器（推荐）

1. 在项目目录下运行：
   ```bash
   ./serve.sh
   ```
   
2. 在浏览器中打开：
   ```
   http://localhost:8000/demo.html
   ```

如果 `serve.sh` 无法执行，可以手动启动服务器：

```bash
# 使用 Python 3
python3 -m http.server 8000

# 或使用 Python 2
python -m SimpleHTTPServer 8000

# 或使用 Node.js
npx http-server -p 8000
```

## 测试每个场景

### 场景一：基础样式
1. 点击 "Click Me to Style!" 按钮
2. 观察按钮样式的变化（颜色、大小、阴影等）
3. 打开控制台查看日志

### 场景二：不可能的定位
1. 点击 "Show Popover" 按钮
2. 观察弹出层如何精确定位在按钮上方
3. 弹出层会在 3 秒后自动消失

### 场景三：Web Components 生命周期
1. 打开浏览器控制台（F12）
2. 点击 "Toggle Component" 按钮
3. 观察控制台中的生命周期日志：
   - "connected" - 组件挂载时
   - "goodbye/removed" - 组件卸载时

### 场景四：HTML-over-the-wire
1. 在输入框中输入一些文本
2. 点击 "Morph Content" 按钮
3. 观察：
   - 内容更新了
   - 输入框的焦点和内容都保持不变（这是关键！）
4. 可以多次点击，每次内容都会变化

### 场景五：高性能虚拟总账
1. 滚动表格查看大量数据（1000 行）
2. 观察性能：
   - 滚动流畅度
   - 内存占用（Chrome 浏览器中会显示）
3. 注意：DOM 中只有可见的行被渲染

## 性能测试

在 Chrome 中打开 DevTools：

1. **Performance 面板**：
   - 点击 Record
   - 在场景五中快速滚动
   - 停止录制
   - 观察 Scripting 时间应该很少

2. **Memory 面板**：
   - 场景五会显示实时内存使用
   - 相比 React 版本，内存占用应该在 3-10MB 之间

## 编译 ClojureScript 版本（可选）

如果你想从 ClojureScript 源代码编译：

1. 确保安装了 Clojure CLI 工具
2. 运行：
   ```bash
   ./build.sh
   ```
3. 打开 `index.html` 而不是 `demo.html`

## 故障排除

### 问题：外部库加载失败
**解决**：使用 HTTP 服务器而不是直接打开 HTML 文件

### 问题：控制台没有日志
**解决**：确保打开了浏览器的开发者工具（F12）

### 问题：场景五内存显示 "N/A"
**解决**：这是正常的，只有 Chrome 浏览器支持 `performance.memory` API

### 问题：morphlex 不工作
**解决**：检查网络连接，确保可以访问 unpkg.com CDN

## 下一步

- 修改 `demo.js` 查看实现细节
- 查看 `src/demo/core.cljs` 了解 ClojureScript 版本
- 阅读 README.md 了解更多技术细节
