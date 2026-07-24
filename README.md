<div align="center">

# ArthSetu AI

### Explainable financial readiness. Actionable progress. Responsible AI.

ArthSetu AI turns self-reported financial behaviour into an explainable **SetuScore**, practical improvement actions, and a capacity-aware educational investment path.

[![Live Demo](https://img.shields.io/badge/Live_Demo-arthsetu--ai.vercel.app-111827?style=for-the-badge&logo=vercel)](https://arthsetu-ai.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-000000?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-20232A?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-ML_API-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Neon](https://img.shields.io/badge/Neon-PostgreSQL_%2B_Auth-00E599?style=flat-square&logo=postgresql&logoColor=111827)](https://neon.tech/)
[![Status](https://img.shields.io/badge/Status-Hackathon_MVP-F97316?style=flat-square)](#mvp-scope)

**Live application:** https://arthsetu-ai.vercel.app  
**Repository:** https://github.com/18-monarch/arthsetu-ai

</div>

---

## Overview

Many people manage money responsibly but have little formal credit history or limited access to clear financial guidance. Existing scores often show a number without explaining what affected it or how the person can improve.

**ArthSetu AI addresses this gap through an educational financial-readiness experience.**

A user answers a consent-first questionnaire, receives an ML-generated SetuScore, understands the strongest reasons behind it, explores possible improvements, and receives a risk-capacity-aware educational investment plan.

> ArthSetu does not merely tell someone where they stand—it shows them how to move forward.

---

## Why ArthSetu is different

ArthSetu is not another expense tracker or black-box score generator.

| Traditional experience | ArthSetu AI |
|---|---|
| Shows only a score | Shows the score and the reasons behind it |
| Gives generic advice | Generates measurable improvement actions |
| Treats willingness to take risk as capacity | Checks both risk appetite and actual financial capacity |
| Uses one shared demo profile | Stores and restores data separately for each authenticated user |
| Hides model limitations | Publishes metrics, features, assumptions and responsible-use boundaries |
| Requires a long judge walkthrough | Includes an instant three-profile Judge Demo |

---

## Product flow

```text
Create account or enter demo mode
              ↓
Consent-first financial questionnaire
              ↓
Answers mapped into 13 model features
              ↓
FastAPI + scikit-learn scoring engine
              ↓
SetuScore + risk bucket + confidence
              ↓
Top drivers + improvement actions
              ↓
Risk appetite and financial-capacity assessment
              ↓
Educational investment plan and projections
              ↓
Account-specific history stored in Neon
```

### Account-specific onboarding

Authenticated data is isolated using the Neon Auth user ID.

```text
New account
→ blank questionnaire
→ user's own answers
→ user's own result saved in Neon

Returning account
→ only that account's saved state is restored

Different account on the same browser
→ cannot inherit another user's answers or score
```

Demo mode remains available and uses browser-only synthetic state.

---

## Core features

### 1. Consent-first questionnaire

A guided, six-phase questionnaire captures understandable indicators such as:

- Monthly income and expenses
- Savings behaviour
- Bill-payment consistency
- Emergency-fund availability
- UPI, wallet, recharge and e-commerce activity
- Income stability
- Investment experience
- Loss reaction and time horizon

ArthSetu does **not** ask for:

- Bank passwords
- UPI PINs
- Aadhaar credentials
- Raw bank statements
- Brokerage credentials

### 2. Explainable SetuScore

The scoring engine returns:

- SetuScore in the **300–900** range
- Low, Medium or High risk bucket
- Confidence indicator
- Top factors supporting or limiting the score
- Personal improvement actions

### 3. Improvement Lab

Users can change selected financial habits and run a live re-score.

Examples:

- Increase the savings ratio
- Reduce the expense ratio
- Reduce late bill payments
- Compare the projected score with the current score

This turns scoring into an improvement experience rather than a judgement.

### 4. Personalised 30-day plan

The application converts weak indicators into simple weekly missions with measurable targets.

### 5. Capacity-aware investment education

ArthSetu evaluates both:

- **Risk appetite:** loss reaction, experience and time horizon
- **Financial capacity:** surplus, emergency fund, income stability and liquidity needs

The safer result determines an educational plan:

- Conservative
- Balanced
- Growth

The projections are mathematical illustrations—not guaranteed returns or regulated recommendations.

### 6. Judge Demo

`/judge-demo` compares three ready-made financial journeys:

- Financially strong
- Developing
- Financially stressed

Judges can instantly compare score, drivers, actions and investment capacity without completing the full questionnaire.

### 7. Model Transparency

`/model-transparency` presents:

- Model type
- Dataset size and synthetic-data disclosure
- Input features
- Evaluation metrics
- Feature importance
- Current limitations
- Responsible-use boundaries

### 8. End-to-end system health

`/api/health` verifies:

- Next.js application
- Neon Auth configuration
- Neon PostgreSQL connectivity
- ML service connectivity

---

## What the machine learning does

ArthSetu uses machine learning only where prediction and comparison add value.

### ML responsibilities

1. **Predict the SetuScore**
   - Receives 13 engineered financial-behaviour features
   - Produces a score between 300 and 900

2. **Identify important score drivers**
   - Combines feature importance with the user's distance from training baselines
   - Returns the most meaningful positive and negative factors

3. **Simulate possible improvements**
   - Changes one weak feature toward a healthier target
   - Runs the model again
   - Shows the possible score difference

### Rule-based and mathematical responsibilities

| Function | Method |
|---|---|
| Questionnaire answer mapping | Transparent rules |
| Financial-capacity assessment | Transparent rules |
| Risk appetite assessment | Transparent rules |
| Conservative/Balanced/Growth plan | Safety-oriented rules |
| Contribution and growth projections | Mathematical calculation |
| Authentication and persistence | Neon Auth + PostgreSQL |

This separation keeps the product understandable and avoids using AI where clear rules are safer.

---

## Model card

| Item | Value |
|---|---|
| Model | StandardScaler + GradientBoostingRegressor |
| Target | SetuScore, 300–900 |
| Training data | 10,000 synthetic financial profiles |
| Input features | 13 |
| Regression MAE | 6.58 |
| Regression R² | 0.9649 |
| Risk-bucket validation accuracy | 93.15% |
| Current purpose | Educational hackathon prototype |

### Model features

```text
payment_consistency
savings_ratio
expense_ratio
late_bill_count
recharge_frequency
upi_transactions
wallet_transactions
ecommerce_orders
digital_activity_score
financial_discipline
monthly_income
age
average_recharge_amount
```

### Most influential features in the current model

| Feature | Importance |
|---|---:|
| Financial discipline | 59.78% |
| Late bill count | 24.18% |
| Savings ratio | 8.34% |
| Digital activity score | 3.24% |
| Payment consistency | 1.29% |

All metrics are based on the bundled **synthetic validation dataset**. They do not prove readiness for real lending decisions.

---

## Architecture

```text
┌──────────────────────────────────────────────────────────┐
│                    Browser / User                        │
└──────────────────────────┬───────────────────────────────┘
                           │ HTTPS
                           ▼
┌──────────────────────────────────────────────────────────┐
│             Next.js 16 application on Vercel            │
│                                                          │
│  UI • App Router • Route Handlers • Server-side BFF      │
│  Questionnaire • Dashboard • Improve • Invest • History  │
└───────────────┬──────────────────────────┬───────────────┘
                │                          │
                │ authenticated queries    │ server-to-server
                ▼                          ▼
┌─────────────────────────────┐   ┌─────────────────────────┐
│ Neon                        │   │ FastAPI ML service      │
│                             │   │                         │
│ Auth                        │   │ scikit-learn model      │
│ PostgreSQL                  │   │ explainability          │
│ assessment_runs             │   │ risk profiling          │
│ consent_events              │   │ scenario generation     │
└─────────────────────────────┘   └─────────────────────────┘
```

The browser communicates with the Next.js application. Database credentials and the ML API key remain server-side.

---

## Technology stack

### Frontend and product layer

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- GSAP
- Lenis
- Lucide React
- Zod

### Backend and data

- Next.js Route Handlers
- Neon Auth
- Neon PostgreSQL
- Drizzle ORM

### Machine learning

- Python
- FastAPI
- scikit-learn
- pandas
- NumPy
- Joblib
- Pydantic
- Pytest

### Deployment

- Vercel — Next.js web application
- Separate FastAPI deployment — ML scoring service
- Neon — authentication and PostgreSQL

---

## Project structure

```text
arthsetu-ai/
├── app/                         # Next.js pages and Route Handlers
│   ├── app/                     # Authenticated product workspace
│   ├── api/                     # Web BFF, auth, health and persistence
│   ├── judge-demo/              # Ready-made judge demonstration
│   ├── model-transparency/      # Public model card
│   └── questionnaire/           # Consent-first onboarding
├── components/
│   ├── app/                     # Dashboard, assessment, improve, history
│   ├── auth/                    # Login and signup
│   ├── judge-demo/              # Judge comparison experience
│   ├── landing/                 # Public landing page
│   ├── questionnaire/           # Questionnaire experience
│   ├── system/                  # Live health proof
│   └── ui/                      # Shared interface components
├── lib/
│   ├── auth/                    # Neon Auth clients
│   ├── db/                      # Drizzle schema and database client
│   ├── demo-engine.ts           # Safe fallback and demo behaviour
│   ├── improvement-plan.ts      # Personal action-plan logic
│   ├── ml-client.ts             # Server-side ML API client
│   ├── questionnaire-map.ts     # Answer-to-feature mapping
│   └── questionnaire-store.ts   # Account-scoped browser state
├── ml-service/                  # FastAPI and trained ML artifacts
├── arthsetudataset/             # Synthetic dataset and training scripts
├── database/NEON_SETUP.sql      # PostgreSQL setup
├── docs/                        # Architecture, deployment and validation
├── .env.example                 # Environment-variable template
└── package.json
```

---

## Local development

### Prerequisites

- Node.js 24
- npm
- Python 3.11 or 3.12
- Git
- Neon project for authenticated persistence  
  The application can also run in demo mode without Neon.

### Fast Windows setup

Clone the repository:

```powershell
git clone https://github.com/18-monarch/arthsetu-ai.git
cd arthsetu-ai
```

Run the full launcher:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\run-local.ps1
```

The launcher:

- Creates `.env.local` when missing
- Installs npm packages
- Creates the Python virtual environment
- Installs ML dependencies
- Starts the FastAPI service
- Starts Next.js
- Opens the application

### Manual setup

Install the web dependencies:

```powershell
npm install
Copy-Item .env.example .env.local
```

Create and start the ML environment:

```powershell
cd ml-service
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
$env:ML_SERVICE_API_KEY="local-development-key"
$env:ALLOWED_ORIGINS="http://localhost:3000,http://127.0.0.1:3000"
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

In a second terminal:

```powershell
cd arthsetu-ai
npm run dev
```

Open:

```text
Website:       http://localhost:3000
Questionnaire: http://localhost:3000/questionnaire
Dashboard:     http://localhost:3000/app/dashboard
Judge Demo:    http://localhost:3000/judge-demo
Model Card:    http://localhost:3000/model-transparency
ML Docs:       http://127.0.0.1:8000/api/docs
```

---

## Environment variables

Create `.env.local` from `.env.example`.

```env
# Neon PostgreSQL pooled connection string
DATABASE_URL=

# Neon Auth URL
NEON_AUTH_BASE_URL=

# Stable secret with at least 32 characters
NEON_AUTH_COOKIE_SECRET=

# Base URL of the FastAPI service; do not include /api/v1
ML_SERVICE_URL=http://127.0.0.1:8000

# Same server-side secret configured on the ML service
ML_SERVICE_API_KEY=local-development-key

# Keep true for reliable demo fallback after live ML is verified
ALLOW_DEMO_FALLBACK=true

# Public web origin
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Security rules

- Never prefix the database URL or ML API key with `NEXT_PUBLIC_`.
- Never commit `.env.local`.
- Use a fresh production ML key.
- Keep the same ML key in the web deployment and the ML deployment.
- Add the production Vercel origin to Neon Auth's allowed domains.

---

## Neon setup

1. Create a Neon project.
2. Enable Neon Auth.
3. Open the Neon SQL Editor.
4. Run:

```text
database/NEON_SETUP.sql
```

This creates:

- `assessment_runs`
- `consent_events`

Authentication tables remain managed by Neon Auth.

Authenticated assessment records use the Neon user ID, so each account can retrieve only its own application state through the server.

Useful Drizzle commands:

```powershell
npm run db:push
npm run db:generate
npm run db:migrate
npm run db:studio
```

---

## Deployment

### 1. Deploy the ML service

Deploy the FastAPI service separately and configure:

```env
ML_SERVICE_API_KEY=<strong-random-secret>
ALLOWED_ORIGINS=https://arthsetu-ai.vercel.app
```

Verify:

```text
GET /api/v1/health
GET /api/docs
```

### 2. Deploy the web application on Vercel

Import the GitHub repository and configure:

```env
DATABASE_URL=<neon-pooled-connection-string>
NEON_AUTH_BASE_URL=<neon-auth-url>
NEON_AUTH_COOKIE_SECRET=<stable-32+-character-secret>
ML_SERVICE_URL=https://<your-ml-service-domain>
ML_SERVICE_API_KEY=<same-secret-as-ml-service>
ALLOW_DEMO_FALLBACK=true
NEXT_PUBLIC_SITE_URL=https://arthsetu-ai.vercel.app
```

Do not add `/api/v1` to `ML_SERVICE_URL`.

### 3. Configure Neon Auth

Add the production origin:

```text
https://arthsetu-ai.vercel.app
```

### 4. Verify production

Open:

```text
https://arthsetu-ai.vercel.app/api/health
```

Expected services:

```text
web: Next.js App Router
auth: Neon Auth configured
database: connected
ml: connected
```

---

## Important routes

### Public routes

| Route | Purpose |
|---|---|
| `/` | Product landing page |
| `/signup` | Create an account |
| `/login` | Sign in |
| `/questionnaire` | Consent and financial onboarding |
| `/judge-demo` | Instant three-profile comparison |
| `/model-transparency` | Metrics, features and limitations |

### Product routes

| Route | Purpose |
|---|---|
| `/app/dashboard` | SetuScore overview and important actions |
| `/app/assessment` | Full financial and investment assessment |
| `/app/improve` | Interactive ML improvement simulator |
| `/app/invest` | Educational allocation and projections |
| `/app/history` | Account-specific assessment history |
| `/app/profile` | Profile and consent information |

### Web API routes

| Route | Method | Purpose |
|---|---|---|
| `/api/health` | GET | Web, database and ML status |
| `/api/account-state` | GET | Restore the authenticated user's saved state |
| `/api/submit-questionnaire` | POST | Validate, score and persist questionnaire data |
| `/api/history` | GET / DELETE | Read or delete account history |
| `/api/score` | POST | Server-side scoring proxy |
| `/api/risk-profile` | POST | Risk-profile proxy |
| `/api/full-assessment` | POST | Combined assessment proxy |
| `/api/model-card` | GET | Model metadata |
| `/api/demo-session` | GET / DELETE | Demo-session management |

### ML API routes

| Route | Method | Purpose |
|---|---|---|
| `/` | GET | Service information |
| `/api/v1/health` | GET | Model-service health |
| `/api/v1/model-card` | GET | Model metadata |
| `/api/v1/profiles` | GET | Synthetic demo profiles |
| `/api/v1/score` | POST | Score a feature set |
| `/api/v1/risk-profile` | POST | Generate a risk profile |
| `/api/v1/full-assessment` | POST | Score, explain and create a plan |
| `/api/docs` | GET | Interactive FastAPI documentation |

Protected ML POST endpoints require the `X-API-Key` header when `ML_SERVICE_API_KEY` is configured.

---

## Validation and testing

### Web application

```powershell
npm run typecheck
npm run lint
npm run build
```

### ML service

```powershell
cd ml-service
.\.venv\Scripts\Activate.ps1
pytest
```

### Essential end-to-end test

```text
1. Create Account A.
2. Complete the questionnaire.
3. Confirm the SetuScore and explanation.
4. Open the Improvement Lab and run a re-score.
5. Confirm the assessment appears in history.
6. Sign out.
7. Create Account B on the same browser.
8. Confirm Account B receives a blank questionnaire.
9. Sign back into Account A.
10. Confirm only Account A's saved state is restored.
```

---

## Three-minute demo path

1. Open `/judge-demo` and compare the three profiles.
2. Open `/model-transparency` and explain the real model metrics and limitations.
3. Create a new account.
4. Complete the questionnaire.
5. Show the score, top drivers and improvement missions.
6. Open `/app/improve` and demonstrate a live score simulation.
7. Show account-specific history and the Neon record.
8. Finish with the responsible-use boundary.

---

## MVP scope

The current MVP proves this idea:

> Self-reported and alternative financial-behaviour indicators can be converted into an understandable financial-readiness score, explanation and improvement path.

### Included

- Authentication and account-specific onboarding
- Consent-first questionnaire
- ML-generated SetuScore
- Risk bucket and confidence
- Explainable drivers
- Improvement simulation
- Personal 30-day plan
- Capacity-aware investment education
- Scenario projections
- Neon account history
- Judge Demo
- Model Transparency
- Live health proof
- Demo fallback

### Future scope

- Consented Account Aggregator integration
- Real-data validation with regulated partners
- Fairness and bias evaluation across larger populations
- Model monitoring and drift detection
- Institutional or financial-counsellor review
- Multilingual financial education
- Stronger deletion, export and consent-management workflows

---

## Responsible-use boundary

ArthSetu AI is an **educational hackathon prototype**.

- SetuScore is **not** an official credit-bureau score.
- ArthSetu does **not** approve or reject loans.
- SetuInvest is **not** regulated financial advice.
- Projections are examples, not guaranteed returns.
- The training dataset is synthetic.
- The current model has not been validated for real lending decisions.
- Protected or highly sensitive credentials are not required for the MVP.

Real-world use would require consented real data, regulatory review, fairness testing, security audits and institutional validation.

---

## Documentation

Additional technical documentation is available in:

```text
docs/ARCHITECTURE.md
docs/DEPLOYMENT.md
docs/ML_EXPLAINABILITY.md
docs/NEON_SETUP.md
docs/PROJECT_MAP.md
docs/TECH_STACK.md
docs/VALIDATION.md
docs/DEMO_SCRIPT.md
```

---

<div align="center">

### ArthSetu AI

**From financial behaviour to explainable progress.**

Built as a responsible, transparent and demo-ready financial-readiness MVP.

</div>
