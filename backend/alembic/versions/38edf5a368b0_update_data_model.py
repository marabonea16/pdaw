"""update data model

Revision ID: 38edf5a368b0
Revises: efa793a576f0
Create Date: 2025-05-19 00:58:48.857131

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '38edf5a368b0'
down_revision: Union[str, None] = 'efa793a576f0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('courses', 'instructor_id',
               existing_type=sa.INTEGER(),
               type_=sa.String(),
               existing_nullable=True)
    op.drop_constraint('courses_instructor_id_fkey', 'courses', type_='foreignkey')
    op.create_foreign_key(None, 'courses', 'teachers', ['instructor_id'], ['id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'courses', type_='foreignkey')
    op.create_foreign_key('courses_instructor_id_fkey', 'courses', 'users', ['instructor_id'], ['id'])
    op.alter_column('courses', 'instructor_id',
               existing_type=sa.String(),
               type_=sa.INTEGER(),
               existing_nullable=True)
    # ### end Alembic commands ###
