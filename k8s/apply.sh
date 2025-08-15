#!/bin/bash

# Skrypt do wdrażania aplikacji blog na RKE2
set -e

echo "🚀 Wdrażanie aplikacji blog na RKE2..."

# 1. Utworzenie namespace
echo "📁 Tworzenie namespace..."
kubectl apply -f namespace.yaml

# 2. Utworzenie sekretów (musisz je najpierw skonfigurować)
echo "🔐 Tworzenie sekretów..."
kubectl apply -f secrets.yaml
kubectl apply -f blog-backend-secret.yaml

# 3. Wdrażanie backendu
echo "🔧 Wdrażanie backendu..."
kubectl apply -f blog-backend-deployment.yaml

# 4. Wdrażanie frontendu
echo "🎨 Wdrażanie frontendu..."
kubectl apply -f frontend-deployment.yaml

# 5. Sprawdzenie statusu
echo "📊 Sprawdzanie statusu..."
kubectl get pods -n blog
kubectl get services -n blog
kubectl get ingress -n blog

echo "✅ Wdrażanie zakończone!"
echo "🌐 Aplikacja będzie dostępna wewnętrznie w klastrze"
echo "📝 Aby uzyskać dostęp z zewnątrz:"
echo "   - Sprawdź adres IP LoadBalancer: kubectl get svc blog-frontend-service -n blog"
echo "   - Lub użyj NodePort: kubectl get svc blog-frontend-nodeport -n blog"
echo "   - Zaktualizuj sekrety w secrets.yaml"
