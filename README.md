# Project Origin Example Frontend

TODO Describe me!

# Building Docker image

    docker build -t example-frontend:v1 .

# Running Docker image

    docker run -e API_URL="http://example.com" -e AUTH_URL="http://example.com/auth/login" -E LOGOUT_URL="http://example.com/auth/logout" example-frontend:v1
