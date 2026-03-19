import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

# ─────────────────────────────────────────────
# FALLBACK DATA  (used when Gemini is unavailable)
# ─────────────────────────────────────────────

SKILL_STEPS = {
    "docker":        ["Learn what containers are and why they exist",
                      "Install Docker and run your first container",
                      "Write a Dockerfile for a simple app",
                      "Use docker-compose for multi-container setups"],
    "kubernetes":    ["Understand pods, deployments, and services",
                      "Set up a local cluster with minikube",
                      "Deploy a containerised app to Kubernetes",
                      "Learn about ConfigMaps, Secrets, and ingress"],
    "python":        ["Cover variables, loops, and functions",
                      "Learn list comprehensions and error handling",
                      "Work with popular libraries: requests, pandas",
                      "Build a small CLI or web project"],
    "sql":           ["Understand tables, rows, and basic SELECT queries",
                      "Practice JOINs, GROUP BY, and subqueries",
                      "Learn indexing and query optimisation",
                      "Try a real dataset on SQLite or PostgreSQL"],
    "react":         ["Learn JSX and functional components",
                      "Master useState and useEffect hooks",
                      "Manage state with Context or Redux",
                      "Build and deploy a small React app"],
    "aws":           ["Get an AWS free-tier account and explore the console",
                      "Learn EC2, S3, and IAM basics",
                      "Deploy a simple app on Elastic Beanstalk",
                      "Study for the AWS Cloud Practitioner exam"],
    "terraform":     ["Understand Infrastructure-as-Code concepts",
                      "Install Terraform and write your first .tf file",
                      "Manage AWS resources with Terraform",
                      "Learn about state files and remote backends"],
    "ci/cd":         ["Learn what CI/CD is and why it matters",
                      "Set up a GitHub Actions workflow",
                      "Add automated tests to your pipeline",
                      "Deploy automatically on merge to main"],
    "linux":         ["Get comfortable with the terminal and basic commands",
                      "Learn file permissions, processes, and cron jobs",
                      "Practice shell scripting (bash)",
                      "Set up a small server on a VPS"],
    "machine learning": ["Review statistics and linear algebra basics",
                         "Learn scikit-learn: regression, classification, clustering",
                         "Understand model evaluation and overfitting",
                         "Complete a Kaggle beginner competition"],
    "typescript":    ["Understand how TypeScript extends JavaScript",
                      "Add types to an existing JS project",
                      "Learn interfaces, generics, and enums",
                      "Integrate TypeScript into a React app"],
}

SKILL_QUESTIONS = {
    "docker":        ["What is the difference between an image and a container?",
                      "How does COPY differ from ADD in a Dockerfile?",
                      "When would you use docker-compose over plain docker run?"],
    "kubernetes":    ["What is a Pod, and how does it differ from a container?",
                      "Explain the role of a Service in Kubernetes.",
                      "How do liveness and readiness probes work?"],
    "python":        ["What is the difference between a list and a tuple?",
                      "Explain how Python's GIL affects multi-threading.",
                      "What are decorators and when would you use one?"],
    "sql":           ["Explain the difference between INNER JOIN and LEFT JOIN.",
                      "When would you use an index, and what are its trade-offs?",
                      "What is the difference between WHERE and HAVING?"],
    "react":         ["What problem does the virtual DOM solve?",
                      "When would you use useCallback vs useMemo?",
                      "How do you prevent unnecessary re-renders?"],
    "aws":           ["What is the difference between S3 and EBS?",
                      "How does IAM control access to AWS resources?",
                      "When would you choose Lambda over EC2?"],
    "terraform":     ["What is a Terraform state file and why is it important?",
                      "How do terraform plan and terraform apply differ?",
                      "What are Terraform modules and why use them?"],
    "ci/cd":         ["What is the difference between continuous delivery and deployment?",
                      "How do you handle secrets securely in a CI pipeline?",
                      "Describe a deployment strategy that minimises downtime."],
    "linux":         ["How do file permissions work in Linux (chmod)?",
                      "What is the difference between a process and a thread?",
                      "How would you troubleshoot high CPU usage on a server?"],
    "machine learning": ["What is the bias-variance trade-off?",
                          "How do you handle class imbalance in a dataset?",
                          "What is cross-validation and why is it used?"],
    "typescript":    ["How do TypeScript interfaces differ from type aliases?",
                      "What are generics and when would you use them?",
                      "How does TypeScript handle null and undefined safely?"],
}

GENERIC_STEPS = [
    "Search for beginner tutorials on YouTube or freeCodeCamp",
    "Read the official documentation and follow the quickstart guide",
    "Build a small hands-on project to apply what you learned",
    "Review common interview questions for this skill",
]

GENERIC_QUESTIONS = [
    "How would you explain this technology to a non-technical teammate?",
    "Describe a project where you applied or would apply this skill.",
    "What resources do you use to stay up to date in this area?",
]


def _configure_gemini():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise Exception("GEMINI_API_KEY not set")
    genai.configure(api_key=api_key)
    return genai.GenerativeModel("gemini-3.1-flash-lite-preview")


def _extract_json(text: str) -> dict:
    start = text.find("{")
    end = text.rfind("}") + 1
    return json.loads(text[start:end])


# ─────────────────────────────────────────────
# 1. ROADMAP GENERATOR
# ─────────────────────────────────────────────

def generate_roadmap(missing_skills: list, role: str = "") -> dict:
    try:
        model = _configure_gemini()

        prompt = f"""
You are a career coach. A user wants to become a {role or 'software professional'}.
They are missing these skills: {missing_skills}.

Return ONLY valid JSON in this exact format (no markdown, no extra text):
{{
  "steps": ["step1", "step2", "step3", "step4", "step5"]
}}

Each step should be a concrete, actionable learning task (max 15 words each).
"""
        response = model.generate_content(prompt)
        print("RAW ROADMAP RESPONSE:", response.text)
        parsed = _extract_json(response.text)

        return {"steps": parsed["steps"], "source": "AI (Gemini)"}

    except Exception as e:
        print("ROADMAP FALLBACK TRIGGERED:", e)
        return _fallback_roadmap(missing_skills)


def _fallback_roadmap(missing_skills: list) -> dict:
    steps = []
    for skill in missing_skills:
        skill_steps = SKILL_STEPS.get(skill.lower())
        if skill_steps:
            # Take first 2 steps per skill to keep the list manageable
            steps.extend([f"[{skill.title()}] {s}" for s in skill_steps[:2]])
        else:
            steps.extend([f"[{skill.title()}] {s}" for s in GENERIC_STEPS[:2]])

    # Cap at 8 steps so it stays readable
    return {"steps": steps[:8], "source": "fallback"}


# ─────────────────────────────────────────────
# 2. MOCK INTERVIEW GENERATOR
# ─────────────────────────────────────────────

def generate_interview_questions(missing_skills: list, role: str = "") -> dict:
    try:
        model = _configure_gemini()

        prompt = f"""
You are a senior technical interviewer. A candidate is preparing for a {role or 'software'} role.
They need to strengthen these skills: {missing_skills}.

Generate 5 technical interview questions that specifically test these skills.
Return ONLY valid JSON in this exact format (no markdown, no extra text):
{{
  "questions": [
    "question 1",
    "question 2",
    "question 3",
    "question 4",
    "question 5"
  ]
}}
"""
        response = model.generate_content(prompt)
        print("RAW INTERVIEW RESPONSE:", response.text)
        parsed = _extract_json(response.text)

        return {
            "questions": parsed["questions"],
            "role": role,
            "based_on_skills": missing_skills,
            "source": "AI (Gemini)"
        }

    except Exception as e:
        print("INTERVIEW FALLBACK TRIGGERED:", e)
        return _fallback_questions(missing_skills, role)


def _fallback_questions(missing_skills: list, role: str = "") -> dict:
    questions = []
    for skill in missing_skills:
        qs = SKILL_QUESTIONS.get(skill.lower(), GENERIC_QUESTIONS)
        questions.extend(qs[:2])  # 2 questions per skill max

    # Always include one general question
    questions.append(f"Walk me through how you would approach learning {missing_skills[0] if missing_skills else 'a new technology'} from scratch.")

    return {
        "questions": questions[:6],  # cap at 6
        "role": role,
        "based_on_skills": missing_skills,
        "source": "fallback"
    }