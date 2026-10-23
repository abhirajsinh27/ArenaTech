
from types import SimpleNamespace

import pytest
from fastapi import HTTPException

from app.routes.facilities import (
    require_facility_manager,
    require_owner_or_admin,
)


def make_user(user_id: int, role: str):
    return SimpleNamespace(id=user_id, role=role)


def make_facility(owner_id: int):
    return SimpleNamespace(owner_id=owner_id)


@pytest.mark.parametrize("role", ["venue_manager", "admin"])
def test_authorized_roles_can_register_facilities(role):
    user = make_user(user_id=1, role=role)

    # No exception means permission was granted.
    require_facility_manager(user)


def test_normal_user_cannot_register_facilities():
    user = make_user(user_id=1, role="normal_user")

    with pytest.raises(HTTPException) as error:
        require_facility_manager(user)

    assert error.value.status_code == 403


def test_facility_owner_can_modify_own_facility():
    user = make_user(user_id=10, role="venue_manager")
    facility = make_facility(owner_id=10)

    require_owner_or_admin(facility, user)


def test_owner_cannot_modify_another_users_facility():
    user = make_user(user_id=10, role="venue_manager")
    facility = make_facility(owner_id=20)

    with pytest.raises(HTTPException) as error:
        require_owner_or_admin(facility, user)

    assert error.value.status_code == 403


def test_admin_can_modify_another_users_facility():
    user = make_user(user_id=99, role="admin")
    facility = make_facility(owner_id=20)

    require_owner_or_admin(facility, user)
