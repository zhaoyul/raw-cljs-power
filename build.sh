#!/bin/bash

echo "📦 Building ClojureScript project..."

# 创建输出目录
mkdir -p out

# 编译 ClojureScript
clojure -M -m cljs.main \
  --optimizations simple \
  --output-to out/main.js \
  --output-dir out \
  --target :bundle \
  --compile demo.core

echo "✅ Build complete! Open index.html in your browser to view the demos."
