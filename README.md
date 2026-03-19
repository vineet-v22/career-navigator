# Career Navigator — Skill-Bridge Career Platform

> A Palo Alto Networks New Grad SWE Take-Home Case Study submission

---

## Demo video link
[Demo Video Link](https://youtu.be/MyA5HzolSaM)

## Candidate Name
Vineet Verma

## Scenario Chosen
**Scenario 2 — Skill-Bridge Career Navigator**

## Estimated Time Spent
5–6 hours

---

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+ (for frontend)
- A Gemini API key ([get one free](https://aistudio.google.com/app/apikey))

### Setup

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd career-navigator

# 2. Backend setup
cd backend
pip install fastapi uvicorn google-generativeai python-dotenv

# 3. Create your .env file
cp .env.example .env
# Then open .env and add your Gemini API key

# 4. Run the backend
uvicorn main:app --reload
# API runs at http://127.0.0.1:8000

# 5. Frontend setup (new terminal)
cd frontend
npm install
npm run dev
# App runs at http://localhost:5173
```

### Test Commands

```bash
cd backend
pip install pytest
pytest test_app.py -v
```

---

## Features

- **Gap Analysis** — Compares user skills against job requirements and identifies missing skills
- **AI Roadmap Generation** — Gemini generates a personalised step-by-step learning roadmap
- **Mock Interview Questions** — AI generates technical interview questions based on missing skills
- **Skill Match Score** — Visual percentage showing how ready the user is for a role
- **Role Search & Filter** — Search available roles by name
- **Add Skills to Profile** — Users can update their skill profile at any time
- **AI Fallback** — All AI features fall back to a rule-based system if Gemini is unavailable

---

## Project Structure

```
career-navigator/
├── backend/
│   ├── main.py            # FastAPI routes
│   ├── utils.py           # Skill gap logic
│   ├── ai_helper.py       # Gemini integration + fallback
│   ├── test_app.py        # Unit tests
│   ├── jobs.json          # Synthetic job data
│   ├── user.json          # Synthetic user profiles
│   ├── .env.example       # Environment variable template
│   └── .env               # Your API key (DO NOT COMMIT)
└── frontend/
    └── src/
        └── App.jsx        # React frontend
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analyze/{user_id}/{role}` | Gap analysis + roadmap |
| GET | `/mock-interview/{user_id}/{role}` | Interview questions |
| GET | `/roles?search=` | List/search available roles |
| POST | `/update-skills/{user_id}` | Add skills to user profile |
| GET | `/user/{user_id}` | Get user profile |

---

## AI Disclosure

**Did you use an AI assistant (Copilot, ChatGPT, etc.)?**
Yes — AI Tools were used during development.

**How did you verify the suggestions?**
Every code suggestion was reviewed manually before use. I tested each endpoint with real requests via the browser and checked edge cases (empty users, missing roles, case mismatches) to confirm behaviour was correct. AI-generated test cases were cross-checked against the actual function logic in `utils.py`.

**Give one example of a suggestion you rejected or changed:**
The AI initially suggested using `set(job_skills) - set(user_skills)` for gap calculation. I changed this to a case-insensitive list comprehension because the set subtraction would incorrectly flag `"docker"` and `"Docker"` as different skills, producing false positives in the gap analysis.

---

## Tradeoffs & Prioritization

**What did you cut to stay within the 4–6 hour limit?**
- User authentication / login system — all users are identified by a plain user ID
- Resume PDF upload and parsing — skills must be entered manually
- Cloud deployment — the app runs locally only (no Vercel/Railway setup)

**What would you build next if you had more time?**
- Resume PDF parser using Gemini's document understanding to auto-extract skills
- Progress tracker so users can mark roadmap steps as complete
- Expanded `jobs.json` with 20+ roles and required skills pulled from real job postings
- A `/compare` endpoint to rank which role the user is closest to qualifying for
- Cloud deployment with a persistent database (PostgreSQL) replacing the JSON files

**Known limitations:**
- User data is stored in a flat JSON file; concurrent writes could cause data loss
- Gemini API has rate limits; heavy usage may trigger the fallback more than expected
- No authentication — any client can read or modify any user's profile by guessing their user ID
- Roadmap quality depends on Gemini's response; the rule-based fallback is intentionally simple

---

## Synthetic Data

Sample data files are included in the repo:

- `backend/jobs.json` — 3 job roles with required skill lists
- `backend/user.json` — 2 synthetic user profiles with skills

No real personal data is used anywhere in the project.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your key:

```
GEMINI_API_KEY=your_key_here
```

**Never commit your `.env` file.** It is listed in `.gitignore`.
