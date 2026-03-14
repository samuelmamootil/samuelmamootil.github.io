---
layout: layouts/post.njk
title: "What is AI? Algorithms, Neural Networks & Predictive Models Explained (2026)"
description: "A complete guide to AI algorithms — regression, classification, clustering, neural networks, and time series. With code examples, flow diagrams, and real-world use cases for engineers."
date: 2026-04-10
tags: [AI, MLOps, Cloud, AWS, Azure]
permalink: /writing/what-is-ai-algorithms/
---

<nav class="toc" aria-label="Table of contents">
  <p class="toc__title">Table of Contents</p>
  <ol>
    <li><a href="#what-is-ai">What is AI?</a></li>
    <li><a href="#types-of-ml">Types of Machine Learning</a></li>
    <li><a href="#predictive-models">Predictive Models</a>
      <ol>
        <li><a href="#regression">Regression (Linear & Multiple)</a></li>
        <li><a href="#classification">Classification (Decision Trees, SVM, Neural Networks)</a></li>
        <li><a href="#time-series">Time Series Forecasting</a></li>
      </ol>
    </li>
    <li><a href="#descriptive-models">Descriptive Models</a>
      <ol>
        <li><a href="#clustering">Clustering (K-Means, Hierarchical)</a></li>
        <li><a href="#association">Association Rules (Apriori)</a></li>
        <li><a href="#summarization">Summarization & Sequence Discovery</a></li>
      </ol>
    </li>
    <li><a href="#neural-networks">How Neural Networks Work</a></li>
    <li><a href="#cloud-ai">Running AI on AWS & Azure in 2026</a></li>
    <li><a href="#faq">FAQ</a></li>
  </ol>
</nav>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "What is AI? Algorithms, Neural Networks & Predictive Models Explained (2026)",
  "description": "A complete guide to AI algorithms — regression, classification, clustering, neural networks, and time series. With code examples, flow diagrams, and real-world use cases for engineers.",
  "author": {
    "@type": "Person",
    "name": "Samuel Mamootil",
    "url": "https://samuelmamootil.github.io",
    "jobTitle": "Senior Cloud & Platform Engineer"
  },
  "datePublished": "2026-04-10",
  "dateModified": "2026-04-10",
  "mainEntityOfPage": "https://samuelmamootil.github.io/writing/what-is-ai-algorithms/"
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the difference between AI, machine learning, and deep learning?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AI is the broad field of making machines intelligent. Machine learning is a subset where machines learn from data without being explicitly programmed. Deep learning is a subset of ML using multi-layer neural networks to learn complex patterns automatically."
      }
    },
    {
      "@type": "Question",
      "name": "What is the best algorithm for beginners to learn first?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Linear regression is the best starting point. It is simple, interpretable, and forms the mathematical foundation for understanding more complex models like neural networks."
      }
    },
    {
      "@type": "Question",
      "name": "How do I run machine learning models on AWS in 2026?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AWS SageMaker is the primary service. You can train models using SageMaker Training Jobs, deploy them as real-time endpoints, and use SageMaker Pipelines for MLOps automation. AWS Bedrock provides access to foundation models like Claude and Llama without managing infrastructure."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between supervised and unsupervised learning?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Supervised learning trains on labelled data — you provide inputs and correct outputs, and the model learns the mapping. Unsupervised learning finds hidden structure in unlabelled data, like grouping customers by behaviour without predefined categories."
      }
    },
    {
      "@type": "Question",
      "name": "How many layers does a neural network need?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A neural network needs at minimum 3 layers: an input layer, one hidden layer, and an output layer. Deep learning uses many hidden layers (sometimes hundreds) to learn increasingly abstract representations of data."
      }
    }
  ]
}
</script>

---

## What is AI? {% raw %}{#{% endraw %}what-is-ai}

Artificial Intelligence is the field of building systems that perform tasks that normally require human intelligence — recognising images, understanding language, making decisions, and predicting outcomes.

The term covers a wide spectrum:

| Term | Definition | Example |
|------|-----------|---------|
| **AI** | Machines that simulate intelligent behaviour | Chess engines, recommendation systems |
| **Machine Learning (ML)** | Systems that learn patterns from data | Spam filters, fraud detection |
| **Deep Learning (DL)** | ML using multi-layer neural networks | Image recognition, GPT models |
| **Generative AI** | Models that create new content | ChatGPT, Stable Diffusion, GitHub Copilot |

The key insight of modern AI: **instead of programming rules, you feed data and let the algorithm find the rules itself.**

---

## Types of Machine Learning {% raw %}{#{% endraw %}types-of-ml}

```
                    ┌─────────────────────────────┐
                    │      Machine Learning        │
                    └──────────────┬──────────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
          ▼                        ▼                        ▼
  ┌───────────────┐      ┌─────────────────┐      ┌────────────────┐
  │  Supervised   │      │  Unsupervised   │      │ Reinforcement  │
  │   Learning    │      │   Learning      │      │   Learning     │
  └───────┬───────┘      └────────┬────────┘      └───────┬────────┘
          │                       │                        │
  Labelled data            Unlabelled data          Reward signals
  Regression               Clustering               Game playing
  Classification           Association rules        Robotics
  Time series              Dimensionality           Self-driving cars
                           reduction
```

- **Supervised learning** — you provide labelled examples. The model learns to map inputs to outputs.
- **Unsupervised learning** — no labels. The model finds hidden structure in raw data.
- **Reinforcement learning** — an agent learns by taking actions and receiving rewards or penalties.

---

## Predictive Models {% raw %}{#{% endraw %}predictive-models}

Predictive models estimate or classify future outcomes based on historical data.

### Regression — Predicting Continuous Values {% raw %}{#{% endraw %}regression}

Regression answers: *"How much?"* or *"How many?"*

**Linear regression** fits a straight line through data points to predict a continuous output.

```
y = mx + b

y  = predicted value (e.g. house price)
x  = input feature (e.g. square footage)
m  = slope (weight learned from data)
b  = intercept (bias term)
```

**Multiple regression** extends this to many input features:

```
y = w₁x₁ + w₂x₂ + w₃x₃ + ... + b
```

**Python example — predicting cloud infrastructure cost:**

```python
from sklearn.linear_model import LinearRegression
import numpy as np

# Features: [num_instances, storage_tb, data_transfer_gb]
X_train = np.array([
    [10, 2, 500],
    [50, 10, 2000],
    [100, 25, 5000],
    [200, 50, 10000],
])
y_train = np.array([1200, 5800, 11500, 23000])  # monthly cost in USD

model = LinearRegression()
model.fit(X_train, y_train)

# Predict cost for a new environment
new_env = np.array([[75, 15, 3000]])
predicted_cost = model.predict(new_env)
print(f"Predicted monthly cost: ${predicted_cost[0]:,.0f}")
# Output: Predicted monthly cost: $8,650
```

**Real-world use cases:**
- Sales forecasting
- Cloud cost estimation
- Predicting server load based on traffic
- Estimating deployment time from codebase size

---

### Classification — Categorising Data {% raw %}{#{% endraw %}classification}

Classification answers: *"Which category does this belong to?"*

#### Decision Trees

A decision tree splits data by asking yes/no questions at each node:

```
                    ┌─────────────────────┐
                    │  Email received?     │
                    └──────────┬──────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
     Contains "FREE MONEY"?            From known sender?
              │                                 │
         Yes ─┤                            Yes ─┤
              ▼                                 ▼
          ┌───────┐                        ┌────────┐
          │ SPAM  │                        │  INBOX │
          └───────┘                        └────────┘
              │ No                              │ No
              ▼                                ▼
     Has suspicious links?            Check domain reputation
```

```python
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split

# Features: [has_free_money, unknown_sender, suspicious_links, caps_ratio]
X = [[1,1,1,0.8], [0,0,0,0.1], [1,0,1,0.6], [0,1,0,0.2], [1,1,0,0.7]]
y = [1, 0, 1, 0, 1]  # 1=spam, 0=not spam

clf = DecisionTreeClassifier(max_depth=3)
clf.fit(X, y)

new_email = [[1, 1, 0, 0.5]]
print("Spam?" , "Yes" if clf.predict(new_email)[0] else "No")
```

#### Support Vector Machines (SVM)

SVM finds the **maximum margin hyperplane** — the widest possible boundary between classes:

```
     Class A (●)    │    Class B (○)
                    │
    ●    ●          │          ○    ○
         ●    ●─────┼─────○    ○
    ●         ●     │     ○         ○
                    │
              ← margin →
              (maximised)
```

Best for: high-dimensional data, text classification, image recognition with small datasets.

#### Neural Networks for Classification

Neural networks learn non-linear decision boundaries that decision trees and SVMs struggle with.

```python
from sklearn.neural_network import MLPClassifier

# Multi-layer perceptron: 2 hidden layers of 64 and 32 neurons
clf = MLPClassifier(
    hidden_layer_sizes=(64, 32),
    activation='relu',
    max_iter=500,
    random_state=42
)
clf.fit(X_train, y_train)
```

**Algorithm comparison for classification:**

| Algorithm | Best for | Interpretable? | Training speed | Handles non-linearity |
|-----------|----------|---------------|----------------|----------------------|
| Decision Tree | Small datasets, explainability | ✅ Yes | Fast | Limited |
| Random Forest | Tabular data, production ML | Partial | Medium | Good |
| SVM | High-dimensional, small data | ❌ No | Slow on large data | Yes (with kernel) |
| Neural Network | Images, text, complex patterns | ❌ No | Slow | Excellent |
| Logistic Regression | Binary classification baseline | ✅ Yes | Very fast | No |

---

### Time Series Forecasting {% raw %}{#{% endraw %}time-series}

Time series models analyse data ordered by time to forecast future values.

```
  Value
    │
 95 ┤                                    ╭──── Forecast
 90 ┤              ╭──╮                 ╱
 85 ┤         ╭───╯  ╰──╮           ╭─╯
 80 ┤    ╭───╯           ╰──╮    ╭─╯
 75 ┤───╯                    ╰──╯
    └────────────────────────────────── Time
    Jan  Feb  Mar  Apr  May  Jun  Jul →
         ◄── Historical data ──►  ◄─ Predicted ─►
```

**Python example — forecasting API request volume:**

```python
import pandas as pd
from statsmodels.tsa.arima.model import ARIMA

# Daily API request counts over 30 days
requests = [1200, 1350, 1100, 1400, 1600, 1800, 1750,
            1900, 2100, 1950, 2200, 2400, 2300, 2500,
            2600, 2450, 2700, 2900, 2800, 3000, 2950,
            3100, 3300, 3200, 3400, 3600, 3500, 3700,
            3900, 3800]

series = pd.Series(requests)

# ARIMA(p=2, d=1, q=2) — autoregressive integrated moving average
model = ARIMA(series, order=(2, 1, 2))
result = model.fit()

# Forecast next 7 days
forecast = result.forecast(steps=7)
print("Next 7 days forecast:", forecast.round(0).tolist())
```

**Common time series algorithms:**

| Algorithm | Use case | Handles seasonality |
|-----------|----------|-------------------|
| ARIMA | Stationary trends, financial data | No (use SARIMA) |
| SARIMA | Seasonal patterns (weekly, yearly) | ✅ Yes |
| Prophet (Meta) | Business metrics with holidays | ✅ Yes |
| LSTM (deep learning) | Complex non-linear sequences | ✅ Yes |
| Transformer (Temporal Fusion) | Multi-variate, long horizons | ✅ Yes |

---

## Descriptive Models {% raw %}{#{% endraw %}descriptive-models}

Descriptive models reveal hidden structure in data — no prediction, no labels. They answer: *"What patterns exist?"*

### Clustering {% raw %}{#{% endraw %}clustering}

Clustering groups similar data points together without predefined categories.

#### K-Means Clustering

```
  Step 1: Place K centroids randomly
  Step 2: Assign each point to nearest centroid
  Step 3: Move centroids to mean of their cluster
  Step 4: Repeat until centroids stop moving

  Before:                After (K=3):
  · · · · · ·            ● ● ▲ ▲ ■ ■
  · · · · · ·            ● ● ▲ ▲ ■ ■
  · · · · · ·            ● ● ▲ ▲ ■ ■
  (no structure)         (3 clusters found)
```

```python
from sklearn.cluster import KMeans
import numpy as np

# Customer data: [monthly_spend, support_tickets, login_frequency]
customers = np.array([
    [500, 1, 30], [480, 2, 28], [520, 1, 32],   # High-value, low-touch
    [100, 8, 5],  [90, 10, 3], [110, 7, 6],      # Low-value, high-support
    [300, 3, 15], [280, 4, 12], [320, 3, 18],    # Mid-tier
])

kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
kmeans.fit(customers)

labels = kmeans.labels_
print("Cluster assignments:", labels)
# Output: [0 0 0 1 1 1 2 2 2]
# Cluster 0 = high-value, Cluster 1 = at-risk, Cluster 2 = mid-tier
```

#### Hierarchical Clustering

Builds a tree (dendrogram) of nested clusters — no need to specify K upfront:

```
  Distance
    │
  5 ┤                    ┌──────────┐
    │                    │          │
  3 ┤          ┌─────────┤     ┌────┤
    │          │         │     │    │
  1 ┤    ┌─────┤    ┌────┤  ┌──┤ ┌──┤
    │    │     │    │    │  │  │ │  │
    └────┴─────┴────┴────┴──┴──┴─┴──┴──
         A     B    C    D  E  F G  H
```

Cut the dendrogram at any height to get different numbers of clusters.

---

### Association Rules — Finding Item Relationships {% raw %}{#{% endraw %}association}

Association rules find items that frequently appear together. The classic example is market basket analysis.

**Key metrics:**

```
Support    = P(A and B)           — how often A and B appear together
Confidence = P(B | A)             — given A, how likely is B?
Lift       = Confidence / P(B)    — is the association stronger than random?
```

**The Apriori algorithm:**

```
  Transaction data:
  T1: {bread, butter, milk}
  T2: {bread, butter}
  T3: {bread, milk, eggs}
  T4: {butter, milk}
  T5: {bread, butter, milk, eggs}

  Step 1 — Find frequent individual items (min support = 60%):
  bread:  4/5 = 80% ✅
  butter: 4/5 = 80% ✅
  milk:   4/5 = 80% ✅
  eggs:   2/5 = 40% ❌

  Step 2 — Find frequent pairs:
  {bread, butter}: 3/5 = 60% ✅
  {bread, milk}:   3/5 = 60% ✅
  {butter, milk}:  3/5 = 60% ✅

  Step 3 — Generate rules:
  bread → butter  (confidence: 3/4 = 75%, lift: 0.75/0.8 = 0.94)
  butter → milk   (confidence: 3/4 = 75%, lift: 0.75/0.8 = 0.94)
```

```python
from mlxtend.frequent_patterns import apriori, association_rules
import pandas as pd

# One-hot encoded transaction data
data = {
    'bread':  [1,1,1,0,1],
    'butter': [1,1,0,1,1],
    'milk':   [1,0,1,1,1],
    'eggs':   [0,0,1,0,1],
}
df = pd.DataFrame(data)

frequent_items = apriori(df, min_support=0.6, use_colnames=True)
rules = association_rules(frequent_items, metric="lift", min_threshold=0.9)
print(rules[['antecedents', 'consequents', 'support', 'confidence', 'lift']])
```

**Real-world applications:**
- E-commerce: "Customers who bought X also bought Y"
- Streaming: "Users who watched A also watched B"
- Cloud infrastructure: "Teams that use EKS also provision RDS and ElastiCache"

---

### Summarization & Sequence Discovery {% raw %}{#{% endraw %}summarization}

**Summarization** condenses large datasets into representative patterns:
- **PCA (Principal Component Analysis)** — reduces dimensions while preserving variance
- **Autoencoders** — neural networks that compress data into a latent representation

**Sequence discovery** finds recurring patterns in ordered data:
- **Hidden Markov Models (HMM)** — model sequences with hidden states (speech recognition, gene sequencing)
- **Sequential pattern mining** — finds frequent subsequences in transaction logs

```python
from sklearn.decomposition import PCA
import numpy as np

# 100 cloud metrics with 20 dimensions — reduce to 2 for visualisation
np.random.seed(42)
metrics = np.random.randn(100, 20)

pca = PCA(n_components=2)
reduced = pca.fit_transform(metrics)

print(f"Variance explained: {pca.explained_variance_ratio_.sum():.1%}")
# Output: Variance explained: 18.3%
# (first 2 components capture 18% of total variance)
```

---

## How Neural Networks Work {% raw %}{#{% endraw %}neural-networks}

A neural network is a system of interconnected nodes (neurons) organised in layers. Each connection has a **weight** — a number that gets adjusted during training.

### Architecture

```
  INPUT LAYER        HIDDEN LAYER 1     HIDDEN LAYER 2     OUTPUT LAYER
  (raw features)     (64 neurons)       (32 neurons)       (prediction)

  ┌───┐              ┌───┐              ┌───┐
  │x₁ │──────────────│   │──────────────│   │──────────────┐
  └───┘         ╱────│   │         ╱────│   │              │   ┌───────┐
  ┌───┐        ╱     └───┘        ╱     └───┘              ├──▶│  ŷ   │
  │x₂ │───────╱      ┌───┐       ╱      ┌───┐              │   └───────┘
  └───┘       ╲──────│   │──────╱  ╱────│   │──────────────┘   (output)
  ┌───┐        ╲     └───┘      ╲ ╱     └───┘
  │x₃ │─────────╲────┌───┐      ╲╱      ┌───┐
  └───┘           ╲──│   │──────╱╲──────│   │
  ┌───┐               └───┘              └───┘
  │x₄ │               ...                ...
  └───┘
  (features)         (learn low-level    (learn high-level
                      patterns)           abstractions)
```

### Forward Pass — How a Prediction is Made

```
  1. Input features enter the network
  2. Each neuron computes: z = Σ(weight × input) + bias
  3. Activation function applied: a = ReLU(z) = max(0, z)
  4. Output flows to next layer
  5. Final layer produces prediction ŷ
```

```python
import numpy as np

def relu(z):
    return np.maximum(0, z)

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

# Single neuron forward pass
inputs  = np.array([0.5, 0.3, 0.8])   # x
weights = np.array([0.4, 0.7, 0.2])   # w (learned)
bias    = 0.1                           # b (learned)

z = np.dot(weights, inputs) + bias     # weighted sum
a = relu(z)                            # activation
print(f"Neuron output: {a:.4f}")       # 0.5300
```

### Backpropagation — How the Network Learns

```
  Forward pass  →  Compute prediction ŷ
                ↓
  Compute loss  →  Loss = (ŷ - y)²   (mean squared error)
                ↓
  Backward pass →  Compute gradient of loss w.r.t. each weight
                ↓
  Update weights → w = w - learning_rate × gradient
                ↓
  Repeat for all training examples (one epoch)
  Repeat for many epochs until loss converges
```

### Full Training Loop in PyTorch

```python
import torch
import torch.nn as nn

# Define a simple 3-layer network
class CloudCostPredictor(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(3, 64),   # 3 input features → 64 neurons
            nn.ReLU(),
            nn.Linear(64, 32),  # 64 → 32 neurons
            nn.ReLU(),
            nn.Linear(32, 1),   # 32 → 1 output (cost prediction)
        )

    def forward(self, x):
        return self.net(x)

model     = CloudCostPredictor()
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
loss_fn   = nn.MSELoss()

# Training loop
for epoch in range(100):
    predictions = model(X_train_tensor)
    loss        = loss_fn(predictions, y_train_tensor)

    optimizer.zero_grad()   # clear previous gradients
    loss.backward()         # compute gradients (backprop)
    optimizer.step()        # update weights

    if epoch % 10 == 0:
        print(f"Epoch {epoch:3d} | Loss: {loss.item():.4f}")
```

### Activation Functions Compared

| Function | Formula | Use case | Output range |
|----------|---------|----------|-------------|
| **ReLU** | max(0, x) | Hidden layers (default) | [0, ∞) |
| **Sigmoid** | 1/(1+e⁻ˣ) | Binary classification output | (0, 1) |
| **Softmax** | eˣⁱ/Σeˣ | Multi-class output | (0, 1), sums to 1 |
| **Tanh** | (eˣ-e⁻ˣ)/(eˣ+e⁻ˣ) | RNNs, some hidden layers | (-1, 1) |
| **GELU** | x·Φ(x) | Transformers (BERT, GPT) | (-0.17, ∞) |

---

## Running AI on AWS & Azure in 2026 {% raw %}{#{% endraw %}cloud-ai}

As a cloud engineer, you don't always train models from scratch. Here's the practical landscape:

### AWS AI/ML Stack

```
  ┌─────────────────────────────────────────────────────┐
  │                   AWS AI Services                    │
  ├─────────────────┬───────────────────────────────────┤
  │  Pre-built APIs │  Rekognition (vision)              │
  │  (no ML needed) │  Textract (document OCR)           │
  │                 │  Comprehend (NLP)                  │
  │                 │  Forecast (time series)            │
  ├─────────────────┼───────────────────────────────────┤
  │  Foundation     │  Bedrock (Claude, Llama, Titan)    │
  │  Models         │  SageMaker JumpStart               │
  ├─────────────────┼───────────────────────────────────┤
  │  Custom         │  SageMaker Training Jobs           │
  │  Training       │  SageMaker Pipelines (MLOps)       │
  │                 │  SageMaker Endpoints (inference)   │
  └─────────────────┴───────────────────────────────────┘
```

**Deploy a SageMaker endpoint in 10 lines:**

```python
import boto3
import sagemaker
from sagemaker.sklearn import SKLearn

role    = sagemaker.get_execution_role()
session = sagemaker.Session()

estimator = SKLearn(
    entry_point="train.py",
    role=role,
    instance_type="ml.m5.xlarge",
    framework_version="1.2-1",
)
estimator.fit({"train": "s3://my-bucket/train-data/"})

predictor = estimator.deploy(
    initial_instance_count=1,
    instance_type="ml.t2.medium",
)
print(predictor.predict([[75, 15, 3000]]))
```

### Azure ML Stack

```python
from azure.ai.ml import MLClient, command
from azure.identity import DefaultAzureCredential

ml_client = MLClient(
    DefaultAzureCredential(),
    subscription_id="<subscription-id>",
    resource_group_name="ml-rg",
    workspace_name="ml-workspace",
)

job = command(
    code="./src",
    command="python train.py --data ${{inputs.training_data}}",
    inputs={"training_data": "azureml:my-dataset:1"},
    environment="AzureML-sklearn-1.0-ubuntu20.04-py38-cpu@latest",
    compute="cpu-cluster",
)
returned_job = ml_client.jobs.create_or_update(job)
print(f"Job submitted: {returned_job.name}")
```

---

## FAQ {% raw %}{#{% endraw %}faq}

**What is the difference between AI, machine learning, and deep learning?**
AI is the broad field. Machine learning is a subset where systems learn from data. Deep learning is a subset of ML using multi-layer neural networks. Every deep learning model is ML, and every ML model is AI — but not vice versa.

**What is the best algorithm for beginners to learn first?**
Linear regression. It is simple, interpretable, and the mathematical foundation for everything else. Once you understand gradient descent on linear regression, neural networks make intuitive sense.

**How do I run machine learning models on AWS in 2026?**
Use AWS SageMaker for custom training and deployment. Use AWS Bedrock for foundation models (Claude, Llama) without managing infrastructure. Use pre-built services like Rekognition, Textract, and Comprehend for common tasks without any ML code.

**What is the difference between supervised and unsupervised learning?**
Supervised learning trains on labelled data — you provide inputs and correct outputs. Unsupervised learning finds hidden structure in unlabelled data. Clustering and association rules are unsupervised. Regression and classification are supervised.

**How many layers does a neural network need?**
Minimum 3: input, one hidden, output. Deep learning uses many hidden layers — ResNet-50 has 50 layers, GPT-4 has hundreds. More layers learn more abstract representations but require more data and compute to train.

**What is overfitting and how do I prevent it?**
Overfitting is when a model memorises training data instead of learning general patterns — it performs well on training data but poorly on new data. Prevent it with: more training data, dropout layers, regularisation (L1/L2), early stopping, and cross-validation.

---

*Building AI infrastructure on AWS or Azure? [Let's connect on LinkedIn](https://linkedin.com/in/samuel-mamootil).*
