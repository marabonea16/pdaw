"""safely modified id type for students and teachers

Revision ID: 99197f5732f5
Revises: dd0b4168a4ce
Create Date: 2025-05-19 10:35:51.000288
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column
from sqlalchemy import String, Integer


# revision identifiers, used by Alembic.
revision: str = '99197f5732f5'
down_revision: Union[str, None] = 'dd0b4168a4ce'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Step 1: Add a new column
    op.add_column('courses', sa.Column('instructor_id_str', sa.String(), nullable=True))

    # Step 2: Backfill existing data
    courses = table(
        'courses',
        column('instructor_id', Integer),
        column('instructor_id_str', String)
    )
    conn = op.get_bind()
    conn.execute(
        courses.update().values(instructor_id_str=sa.cast(courses.c.instructor_id, String))
    )

    # Step 3: Drop the existing foreign key constraint
    op.drop_constraint('courses_instructor_id_fkey', 'courses', type_='foreignkey')

    # Step 4: Drop old column
    op.drop_column('courses', 'instructor_id')

    # Step 5: Rename new column
    op.alter_column('courses', 'instructor_id_str', new_column_name='instructor_id')

    # Step 6: Recreate foreign key (assumes teachers.id is now String type)
    op.create_foreign_key(None, 'courses', 'teachers', ['instructor_id'], ['id'])


def downgrade() -> None:
    # Step 1: Add back instructor_id as Integer
    op.add_column('courses', sa.Column('instructor_id_int', sa.Integer(), nullable=True))

    # Step 2: Backfill data (convert string to int)
    courses = table(
        'courses',
        column('instructor_id', String),
        column('instructor_id_int', Integer)
    )
    conn = op.get_bind()
    conn.execute(
        courses.update().values(instructor_id_int=sa.cast(courses.c.instructor_id, Integer))
    )

    # Step 3: Drop FK and current string column
    op.drop_constraint(None, 'courses', type_='foreignkey')
    op.drop_column('courses', 'instructor_id')

    # Step 4: Rename instructor_id_int back to instructor_id
    op.alter_column('courses', 'instructor_id_int', new_column_name='instructor_id')

    # Step 5: Restore FK (assumes previous FK was to 'users')
    op.create_foreign_key('courses_instructor_id_fkey', 'courses', 'users', ['instructor_id'], ['id'])
"""safely modified id type for students and teachers

Revision ID: 99197f5732f5
Revises: dd0b4168a4ce
Create Date: 2025-05-19 10:35:51.000288
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column
from sqlalchemy import String, Integer
from sqlalchemy import text


# revision identifiers, used by Alembic.
revision: str = '99197f5732f5'
down_revision: Union[str, None] = 'dd0b4168a4ce'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Step 1: Add a new column
    op.add_column('courses', sa.Column('instructor_id_str', sa.String(), nullable=True))

    # Step 2: Backfill existing data
    courses = table(
        'courses',
        column('instructor_id', Integer),
        column('instructor_id_str', String)
    )
    conn = op.get_bind()
    conn.execute(
        courses.update().values(instructor_id_str=sa.cast(courses.c.instructor_id, String))
    )

    # Step 3: Drop the existing foreign key constraint
    conn = op.get_bind()
    result = conn.execute(text("""
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'courses_instructor_id_fkey' 
        AND table_name = 'courses'
    """)).fetchone()
    
    if result:
        op.drop_constraint('courses_instructor_id_fkey', 'courses', type_='foreignkey')
    # Step 4: Drop old column
    op.drop_column('courses', 'instructor_id')

    # Step 5: Rename new column
    op.alter_column('courses', 'instructor_id_str', new_column_name='instructor_id')

    # Step 6: Recreate foreign key (assumes teachers.id is now String type)
    op.create_foreign_key(None, 'courses', 'teachers', ['instructor_id'], ['id'])


def downgrade() -> None:
    # Step 1: Add back instructor_id as Integer
    op.add_column('courses', sa.Column('instructor_id_int', sa.Integer(), nullable=True))

    # Step 2: Backfill data (convert string to int)
    courses = table(
        'courses',
        column('instructor_id', String),
        column('instructor_id_int', Integer)
    )
    conn = op.get_bind()
    conn.execute(
        courses.update().values(instructor_id_int=sa.cast(courses.c.instructor_id, Integer))
    )

    # Step 3: Drop FK and current string column
    op.drop_constraint(None, 'courses', type_='foreignkey')
    op.drop_column('courses', 'instructor_id')

    # Step 4: Rename instructor_id_int back to instructor_id
    op.alter_column('courses', 'instructor_id_int', new_column_name='instructor_id')

    # Step 5: Restore FK (assumes previous FK was to 'users')
    op.create_foreign_key('courses_instructor_id_fkey', 'courses', 'users', ['instructor_id'], ['id'])
