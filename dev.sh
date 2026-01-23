#!/bin/bash
set -e

echo "🔧 Building ClojureScript in development mode..."

# 清理旧输出
rm -rf out

# 创建输出目录
mkdir -p out

# 编译 ClojureScript with browser REPL support
clojure -M -m cljs.main \
  --optimizations none \
  --output-to out/main.js \
  --output-dir out \
  --compile demo.core

echo "✅ Development build complete!"
echo "📂 Files compiled to out/"
echo ""
echo "Next steps:"
echo "  1. Run: ./serve.sh (in another terminal)"
echo "  2. Run: ./repl.sh (in this terminal)"
echo "  3. Open http://localhost:8000/dev.html in your browser"
echo "  4. Connect your editor to nREPL port 8777"
