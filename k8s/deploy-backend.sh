#!/bin/bash

# Skrypt do wdrażania backendu blog na RKE2
set -e

echo "🔧 Wdrażanie backendu blog na RKE2..."

# 1. Sprawdzenie czy namespace istnieje
echo "📁 Sprawdzanie namespace..."
kubectl get namespace blog >/dev/null 2>&1 || kubectl apply -f namespace.yaml

# 2. Utworzenie sekretów backendu
echo "🔐 Tworzenie sekretów backendu..."
kubectl apply -f blog-backend-secret.yaml

# 3. Wdrażanie backendu
echo "🚀 Wdrażanie backendu..."
kubectl apply -f blog-backend-deployment.yaml

# 4. Sprawdzenie statusu
echo "📊 Sprawdzanie statusu backendu..."
kubectl get pods -n blog -l app=blog-backend
kubectl get services -n blog -l app=blog-backend

echo "✅ Backend wdrożony!"
echo "🔗 Backend będzie dostępny pod adresem: http://blog-backend-service:5000"
echo "📝 Aby sprawdzić logi: kubectl logs -f deployment/blog-backend -n blog"


