#!/bin/bash

echo "🔍 Testowanie połączenia między frontendem a backendem..."

echo ""
echo "📊 Status podów:"
kubectl get pods -n blog

echo ""
echo "🌐 Serwisy:"
kubectl get svc -n blog

echo ""
echo "🔗 Testowanie połączenia backendu:"
echo ""

# Test połączenia do backendu z wewnątrz klastra
BACKEND_POD=$(kubectl get pods -n blog -l app=blog-backend -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)
if [ ! -z "$BACKEND_POD" ]; then
    echo "✅ Backend pod: $BACKEND_POD"
    
    # Test health endpoint
    echo "🔍 Testowanie health endpoint..."
    kubectl exec -n blog $BACKEND_POD -- curl -s http://localhost:5000/api/health || echo "❌ Health endpoint nie odpowiada"
    
    # Test połączenia do MongoDB
    echo "🔍 Testowanie połączenia do MongoDB..."
    kubectl exec -n blog $BACKEND_POD -- env | grep MONGODB_URI || echo "❌ MONGODB_URI nie ustawione"
else
    echo "❌ Backend pod nie znaleziony"
fi

echo ""
echo "🔗 Testowanie połączenia frontendu do backendu:"
echo ""

# Test połączenia z frontendu do backendu
FRONTEND_POD=$(kubectl get pods -n blog -l app=blog-frontend -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)
if [ ! -z "$FRONTEND_POD" ]; then
    echo "✅ Frontend pod: $FRONTEND_POD"
    
    # Test połączenia do backendu service
    echo "🔍 Testowanie połączenia do blog-backend-service..."
    kubectl exec -n blog $FRONTEND_POD -- curl -s http://blog-backend-service:5000/api/health || echo "❌ Nie można połączyć się z backendem"
    
    # Sprawdź zmienne środowiskowe
    echo "🔍 Sprawdzanie zmiennych środowiskowych..."
    kubectl exec -n blog $FRONTEND_POD -- env | grep NEXT_PUBLIC_API_URL || echo "❌ NEXT_PUBLIC_API_URL nie ustawione"
else
    echo "❌ Frontend pod nie znaleziony"
fi

echo ""
echo "📝 Logi backendu:"
kubectl logs --tail=10 deployment/blog-backend -n blog 2>/dev/null || echo "❌ Nie można pobrać logów backendu"

echo ""
echo "📝 Logi frontendu:"
kubectl logs --tail=10 deployment/blog-frontend -n blog 2>/dev/null || echo "❌ Nie można pobrać logów frontendu"


