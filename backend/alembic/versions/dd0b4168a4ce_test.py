"""test

Revision ID: dd0b4168a4ce
Revises: 38edf5a368b0
Create Date: 2025-05-19 01:14:10.976053

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dd0b4168a4ce'
down_revision: Union[str, None] = '38edf5a368b0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
