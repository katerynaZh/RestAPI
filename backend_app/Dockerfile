# Use the official Python image from the Docker Hub, version 3.11-slim
FROM python:3.11-slim

# Set the working directory inside the container to /app
WORKDIR /app

# Copy the requirements.txt file from the host to the container
COPY requirements.txt .

# Install the Python dependencies specified in requirements.txt
RUN pip install -r requirements.txt

# Copy the rest of the application code from the host to the container
COPY . .

# Specify the command to run the application using uvicorn
CMD ["uvicorn", "backend_app.main:app", "--host", "0.0.0.0", "--port", "80"]