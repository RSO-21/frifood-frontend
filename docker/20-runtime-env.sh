#!/bin/sh
set -e
CONFIG_JS="/usr/share/nginx/html/assets/config.js"
if [ -n "$GOOGLE_MAPS_API_KEY" ] && [ -f "$CONFIG_JS" ]; then
  echo "Injecting GOOGLE_MAPS_API_KEY into runtime config..."
  # Replace placeholder with actual key
  sed -i "s/__GOOGLE_MAPS_API_KEY__/${GOOGLE_MAPS_API_KEY}/g" "$CONFIG_JS"
else
  echo "GOOGLE_MAPS_API_KEY not set or config.js missing; leaving placeholder."
fi
