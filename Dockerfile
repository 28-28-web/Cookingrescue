FROM python:3.11-slim

WORKDIR /app

# Copy all files
COPY . .

# Expose port
EXPOSE 8000
ENV PORT=8000

# Run the server
CMD ["python3", "server.py"]
