import json

def load_jobs():
    with open("jobs.json", "r") as f:
        return json.load(f)

def load_users():
    with open("user.json", "r") as f:
        return json.load(f)

def get_missing_skills(user_skills: list, job_skills: list) -> list:
    """Return skills in job_skills that are missing from user_skills.
    Case-insensitive comparison."""
    user_lower = {s.lower() for s in user_skills}
    return [s for s in job_skills if s.lower() not in user_lower]

def find_role_gap(role_name: str, user_id: str) -> dict:
    jobs  = load_jobs()
    users = load_users()

    user = next((u for u in users if u["user_id"] == user_id), None)
    if not user:
        return {"error": f"User '{user_id}' not found"}

    for job in jobs:
        if job["role"].lower() == role_name.lower():
            missing = get_missing_skills(user["skills"], job["skills"])
            return {
                "role": job["role"],
                "your_skills": user["skills"],
                "missing_skills": missing
            }

    return {"error": f"Role '{role_name}' not found"}