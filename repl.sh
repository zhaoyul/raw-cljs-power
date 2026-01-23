#!/bin/bash

echo "🚀 Starting ClojureScript REPL Environment..."
echo ""
echo "This will:"
echo "  1. Start an nREPL server on port 8777"
echo "  2. Start a browser REPL that connects to your app"
echo ""
echo "Next steps:"
echo "  1. Connect your editor to nREPL on port 8777"
echo "  2. Open http://localhost:8000/dev.html in your browser"
echo "  3. In your editor, evaluate: (start-cljs-repl!)"
echo ""
echo "Press Ctrl+C to stop the REPL server"
echo ""

# Start nREPL server
clojure -M:nrepl
