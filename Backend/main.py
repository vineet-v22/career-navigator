from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json

from utils import find_role_gap, load_jobs
from ai_helper import generate_roadmap, generate_interview_questions

app = FastAPI()

# ─────────────────────────────────────────────
# CORS
# ─────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



def load_users() -> list:
    try:
        with open("user.json", "r") as f:
            return json.load(f)
    except Exception:
        return []


def save_users(users: list):
    with open("user.json", "w") as f:
        json.dump(users, f, indent=2)


def get_user(user_id: str) -> dict | None:
    """Return the user dict or None if not found."""
    users = load_users()
    return next((u for u in users if u["user_id"] == user_id), None)


def get_job(role: str) -> dict | None:
    """Return the job dict (case-insensitive match) or None."""
    jobs = load_jobs()
    return next((j for j in jobs if j["role"].lower() == role.lower()), None)


# ROUTES

@app.get("/")
def home():
    return {"message": "Career Navigator API is running 🚀"}


#1. Analyze skill gap 
@app.get("/analyze/{user_id}/{role}")
def analyze_role(user_id: str, role: str):
    result = find_role_gap(role, user_id)

    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])

    if not result["missing_skills"]:
        roadmap_data = {
            "steps": ["🎉 You already have all required skills for this role!"],
            "source": "system"
        }
    else:
        roadmap_data = generate_roadmap(result["missing_skills"], role)

    # match score: how many required skills the user already has
    job = get_job(role)
    required = job["skills"] if job else []
    user_skills_lower = [s.lower() for s in result["your_skills"]]
    matched = [s for s in required if s.lower() in user_skills_lower]
    match_pct = round(len(matched) / len(required) * 100) if required else 0

    return {
        "role": result["role"],
        "your_skills": result["your_skills"],
        "missing_skills": result["missing_skills"],
        "match_score": match_pct,         
        "roadmap": roadmap_data["steps"],
        "generated_by": roadmap_data["source"]
    }


#2. List / search roles
@app.get("/roles")
def get_roles(search: str = ""):
    jobs = load_jobs()
    if search:
        jobs = [j for j in jobs if search.lower() in j["role"].lower()]
    return {"roles": [job["role"] for job in jobs]}


@app.get("/search")
def search_role(query: str = ""):
    if not query.strip():
        raise HTTPException(status_code=400, detail="Query parameter is required")
    jobs = load_jobs()
    filtered = [j for j in jobs if query.lower() in j["role"].lower()]
    return {"results": filtered}


# ── 4. Add / update user skills
@app.post("/update-skills/{user_id}")
def update_skills(user_id: str, new_skills: list = Body(...)):
    if not user_id.strip():
        raise HTTPException(status_code=400, detail="User ID cannot be empty")

    cleaned = [s.strip() for s in new_skills if s.strip()]
    if not cleaned:
        raise HTTPException(status_code=400, detail="Provide at least one valid skill")

    users = load_users()
    user = next((u for u in users if u["user_id"] == user_id), None)

    if not user:

        user = {"user_id": user_id, "skills": []}
        users.append(user)

    merged = {s.lower(): s for s in user["skills"]}
    for s in cleaned:
        merged[s.lower()] = s         
    user["skills"] = list(merged.values())

    save_users(users)
    return {"user_id": user_id, "skills": user["skills"]}


#5. Mock interview questions
@app.get("/mock-interview/{user_id}/{role}")
def mock_interview(user_id: str, role: str):
    user = get_user(user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail=f"User '{user_id}' not found. Add skills first via /update-skills."
        )

    job = get_job(role)
    if not job:
        raise HTTPException(
            status_code=404,
            detail=f"Role '{role}' not found. Check /roles for available options."
        )

    user_skills_lower = [s.lower() for s in user["skills"]]
    missing = [s for s in job["skills"] if s.lower() not in user_skills_lower]


    target_skills = missing if missing else job["skills"]

    result = generate_interview_questions(target_skills, role)
    return result


# 6. Get user profile
@app.get("/user/{user_id}")
def get_user_profile(user_id: str):
    user = get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail=f"User '{user_id}' not found")
    return user