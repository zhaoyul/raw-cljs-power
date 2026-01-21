#!/bin/bash

echo "🔄 Starting ClojureScript watch mode..."

# 创建输出目录
mkdir -p out

# 监视模式编译
clojure -M -m cljs.main \
  --watch src \
  --optimizations none \
  --output-to out/main.js \
  --output-dir out \
  --compile demo.core

