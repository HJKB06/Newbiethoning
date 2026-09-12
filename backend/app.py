import math

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker, Session

# 1. Database Setup

SQLALCHEMY_DATABASE_URL = "sqlite:///./users.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    budget = Column(Integer)
    location = Column(String)
    commute = Column(Integer)
    job = Column(String)
    community = Column(String)

# Recreate the table so the SQLite schema matches the current model.
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

# 2. Pydantic Models (Data Validation)
class UserCreate(BaseModel):
    budget: int
    location: str
    commute: int
    job: str
    community: str

# 3. Neighborhood Data
AREAS = [
    {"name": "안암동", "rent": 650000, "commute": 10, "jobs": 72},
    {"name": "회기동", "rent": 580000, "commute": 25, "jobs": 68},
    {"name": "신림동", "rent": 520000, "commute": 38, "jobs": 85},
    {"name": "성수동", "rent": 900000, "commute": 30, "jobs": 95},
]

# 4. App Initialization & CORS
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 5. API Endpoints
@app.post("/users/")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = User(**user.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User saved successfully!", "user": new_user}

@app.get("/api/housing/{user_id}")
def get_recommendations(user_id: int, db: Session = Depends(get_db)):
    # Feature: Recommendation Engine
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    ranked_areas = []
    for area in AREAS:
        housing_score = (
            100
            if area["rent"] <= user.budget
            else 0
            if user.budget == 0
            else max(
                0,
                100 - ((area["rent"] - user.budget) / user.budget) * 100,
            )
        )

        transport_score = (
            100
            if area["commute"] <= user.commute
            else max(0, 100 - (area["commute"] - user.commute) * 3)
        )
        job_score = area["jobs"]
        score = (
            housing_score * 0.4
            + transport_score * 0.35
            + job_score * 0.25
        )

        ranked_areas.append(
            {
                **area,
                "housingScore": math.floor(housing_score + 0.5),
                "transportScore": math.floor(transport_score + 0.5),
                "jobScore": job_score,
                "score": math.floor(score + 0.5),
            }
        )

    ranked_areas.sort(key=lambda area: area["score"], reverse=True)

    return {"user_budget": user.budget, "matches": ranked_areas[:3]}