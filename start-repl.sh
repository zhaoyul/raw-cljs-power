#!/bin/bash

echo "🚀 Starting ClojureScript Browser REPL..."
echo ""
echo "This will start a REPL that connects to your browser."
echo ""
echo "After this starts:"
echo "  1. Open http://localhost:9000/dev.html in your browser"
echo "  2. Wait for 'Browser-REPL ready' message"
echo "  3. Start coding! Try: (js/alert \"Hello from REPL!\")"
echo ""
echo "Press Ctrl+C to exit"
echo ""

# Start ClojureScript browser REPL
clojure -M -m cljs.main \
  --repl-opts '{:port 9000}' \
  --compile demo.core \
  --repl
