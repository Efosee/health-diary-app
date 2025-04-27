from fastapi import FastAPI
from fastapi.exceptions import ResponseValidationError
from starlette.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, user, health_profile, personal_training, event_training, analytics, sport_event

app = FastAPI(title="Health Diary System", version="1.0.0")

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(ResponseValidationError)
async def response_validation_exception_handler(request, exc: ResponseValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "detail": [{
                "loc": err["loc"],
                "msg": err["msg"],
                "type": err["type"]
            } for err in exc.errors()]
        }
    )

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(user.router, prefix="/users", tags=["users"])
app.include_router(health_profile.router, prefix="/health", tags=["health"])
app.include_router(personal_training.router, prefix="/personal_training", tags=["personal_training"])
app.include_router(event_training.router, prefix="/event_training", tags=["event_training"])
app.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
app.include_router(sport_event.router, prefix="/sport_events", tags=["sport_events"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Health Diary System API"}