#!/bin/bash

# frontend|backend
app:=backend

.PHONY: dev
dev:
	@npm install --legacy-peer-deps
	@npx nx run-many --targets=serve --projects=backend,frontend --parallel

.PHONY: up 
up:
	@npm install --legacy-peer-deps
	@docker-compose -f docker-compose.dev.yml up -d --build

.PHONY: down
down:
	@docker-compose -f docker-compose.dev.yml down --rmi local

.PHONY: logs
logs:
	@docker-compose -f docker-compose.dev.yml logs -f $(app)