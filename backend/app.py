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
    housingType = Column(String)
    community = Column(String)
    lifestyles = Column(String) # Stored as comma-separated string (e.g., "study,safety")

# Drop and recreate tables to apply the new schema
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

# 2. Pydantic Models (Incoming JSON Payload Validation)
class UserCreate(BaseModel):
    budget: int
    location: str
    commute: int
    job: str
    housingType: str
    community: str
    lifestyles: list[str]

# 3. Complex Neighborhood Dataset
AREAS = [
    {
        "name": "안암동",
        "name_en": "Anam",
        "lat": 37.586,
        "lng": 127.029,
        "rent": 650000,
        "commute": 10,
        "jobs": {"IT / Software": 72, "Business": 80, "Engineering": 75, "Healthcare": 65, "Education": 90},
        "housing": {"one-room": 95, "officetel": 80, "share-house": 70, "flexible": 85},
        "community": {"international": 65, "local": 85, "mixed": 78, "none": 75},
        "lifestyle": {"quiet": 80, "cafes": 75, "nightlife": 45, "fitness": 70, "study": 98, "safety": 88}
    },
    {
        "name": "성수동",
        "name_en": "Seongsu",
        "lat": 37.544,
        "lng": 127.057,
        "rent": 950000,
        "commute": 30,
        "jobs": {"IT / Software": 95, "Business": 90, "Engineering": 70, "Healthcare": 60, "Education": 50},
        "housing": {"one-room": 75, "officetel": 95, "share-house": 65, "flexible": 80},
        "community": {"international": 80, "local": 70, "mixed": 85, "none": 80},
        "lifestyle": {"quiet": 50, "cafes": 98, "nightlife": 85, "fitness": 90, "study": 60, "safety": 85}
    },
    {
        "name": "신림동",
        "name_en": "Sillim",
        "lat": 37.484,
        "lng": 126.929,
        "rent": 500000,
        "commute": 40,
        "jobs": {"IT / Software": 85, "Business": 70, "Engineering": 65, "Healthcare": 75, "Education": 60},
        "housing": {"one-room": 98, "officetel": 70, "share-house": 85, "flexible": 85},
        "community": {"international": 40, "local": 95, "mixed": 65, "none": 70},
        "lifestyle": {"quiet": 70, "cafes": 65, "nightlife": 80, "fitness": 75, "study": 85, "safety": 70}
    }
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
    # Convert the lifestyles array to a string for SQLite storage
    db_user = User(
        budget=user.budget,
        location=user.location,
        commute=user.commute,
        job=user.job,
        housingType=user.housingType,
        community=user.community,
        lifestyles=",".join(user.lifestyles)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "User saved successfully!", "user": db_user}

@app.get("/api/housing/{user_id}")
def get_recommendations(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_lifestyles = user.lifestyles.split(",") if user.lifestyles else []
    ranked_areas = []

    for area in AREAS:
        # 1. Housing Score: Base dictionary score minus rent penalty
        base_housing = area["housing"].get(user.housingType, 80)
        rent_penalty = 0 if area["rent"] <= user.budget else ((area["rent"] - user.budget) / user.budget) * 100
        housing_score = max(0, base_housing - rent_penalty)

        # 2. Transport Score
        transport_score = 100 if area["commute"] <= user.commute else max(0, 100 - (area["commute"] - user.commute) * 3)

        # 3. Job Score
        job_score = area["jobs"].get(user.job, 70)

        # 4. Core Score (40% Housing / 35% Transport / 25% Jobs)
        core_score = (housing_score * 0.4) + (transport_score * 0.35) + (job_score * 0.25)

        # 5. Calculate Lifestyle/Community Bonus
        comm_score = area["community"].get(user.community, 50)
        life_scores = [area["lifestyle"].get(l, 50) for l in user_lifestyles]
        avg_life = sum(life_scores) / len(life_scores) if life_scores else 50
        
        bonus = ((comm_score - 50) * 0.1) + ((avg_life - 50) * 0.1)
        final_score = min(100, max(0, core_score + bonus))

        # 6. Generate Dynamic Reasons
        reasons = []
        if avg_life > 80 and user_lifestyles:
            reasons.append(f"Great match for your lifestyle ({', '.join(user_lifestyles)})")
        if area["commute"] <= user.commute:
            reasons.append("Short commute time")
        if base_housing >= 85:
            reasons.append(f"Excellent {user.housingType} options")
        if comm_score >= 80 and user.community != "none":
            reasons.append(f"Strong {user.community} community vibe")

        ranked_areas.append({
            "name": area["name"],
            "name_en": area["name_en"],
            "rent": area["rent"],
            "commute": area["commute"],
            "housingScore": math.floor(housing_score + 0.5),
            "transportScore": math.floor(transport_score + 0.5),
            "jobScore": job_score,
            "score": math.floor(final_score + 0.5),
            "reasons": reasons[:3] # Return top 3 reasons max
        })

    ranked_areas.sort(key=lambda area: area["score"], reverse=True)
    return {"matches": ranked_areas}