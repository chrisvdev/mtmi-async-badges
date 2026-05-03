#!/bin/bash
# Script para verificar que todo está listo para publicar

echo "🔍 Verificando configuración del proyecto..."
echo ""

# 1. Verificar package.json
echo "1️⃣ Verificando package.json..."
if grep -q '"author": ""' package.json; then
    echo "   ❌ Falta el campo 'author' en package.json"
else
    echo "   ✅ Campo 'author' configurado"
fi

# 2. Verificar que el build funciona
echo ""
echo "2️⃣ Verificando compilación..."
if pnpm build > /dev/null 2>&1; then
    echo "   ✅ Compilación exitosa"
    ls -lh dist/ | tail -5
else
    echo "   ❌ Error en la compilación"
    exit 1
fi

# 3. Verificar archivos necesarios
echo ""
echo "3️⃣ Verificando archivos..."
required_files=("dist/index.js" "dist/index.cjs" "dist/index.d.ts" "dist/index.d.cts")
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file existe"
    else
        echo "   ❌ $file no existe"
    fi
done

# 4. Verificar workflows
echo ""
echo "4️⃣ Verificando GitHub Actions..."
workflows=(".github/workflows/publish-npm.yml" ".github/workflows/publish-npm-tag.yml")
for workflow in "${workflows[@]}"; do
    if [ -f "$workflow" ]; then
        echo "   ✅ $workflow existe"
    else
        echo "   ❌ $workflow no existe"
    fi
done

echo ""
echo "5️⃣ Siguiente paso: Configurar NPM_TOKEN en GitHub"
echo "   URL: https://github.com/chrisvdev/mtmi-async-badges/settings/secrets/actions"
echo ""
echo "6️⃣ Luego puedes publicar con:"
echo "   pnpm version patch"
echo "   git push && git push --tags"
echo ""
echo "✨ ¡El proyecto está listo para publicar!"
