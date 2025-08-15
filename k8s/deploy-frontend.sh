#!/bin/bash

# Skrypt do wdrażania frontendu blog na RKE2
set -e

echo "🎨 Wdrażanie frontendu blog na RKE2..."

# 1. Sprawdzenie czy namespace istnieje
echo "📁 Sprawdzanie namespace..."
kubectl get namespace blog >/dev/null 2>&1 || kubectl apply -f namespace.yaml

# 2. Sprawdzenie czy backend jest gotowy
echo "🔍 Sprawdzanie czy backend jest gotowy..."
if ! kubectl get service blog-backend-service -n blog >/dev/null 2>&1; then
    echo "⚠️  Backend service nie istnieje. Uruchom najpierw deploy-backend.sh"
    exit 1
fi

# 3. Wdrażanie frontendu
echo "🚀 Wdrażanie frontendu..."
kubectl apply -f frontend-deployment.yaml

# 4. Sprawdzenie statusu
echo "📊 Sprawdzanie statusu frontendu..."
kubectl get pods -n blog -l app=blog-frontend
kubectl get services -n blog -l app=blog-frontend

echo "✅ Frontend wdrożony!"
echo "🔗 Frontend będzie dostępny przez LoadBalancer"
echo "📝 Aby sprawdzić adres: kubectl get svc blog-frontend-service -n blog"
echo "📝 Aby sprawdzić logi: kubectl logs -f deployment/blog-frontend -n blog"


