#!/bin/bash

# Copy file .env
cp .env ./apps/admin

# Build docker
docker build --no-cache -t vosint-frontend -f ./apps/admin/Dockerfile.prod .
