---
layout: layouts/post.njk
title: "How to Deploy a Machine Learning Model to Production (2026)"
description: "How to deploy a machine learning model to production on AWS and Azure. Covers model packaging, REST APIs with FastAPI, Docker containers, SageMaker endpoints, CI/CD pipelines, monitoring, and MLOps best practices."
date: 2026-04-17
tags: [AI, MLOps, AWS, Azure, DevOps, Cloud]
permalink: /writing/deploy-ml-model-production/
---

<nav class="toc" aria-label="Table of contents">
  <p class="toc__title">Table of Contents</p>
  <ol>
    <li><a href="#ml-production-gap">The ML Production Gap</a></li>
    <li><a href="#model-packaging">Step 1: Package the Model</a></li>
    <li><a href="#rest-api">Step 2: Build a REST API</a></li>
    <li><a href="#containerise">Step 3: Containerise with Docker</a></li>
    <li><a href="#sagemaker">Step 4: Deploy to AWS SageMaker</a></li>
    <li><a href="#cicd">Step 5: CI/CD Pipeline for ML</a></li>
    <li><a href="#monitoring">Step 6: Monitor in Production</a></li>
    <li><a href="#mlops">MLOps Architecture</a></li>
    <li><a href="#faq">FAQ</a></li>
  </ol>
</nav>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Deploy a Machine Learning Model to Production (2026)",
  "description": "How to deploy a machine learning model to production on AWS and Azure. Covers model packaging, FastAPI, Docker, SageMaker, CI/CD, and monitoring.",
  "author": { "@type": "Person", "name": "Samuel Mamootil", "url": "https://samuelmamootil.github.io" },
  "datePublished": "2026-04-17",
  "dateModified": "2026-04-17",
  "mainEntityOfPage": "https://samuelmamootil.github.io/writing/deploy-ml-model-production/"
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do you deploy a machine learning model to production?",
      "acceptedAnswer": { "@type": "Answer", "text": "The standard path: train and save the model (pickle/joblib/ONNX), wrap it in a REST API (FastAPI), containerise with Docker, push to a container registry, deploy to a cloud service (AWS SageMaker, ECS, or Lambda), set up a CI/CD pipeline for automated redeployment, and monitor for data drift and performance degradation." }
    },
    {
      "@type": "Question",
      "name": "What is the difference between batch inference and real-time inference?",
      "acceptedAnswer": { "@type": "Answer", "text": "Real-time inference serves predictions on-demand via an API endpoint with low latency (milliseconds). Batch inference processes large datasets offline on a schedule, trading latency for throughput and cost efficiency. Use real-time for user-facing features, batch for overnight scoring jobs." }
    },
    {
      "@type": "Question",
      "name": "What is model drift and how do you detect it?",
      "acceptedAnswer": { "@type": "Answer", "text": "Model drift occurs when a model's performance degrades over time because the real-world data distribution has changed from the training data. Detect it by monitoring prediction distributions, feature statistics, and business metrics. AWS SageMaker Model Monitor automates drift detection." }
    }
  ]
}
</script>

---

## The ML Production Gap {% raw %}{#{% endraw %}ml-production-gap}

90% of ML models never make it to production. The gap between a Jupyter notebook and a production system is enormous:

```
  NOTEBOOK                    PRODUCTION
  ────────                    ──────────
  CSV file                    Real-time data streams
  Single prediction           1,000 req/sec
  Manual run                  Automated CI/CD
  No versioning               Model registry + versioning
  No monitoring               Drift detection, alerting
  Works on my machine         Docker container, any machine
  Scientist runs it           Engineers maintain it
```

The full MLOps lifecycle:

```
  Data → Train → Evaluate → Package → Deploy → Monitor → Retrain
    ▲                                                        │
    └────────────────────────────────────────────────────────┘
                    (continuous loop)
```

---

## Step 1: Package the Model {% raw %}{#{% endraw %}model-packaging}

After training, save the model in a portable format:

```python
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
import json

# Train
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model', RandomForestClassifier(n_estimators=100, random_state=42))
])
pipeline.fit(X_train, y_train)

# Save model + metadata
joblib.dump(pipeline, 'model.joblib')

metadata = {
    'model_version': '1.0.0',
    'trained_at': '2026-04-17',
    'features': ['cpu_avg', 'memory_avg', 'network_mbps', 'age_days'],
    'accuracy': float(pipeline.score(X_test, y_test)),
    'framework': 'scikit-learn',
}
with open('model_metadata.json', 'w') as f:
    json.dump(metadata, f)

print(f"Model saved. Test accuracy: {metadata['accuracy']:.3f}")
```

**For deep learning models, use ONNX for cross-framework portability:**

```python
import torch
import torch.onnx

# Export PyTorch model to ONNX
dummy_input = torch.randn(1, 4)  # batch_size=1, features=4
torch.onnx.export(
    model,
    dummy_input,
    'model.onnx',
    export_params=True,
    opset_version=17,
    input_names=['features'],
    output_names=['prediction'],
    dynamic_axes={'features': {0: 'batch_size'}}
)
```

---

## Step 2: Build a REST API {% raw %}{#{% endraw %}rest-api}

Wrap the model in a FastAPI endpoint:

```python
# app.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
import logging

app = FastAPI(title="Cloud Rightsizing API", version="1.0.0")
logger = logging.getLogger(__name__)

# Load model once at startup
model = joblib.load('model.joblib')

class PredictionRequest(BaseModel):
    cpu_avg: float
    memory_avg: float
    network_mbps: float
    age_days: int

class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    model_version: str

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    try:
        features = np.array([[
            request.cpu_avg,
            request.memory_avg,
            request.network_mbps,
            request.age_days,
        ]])

        prediction = model.predict(features)[0]
        probabilities = model.predict_proba(features)[0]
        confidence = float(max(probabilities))

        logger.info(f"Prediction: {prediction}, confidence: {confidence:.3f}")

        return PredictionResponse(
            prediction="rightsize" if prediction == 1 else "keep",
            confidence=confidence,
            model_version="1.0.0",
        )
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
```

Test it locally:

```bash
uvicorn app:app --reload --port 8000

curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"cpu_avg": 8.5, "memory_avg": 12.3, "network_mbps": 45, "age_days": 180}'

# Response:
# {"prediction": "rightsize", "confidence": 0.94, "model_version": "1.0.0"}
```

---

## Step 3: Containerise with Docker {% raw %}{#{% endraw %}containerise}

```dockerfile
# Dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install dependencies first (layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy model and app
COPY model.joblib model_metadata.json ./
COPY app.py .

EXPOSE 8000

# Non-root user for security
RUN useradd -m appuser && chown -R appuser /app
USER appuser

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

```
# requirements.txt
fastapi==0.115.0
uvicorn==0.32.0
scikit-learn==1.5.2
numpy==2.1.3
joblib==1.4.2
pydantic==2.9.2
```

```bash
# Build and test
docker build -t ml-api:1.0.0 .
docker run -p 8000:8000 ml-api:1.0.0

# Push to ECR
aws ecr create-repository --repository-name ml-api
docker tag ml-api:1.0.0 123456789.dkr.ecr.us-east-1.amazonaws.com/ml-api:1.0.0
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/ml-api:1.0.0
```

---

## Step 4: Deploy to AWS SageMaker {% raw %}{#{% endraw %}sagemaker}

```python
import sagemaker
from sagemaker.model import Model

session = sagemaker.Session()
role    = sagemaker.get_execution_role()

# Deploy custom container to SageMaker endpoint
model = Model(
    image_uri='123456789.dkr.ecr.us-east-1.amazonaws.com/ml-api:1.0.0',
    role=role,
    sagemaker_session=session,
)

predictor = model.deploy(
    initial_instance_count=1,
    instance_type='ml.t2.medium',
    endpoint_name='cloud-rightsizing-v1',
)

# Test the endpoint
import json
response = predictor.predict(
    json.dumps({"cpu_avg": 8.5, "memory_avg": 12.3, "network_mbps": 45, "age_days": 180}),
    initial_args={"ContentType": "application/json"}
)
print(json.loads(response))
```

**Auto-scaling the endpoint:**

```python
import boto3

autoscaling = boto3.client('application-autoscaling')

autoscaling.register_scalable_target(
    ServiceNamespace='sagemaker',
    ResourceId='endpoint/cloud-rightsizing-v1/variant/AllTraffic',
    ScalableDimension='sagemaker:variant:DesiredInstanceCount',
    MinCapacity=1,
    MaxCapacity=10,
)

autoscaling.put_scaling_policy(
    PolicyName='RequestsPerInstance',
    ServiceNamespace='sagemaker',
    ResourceId='endpoint/cloud-rightsizing-v1/variant/AllTraffic',
    ScalableDimension='sagemaker:variant:DesiredInstanceCount',
    PolicyType='TargetTrackingScaling',
    TargetTrackingScalingPolicyConfiguration={
        'TargetValue': 1000.0,  # target 1000 requests per instance
        'PredefinedMetricSpecification': {
            'PredefinedMetricType': 'SageMakerVariantInvocationsPerInstance'
        }
    }
)
```

---

## Step 5: CI/CD Pipeline for ML {% raw %}{#{% endraw %}cicd}

```yaml
# .github/workflows/ml-deploy.yml
name: ML Model CI/CD

on:
  push:
    paths: ['model/**', 'app.py', 'requirements.txt']
    branches: [main]

jobs:
  train-and-evaluate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Train model
        run: python train.py

      - name: Evaluate model
        run: |
          python evaluate.py
          # Fail if accuracy drops below threshold
          python -c "
          import json
          meta = json.load(open('model_metadata.json'))
          assert meta['accuracy'] >= 0.90, f'Accuracy {meta[\"accuracy\"]} below threshold'
          print(f'Accuracy: {meta[\"accuracy\"]:.3f} ✅')
          "

      - name: Build and push Docker image
        run: |
          aws ecr get-login-password | docker login --username AWS \
            --password-stdin ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.us-east-1.amazonaws.com
          docker build -t ml-api:${{ github.sha }} .
          docker push ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.us-east-1.amazonaws.com/ml-api:${{ github.sha }}

      - name: Deploy to SageMaker
        run: python deploy.py --image-tag ${{ github.sha }}
```

---

## Step 6: Monitor in Production {% raw %}{#{% endraw %}monitoring}

```python
import boto3

sm = boto3.client('sagemaker')

# Enable data capture on the endpoint
sm.update_endpoint(
    EndpointName='cloud-rightsizing-v1',
    EndpointConfigName='rightsizing-config-v2',
)

# Create a Model Monitor schedule
sm.create_monitoring_schedule(
    MonitoringScheduleName='rightsizing-monitor',
    MonitoringScheduleConfig={
        'ScheduleConfig': {'ScheduleExpression': 'cron(0 * ? * * *)'},  # hourly
        'MonitoringJobDefinition': {
            'MonitoringInputs': [{
                'EndpointInput': {
                    'EndpointName': 'cloud-rightsizing-v1',
                    'LocalPath': '/opt/ml/processing/input/endpoint',
                }
            }],
            'MonitoringOutputConfig': {
                'MonitoringOutputs': [{
                    'S3Output': {
                        'S3Uri': 's3://my-bucket/monitoring/',
                        'LocalPath': '/opt/ml/processing/output',
                    }
                }]
            },
            'MonitoringResources': {
                'ClusterConfig': {
                    'InstanceCount': 1,
                    'InstanceType': 'ml.m5.xlarge',
                    'VolumeSizeInGB': 20,
                }
            },
            'RoleArn': role,
        }
    }
)
```

**Key metrics to monitor:**

| Metric | What it detects | Alert threshold |
|--------|----------------|----------------|
| Prediction distribution shift | Data drift | > 10% change in output distribution |
| Feature statistics drift | Input drift | PSI > 0.2 for any feature |
| Latency (p99) | Performance degradation | > 500ms |
| Error rate | Model failures | > 1% |
| Business metric | Model quality | Depends on use case |

---

## MLOps Architecture {% raw %}{#{% endraw %}mlops}

```
  ┌─────────────────────────────────────────────────────────┐
  │                    MLOps on AWS                          │
  │                                                          │
  │  Data Layer:    S3 ──► Glue ──► Feature Store           │
  │                                                          │
  │  Training:      SageMaker Training Jobs                  │
  │                 SageMaker Experiments (tracking)         │
  │                                                          │
  │  Registry:      SageMaker Model Registry                 │
  │                 (versioning, approval workflow)          │
  │                                                          │
  │  Deployment:    SageMaker Endpoints (real-time)          │
  │                 SageMaker Batch Transform (batch)        │
  │                                                          │
  │  Monitoring:    SageMaker Model Monitor                  │
  │                 CloudWatch metrics + alarms              │
  │                                                          │
  │  Orchestration: SageMaker Pipelines                      │
  │                 (train → evaluate → register → deploy)   │
  │                                                          │
  │  CI/CD:         GitHub Actions → SageMaker Pipelines     │
  └─────────────────────────────────────────────────────────┘
```

---

## FAQ {% raw %}{#{% endraw %}faq}

**How do you deploy a machine learning model to production?**
Train and save the model (joblib/ONNX), wrap in a FastAPI REST endpoint, containerise with Docker, push to ECR, deploy to SageMaker or ECS, set up GitHub Actions CI/CD for automated redeployment, and monitor with SageMaker Model Monitor for drift.

**What is the difference between batch and real-time inference?**
Real-time inference serves predictions on-demand via an API with millisecond latency. Batch inference processes large datasets offline on a schedule — cheaper and higher throughput but not suitable for user-facing features.

**What is model drift and how do you detect it?**
Model drift is when performance degrades because real-world data has changed from training data. Detect it by monitoring prediction distributions, feature statistics (PSI score), and business metrics. AWS SageMaker Model Monitor automates this with scheduled jobs.

**What is the best framework for serving ML models in production?**
FastAPI for custom APIs (fast, async, automatic OpenAPI docs). TorchServe for PyTorch models. TensorFlow Serving for TF models. AWS SageMaker for managed deployment with auto-scaling and monitoring built in.

---

*Deploying ML models to production on AWS? [Let's connect on LinkedIn](https://linkedin.com/in/samuel-mamootil).*
