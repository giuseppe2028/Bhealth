# Use a base Python image
FROM python:3.11

# Set the working directory inside the container
WORKDIR /app

# Copy project dependencies
COPY requirements.txt ./
RUN pip install -r requirements.txt

# Copy the rest of the source code
COPY . .

# Expose the microservice port
EXPOSE 5000

# Command to start the service
CMD ["python", "app.py"]