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
    name = Column(String)
    email = Column(String, unique=True, index=True)
    work = Column(String)
    budget = Column(Integer)
    location = Column(String)
    transportation = Column(String)
    time_vs_cost = Column(String)

Base.metadata.create_all(bind=engine)

# 2. Pydantic Models (Data Validation)
class UserCreate(BaseModel):
    name: str
    email: str
    work: str
    budget: int
    location: str
    transportation: str
    time_vs_cost: str

class UserLogin(BaseModel):
    email: str

# 3. Mock Housing Database (Hackathon Shortcut)
MOCK_HOUSING = [
    {"id": 1, "title": "Budget Student Studio", "price": 400, "commute_time": 45},
    {"id": 2, "title": "Cozy Shared Apartment", "price": 600, "commute_time": 30},
    {"id": 3, "title": "Worker's Mid-range Flat", "price": 900, "commute_time": 15},
    {"id": 4, "title": "Luxury Downtown Loft", "price": 1500, "commute_time": 5},
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
    # Feature 1: Prevent Duplicate Emails
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = User(**user.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User saved successfully!", "user": new_user}

@app.post("/login/")
def login_user(login_data: UserLogin, db: Session = Depends(get_db)):
    # Feature 2: Login Endpoint
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Login successful", "user": user}

@app.get("/api/housing/{user_id}")
def get_recommendations(user_id: int, db: Session = Depends(get_db)):
    # Feature 3: Recommendation Engine
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Filter out houses that are too expensive for the user
    recommended = [house for house in MOCK_HOUSING if house["price"] <= user.budget]
    
    # Sort the results based on what the user values more
    if user.time_vs_cost == "time":
        recommended.sort(key=lambda x: x["commute_time"]) # Shortest commute at the top
    else:
        recommended.sort(key=lambda x: x["price"]) # Cheapest price at the top

    return {"user_budget": user.budget, "matches": recommended}