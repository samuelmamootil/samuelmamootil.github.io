---
layout: layouts/post.njk
title: "Decision Trees vs Random Forests: Which is Better for Classification? (2026)"
description: "Decision Trees vs Random Forests — a complete comparison for classification tasks. How each algorithm works, when to use which, bias-variance tradeoff, feature importance, and Python examples."
date: 2026-04-16
tags: [AI, MLOps, Cloud]
permalink: /writing/decision-trees-vs-random-forests/
---

<nav class="toc" aria-label="Table of contents">
  <p class="toc__title">Table of Contents</p>
  <ol>
    <li><a href="#decision-trees">How Decision Trees Work</a></li>
    <li><a href="#problems">Problems with Single Decision Trees</a></li>
    <li><a href="#random-forests">How Random Forests Work</a></li>
    <li><a href="#comparison">Head-to-Head Comparison</a></li>
    <li><a href="#bias-variance">Bias-Variance Tradeoff</a></li>
    <li><a href="#feature-importance">Feature Importance</a></li>
    <li><a href="#code">Python Implementation</a></li>
    <li><a href="#when-to-use">When to Use Which</a></li>
    <li><a href="#faq">FAQ</a></li>
  </ol>
</nav>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Decision Trees vs Random Forests: Which is Better for Classification? (2026)",
  "description": "Decision Trees vs Random Forests — a complete comparison. How each works, bias-variance tradeoff, feature importance, and Python examples.",
  "author": { "@type": "Person", "name": "Samuel Mamootil", "url": "https://samuelmamootil.github.io" },
  "datePublished": "2026-04-16",
  "dateModified": "2026-04-16",
  "mainEntityOfPage": "https://samuelmamootil.github.io/writing/decision-trees-vs-random-forests/"
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the difference between a decision tree and a random forest?",
      "acceptedAnswer": { "@type": "Answer", "text": "A decision tree is a single model that splits data by asking yes/no questions. A random forest is an ensemble of many decision trees, each trained on a random subset of data and features. The forest averages their predictions, which dramatically reduces overfitting and improves accuracy." }
    },
    {
      "@type": "Question",
      "name": "When should you use a decision tree instead of a random forest?",
      "acceptedAnswer": { "@type": "Answer", "text": "Use a decision tree when interpretability is critical — you need to explain exactly why a prediction was made (e.g. loan approval, medical diagnosis). Random forests are more accurate but harder to interpret. For production ML where accuracy matters more than explainability, use random forests." }
    },
    {
      "@type": "Question",
      "name": "Does random forest always outperform decision trees?",
      "acceptedAnswer": { "@type": "Answer", "text": "Almost always on accuracy, yes. Random forests reduce variance through ensemble averaging, which is the main weakness of single decision trees. The tradeoff is interpretability and training time. On very small datasets, a single decision tree may generalise just as well." }
    }
  ]
}
</script>

---

## How Decision Trees Work {% raw %}{#{% endraw %}decision-trees}

A decision tree learns a series of if/else rules from training data. At each node, it finds the feature and threshold that best separates the classes.

```
  TRAINING DATA: Predict if a cloud instance should be rightsized

  Features: [cpu_avg, memory_avg, network_avg, age_days]
  Label: 1 = rightsize, 0 = keep

  LEARNED TREE:
                    ┌─────────────────────┐
                    │   cpu_avg < 20%?    │
                    └──────────┬──────────┘
                               │
              ┌────────────────┴────────────────┐
             YES                                NO
              │                                 │
              ▼                                 ▼
  ┌───────────────────┐             ┌───────────────────┐
  │  memory_avg < 30%?│             │  Keep instance    │
  └─────────┬─────────┘             │  (well utilised)  │
            │                       └───────────────────┘
       ┌────┴────┐
      YES        NO
       │          │
       ▼          ▼
  ┌─────────┐  ┌─────────┐
  │Rightsize│  │  Keep   │
  │ (waste) │  │(memory  │
  └─────────┘  │ bound)  │
               └─────────┘
```

**How splits are chosen — Gini Impurity:**

```
  Gini Impurity = 1 - Σ(pᵢ²)

  Pure node (all one class):   Gini = 1 - (1² + 0²) = 0
  Perfectly mixed (50/50):     Gini = 1 - (0.5² + 0.5²) = 0.5

  The algorithm picks the split that minimises weighted Gini
  across the two resulting child nodes.
```

---

## Problems with Single Decision Trees {% raw %}{#{% endraw %}problems}

Decision trees have one critical weakness: **they overfit**.

```
  TRAINING DATA:          TEST DATA:
  ─────────────           ──────────
  Accuracy: 99%           Accuracy: 71%

  The tree memorised the training data.
  It learned noise, not signal.
```

Why this happens:

```
  A deep decision tree can create a unique leaf
  for every training example — perfect training
  accuracy, terrible generalisation.

  Depth 1:  Underfits (too simple)
  Depth 5:  Good generalisation
  Depth 20: Overfits (memorises training data)
  Unlimited: Perfect training accuracy, poor test accuracy
```

---

## How Random Forests Work {% raw %}{#{% endraw %}random-forests}

Random Forest fixes overfitting by building many trees and averaging their predictions. Two sources of randomness make each tree different:

```
  RANDOM FOREST TRAINING

  Original dataset (N rows, M features)
         │
         ├── Bootstrap sample 1 (random N rows with replacement)
         │   + Random subset of features (√M features)
         │   → Train Tree 1
         │
         ├── Bootstrap sample 2 (different random N rows)
         │   + Different random subset of features
         │   → Train Tree 2
         │
         ├── Bootstrap sample 3
         │   → Train Tree 3
         │
         └── ... repeat for 100-500 trees

  PREDICTION:
  New sample → run through all trees
  Classification: majority vote
  Regression: average of all predictions
```

```
  Tree 1 says: RIGHTSIZE
  Tree 2 says: KEEP
  Tree 3 says: RIGHTSIZE
  Tree 4 says: RIGHTSIZE
  Tree 5 says: KEEP
  ...
  Tree 100 says: RIGHTSIZE

  Final prediction: RIGHTSIZE (majority vote)
```

The magic: each tree overfits to its bootstrap sample, but their errors are **uncorrelated** — they overfit in different directions. Averaging cancels out the noise.

---

## Head-to-Head Comparison {% raw %}{#{% endraw %}comparison}

| Property | Decision Tree | Random Forest |
|----------|--------------|--------------|
| **Accuracy** | Moderate | High |
| **Overfitting** | High risk | Low risk |
| **Interpretability** | ✅ Fully interpretable | ❌ Black box |
| **Training speed** | Fast | Slower (100s of trees) |
| **Prediction speed** | Very fast | Slower (100s of trees) |
| **Feature importance** | Yes | Yes (more reliable) |
| **Handles missing data** | Needs imputation | More robust |
| **Hyperparameters** | depth, min_samples | n_estimators, max_features, depth |
| **Memory usage** | Low | High |
| **Best for** | Explainability, small data | Production ML, tabular data |

---

## Bias-Variance Tradeoff {% raw %}{#{% endraw %}bias-variance}

```
  ERROR = BIAS² + VARIANCE + IRREDUCIBLE NOISE

  HIGH BIAS (underfitting):
  Model too simple, misses patterns
  Training error: high
  Test error: high

  HIGH VARIANCE (overfitting):
  Model too complex, memorises noise
  Training error: low
  Test error: high

  SWEET SPOT:
  Training error: low-medium
  Test error: low

  ┌─────────────────────────────────────────────┐
  │  Error                                       │
  │    │                                         │
  │    │  Total Error                            │
  │    │    ╲                    ╱               │
  │    │     ╲                  ╱                │
  │    │      ╲    ╭──────────╮╱                 │
  │    │       ╲  ╱  Variance  ╲                 │
  │    │        ╲╱              ╲                │
  │    │        ╱╲    Bias²      ╲               │
  │    │       ╱  ╲──────────────►               │
  │    └────────────────────────── Model         │
  │              Simple      Complex             │
  └─────────────────────────────────────────────┘

  Decision Tree (deep):  Low bias, HIGH variance
  Random Forest:         Low bias, LOW variance ← ideal
```

---

## Feature Importance {% raw %}{#{% endraw %}feature-importance}

Random forests provide reliable feature importance scores — how much each feature contributes to predictions:

```python
from sklearn.ensemble import RandomForestClassifier
import pandas as pd
import numpy as np

# Cloud instance rightsizing dataset
feature_names = ['cpu_avg_pct', 'memory_avg_pct', 'network_mbps',
                 'disk_iops', 'age_days', 'instance_family']

X = np.random.rand(1000, 6)
y = (X[:, 0] < 0.2) & (X[:, 1] < 0.3)  # rightsize if low CPU and memory

rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X, y)

importance = pd.Series(rf.feature_importances_, index=feature_names)
importance_sorted = importance.sort_values(ascending=False)

print("Feature Importance:")
for feat, score in importance_sorted.items():
    bar = '█' * int(score * 50)
    print(f"  {feat:<20} {bar} {score:.3f}")

# Output:
# cpu_avg_pct          ████████████████████████ 0.481
# memory_avg_pct       ████████████████ 0.312
# age_days             ████ 0.089
# network_mbps         ███ 0.062
# disk_iops            ██ 0.038
# instance_family      █ 0.018
```

---

## Python Implementation {% raw %}{#{% endraw %}code}

```python
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report
import numpy as np

# Generate synthetic cloud rightsizing data
np.random.seed(42)
n = 2000
X = np.column_stack([
    np.random.uniform(0, 100, n),   # cpu_avg
    np.random.uniform(0, 100, n),   # memory_avg
    np.random.uniform(0, 1000, n),  # network_mbps
    np.random.randint(1, 730, n),   # age_days
])
y = ((X[:, 0] < 25) & (X[:, 1] < 35)).astype(int)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Decision Tree
dt = DecisionTreeClassifier(max_depth=5, random_state=42)
dt.fit(X_train, y_train)
dt_cv = cross_val_score(dt, X, y, cv=5).mean()

# Random Forest
rf = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    max_features='sqrt',   # √M features per split
    random_state=42,
    n_jobs=-1              # use all CPU cores
)
rf.fit(X_train, y_train)
rf_cv = cross_val_score(rf, X, y, cv=5).mean()

print(f"Decision Tree  — CV Accuracy: {dt_cv:.3f}")
print(f"Random Forest  — CV Accuracy: {rf_cv:.3f}")
print()
print("Random Forest Classification Report:")
print(classification_report(y_test, rf.predict(X_test),
      target_names=['Keep', 'Rightsize']))
```

---

## When to Use Which {% raw %}{#{% endraw %}when-to-use}

**Use a Decision Tree when:**
- You need to explain every prediction (loan approval, medical diagnosis, compliance)
- Stakeholders need to understand the model logic
- Dataset is very small (< 1,000 rows) — random forest may not help much
- Inference speed is critical and you can't afford 100 trees

**Use a Random Forest when:**
- Accuracy matters more than interpretability
- You have tabular data (the domain where random forests excel)
- You want reliable feature importance scores
- You need a robust baseline before trying deep learning
- Dataset is medium to large (1,000+ rows)

**Consider alternatives when:**
- Data is images or text → use neural networks
- You need maximum accuracy on tabular data → try XGBoost or LightGBM
- You need full interpretability with high accuracy → try SHAP values on random forest

---

## FAQ {% raw %}{#{% endraw %}faq}

**What is the difference between a decision tree and a random forest?**
A decision tree is a single model making splits on features. A random forest is an ensemble of 100–500 trees, each trained on a random data subset with random feature subsets. The forest votes on the final prediction, dramatically reducing overfitting.

**When should you use a decision tree instead of a random forest?**
When interpretability is critical — you need to explain exactly why a prediction was made. Decision trees produce human-readable rules. Random forests are more accurate but are essentially black boxes.

**Does random forest always outperform decision trees?**
Almost always on accuracy. The tradeoff is interpretability and training time. On very small datasets, a well-tuned decision tree may generalise just as well.

**What is the best number of trees in a random forest?**
Start with 100. Accuracy improves up to ~200–500 trees, then plateaus. More trees increase training time without meaningful accuracy gains. Use cross-validation to find the sweet spot for your dataset.

---

*Working on ML classification problems? [Let's connect on LinkedIn](https://linkedin.com/in/samuel-mamootil).*
