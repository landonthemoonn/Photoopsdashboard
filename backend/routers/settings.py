from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone

from database import get_db
from models import StudioSettings

router = APIRouter()


class SettingsPayload(BaseModel):
    credentials: dict = {}
    config: dict = {}


@router.get("/api/settings")
async def get_settings(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(StudioSettings).where(StudioSettings.id == 1))
    row = result.scalar_one_or_none()
    if row is None:
        return {"credentials": {}, "config": {}}
    return {"credentials": row.credentials or {}, "config": row.config or {}}


@router.post("/api/settings")
async def upsert_settings(payload: SettingsPayload, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(StudioSettings).where(StudioSettings.id == 1))
    row = result.scalar_one_or_none()

    now = datetime.now(timezone.utc)
    if row is None:
        row = StudioSettings(
            id=1,
            credentials=payload.credentials,
            config=payload.config,
            updated_at=now,
        )
        db.add(row)
    else:
        row.credentials = payload.credentials
        row.config = payload.config
        row.updated_at = now

    await db.commit()
    await db.refresh(row)
    return {"credentials": row.credentials or {}, "config": row.config or {}}
