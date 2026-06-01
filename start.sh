#!/bin/bash
# ShopNav — Start Server
# Automatically uses the bundled Node.js if system node is not found.

NODE_BUNDLED="/tmp/node-v20.18.0-darwin-arm64/bin"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Check for system node first, fall back to bundled
if command -v node &>/dev/null; then
  NODE_BIN=""
else
  echo "System Node.js not found. Using bundled Node.js v20..."
  # Download if not yet extracted
  if [ ! -f "$NODE_BUNDLED/node" ]; then
    echo "Downloading Node.js v20..."
    curl -fsSL https://nodejs.org/dist/v20.18.0/node-v20.18.0-darwin-arm64.tar.gz -o /tmp/node.tar.gz
    tar -xzf /tmp/node.tar.gz -C /tmp/
  fi
  export PATH="$NODE_BUNDLED:$PATH"
fi

cd "$SCRIPT_DIR"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

echo ""
echo "  Starting ShopNav server..."
echo "  Open http://localhost:3000/cart.html in your browser"
echo ""

node server.js
