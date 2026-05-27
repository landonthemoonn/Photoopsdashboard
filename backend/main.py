from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from database import engine, Base
from routers import settings, jamf


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup if they do not already exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(title="PhotoOps Dashboard API", lifespan=lifespan)

# Allow all origins for local network access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(settings.router)
app.include_router(jamf.router)

# Serve the built React SPA from ./static, with HTML fallback for client-side routing
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.isdir(static_dir):
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")
