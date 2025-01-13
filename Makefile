#!/bin/bash

.PHONY: serve
serve:
	@npx nx run-many --targets=serve --projects=backend,frontend --parallel