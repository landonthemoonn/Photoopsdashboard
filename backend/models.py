from datetime import datetime, timezone
from sqlalchemy import Integer, JSON, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from database import Base


class StudioSettings(Base):
    __tablename__ = "studio_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    credentials: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    config: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
