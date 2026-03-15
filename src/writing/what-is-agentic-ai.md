---
layout: layouts/post.njk
title: "What is Agentic AI and How Does It Work? (2026)"
description: "What is Agentic AI? How do AI agents work, what is the ReAct pattern, how do multi-agent systems coordinate, and how do you build and deploy agentic AI on AWS Bedrock and Azure OpenAI in 2026."
date: 2026-04-15
tags: [AI, MLOps, AWS, Azure, Cloud]
permalink: /writing/what-is-agentic-ai/
---

<nav class="toc" aria-label="Table of contents">
  <p class="toc__title">Table of Contents</p>
  <ol>
    <li><a href="#what-is-agentic-ai">What is Agentic AI?</a></li>
    <li><a href="#how-agents-work">How AI Agents Work</a></li>
    <li><a href="#react-pattern">The ReAct Pattern</a></li>
    <li><a href="#tools">Tools and Function Calling</a></li>
    <li><a href="#memory">Memory and Context</a></li>
    <li><a href="#multi-agent">Multi-Agent Systems</a></li>
    <li><a href="#aws-bedrock">Building Agents on AWS Bedrock</a></li>
    <li><a href="#use-cases">Real-World Use Cases</a></li>
    <li><a href="#faq">FAQ</a></li>
  </ol>
</nav>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "What is Agentic AI and How Does It Work? (2026)",
  "description": "What is Agentic AI? How do AI agents work, the ReAct pattern, multi-agent systems, and how to build agentic AI on AWS Bedrock and Azure OpenAI.",
  "author": { "@type": "Person", "name": "Samuel Mamootil", "url": "https://samuelmamootil.github.io" },
  "datePublished": "2026-04-15",
  "dateModified": "2026-04-15",
  "mainEntityOfPage": "https://samuelmamootil.github.io/writing/what-is-agentic-ai/"
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Agentic AI?",
      "acceptedAnswer": { "@type": "Answer", "text": "Agentic AI refers to AI systems that can autonomously plan, take actions, use tools, and pursue goals over multiple steps — without requiring a human to direct each step. Unlike a chatbot that answers one question at a time, an AI agent can decompose a complex goal, execute a sequence of actions, observe results, and adapt its plan." }
    },
    {
      "@type": "Question",
      "name": "What is the difference between a chatbot and an AI agent?",
      "acceptedAnswer": { "@type": "Answer", "text": "A chatbot responds to a single input with a single output. An AI agent can take a high-level goal, break it into steps, use tools (search, code execution, APIs), observe results, and iterate until the goal is achieved — autonomously, over multiple steps." }
    },
    {
      "@type": "Question",
      "name": "What is the ReAct pattern in AI agents?",
      "acceptedAnswer": { "@type": "Answer", "text": "ReAct (Reasoning + Acting) is a prompting pattern where the agent alternates between Thought (reasoning about what to do), Action (calling a tool), and Observation (reading the result) — repeating until the task is complete." }
    },
    {
      "@type": "Question",
      "name": "How do you build an AI agent on AWS?",
      "acceptedAnswer": { "@type": "Answer", "text": "AWS Bedrock Agents is the managed service for building agentic AI on AWS. You define an agent with a foundation model (Claude, Llama), attach action groups (Lambda functions the agent can call), and optionally connect a knowledge base (RAG). Bedrock handles the orchestration loop automatically." }
    }
  ]
}
</script>

---

## What is Agentic AI? {% raw %}{#{% endraw %}what-is-agentic-ai}

Agentic AI refers to AI systems that can autonomously plan, take actions, use tools, and pursue goals over multiple steps — without a human directing each step.

The shift from traditional AI to agentic AI:

| Traditional AI | Agentic AI |
|---------------|-----------|
| Single input → single output | Goal → multi-step plan → execution |
| Stateless | Maintains memory across steps |
| No tools | Uses tools (search, code, APIs, databases) |
| Human directs each step | Autonomous decision-making |
| Example: ChatGPT answering a question | Example: Agent that researches, writes, and publishes a report |

**The key properties of an AI agent:**
- **Perception** — reads inputs (text, files, API responses, sensor data)
- **Reasoning** — plans what actions to take
- **Action** — executes tools, writes code, calls APIs
- **Memory** — remembers context across steps
- **Goal-directedness** — pursues an objective until complete

---

## How AI Agents Work {% raw %}{#{% endraw %}how-agents-work}

```
  ┌─────────────────────────────────────────────────────────┐
  │                    AI AGENT LOOP                         │
  │                                                          │
  │   ┌──────────┐                                          │
  │   │   GOAL   │  "Research cloud costs and write report" │
  │   └────┬─────┘                                          │
  │        │                                                 │
  │        ▼                                                 │
  │   ┌──────────┐    ┌─────────────────────────────────┐   │
  │   │  THINK   │    │  What do I need to do first?    │   │
  │   │ (LLM)    │───►│  Step 1: Search for cost data   │   │
  │   └──────────┘    │  Step 2: Analyse the numbers    │   │
  │        │          │  Step 3: Write the report       │   │
  │        │          └─────────────────────────────────┘   │
  │        ▼                                                 │
  │   ┌──────────┐                                          │
  │   │   ACT    │  Call tool: web_search("AWS cost 2026")  │
  │   └──────────┘                                          │
  │        │                                                 │
  │        ▼                                                 │
  │   ┌──────────┐                                          │
  │   │ OBSERVE  │  Read tool result: search results        │
  │   └──────────┘                                          │
  │        │                                                 │
  │        └──────────► THINK again with new information    │
  │                     Repeat until goal achieved           │
  └─────────────────────────────────────────────────────────┘
```

---

## The ReAct Pattern {% raw %}{#{% endraw %}react-pattern}

ReAct (Reasoning + Acting) is the foundational pattern for AI agents. The agent alternates between thinking and acting:

```
  Thought: I need to find the current AWS EC2 pricing for m5.large
  Action: web_search("AWS EC2 m5.large price us-east-1 2026")
  Observation: m5.large costs $0.096/hr on-demand in us-east-1

  Thought: Now I need to calculate monthly cost
  Action: calculator("0.096 * 24 * 30")
  Observation: 69.12

  Thought: I have the monthly cost. Now write the answer.
  Final Answer: An m5.large instance costs $0.096/hr or approximately
                $69.12/month on-demand in us-east-1.
```

**Python implementation with LangChain:**

```python
from langchain.agents import create_react_agent, AgentExecutor
from langchain.tools import Tool
from langchain_aws import ChatBedrock
import boto3

# Define tools the agent can use
def search_aws_docs(query: str) -> str:
    # In production: call a real search API or RAG pipeline
    return f"Search results for: {query}"

def run_python(code: str) -> str:
    # In production: use a sandboxed executor
    result = {}
    exec(code, result)
    return str(result.get('output', 'No output'))

tools = [
    Tool(name="search", func=search_aws_docs,
         description="Search AWS documentation and pricing"),
    Tool(name="python", func=run_python,
         description="Execute Python code for calculations"),
]

# Use Claude via AWS Bedrock
llm = ChatBedrock(
    model_id="anthropic.claude-3-5-sonnet-20241022-v2:0",
    region_name="us-east-1",
)

agent = create_react_agent(llm, tools, prompt=react_prompt)
executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

result = executor.invoke({
    "input": "What is the monthly cost of running 10 m5.large instances 24/7 in us-east-1?"
})
print(result['output'])
```

---

## Tools and Function Calling {% raw %}{#{% endraw %}tools}

Tools are functions the agent can call to interact with the world. Modern LLMs support structured function calling — the model outputs a JSON object specifying which function to call and with what arguments.

```python
import anthropic

client = anthropic.Anthropic()

# Define tools available to the agent
tools = [
    {
        "name": "get_ec2_price",
        "description": "Get the current on-demand price for an EC2 instance type",
        "input_schema": {
            "type": "object",
            "properties": {
                "instance_type": {"type": "string", "description": "e.g. m5.large"},
                "region": {"type": "string", "description": "e.g. us-east-1"},
            },
            "required": ["instance_type", "region"]
        }
    },
    {
        "name": "create_cost_report",
        "description": "Generate a cost optimisation report and save to S3",
        "input_schema": {
            "type": "object",
            "properties": {
                "data": {"type": "object"},
                "s3_key": {"type": "string"}
            },
            "required": ["data", "s3_key"]
        }
    }
]

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    tools=tools,
    messages=[{
        "role": "user",
        "content": "Analyse our EC2 costs and create a report"
    }]
)

# Agent decides which tool to call
if response.stop_reason == "tool_use":
    tool_call = next(b for b in response.content if b.type == "tool_use")
    print(f"Agent calling: {tool_call.name}")
    print(f"With args: {tool_call.input}")
```

---

## Memory and Context {% raw %}{#{% endraw %}memory}

Agents need memory to maintain context across steps and sessions:

```
  MEMORY TYPES
  ─────────────────────────────────────────────────────
  In-context     Short-term, within one conversation
  (working)      Limited by context window (200K tokens)
                 Lost when session ends

  External       Long-term, persisted in a database
  (episodic)     Vector DB (Pinecone, OpenSearch)
                 Retrieved via semantic search (RAG)

  Procedural     How to do things — stored as tools
                 or system prompts

  Semantic       Facts about the world — knowledge base
                 Retrieved when relevant
```

```python
from langchain.memory import ConversationBufferWindowMemory
from langchain_community.vectorstores import OpenSearchVectorSearch

# Short-term: keep last 10 exchanges in context
short_term = ConversationBufferWindowMemory(k=10)

# Long-term: semantic search over past interactions
long_term = OpenSearchVectorSearch(
    opensearch_url="https://my-opensearch.us-east-1.es.amazonaws.com",
    index_name="agent-memory",
    embedding_function=embeddings,
)

def recall_relevant_memory(query: str) -> str:
    docs = long_term.similarity_search(query, k=3)
    return "\n".join([d.page_content for d in docs])
```

---

## Multi-Agent Systems {% raw %}{#{% endraw %}multi-agent}

Complex tasks benefit from multiple specialised agents working together:

```
  ┌─────────────────────────────────────────────────────────┐
  │                  ORCHESTRATOR AGENT                      │
  │         "Analyse cloud infrastructure and               │
  │          produce cost optimisation report"               │
  └──────────────────────┬──────────────────────────────────┘
                         │ delegates to
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
  │  DATA AGENT  │ │ANALYSIS AGENT│ │WRITER AGENT  │
  │              │ │              │ │              │
  │ Pulls AWS    │ │ Identifies   │ │ Writes the   │
  │ Cost Explorer│ │ waste and    │ │ report in    │
  │ data via API │ │ savings opps │ │ markdown     │
  └──────────────┘ └──────────────┘ └──────────────┘
          │              │              │
          └──────────────┴──────────────┘
                         │ results back to
                         ▼
                  ORCHESTRATOR compiles
                  final report
```

---

## Building Agents on AWS Bedrock {% raw %}{#{% endraw %}aws-bedrock}

AWS Bedrock Agents is the managed service for agentic AI on AWS. No infrastructure to manage — you define the agent, attach Lambda action groups, and Bedrock handles the orchestration loop.

```python
import boto3

bedrock_agent = boto3.client('bedrock-agent', region_name='us-east-1')

# Create an agent
response = bedrock_agent.create_agent(
    agentName='cloud-cost-analyst',
    agentResourceRoleArn='arn:aws:iam::123456789:role/bedrock-agent-role',
    foundationModel='anthropic.claude-3-5-sonnet-20241022-v2:0',
    instruction="""You are a cloud cost analyst. When asked about AWS costs,
    use the available tools to retrieve real cost data, analyse it,
    and provide specific, actionable recommendations.""",
)

agent_id = response['agent']['agentId']

# Invoke the agent
runtime = boto3.client('bedrock-agent-runtime', region_name='us-east-1')

response = runtime.invoke_agent(
    agentId=agent_id,
    agentAliasId='TSTALIASID',
    sessionId='session-001',
    inputText='Analyse our EC2 costs for the last 30 days and identify top 3 savings opportunities',
)

for event in response['completion']:
    if 'chunk' in event:
        print(event['chunk']['bytes'].decode(), end='', flush=True)
```

---

## Real-World Use Cases {% raw %}{#{% endraw %}use-cases}

| Use case | Agent capability | Tools used |
|----------|-----------------|-----------|
| **Cloud cost analyst** | Pulls cost data, identifies waste, writes report | AWS Cost Explorer API, calculator, S3 |
| **DevOps incident responder** | Reads alerts, queries logs, suggests fixes | CloudWatch, PagerDuty, Slack |
| **Resume screener** (ReRhythm) | Parses resume, scores against JD, generates feedback | Textract, Bedrock, DynamoDB |
| **Code reviewer** | Reads PR diff, checks security, posts comments | GitHub API, SAST tools |
| **Customer support** | Answers questions, looks up orders, escalates | CRM API, knowledge base, ticketing |

---

## FAQ {% raw %}{#{% endraw %}faq}

**What is Agentic AI?**
Agentic AI systems autonomously plan, take actions, use tools, and pursue goals over multiple steps without human direction at each step. Unlike a chatbot, an agent can decompose a complex goal, execute a sequence of actions, observe results, and adapt its plan.

**What is the difference between a chatbot and an AI agent?**
A chatbot responds to one input with one output. An AI agent takes a high-level goal, breaks it into steps, uses tools (search, code, APIs), observes results, and iterates until the goal is achieved — autonomously.

**What is the ReAct pattern?**
ReAct (Reasoning + Acting) alternates between Thought (what should I do?), Action (call a tool), and Observation (read the result) — repeating until the task is complete. It's the foundational pattern for most AI agent implementations.

**How do you build an AI agent on AWS?**
Use AWS Bedrock Agents — define an agent with a foundation model (Claude, Llama), attach Lambda action groups as tools, and optionally connect a knowledge base for RAG. Bedrock handles the orchestration loop. For custom implementations, use LangChain or LlamaIndex with Bedrock as the LLM backend.

---

*Building agentic AI infrastructure on AWS? [Let's connect on LinkedIn](https://linkedin.com/in/samuel-mamootil).*
