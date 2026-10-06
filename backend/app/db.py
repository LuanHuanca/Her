from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import settings


def _url_con_driver_explicito(url: str) -> str:
    """Fuerza el driver psycopg2 cuando la URL no especifica uno.
    Sin esto, SQLAlchemy puede preferir el driver psycopg (v3) por defecto
    según la versión instalada — y acá solo tenemos psycopg2-binary."""
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+psycopg2://", 1)
    return url


engine = create_engine(_url_con_driver_explicito(settings.database_url), pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
