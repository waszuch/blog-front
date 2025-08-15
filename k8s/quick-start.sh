#!/bin/bash

echo "🚀 Quick Start - Wdrażanie aplikacji blog na RKE2"
echo "=================================================="
echo ""

# Sprawdzenie czy kubectl jest dostępny
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl nie jest zainstalowany lub nie jest w PATH"
    exit 1
fi

# Sprawdzenie połączenia z klastrem
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Nie można połączyć się z klastrem Kubernetes"
    exit 1
fi

echo "✅ Połączenie z klastrem OK"
echo ""

echo "📋 Kroki do wykonania:"
echo ""

echo "1️⃣  Przygotuj obrazy Docker:"
echo "   # Frontend"
echo "   docker build -t your-registry/blog-frontend:latest ."
echo "   docker push your-registry/blog-frontend:latest"
echo ""
echo "   # Backend (w katalogu backendu)"
echo "   docker build -t your-registry/blog-backend:latest ."
echo "   docker push your-registry/blog-backend:latest"
echo ""

echo "2️⃣  Skonfiguruj sekrety w plikach:"
echo "   - k8s/secrets.yaml"
echo "   - k8s/blog-backend-secret.yaml"
echo ""
echo "   Aby zakodować wartości w base64:"
echo "   echo -n 'mongodb://your-uri' | base64"
echo "   echo -n 'your-jwt-secret' | base64"
echo ""

echo "3️⃣  Zmień 'your-registry' na swój registry w plikach:"
echo "   - k8s/frontend-deployment.yaml"
echo "   - k8s/blog-backend-deployment.yaml"
echo ""

echo "4️⃣  Wdróż aplikację:"
echo "   chmod +x k8s/*.sh"
echo "   ./k8s/deploy-backend.sh"
echo "   ./k8s/deploy-frontend.sh"
echo ""

echo "5️⃣  Sprawdź status:"
echo "   ./k8s/check-access.sh"
echo "   ./k8s/test-connection.sh"
echo ""

echo "🔗 Aplikacja będzie dostępna:"
echo "   - Frontend: przez LoadBalancer IP"
echo "   - Backend: http://blog-backend-service:5000 (wewnętrznie)"
echo ""

echo "📝 Przydatne komendy:"
echo "   kubectl get pods -n blog"
echo "   kubectl get svc -n blog"
echo "   kubectl logs -f deployment/blog-frontend -n blog"
echo "   kubectl logs -f deployment/blog-backend -n blog"


