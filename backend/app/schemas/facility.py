
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, field_validator


class FacilityBase(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    description: str | None = None
    sport_type: str = Field(min_length=2, max_length=80)
    address: str = Field(min_length=5, max_length=255)
    city: str = Field(min_length=2, max_length=100)
    state: str = Field(default="Gujarat", max_length=100)
    postal_code: str | None = Field(default=None, max_length=15)
    price_per_hour: Decimal = Field(ge=0, max_digits=10, decimal_places=2)
    amenities: list[str] = Field(default_factory=list)
    image_url: str | None = Field(default=None, max_length=500)

    @field_validator("name", "sport_type", "address", "city", "state")
    @classmethod
    def strip_required_text(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("This field cannot be empty.")

        return value

    @field_validator("amenities")
    @classmethod
    def clean_amenities(cls, values: list[str]) -> list[str]:
        cleaned = list(dict.fromkeys(
            item.strip() for item in values if item.strip()
        ))

        return cleaned


class FacilityCreate(FacilityBase):
    pass


class FacilityUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=150)
    description: str | None = None
    sport_type: str | None = Field(default=None, min_length=2, max_length=80)
    address: str | None = Field(default=None, min_length=5, max_length=255)
    city: str | None = Field(default=None, min_length=2, max_length=100)
    state: str | None = Field(default=None, max_length=100)
    postal_code: str | None = Field(default=None, max_length=15)
    price_per_hour: Decimal | None = Field(
        default=None, ge=0, max_digits=10, decimal_places=2
    )
    amenities: list[str] | None = None
    image_url: str | None = Field(default=None, max_length=500)
    is_active: bool | None = None

    @field_validator(
        "name", "sport_type", "address", "city", "state",
        mode="before",
    )
    @classmethod
    def strip_optional_text(cls, value):
        if value is None:
            return value

        if isinstance(value, str):
            value = value.strip()

            if not value:
                raise ValueError("This field cannot be empty.")

        return value

    @field_validator("amenities")
    @classmethod
    def clean_optional_amenities(cls, values):
        if values is None:
            return values

        return list(dict.fromkeys(
            item.strip() for item in values if item.strip()
        ))


class FacilityResponse(FacilityBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str
    is_active: bool
    owner_id: int
