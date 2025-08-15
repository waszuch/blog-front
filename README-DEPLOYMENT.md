# Wdrażanie aplikacji blog na RKE2 (Wewnętrzny dostęp)

## Wymagania wstępne

1. **RKE2 Cluster** - skonfigurowany i działający
2. **kubectl** - skonfigurowany do komunikacji z klastrem
3. **Docker Registry** - do przechowywania obrazów

## Struktura plików

```
k8s/
├── namespace.yaml              # Namespace dla aplikacji
├── secrets.yaml               # Sekrety (MongoDB URI, JWT Secret)
├── blog-backend-secret.yaml   # Sekrety backendu
├── blog-backend-deployment.yaml # Deployment backendu
├── frontend-deployment.yaml   # Deployment frontendu
├── internal-access.yaml       # NodePort service (opcjonalnie)
├── apply.sh                   # Skrypt wdrażania wszystkiego
├── deploy-backend.sh          # Skrypt wdrażania backendu
├── deploy-frontend.sh         # Skrypt wdrażania frontendu
├── check-access.sh            # Skrypt sprawdzania dostępu
└── test-connection.sh         # Skrypt testowania połączenia
```

## Konfiguracja

### 1. Przygotowanie obrazów Docker

#### Frontend
```bash
# Budowanie obrazu
docker build -t your-registry/blog-frontend:latest .

# Push do registry
docker push your-registry/blog-frontend:latest
```

#### Backend
```bash
# Budowanie obrazu (w katalogu backendu)
docker build -t your-registry/blog-backend:latest .

# Push do registry
docker push your-registry/blog-backend:latest
```

### 2. Konfiguracja sekretów

Edytuj plik `k8s/secrets.yaml`:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: blog-secrets
type: Opaque
data:
  # Base64 encoded values
  mongodb-uri: <base64-encoded-mongodb-uri>
  jwt-secret: <base64-encoded-jwt-secret>
```

Aby zakodować wartości w base64:
```bash
echo -n "mongodb://your-mongodb-uri" | base64
echo -n "your-jwt-secret" | base64
```

### 3. Konfiguracja dla wewnętrznego dostępu

W plikach `frontend-deployment.yaml` i `blog-backend-deployment.yaml`:
- Frontend używa LoadBalancer service dla dostępu z zewnątrz
- Backend ma CORS ustawiony na `*` dla wewnętrznej komunikacji
- Dodane zmienne środowiskowe: `K8S_MODE=true` i `NODE_ENV=production`
- Frontend komunikuje się z backendem przez `http://blog-backend-service:5000/api`
- Zmień `your-registry` na adres swojego registry

## Wdrażanie

### Automatyczne wdrażanie wszystkiego
```bash
cd k8s
chmod +x apply.sh
./apply.sh
```

### Wdrażanie krok po kroku
```bash
# 1. Wdrażanie backendu
chmod +x deploy-backend.sh
./deploy-backend.sh

# 2. Wdrażanie frontendu
chmod +x deploy-frontend.sh
./deploy-frontend.sh
```

### Ręczne wdrażanie
```bash
# 1. Utworzenie namespace
kubectl apply -f namespace.yaml

# 2. Utworzenie sekretów
kubectl apply -f secrets.yaml
kubectl apply -f blog-backend-secret.yaml

# 3. Wdrażanie backendu
kubectl apply -f blog-backend-deployment.yaml

# 4. Wdrażanie frontendu
kubectl apply -f frontend-deployment.yaml
```

## Sprawdzenie statusu

```bash
# Automatyczne sprawdzenie dostępu
cd k8s
chmod +x check-access.sh
./check-access.sh

# Testowanie połączenia między frontendem a backendem
chmod +x test-connection.sh
./test-connection.sh

# Ręczne sprawdzenie
kubectl get pods -n blog
kubectl get services -n blog

# Logi aplikacji
kubectl logs -f deployment/blog-frontend -n blog
kubectl logs -f deployment/blog-backend -n blog
```

## Dostęp do aplikacji

### LoadBalancer (domyślny)
```bash
# Sprawdzenie adresu IP LoadBalancer
kubectl get svc blog-frontend-service -n blog
```

### NodePort (alternatywa)
Jeśli LoadBalancer nie jest dostępny:
```bash
# Wdrożenie NodePort service
kubectl apply -f internal-access.yaml -n blog

# Sprawdzenie NodePort
kubectl get svc blog-frontend-nodeport -n blog
```

Aplikacja będzie dostępna pod adresem: `http://<node-ip>:30080`

## Troubleshooting

### Sprawdzenie logów
```bash
# Logi frontendu
kubectl logs -f deployment/blog-frontend -n blog

# Logi backendu
kubectl logs -f deployment/blog-backend -n blog
```

### Sprawdzenie konfiguracji
```bash
# Sprawdzenie zmiennych środowiskowych
kubectl describe pod -l app=blog-frontend -n blog
kubectl describe pod -l app=blog-backend -n blog
```

### Restart deploymentów
```bash
kubectl rollout restart deployment/blog-frontend -n blog
kubectl rollout restart deployment/blog-backend -n blog
```

## Zmiany w kodzie

### Frontend
- API URL jest konfigurowany przez zmienną środowiskową `NEXT_PUBLIC_API_URL`
- W Kubernetes ustawiony na `http://blog-backend-service:5000/api` (wewnętrzna komunikacja)
- Dostęp z zewnątrz przez LoadBalancer lub NodePort

### Backend
- CORS origin ustawiony na `*` dla wewnętrznej komunikacji
- MongoDB URI i JWT Secret pobierane z sekretów Kubernetes

## Monitoring

Dodaj monitoring używając Prometheus i Grafana:

```bash
# Instalacja Prometheus Operator
kubectl apply -f https://raw.githubusercontent.com/prometheus-operator/prometheus-operator/master/bundle.yaml
```

## Backup

Regularnie twórz backup bazy danych MongoDB:

```bash
# Backup MongoDB
mongodump --uri="your-mongodb-uri" --out=/backup/$(date +%Y%m%d)
```
