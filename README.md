# 🌱 Community Climate Action & Reduction Platform

> **From Individual Climate Action to Collective Community Impact**

An AI-powered climate action platform that helps individuals understand their environmental impact, take meaningful climate actions, verify their activities, and contribute to measurable community-level environmental progress.

---

## 📌 Problem Statement

Climate action often happens at an individual level, but there is a gap between personal efforts and measurable community impact.

Many existing approaches focus on tracking or reporting activities, but users also need a way to:

- Understand their environmental impact
- Discover practical climate-friendly actions
- Record real-world activities
- Provide evidence for their actions
- Measure verified environmental impact
- Receive personalized recommendations
- Participate in community challenges
- Understand collective community progress

Our platform aims to connect these activities through a unified climate-action journey.

---

## 💡 Our Solution

The platform follows a simple journey:

**Discover → Act → Record → Evidence → Verify → Calculate → Understand → Contribute**

Users can:

- Explore climate-friendly actions
- Record completed environmental activities
- Submit relevant evidence
- Receive AI-assisted verification
- Calculate environmental impact
- Track personal progress
- Get personalized AI recommendations
- Participate in challenges
- Join communities
- View community-level impact
- Discover local climate activities
- Compare verified impact through leaderboards

The core idea is:

> **Individual Action → Verified Impact → Community Contribution → Collective Climate Impact**

---

## ✨ Key Features

### 👤 Personal Climate Dashboard

- Personal environmental progress
- Verified and pending actions
- Completed activities
- Impact summaries
- Goals and challenges
- Recent activity
- AI-powered recommendations

### 🌍 Climate Actions

Climate actions are organized into categories such as:

- 🚲 Sustainable Transportation
- ⚡ Energy Conservation
- ❄️ Air Conditioning Reduction
- ♻️ Waste Reduction
- 🛍️ Plastic Reduction
- 💧 Water Conservation
- 🌳 Tree & Green Activities
- 🍃 Sustainable Food Practices
- 🛒 Sustainable Consumption
- 🔋 E-Waste Management
- 🤝 Community Activities

### 📸 Evidence & Verification

Users can record relevant details such as:

- Quantity
- Date
- Location
- Duration or distance
- Description
- Photo evidence

The platform combines:

- Backend validation rules
- AI-assisted evidence analysis
- Structured verification
- Manual review where required

AI-assisted verification is designed to support the verification process rather than guarantee perfect accuracy.

### 📊 Impact Calculation

Verified activities are converted into measurable environmental impact using documented calculation methods and environmental/emission factors.

The calculation engine is handled by the backend rather than relying on AI to invent numerical values.

### 🤖 AI Climate Assistant

The AI assistant can help users with:

- Climate actions
- Environmental impact
- Personalized recommendations
- Challenges
- Community information
- Climate-related questions
- Action verification guidance

### 🏆 Challenges & Goals

Users can participate in climate challenges such as:

- Sustainable Transportation
- Cycling
- Public Transport
- Plastic Reduction
- Waste Reduction
- Energy Conservation
- Water Conservation
- Tree Planting
- Community Cleanup

### 👥 Community Impact

Individual verified activities contribute to community-level insights.

Communities can view:

- Participation
- Verified actions
- Environmental impact
- Challenge progress
- Community activities
- Leaderboards
- Improvement opportunities

### 📍 Local Climate Activities

Users can discover activities such as:

- Community cleanups
- Tree planting
- E-waste collection
- Water-body cleanup
- Recycling activities
- Environmental awareness programs
- Green campaigns

### 🌎 Global Impact

The platform aggregates verified climate actions to provide an overview of collective environmental participation.

Impact areas include:

- Waste reduction
- Sustainable transportation
- Energy conservation
- Water conservation
- Tree and green activities
- Community cleanups
- Sustainable consumption

---

## 🧠 AI Integration

AI is used as an intelligence layer across the platform.

### AI Use Cases

- Personalized climate recommendations
- Evidence analysis
- Action classification
- Verification assistance
- Community intelligence
- Challenge recommendations
- Impact explanations
- Climate assistance

### AI Principle

The platform separates **intelligence from critical calculations**.

> **Database stores the data.  
> FastAPI enforces application rules.  
> Deterministic calculations measure impact.  
> AI provides intelligence and recommendations.**

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │       User          │
                    │  Web Browser        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ React + TypeScript  │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │       FastAPI       │
                    │       Backend       │
                    └──────┬──────┬───────┘
                           │      │
                           │      ▼
                           │  ┌─────────────┐
                           │  │     AI      │
                           │  │   Service   │
                           │  └─────────────┘
                           │
                           ▼
                    ┌─────────────────────┐
                    │       MySQL         │
                    │      Database       │
                    └─────────────────────┘
