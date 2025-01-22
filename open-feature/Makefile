# Variáveis
FLAG_MODE ?= operator
PORT_FORWARD = 3001
SERVICE_NAME = hello-world-service-operator
DEPLOYMENT_NAME = hello-world-app-operator

# Comandos
.PHONY: dev dev-k8s down start stop k8s-build k8s-deploy k8s-delete

dev:
	docker-compose up -d --build

dev-k8s: k8s-deploy
	@echo "Starting development with Kubernetes in $(FLAG_MODE) mode..."
	@echo "Service will be available on http://localhost:$(PORT_FORWARD)"
	@echo "Watching for changes in source code..."
	@bash -c 'trap "kill 0" SIGINT; \
		sleep 2; \
		kubectl port-forward svc/$(SERVICE_NAME) $(PORT_FORWARD):80 & \
		FLAG_MODE=$(FLAG_MODE) fswatch -o ./src/ ./k8s/ | while read f; do \
			echo "Changes detected, rebuilding and redeploying..."; \
			make k8s-deploy; \
		done'

down:
	docker-compose down

start:
	docker-compose start

stop:
	docker-compose stop

k8s-build:
	docker build -t hello-world-app:latest . --build-arg FLAG_MODE=$(FLAG_MODE)
	kind load docker-image hello-world-app:latest

k8s-deploy: k8s-build
	@if [ "$(FLAG_MODE)" = "operator" ]; then \
		echo "Deploying in operator mode..." && \
		kubectl apply -f k8s/v2/; \
	else \
		echo "Deploying in standalone mode..." && \
		kubectl apply -f k8s/app.yaml && \
		kubectl apply -f k8s/flagd.yaml && \
		kubectl apply -f k8s/flags.yaml && \
		kubectl apply -f k8s/hello-world.yaml && \
		kubectl apply -f k8s/monitoring.yaml; \
	fi
	kubectl rollout restart deployment/$(DEPLOYMENT_NAME)
	@echo "Waiting for deployment to be ready..."
	kubectl wait --for=condition=available deployment/$(DEPLOYMENT_NAME) --timeout=60s
	@echo "Deployment is ready!"
	@echo "You can access the service using port-forward:"
	@echo "kubectl port-forward svc/$(SERVICE_NAME) $(PORT_FORWARD):80"

k8s-delete:
	@if [ "$(FLAG_MODE)" = "operator" ]; then \
		kubectl delete -f k8s/v2/; \
	else \
		kubectl delete -f k8s/app.yaml && \
		kubectl delete -f k8s/flagd.yaml && \
		kubectl delete -f k8s/flags.yaml && \
		kubectl delete -f k8s/hello-world.yaml && \
		kubectl delete -f k8s/monitoring.yaml; \
	fi

kind:
	@if ! kind get clusters | grep -q "^kind$$"; then \
		echo "Criando novo cluster..." && \
		kind create cluster --config kind.yaml; \
	else \
		echo "Cluster já existe, pulando criação..."; \
	fi && \
	echo "Instalando cert-manager..." && \
	kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.2/cert-manager.yaml && \
	echo "Aguardando cert-manager estar pronto..." && \
	kubectl wait --timeout=60s --for condition=Available=True deploy --all -n cert-manager && \
	echo "Instalando OpenFeature Operator..." && \
	helm repo add openfeature https://open-feature.github.io/open-feature-operator/ && \
	helm repo update && \
	helm upgrade --install open-feature-operator openfeature/open-feature-operator && \
	echo "Aguardando OpenFeature Operator estar pronto..." && \
	kubectl wait --timeout=60s --for condition=Available=True deploy --all -n default && \
	echo "Cluster está pronto com OpenFeature Operator instalado"