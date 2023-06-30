#!/bin/bash

# Copy file .env
cp .env ./apps/admin

# Build docker
docker build -t vosint-frontend -f ./apps/admin/Dockerfile.prod .
