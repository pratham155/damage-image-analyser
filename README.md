# Damage Image

docker build -t gcr.io/damageimage/damage_image2 .

gcloud auth login
gcloud auth configure-docker
docker tag gcr.io/damageimage/damage_image gcr.io/PROJECT-ID/damage_image
gcloud run deploy damage-image --image gcr.io/PROJECT-ID/damage_image --platform managed


# deploy

# Build the Docker image
docker build -t gcr.io/fulfilai-fulfillment-d-1-5d7f/damage_image .

# Authenticate with Google Cloud
gcloud auth login
gcloud config set project fulfilai-fulfillment-d-1-5d7f

# Push the Docker image to Google Container Registry
docker push gcr.io/fulfilai-fulfillment-d-1-5d7f/damage_image

# Deploy the Docker image to Google Cloud Run
gcloud run deploy damage-image-service \
  --image gcr.io/fulfilai-fulfillment-d-1-5d7f/damage_image \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated



