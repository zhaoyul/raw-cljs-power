#!/bin/bash

# Simple HTTP server for testing
echo "🌐 Starting HTTP server on http://localhost:8000"
echo "📂 Open http://localhost:8000/demo.html in your browser"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Try Python 3 first, then Python 2, then Node.js
if command -v python3 &> /dev/null; then
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    python -m SimpleHTTPServer 8000
elif command -v node &> /dev/null && command -v npx &> /dev/null; then
    npx http-server -p 8000
else
    echo "❌ Error: No suitable HTTP server found."
    echo "Please install Python or Node.js to run the server."
    exit 1
fi
