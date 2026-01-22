#!/bin/bash
set -e

echo "📦 Building ClojureScript project..."

# 清理旧输出，避免读取过期的编译缓存
rm -rf out

# 创建输出目录
mkdir -p out

# 编译 ClojureScript
clojure -M -m cljs.main \
  -co '{:browser-repl false}' \
  --optimizations simple \
  --output-to out/main.js \
  --output-dir out \
  --compile demo.core

echo "✅ Build complete! Open index.html in your browser to view the demos."
