FROM python:3.12-slim

WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source files
COPY backend/ ./

# Copy built frontend into the static directory served by FastAPI
COPY dist/ ./static/

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
