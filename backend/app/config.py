from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str
    frontend_url: str = "http://localhost:5173"
    secret_key: str

    # Session cookie configuration
    session_cookie_name: str = "arenatech_session"
    session_expire_hours: int = 12

    # False for local HTTP development.
    # Set to True when deployed behind HTTPS.
    cookie_secure: bool = False

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()