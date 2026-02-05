FROM python:3.9-slim

WORKDIR /app

# Copy server file
COPY server.py .

# Environment setup
ENV PYTHONUNBUFFERED=1
ENV PORT=3000

# Start command
CMD ["python", "server.py"]
