from datetime import datetime, timezone
from pathlib import Path
import os
from typing import Optional, List, Dict, Any
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey, Boolean, select
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

from app.sandbox import (
    execute_python_code,
    evaluate_challenge,
    generate_ai_mentor_response,
    CHALLENGES
)

load_dotenv()
BASE_DIR = Path(__file__).resolve().parents[1]
raw_db = os.getenv("DATABASE_URL", "sqlite:///./teklozy.db")
if raw_db.startswith("sqlite:///./"):
    raw_db = "sqlite:///" + str((BASE_DIR / raw_db.replace("sqlite:///./", "")).resolve())
engine = create_engine(raw_db, connect_args={"check_same_thread": False} if raw_db.startswith("sqlite") else {})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String(120), nullable=False, default="Learner")
    email = Column(String(255), unique=True, nullable=False, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    progress = relationship("LessonProgress", back_populates="user", cascade="all, delete-orphan")

class LessonProgress(Base):
    __tablename__ = "lesson_progress"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    lesson_id = Column(Integer, nullable=False)
    completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)
    user = relationship("User", back_populates="progress")

class StudentProject(Base):
    __tablename__ = "student_projects"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False, index=True)
    file_key = Column(String(120), default="main.py", nullable=False)
    code = Column(String, default="")
    language = Column(String(40), default="python")
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

Base.metadata.create_all(bind=engine)
app = FastAPI(title="Teklozy API", version="1.0.0", description="Learning journey, lesson progress and profile API for Teklozy.")
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DemoSignIn(BaseModel):
    email: str
    name: str | None = Field(default=None, max_length=120)

    @field_validator("email")
    @classmethod
    def valid_email(cls, value):
        value = value.strip().lower()
        if "@" not in value or "." not in value.rsplit("@", 1)[-1]:
            raise ValueError("Enter a valid email address")
        return value

class ProgressUpdate(BaseModel):
    lesson_id: int = Field(ge=0, le=100)
    completed: bool = True

class ProfileUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=120)

@app.get("/")
def root():
    return {"name": "Teklozy API", "version": "1.0.0", "docs": "/docs"}

@app.get("/health")
def health():
    with SessionLocal() as db:
        db.execute(select(1))
    return {"status": "ok", "database": "connected", "timestamp": datetime.now(timezone.utc).isoformat()}

@app.post("/api/demo-signin")
def demo_signin(payload: DemoSignIn):
    """Creates or returns a demo learner. This is not production authentication."""
    with SessionLocal() as db:
        user = db.scalar(select(User).where(User.email == payload.email.lower()))
        if not user:
            user = User(email=payload.email.lower(), name=payload.name or payload.email.split("@")[0].replace(".", " ").title())
            db.add(user); db.commit(); db.refresh(user)
        return {"user": {"id": user.id, "name": user.name, "email": user.email}, "mode": "demo"}

@app.get("/api/profile/{user_id}")
def get_profile(user_id: int):
    with SessionLocal() as db:
        user = db.get(User, user_id)
        if not user: raise HTTPException(404, "User not found")
        return {"id": user.id, "name": user.name, "email": user.email, "created_at": user.created_at}

@app.patch("/api/profile/{user_id}")
def update_profile(user_id: int, payload: ProfileUpdate):
    with SessionLocal() as db:
        user = db.get(User, user_id)
        if not user: raise HTTPException(404, "User not found")
        user.name = payload.name.strip(); db.commit(); db.refresh(user)
        return {"id": user.id, "name": user.name, "email": user.email}

@app.get("/api/progress/{user_id}")
def get_progress(user_id: int):
    with SessionLocal() as db:
        user = db.get(User, user_id)
        if not user: raise HTTPException(404, "User not found")
        rows = db.scalars(select(LessonProgress).where(LessonProgress.user_id == user_id)).all()
        done = sorted([r.lesson_id for r in rows if r.completed])
        return {"user_id": user_id, "completed_lessons": done, "completed_count": len(done), "xp": 2450 + 125 * len(done)}

@app.post("/api/progress/{user_id}")
def update_progress(user_id: int, payload: ProgressUpdate):
    with SessionLocal() as db:
        user = db.get(User, user_id)
        if not user: raise HTTPException(404, "User not found")
        row = db.scalar(select(LessonProgress).where(LessonProgress.user_id == user_id, LessonProgress.lesson_id == payload.lesson_id))
        if not row:
            row = LessonProgress(user_id=user_id, lesson_id=payload.lesson_id); db.add(row)
        row.completed = payload.completed
        row.completed_at = datetime.now(timezone.utc) if payload.completed else None
        db.commit()
        rows = db.scalars(select(LessonProgress).where(LessonProgress.user_id == user_id, LessonProgress.completed.is_(True))).all()
        done = sorted([r.lesson_id for r in rows])
        return {"user_id": user_id, "completed_lessons": done, "completed_count": len(done), "xp": 2450 + 125 * len(done)}

@app.get("/api/lessons")
def lessons():
    return {"lessons": [
        {"id": 0, "title": "The Big Question", "type": "Video", "duration": 6},
        {"id": 1, "title": "What is AI?", "type": "Reading", "duration": 3},
        {"id": 2, "title": "Why AI Exists?", "type": "Visual", "duration": 4},
        {"id": 3, "title": "AI Around You", "type": "Reading", "duration": 4},
        {"id": 4, "title": "How AI Learns?", "type": "Reading", "duration": 5}
    ]}

# =====================================================================
# TEKLOZY CODELAB ENDPOINTS
# =====================================================================

class CodeExecutionRequest(BaseModel):
    code: str
    stdin: str = ""
    timeout: float = 4.0

class ChallengeSubmitRequest(BaseModel):
    challenge_id: str
    code: str
    user_id: Optional[int] = None

class MentorQueryRequest(BaseModel):
    prompt: str
    code: str = ""
    error_context: str = ""
    hint_level: int = 1
    challenge_id: Optional[str] = None

class SaveProjectRequest(BaseModel):
    user_id: int
    file_key: str = "main.py"
    code: str
    language: str = "python"


@app.post("/api/codelab/run")
def codelab_run(payload: CodeExecutionRequest):
    """Executes Python code in an isolated sandbox with timeout and stdout/stderr capture."""
    result = execute_python_code(
        code=payload.code,
        stdin_input=payload.stdin,
        timeout=min(10.0, max(1.0, payload.timeout))
    )
    return result


@app.get("/api/codelab/challenges")
def codelab_challenges():
    """Returns curated programming challenges without revealing hidden test cases."""
    public_challenges = []
    for c in CHALLENGES:
        public_challenges.append({
            "id": c["id"],
            "title": c["title"],
            "difficulty": c["difficulty"],
            "category": c["category"],
            "xp_reward": c["xp_reward"],
            "description": c["description"],
            "input_format": c["input_format"],
            "output_format": c["output_format"],
            "constraints": c["constraints"],
            "starter_code": c["starter_code"],
            "sample_cases": c["sample_cases"]
        })
    return {"challenges": public_challenges}


@app.post("/api/codelab/submit")
def codelab_submit(payload: ChallengeSubmitRequest):
    """Evaluates student challenge submission against hidden backend test suite."""
    eval_result = evaluate_challenge(payload.challenge_id, payload.code)
    
    # If student is authenticated and passed all tests, award XP
    if payload.user_id and eval_result.get("all_passed"):
        try:
            with SessionLocal() as db:
                user = db.get(User, payload.user_id)
                if user:
                    # Mark progress
                    pass
        except Exception:
            pass

    return eval_result


@app.post("/api/codelab/mentor")
def codelab_mentor(payload: MentorQueryRequest):
    """
    Pedagogical AI Mentor endpoint.
    Strictly forbids direct code generation; provides Socratic hints, debugger explanations,
    and progressive step-by-step reasoning.
    """
    response = generate_ai_mentor_response(
        student_prompt=payload.prompt,
        code=payload.code,
        error_context=payload.error_context,
        hint_level=payload.hint_level,
        challenge_context=payload.challenge_id
    )
    return response


@app.post("/api/codelab/save")
def codelab_save(payload: SaveProjectRequest):
    """Saves student code file to database."""
    with SessionLocal() as db:
        user = db.get(User, payload.user_id)
        if not user:
            # Create user if needed
            user = User(id=payload.user_id, email=f"learner_{payload.user_id}@teklozy.com", name="Learner")
            db.add(user)
            db.commit()

        project = db.scalar(
            select(StudentProject).where(
                StudentProject.user_id == payload.user_id,
                StudentProject.file_key == payload.file_key
            )
        )
        if not project:
            project = StudentProject(
                user_id=payload.user_id,
                file_key=payload.file_key,
                code=payload.code,
                language=payload.language
            )
            db.add(project)
        else:
            project.code = payload.code
            project.language = payload.language
            project.updated_at = datetime.now(timezone.utc)
        
        db.commit()
        return {"status": "saved", "file_key": payload.file_key, "updated_at": project.updated_at.isoformat()}


@app.get("/api/codelab/save/{user_id}/{file_key}")
def codelab_load(user_id: int, file_key: str):
    """Restores saved code file from database."""
    with SessionLocal() as db:
        project = db.scalar(
            select(StudentProject).where(
                StudentProject.user_id == user_id,
                StudentProject.file_key == file_key
            )
        )
        if not project:
            return {"status": "not_found", "file_key": file_key, "code": None}
        return {
            "status": "found",
            "file_key": project.file_key,
            "code": project.code,
            "language": project.language,
            "updated_at": project.updated_at.isoformat()
        }
