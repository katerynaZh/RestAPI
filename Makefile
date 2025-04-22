.PHONY: up gen-secret

# Default target
all: help

help:
	@echo "Usage:"
	@echo "  make up             Start the services with a random password"
	@echo "  make gen-secret     Generate a random password and save it to .env"

# Generate .env file with random password
gen-secret:
	@echo "Generating secret..."
	@echo "POSTGRES_PASSWORD=$$(openssl rand -base64 16)" > .env
	@echo "POSTGRES_USER=pguser" >> .env
	@echo "POSTGRES_DB=tasks_db" >> .env

# Generate secret and start the services
up: gen-secret
	@echo "Starting services..."
	docker compose --env-file .env up --build