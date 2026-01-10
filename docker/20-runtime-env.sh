#!/bin/sh
set -e

ASSETS_DIR="/usr/share/nginx/html/assets"
CONFIG_JS="$ASSETS_DIR/config.js"

mkdir -p "$ASSETS_DIR"

echo "Writing runtime config to $CONFIG_JS"

cat > "$CONFIG_JS" <<EOF
window.__ENV = window.__ENV || {};
window.__ENV.GOOGLE_MAPS_API_KEY = "${GOOGLE_MAPS_API_KEY:-}";
EOF
