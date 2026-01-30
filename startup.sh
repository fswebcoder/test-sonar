#!/bin/bash

# Navegar al directorio de la aplicación Angular compilada
cd /home/site/wwwroot

# Verificar si existe package.json y ejecutar como app Node si aplica
if [ -f "package.json" ]; then
    npm install
    npm start
else
    # Si no hay package.json, usar un servidor HTTP simple para Angular en puerto 8080
    echo "🚀 Iniciando servidor HTTP en puerto 8080..."
    npx http-server . -p 8080 --cors -a 0.0.0.0
fi 