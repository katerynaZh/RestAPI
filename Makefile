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
	@touch .env
	@if ! grep -q "^POSTGRES_PASSWORD=" .env; then \
		echo "POSTGRES_PASSWORD=$$(openssl rand -base64 16)" >> .env; \
	fi
	@if ! grep -q "^POSTGRES_USER=" .env; then \
		echo "POSTGRES_USER=pguser" >> .env; \
	fi
	@if ! grep -q "^POSTGRES_DB=" .env; then \
		echo "POSTGRES_DB=tasks_db" >> .env; \
	fi
	@if ! grep -q "^POSTGRES_HOST=" .env; then \
		echo "POSTGRES_HOST=postgres" >> .env; \
	fi
	@if ! grep -q "^POSTGRES_PORT=" .env; then \
		echo "POSTGRES_PORT=5432" >> .env; \
	fi

# Generate secret and start the services
up: gen-secret
	@echo "Starting services..."
	docker compose --env-file .env up --build