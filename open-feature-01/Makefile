#!/bin/bash

# Variáveis

# flag mode
FLAG_MODE ?= operator  # Pode ser 'operator' ou 'standalone'
PORT_FORWARD = 3001
SERVICE_NAME = hello-world-service-operator


# commandds

.PHONY: dev dev-k8s down start stop k8s-build k8s-deploy k8s-delete

dev:
	docker-compose up -d --build

dev-k8s: k8s-deploy
	@echo "Starting development with Kubernetes in $(FLAG_MODE) mode..."
	@echo "Service will be available on http://localhost:$(PORT_FORWARD)"
	@echo "Watching for changes in source code..."
	@(trap 'kill 0' SIGINT; \
		sleep 2; \
		kubectl port-forward svc/$(SERVICE_NAME) $(PORT_FORWARD):80 & \
		FLAG_MODE=$(FLAG_MODE) fswatch -o ./src/ ./k8s/ | while read f; do \
			echo "Changes detected, rebuilding and redeploying..."; \
		done \
	)

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
		echo "Deploying in operator mode..."; \
		kubectl apply -f k8s/v2/; \
	else \
		echo "Deploying in standalone mode..."; \
		kubectl apply -f k8s/app.yaml; \
		kubectl apply -f k8s/flagd.yaml; \
		kubectl apply -f k8s/flags.yaml; \
		kubectl apply -f k8s/hello-world.yaml; \
		kubectl apply -f k8s/monitoring.yaml; \
	fi
	kubectl rollout restart deployment/hello-world-app
	@echo "Waiting for deployment to be ready..."
	kubectl wait --for=condition=available deployment/hello-world-app --timeout=60s
	@echo "Deployment is ready!"
	@echo "You can access the service using port-forward:"
	@echo "kubectl port-forward svc/$(SERVICE_NAME) $(PORT_FORWARD):80"

k8s-delete:
	@if [ "$(FLAG_MODE)" = "operator" ]; then \
		kubectl delete -f k8s/v2/; \
	else \
		kubectl delete -f k8s/app.yaml; \
		kubectl delete -f k8s/flagd.yaml; \
		kubectl delete -f k8s/flags.yaml; \
		kubectl delete -f k8s/hello-world.yaml; \
		kubectl delete -f k8s/monitoring.yaml; \
	fi
