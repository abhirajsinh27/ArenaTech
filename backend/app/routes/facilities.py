
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.facility import Facility
from app.models.user import User
from app.schemas.facility import (
    FacilityCreate,
    FacilityResponse,
    FacilityUpdate,
)


router = APIRouter(
    prefix="/api/facilities",
    tags=["Sports Facilities"],
)


def require_facility_manager(user: User) -> None:
    if user.role not in {"venue_manager", "admin"}:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only venue managers and admins can register facilities.",
        )


def get_facility_or_404(
    db: Session,
    facility_id: int,
) -> Facility:
    facility = db.get(Facility, facility_id)

    if facility is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Facility not found.",
        )

    return facility


def require_owner_or_admin(
    facility: Facility,
    user: User,
) -> None:
    if facility.owner_id != user.id and user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to modify this facility.",
        )


@router.get(
    "",
    response_model=list[FacilityResponse],
)
def list_facilities(
    city: str | None = Query(default=None, max_length=100),
    sport_type: str | None = Query(default=None, max_length=80),
    search: str | None = Query(default=None, max_length=100),
    min_price: Decimal | None = Query(default=None, ge=0),
    max_price: Decimal | None = Query(default=None, ge=0),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=12, ge=1, le=100),
    db: Session = Depends(get_db),
):
    if (
        min_price is not None
        and max_price is not None
        and min_price > max_price
    ):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="min_price cannot be greater than max_price.",
        )

    statement = select(Facility).where(
        Facility.status == "approved",
        Facility.is_active.is_(True),
    )

    if city and city.strip():
        statement = statement.where(
            Facility.city.ilike(city.strip())
        )

    if sport_type and sport_type.strip():
        statement = statement.where(
            Facility.sport_type.ilike(sport_type.strip())
        )

    if search and search.strip():
        search_term = f"%{search.strip()}%"

        statement = statement.where(
            or_(
                Facility.name.ilike(search_term),
                Facility.description.ilike(search_term),
                Facility.address.ilike(search_term),
                Facility.city.ilike(search_term),
            )
        )

    if min_price is not None:
        statement = statement.where(
            Facility.price_per_hour >= min_price
        )

    if max_price is not None:
        statement = statement.where(
            Facility.price_per_hour <= max_price
        )

    statement = (
        statement
        .order_by(Facility.created_at.desc())
        .offset(skip)
        .limit(limit)
    )

    return db.scalars(statement).all()


@router.get(
    "/{facility_id}",
    response_model=FacilityResponse,
)
def get_facility(
    facility_id: int,
    db: Session = Depends(get_db),
):
    facility = get_facility_or_404(db, facility_id)

    if facility.status != "approved" or not facility.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Facility not found.",
        )

    return facility


@router.post(
    "",
    response_model=FacilityResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_facility(
    data: FacilityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_facility_manager(current_user)

    facility = Facility(
        **data.model_dump(),
        owner_id=current_user.id,
        status="pending",
    )

    db.add(facility)
    db.commit()
    db.refresh(facility)

    return facility


@router.patch(
    "/{facility_id}",
    response_model=FacilityResponse,
)

@router.patch(
    "/{facility_id}",
    response_model=FacilityResponse,
)
def update_facility(
    facility_id: int,
    data: FacilityUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    facility = get_facility_or_404(db, facility_id)

    require_owner_or_admin(facility, current_user)

    updates = data.model_dump(exclude_unset=True)

    if not updates:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provide at least one field to update.",
        )

    # Approval status is managed by a separate admin endpoint.
    # Only admins can deactivate or reactivate facilities.
    if "is_active" in updates and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can change facility activation status.",
        )

    required_fields = {
        "name",
        "sport_type",
        "address",
        "city",
        "state",
        "price_per_hour",
        "amenities",
        "is_active",
    }

    for field, value in updates.items():
        if value is None and field in required_fields:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"{field} cannot be null.",
            )

        setattr(facility, field, value)

    db.commit()
    db.refresh(facility)

    return facility


@router.patch(
    "/{facility_id}/approval",
    response_model=FacilityResponse,
)
def update_facility_approval(
    facility_id: int,
    approval_status: str = Query(
        ...,
        alias="status",
        pattern="^(approved|rejected)$",
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can approve or reject facilities.",
        )

    facility = get_facility_or_404(db, facility_id)

    if facility.status == "suspended":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Suspended facilities cannot be approved through this endpoint.",
        )

    facility.status = approval_status

    db.commit()
    db.refresh(facility)

    return facility
