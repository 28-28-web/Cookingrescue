FROM python:3.9-slim

WORKDIR /app

# Copy server file
COPY server.py .

# Environment setup
ENV PYTHONUNBUFFERED=1
ENV PORT=3000

# Install any potential dependencies (though we use stdlib, this is good practice to have the step)
# RUN pip install requests # Uncomment if needed later

# Start command
CMD ["python", "server.py"]
