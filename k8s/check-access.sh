#!/bin/bash

echo "🔍 Sprawdzanie dostępu do aplikacji blog..."

echo ""
echo "📊 Status podów:"
kubectl get pods -n blog

echo ""
echo "🌐 Serwisy:"
kubectl get svc -n blog

echo ""
echo "🔗 Adresy dostępu:"
echo ""

# Sprawdź LoadBalancer
LB_IP=$(kubectl get svc blog-frontend-service -n blog -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null)
if [ ! -z "$LB_IP" ]; then
    echo "✅ LoadBalancer IP: http://$LB_IP"
else
    echo "⚠️  LoadBalancer nie ma jeszcze przypisanego IP"
fi

# Sprawdź NodePort
NODE_PORT=$(kubectl get svc blog-frontend-nodeport -n blog -o jsonpath='{.spec.ports[0].nodePort}' 2>/dev/null)
if [ ! -z "$NODE_PORT" ]; then
    echo "✅ NodePort: http://<node-ip>:$NODE_PORT"
    echo "   (Zastąp <node-ip> adresem IP dowolnego node'a w klastrze)"
else
    echo "⚠️  NodePort service nie jest wdrożony"
fi

echo ""
echo "🔧 Aby wdrożyć NodePort service:"
echo "   kubectl apply -f internal-access.yaml -n blog"

echo ""
echo "📝 Logi aplikacji:"
echo "   Frontend: kubectl logs -f deployment/blog-frontend -n blog"
echo "   Backend:  kubectl logs -f deployment/blog-backend -n blog"
