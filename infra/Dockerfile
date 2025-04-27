# Dockerfile
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy Flask app
COPY data/dummy_server.py .

# Install required dependencies
RUN pip install Flask prometheus_client

# Expose Flask and Prometheus metrics port
EXPOSE 8085

# Command to run Flask app
CMD ["python", "dummy_server.py"]
