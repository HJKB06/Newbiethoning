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

# Keep existing user data when the development server reloads.
# Schema changes should be handled with a migration instead of dropping tables.
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


    # 3. Complex Neighborhood Dataset (15 Areas)
AREAS = [
    {
        "name": "안암동", "name_en": "Anam", "lat": 37.586, "lng": 127.029, "rent": 650000, "commute": 10,
        "jobs": {"IT / Software": 72, "Business": 80, "Engineering": 75, "Healthcare": 65, "Education": 90},
        "housing": {"one-room": 95, "officetel": 80, "share-house": 70, "flexible": 85},
        "community": {"international": 65, "local": 85, "mixed": 78, "none": 75},
        "lifestyle": {"quiet": 80, "cafes": 75, "nightlife": 45, "fitness": 70, "study": 98, "safety": 88}
    },
    {
        "name": "성수동", "name_en": "Seongsu", "lat": 37.544, "lng": 127.057, "rent": 950000, "commute": 30,
        "jobs": {"IT / Software": 95, "Business": 90, "Engineering": 70, "Healthcare": 60, "Education": 50},
        "housing": {"one-room": 75, "officetel": 95, "share-house": 65, "flexible": 80},
        "community": {"international": 80, "local": 70, "mixed": 85, "none": 80},
        "lifestyle": {"quiet": 50, "cafes": 98, "nightlife": 85, "fitness": 90, "study": 60, "safety": 85}
    },
    {
        "name": "신림동", "name_en": "Sillim", "lat": 37.484, "lng": 126.929, "rent": 500000, "commute": 40,
        "jobs": {"IT / Software": 85, "Business": 70, "Engineering": 65, "Healthcare": 75, "Education": 60},
        "housing": {"one-room": 98, "officetel": 70, "share-house": 85, "flexible": 85},
        "community": {"international": 40, "local": 95, "mixed": 65, "none": 70},
        "lifestyle": {"quiet": 70, "cafes": 65, "nightlife": 80, "fitness": 75, "study": 85, "safety": 70}
    },
    {
        "name": "이태원동", "name_en": "Itaewon", "lat": 37.534, "lng": 126.994, "rent": 850000, "commute": 25,
        "jobs": {"IT / Software": 60, "Business": 85, "Engineering": 50, "Healthcare": 40, "Education": 65},
        "housing": {"one-room": 85, "officetel": 70, "share-house": 95, "flexible": 80},
        "community": {"international": 98, "local": 40, "mixed": 90, "none": 75},
        "lifestyle": {"quiet": 30, "cafes": 85, "nightlife": 98, "fitness": 60, "study": 45, "safety": 65}
    },
    {
        "name": "신촌동", "name_en": "Sinchon", "lat": 37.559, "lng": 126.936, "rent": 700000, "commute": 20,
        "jobs": {"IT / Software": 75, "Business": 80, "Engineering": 60, "Healthcare": 95, "Education": 95},
        "housing": {"one-room": 95, "officetel": 85, "share-house": 80, "flexible": 85},
        "community": {"international": 85, "local": 75, "mixed": 90, "none": 80},
        "lifestyle": {"quiet": 40, "cafes": 95, "nightlife": 90, "fitness": 75, "study": 95, "safety": 80}
    },
    {
        "name": "역삼동", "name_en": "Yeoksam", "lat": 37.500, "lng": 127.036, "rent": 1100000, "commute": 35,
        "jobs": {"IT / Software": 98, "Business": 99, "Engineering": 85, "Healthcare": 80, "Education": 60},
        "housing": {"one-room": 60, "officetel": 98, "share-house": 50, "flexible": 70},
        "community": {"international": 70, "local": 80, "mixed": 75, "none": 75},
        "lifestyle": {"quiet": 60, "cafes": 90, "nightlife": 85, "fitness": 95, "study": 70, "safety": 90}
    },
    {
        "name": "혜화동", "name_en": "Hyehwa", "lat": 37.588, "lng": 127.001, "rent": 680000, "commute": 15,
        "jobs": {"IT / Software": 65, "Business": 70, "Engineering": 60, "Healthcare": 90, "Education": 95},
        "housing": {"one-room": 90, "officetel": 70, "share-house": 75, "flexible": 85},
        "community": {"international": 75, "local": 85, "mixed": 80, "none": 75},
        "lifestyle": {"quiet": 65, "cafes": 90, "nightlife": 70, "fitness": 60, "study": 95, "safety": 85}
    },
    {
        "name": "노량진동", "name_en": "Noryangjin", "lat": 37.513, "lng": 126.944, "rent": 450000, "commute": 30,
        "jobs": {"IT / Software": 50, "Business": 60, "Engineering": 50, "Healthcare": 55, "Education": 85},
        "housing": {"one-room": 95, "officetel": 50, "share-house": 60, "flexible": 80},
        "community": {"international": 30, "local": 98, "mixed": 50, "none": 70},
        "lifestyle": {"quiet": 75, "cafes": 60, "nightlife": 40, "fitness": 50, "study": 99, "safety": 80}
    },
    {
        "name": "서교동 (홍대)", "name_en": "Hongdae", "lat": 37.554, "lng": 126.918, "rent": 800000, "commute": 25,
        "jobs": {"IT / Software": 80, "Business": 85, "Engineering": 65, "Healthcare": 50, "Education": 75},
        "housing": {"one-room": 85, "officetel": 75, "share-house": 85, "flexible": 80},
        "community": {"international": 90, "local": 65, "mixed": 95, "none": 80},
        "lifestyle": {"quiet": 20, "cafes": 99, "nightlife": 99, "fitness": 70, "study": 65, "safety": 75}
    },
    {
        "name": "잠실동", "name_en": "Jamsil", "lat": 37.511, "lng": 127.084, "rent": 1050000, "commute": 45,
        "jobs": {"IT / Software": 85, "Business": 95, "Engineering": 75, "Healthcare": 80, "Education": 70},
        "housing": {"one-room": 50, "officetel": 95, "share-house": 40, "flexible": 70},
        "community": {"international": 65, "local": 90, "mixed": 80, "none": 75},
        "lifestyle": {"quiet": 85, "cafes": 85, "nightlife": 60, "fitness": 98, "study": 75, "safety": 95}
    },
    {
        "name": "구로동", "name_en": "Guro", "lat": 37.495, "lng": 126.887, "rent": 550000, "commute": 50,
        "jobs": {"IT / Software": 95, "Business": 85, "Engineering": 90, "Healthcare": 60, "Education": 50},
        "housing": {"one-room": 85, "officetel": 85, "share-house": 60, "flexible": 80},
        "community": {"international": 70, "local": 85, "mixed": 75, "none": 70},
        "lifestyle": {"quiet": 65, "cafes": 60, "nightlife": 65, "fitness": 70, "study": 60, "safety": 75}
    },
    {
        "name": "행당동 (왕십리)", "name_en": "Wangsimni", "lat": 37.561, "lng": 127.035, "rent": 750000, "commute": 15,
        "jobs": {"IT / Software": 75, "Business": 85, "Engineering": 80, "Healthcare": 85, "Education": 85},
        "housing": {"one-room": 85, "officetel": 90, "share-house": 75, "flexible": 85},
        "community": {"international": 70, "local": 85, "mixed": 80, "none": 75},
        "lifestyle": {"quiet": 60, "cafes": 85, "nightlife": 75, "fitness": 80, "study": 85, "safety": 85}
    },
    {
        "name": "수유동", "name_en": "Suyu", "lat": 37.638, "lng": 127.022, "rent": 450000, "commute": 40,
        "jobs": {"IT / Software": 40, "Business": 50, "Engineering": 45, "Healthcare": 60, "Education": 60},
        "housing": {"one-room": 95, "officetel": 60, "share-house": 70, "flexible": 80},
        "community": {"international": 30, "local": 95, "mixed": 50, "none": 70},
        "lifestyle": {"quiet": 85, "cafes": 65, "nightlife": 60, "fitness": 75, "study": 70, "safety": 80}
    },
    {
        "name": "서초동", "name_en": "Seocho", "lat": 37.483, "lng": 127.014, "rent": 1200000, "commute": 35,
        "jobs": {"IT / Software": 90, "Business": 95, "Engineering": 80, "Healthcare": 95, "Education": 80},
        "housing": {"one-room": 40, "officetel": 95, "share-house": 40, "flexible": 60},
        "community": {"international": 75, "local": 85, "mixed": 80, "none": 75},
        "lifestyle": {"quiet": 90, "cafes": 85, "nightlife": 50, "fitness": 90, "study": 85, "safety": 98}
    },
    {
        "name": "망원동", "name_en": "Mangwon", "lat": 37.556, "lng": 126.904, "rent": 650000, "commute": 30,
        "jobs": {"IT / Software": 70, "Business": 75, "Engineering": 60, "Healthcare": 50, "Education": 60},
        "housing": {"one-room": 85, "officetel": 60, "share-house": 80, "flexible": 85},
        "community": {"international": 65, "local": 90, "mixed": 75, "none": 75},
        "lifestyle": {"quiet": 75, "cafes": 95, "nightlife": 65, "fitness": 80, "study": 70, "safety": 80}
    }
]

import random

random.seed(42)  # Keeps generated data consistent

ONE_ROOM_TITLES = [
    "Sunny {area} One-room",
    "Quiet Studio near {area}",
    "Bright Corner Room in {area}",
    "Compact City Studio — {area}",
    "Modern One-room near Transit",
    "Cozy Student Studio in {area}",
    "Minimal Studio with Natural Light",
    "Convenient One-room near Campus",
]

OFFICETEL_TITLES = [
    "Secure High-rise Officetel",
    "Modern Officetel in {area}",
    "City-view Officetel near Station",
    "Newly Built Officetel — {area}",
    "Premium Officetel with Security",
    "Compact Business District Officetel",
    "High-floor Officetel near Transit",
    "Clean Furnished Officetel in {area}",
]

SHARE_HOUSE_TITLES = [
    "Cozy Share-house (Private Room)",
    "Friendly Share-house in {area}",
    "International Share-house near Campus",
    "Private Room in Community House",
    "Affordable Share-house — {area}",
    "Social Living House with Private Room",
    "Student Share-house near Station",
    "Quiet Private Room in Shared Home",
]

for idx, area in enumerate(AREAS):
    base_rent = area["rent"]

    area["properties"] = [
        {
            "id": f"prop-{idx}-1",
            "title": random.choice(ONE_ROOM_TITLES).format(
                area=area["name_en"]
            ),
            "type": "one-room",
            "deposit": 10000000,
            "rent": base_rent - 50000,
            "foreigner_friendly": True,
            "gender": "Any",
        },
        {
            "id": f"prop-{idx}-2",
            "title": random.choice(OFFICETEL_TITLES).format(
                area=area["name_en"]
            ),
            "type": "officetel",
            "deposit": 20000000,
            "rent": base_rent + 150000,
            "foreigner_friendly": False,
            "gender": "Female Only",
        },
        {
            "id": f"prop-{idx}-3",
            "title": random.choice(SHARE_HOUSE_TITLES).format(
                area=area["name_en"]
            ),
            "type": "share-house",
            "deposit": 3000000,
            "rent": base_rent - 150000,
            "foreigner_friendly": True,
            "gender": "Any",
        },
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
            "lat": area["lat"],
            "lng": area["lng"],
            "rent": area["rent"],
            "commute": area["commute"],
            "housingScore": math.floor(housing_score + 0.5),
            "transportScore": math.floor(transport_score + 0.5),
            "jobScore": job_score,
            "score": math.floor(final_score + 0.5),
            "reasons": reasons[:3],
            "properties": area["properties"] 
        })

    ranked_areas.sort(key=lambda area: area["score"], reverse=True)
    return {"matches": ranked_areas}
