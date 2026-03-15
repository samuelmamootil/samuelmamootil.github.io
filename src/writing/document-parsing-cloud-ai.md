---
layout: layouts/post.njk
title: "How to Parse and Process Documents Using Cloud AI Services (2026)"
description: "How to parse and process documents using cloud AI services. Covers AWS Textract, Azure Document Intelligence, OCR, table extraction, form parsing, and building a document processing pipeline with Lambda and Python."
date: 2026-04-19
tags: [AI, AWS, Azure, Cloud, MLOps]
permalink: /writing/document-parsing-cloud-ai/
---

<nav class="toc" aria-label="Table of contents">
  <p class="toc__title">Table of Contents</p>
  <ol>
    <li><a href="#why-cloud-ai">Why Use Cloud AI for Documents?</a></li>
    <li><a href="#aws-textract">AWS Textract</a></li>
    <li><a href="#azure-doc-intelligence">Azure Document Intelligence</a></li>
    <li><a href="#table-extraction">Table Extraction</a></li>
    <li><a href="#form-parsing">Form and Key-Value Parsing</a></li>
    <li><a href="#pipeline">Building a Document Pipeline</a></li>
    <li><a href="#llm-extraction">LLM-Powered Extraction</a></li>
    <li><a href="#comparison">Service Comparison</a></li>
    <li><a href="#faq">FAQ</a></li>
  </ol>
</nav>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Parse and Process Documents Using Cloud AI Services (2026)",
  "description": "How to parse and process documents using cloud AI. Covers AWS Textract, Azure Document Intelligence, table extraction, form parsing, and building a document pipeline.",
  "author": { "@type": "Person", "name": "Samuel Mamootil", "url": "https://samuelmamootil.github.io" },
  "datePublished": "2026-04-19",
  "dateModified": "2026-04-19",
  "mainEntityOfPage": "https://samuelmamootil.github.io/writing/document-parsing-cloud-ai/"
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the best cloud service for document parsing in 2026?",
      "acceptedAnswer": { "@type": "Answer", "text": "AWS Textract is the leading service for general document OCR, table extraction, and form parsing. Azure Document Intelligence (formerly Form Recognizer) is excellent for pre-built models on invoices, receipts, and IDs. For complex unstructured documents, combining Textract with Claude or GPT-4 via Bedrock/Azure OpenAI gives the best results." }
    },
    {
      "@type": "Question",
      "name": "How does AWS Textract work?",
      "acceptedAnswer": { "@type": "Answer", "text": "AWS Textract uses machine learning to automatically extract text, tables, forms, and key-value pairs from documents (PDFs, images). It goes beyond simple OCR by understanding document structure — it knows a table cell belongs to a specific row and column, and a form field has a corresponding label." }
    },
    {
      "@type": "Question",
      "name": "Can cloud AI parse handwritten documents?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. AWS Textract and Azure Document Intelligence both support handwriting recognition. Accuracy depends on handwriting clarity. For printed text, accuracy is typically 99%+. For handwriting, 85-95% depending on quality." }
    }
  ]
}
</script>

---

## Why Use Cloud AI for Documents? {% raw %}{#{% endraw %}why-cloud-ai}

Traditional document processing required building and maintaining custom OCR models. Cloud AI services eliminate that entirely — you call an API and get structured data back in seconds.

```
  TRADITIONAL APPROACH:
  PDF → Custom OCR model → Post-processing → Structured data
  Time to build: 3-6 months
  Accuracy: 80-90%
  Maintenance: Ongoing

  CLOUD AI APPROACH:
  PDF → API call → Structured JSON
  Time to build: 1 day
  Accuracy: 95-99%
  Maintenance: None (provider handles model updates)
```

**What cloud document AI can extract:**
- Raw text (all words, positions, confidence scores)
- Tables (rows, columns, cell values)
- Key-value pairs (form fields and their values)
- Signatures, checkboxes, barcodes
- Document structure (headers, paragraphs, sections)
- Specific document types (invoices, receipts, IDs, tax forms)

---

## AWS Textract {% raw %}{#{% endraw %}aws-textract}

Textract is AWS's document analysis service. I used it in **ReRhythm** to parse uploaded resumes — extracting skills, experience, and education from PDFs of any format.

**Basic text extraction:**

```python
import boto3
import json

textract = boto3.client('textract', region_name='us-east-1')

def extract_text_from_s3(bucket: str, key: str) -> str:
    response = textract.detect_document_text(
        Document={'S3Object': {'Bucket': bucket, 'Name': key}}
    )

    lines = [
        block['Text']
        for block in response['Blocks']
        if block['BlockType'] == 'LINE'
    ]

    return '\n'.join(lines)

text = extract_text_from_s3('my-bucket', 'resume.pdf')
print(text[:500])
```

**Async processing for large documents (multi-page PDFs):**

```python
import time

def start_document_analysis(bucket: str, key: str) -> str:
    response = textract.start_document_analysis(
        DocumentLocation={'S3Object': {'Bucket': bucket, 'Name': key}},
        FeatureTypes=['TABLES', 'FORMS', 'SIGNATURES'],
    )
    return response['JobId']

def get_analysis_results(job_id: str) -> list:
    blocks = []
    next_token = None

    while True:
        # Poll until complete
        kwargs = {'JobId': job_id}
        if next_token:
            kwargs['NextToken'] = next_token

        response = textract.get_document_analysis(**kwargs)
        status = response['JobStatus']

        if status == 'IN_PROGRESS':
            time.sleep(2)
            continue
        elif status == 'FAILED':
            raise Exception(f"Textract job failed: {response.get('StatusMessage')}")

        blocks.extend(response['Blocks'])
        next_token = response.get('NextToken')
        if not next_token:
            break

    return blocks

job_id = start_document_analysis('my-bucket', 'invoice-50pages.pdf')
blocks  = get_analysis_results(job_id)
print(f"Extracted {len(blocks)} blocks from document")
```

---

## Azure Document Intelligence {% raw %}{#{% endraw %}azure-doc-intelligence}

Azure Document Intelligence (formerly Form Recognizer) has pre-built models for common document types:

```python
from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.core.credentials import AzureKeyCredential

client = DocumentIntelligenceClient(
    endpoint="https://my-resource.cognitiveservices.azure.com/",
    credential=AzureKeyCredential("<api-key>"),
)

# Use pre-built invoice model
with open("invoice.pdf", "rb") as f:
    poller = client.begin_analyze_document("prebuilt-invoice", f)

result = poller.result()

for invoice in result.documents:
    fields = invoice.fields
    print(f"Vendor:      {fields.get('VendorName', {}).get('content', 'N/A')}")
    print(f"Invoice #:   {fields.get('InvoiceId', {}).get('content', 'N/A')}")
    print(f"Total:       {fields.get('InvoiceTotal', {}).get('content', 'N/A')}")
    print(f"Due date:    {fields.get('DueDate', {}).get('content', 'N/A')}")
```

**Pre-built models available:**
- `prebuilt-invoice` — vendor, line items, totals, tax
- `prebuilt-receipt` — merchant, items, total, date
- `prebuilt-idDocument` — passport, driver's licence fields
- `prebuilt-businessCard` — name, email, phone, company
- `prebuilt-tax.us.w2` — W-2 tax form fields
- `prebuilt-read` — general OCR with language detection

---

## Table Extraction {% raw %}{#{% endraw %}table-extraction}

Extracting tables from PDFs is one of the hardest document processing tasks. Cloud AI handles it natively:

```python
def extract_tables(blocks: list) -> list:
    tables = []

    # Find all TABLE blocks
    table_blocks = {b['Id']: b for b in blocks if b['BlockType'] == 'TABLE'}
    cell_blocks  = {b['Id']: b for b in blocks if b['BlockType'] == 'CELL'}
    word_blocks  = {b['Id']: b for b in blocks if b['BlockType'] == 'WORD'}

    for table_id, table in table_blocks.items():
        rows = {}

        for rel in table.get('Relationships', []):
            if rel['Type'] == 'CHILD':
                for cell_id in rel['Ids']:
                    cell = cell_blocks.get(cell_id)
                    if not cell:
                        continue

                    row_idx = cell['RowIndex']
                    col_idx = cell['ColumnIndex']

                    # Get cell text
                    cell_text = ''
                    for cell_rel in cell.get('Relationships', []):
                        if cell_rel['Type'] == 'CHILD':
                            cell_text = ' '.join(
                                word_blocks[wid]['Text']
                                for wid in cell_rel['Ids']
                                if wid in word_blocks
                            )

                    rows.setdefault(row_idx, {})[col_idx] = cell_text

        # Convert to list of lists
        if rows:
            max_row = max(rows.keys())
            max_col = max(col for row in rows.values() for col in row.keys())
            table_data = [
                [rows.get(r, {}).get(c, '') for c in range(1, max_col + 1)]
                for r in range(1, max_row + 1)
            ]
            tables.append(table_data)

    return tables

tables = extract_tables(blocks)
for i, table in enumerate(tables):
    print(f"\nTable {i+1}:")
    for row in table:
        print(' | '.join(row))
```

---

## Form and Key-Value Parsing {% raw %}{#{% endraw %}form-parsing}

```python
def extract_key_value_pairs(blocks: list) -> dict:
    key_blocks   = {b['Id']: b for b in blocks if b['BlockType'] == 'KEY_VALUE_SET' and 'KEY' in b.get('EntityTypes', [])}
    value_blocks = {b['Id']: b for b in blocks if b['BlockType'] == 'KEY_VALUE_SET' and 'VALUE' in b.get('EntityTypes', [])}
    word_blocks  = {b['Id']: b for b in blocks if b['BlockType'] == 'WORD'}

    def get_text(block):
        text = ''
        for rel in block.get('Relationships', []):
            if rel['Type'] == 'CHILD':
                text = ' '.join(
                    word_blocks[wid]['Text']
                    for wid in rel['Ids']
                    if wid in word_blocks
                )
        return text.strip()

    pairs = {}
    for key_id, key_block in key_blocks.items():
        key_text = get_text(key_block)

        for rel in key_block.get('Relationships', []):
            if rel['Type'] == 'VALUE':
                for val_id in rel['Ids']:
                    val_block = value_blocks.get(val_id)
                    if val_block:
                        pairs[key_text] = get_text(val_block)

    return pairs

# Example output from an invoice:
# {
#   "Invoice Number": "INV-2026-0042",
#   "Date": "April 17, 2026",
#   "Bill To": "Acme Corp",
#   "Total Amount Due": "$12,450.00"
# }
```

---

## Building a Document Pipeline {% raw %}{#{% endraw %}pipeline}

A production document processing pipeline using S3, Lambda, and Textract:

```
  ┌──────────┐   upload   ┌─────────┐  trigger  ┌──────────────────┐
  │  Client  │───────────►│   S3    │──────────►│ Lambda:          │
  │  uploads │            │ Bucket  │           │ StartTextract    │
  │  PDF     │            └─────────┘           └────────┬─────────┘
  └──────────┘                                           │
                                                         │ async job
                                                         ▼
  ┌──────────┐  callback  ┌─────────┐  complete ┌──────────────────┐
  │ DynamoDB │◄───────────│   SNS   │◄──────────│ Textract         │
  │ Results  │            │  Topic  │           │ Job Complete     │
  └──────────┘            └─────────┘           └──────────────────┘
       │                       │
       │                       ▼
       │              ┌──────────────────┐
       │              │ Lambda:          │
       │              │ ProcessResults   │
       │              │ + Store to DB    │
       └──────────────┤ + Notify client  │
                      └──────────────────┘
```

```python
# Lambda: trigger Textract on S3 upload
import boto3
import os

textract = boto3.client('textract')
sns      = boto3.client('sns')

SNS_TOPIC_ARN = os.environ['SNS_TOPIC_ARN']
ROLE_ARN      = os.environ['TEXTRACT_ROLE_ARN']

def lambda_handler(event, context):
    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key    = record['s3']['object']['key']

        response = textract.start_document_analysis(
            DocumentLocation={'S3Object': {'Bucket': bucket, 'Name': key}},
            FeatureTypes=['TABLES', 'FORMS'],
            NotificationChannel={
                'SNSTopicArn': SNS_TOPIC_ARN,
                'RoleArn': ROLE_ARN,
            },
            JobTag=key,  # pass the S3 key as a tag for retrieval
        )

        print(f"Started Textract job {response['JobId']} for {key}")
```

---

## LLM-Powered Extraction {% raw %}{#{% endraw %}llm-extraction}

For complex unstructured documents, combine Textract with an LLM for intelligent extraction:

```python
import boto3
import json

textract = boto3.client('textract')
bedrock  = boto3.client('bedrock-runtime', region_name='us-east-1')

def extract_with_llm(bucket: str, key: str, schema: dict) -> dict:
    # Step 1: Get raw text from Textract
    response = textract.detect_document_text(
        Document={'S3Object': {'Bucket': bucket, 'Name': key}}
    )
    raw_text = '\n'.join(
        b['Text'] for b in response['Blocks'] if b['BlockType'] == 'LINE'
    )

    # Step 2: Use Claude to extract structured data
    prompt = f"""Extract the following fields from this document.
Return a JSON object with exactly these keys: {list(schema.keys())}

Document text:
{raw_text[:4000]}

Return only valid JSON, no explanation."""

    response = bedrock.invoke_model(
        modelId='anthropic.claude-3-5-sonnet-20241022-v2:0',
        body=json.dumps({
            'anthropic_version': 'bedrock-2023-05-31',
            'max_tokens': 1024,
            'messages': [{'role': 'user', 'content': prompt}]
        })
    )

    result = json.loads(response['body'].read())
    return json.loads(result['content'][0]['text'])

# Extract specific fields from a contract
schema = {
    'party_name': 'Name of the contracting party',
    'contract_value': 'Total contract value in USD',
    'start_date': 'Contract start date',
    'end_date': 'Contract end date',
    'governing_law': 'Governing law jurisdiction',
}

extracted = extract_with_llm('contracts-bucket', 'contract-2026.pdf', schema)
print(json.dumps(extracted, indent=2))
```

---

## Service Comparison {% raw %}{#{% endraw %}comparison}

| Feature | AWS Textract | Azure Doc Intelligence | Google Document AI |
|---------|-------------|----------------------|-------------------|
| **General OCR** | ✅ Excellent | ✅ Excellent | ✅ Excellent |
| **Table extraction** | ✅ Best-in-class | ✅ Good | ✅ Good |
| **Form parsing** | ✅ Excellent | ✅ Excellent | ✅ Good |
| **Pre-built models** | Limited | ✅ Many (invoice, receipt, ID) | ✅ Many |
| **Handwriting** | ✅ Good | ✅ Good | ✅ Good |
| **Async processing** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Price (per page)** | ~$0.0015 | ~$0.001 | ~$0.0015 |
| **Best for** | AWS-native pipelines | Azure/Microsoft stack | GCP workloads |

---

## FAQ {% raw %}{#{% endraw %}faq}

**What is the best cloud service for document parsing in 2026?**
AWS Textract for AWS-native pipelines and table extraction. Azure Document Intelligence for pre-built models on invoices, receipts, and IDs. For complex unstructured documents, combine either with Claude or GPT-4 for intelligent extraction.

**How does AWS Textract work?**
Textract uses ML to extract text, tables, forms, and key-value pairs from PDFs and images. It understands document structure — not just raw text positions. You call the API with a document, and it returns structured JSON with every word, its position, confidence score, and relationships.

**Can cloud AI parse handwritten documents?**
Yes. Both Textract and Azure Document Intelligence support handwriting. Accuracy is 99%+ for printed text and 85–95% for handwriting depending on clarity.

**How do I process a 100-page PDF with Textract?**
Use the async API: `start_document_analysis` returns a job ID, then poll `get_document_analysis` until the job completes. For SNS notifications instead of polling, configure a `NotificationChannel` with an SNS topic and Lambda subscriber.

---

*Building document processing pipelines on AWS? [Let's connect on LinkedIn](https://linkedin.com/in/samuel-mamootil).*
