from utils import get_missing_skills

# UNIT TESTS — get_missing_skills()

def test_happy_path():
    """User has some skills — missing ones should be returned."""
    user = ["Python"]
    job  = ["Python", "Docker"]

    result = get_missing_skills(user, job)

    assert "Docker" in result
    assert "Python" not in result        

def test_edge_case_no_missing():
    """User has ALL required skills — should return empty list."""
    user = ["Python", "Docker"]
    job  = ["Python", "Docker"]

    result = get_missing_skills(user, job)

    assert result == []

def test_edge_case_case_insensitive():
    """Skill matching must be case-insensitive (e.g. 'docker' == 'Docker')."""
    user = ["python", "docker"]         
    job  = ["Python", "Docker", "AWS"]  

    result = get_missing_skills(user, job)

    assert "AWS" in result
    assert "Python" not in result       
    assert "Docker" not in result       

def test_edge_case_empty_user_skills():
    """User has no skills at all — all job skills are missing."""
    user = []
    job  = ["Docker", "Kubernetes"]

    result = get_missing_skills(user, job)

    assert "Docker" in result
    assert "Kubernetes" in result
    assert len(result) == 2

def test_edge_case_empty_job_skills():
    """Job requires no skills — nothing should be missing."""
    user = ["Python", "Docker"]
    job  = []

    result = get_missing_skills(user, job)

    assert result == []