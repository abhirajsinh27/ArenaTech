
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.models.user import User
from app.routes.auth import router as auth_router
from app.routes.facilities import router as facilities_router


app = FastAPI(
    title="ArenaTech Gujarat API",
    description="Sports technology and infrastructure platform",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url.rstrip("/")],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "X-CSRF-Token"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(facilities_router)

@app.get("/")
def health_check():
    return {
        "message": "ArenaTech Gujarat API is running",
        "status": "ok",
    }
