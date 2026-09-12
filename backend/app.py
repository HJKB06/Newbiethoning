from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker, Session

# 1. Database Setup (SQLite)
SQLALCHEMY_DATABASE_URL = "sqlite:///./users.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 2. Database Entity (Table Constraints & Primary Keys)
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    work = Column(String)
    budget = Column(Integer)
    location = Column(String)
    transportation = Column(String)
    time_vs_cost = Column(String)

# Create the tables in the database
Base.metadata.create_all(bind=engine)

# 3. Data Validation Model
class UserCreate(BaseModel):
    name: str
    email: str
    work: str
    budget: int
    location: str
    transportation: str
    time_vs_cost: str

# 4. FastAPI App Initialization & CORS
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows your friend's frontend to connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 5. API Routes
@app.get("/")
def read_root():
    return {"message": "Backend is running!"}

@app.post("/users/")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Map the validated data to our database entity
    db_user = User(
        name=user.name,
        email=user.email,
        work=user.work,
        budget=user.budget,
        location=user.location,
        transportation=user.transportation,
        time_vs_cost=user.time_vs_cost
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "User saved successfully!", "user": db_user}