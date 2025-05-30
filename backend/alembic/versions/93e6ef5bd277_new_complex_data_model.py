"""new complex data model

Revision ID: 93e6ef5bd277
Revises: 0de0993651bc
Create Date: 2025-05-02 20:22:25.170775

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '93e6ef5bd277'
down_revision: Union[str, None] = '0de0993651bc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('ix_courses_code', table_name='courses')
    op.drop_index('ix_courses_faculty_id', table_name='courses')
    op.drop_index('ix_courses_id', table_name='courses')
    op.drop_index('ix_courses_instructor_id', table_name='courses')
    op.drop_index('ix_courses_name', table_name='courses')
    op.drop_table('courses')
    op.drop_table('faculties')
    op.drop_index('ix_users_email', table_name='users')
    op.drop_index('ix_users_id', table_name='users')
    op.drop_index('ix_users_uni_id', table_name='users')
    op.create_unique_constraint(None, 'users', ['uni_id'])
    op.create_unique_constraint(None, 'users', ['email'])
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'users', type_='unique')
    op.drop_constraint(None, 'users', type_='unique')
    op.create_index('ix_users_uni_id', 'users', ['uni_id'], unique=True)
    op.create_index('ix_users_id', 'users', ['id'], unique=False)
    op.create_index('ix_users_email', 'users', ['email'], unique=True)
    op.create_table('faculties',
    sa.Column('id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('code', sa.TEXT(), autoincrement=False, nullable=False),
    sa.Column('name', sa.TEXT(), autoincrement=False, nullable=False),
    sa.PrimaryKeyConstraint('id', name='faculties_pkey')
    )
    op.create_table('courses',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('name', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('description', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('code', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('semester', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('year', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('credits', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('instructor_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('faculty_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('created_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('updated_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='courses_pkey')
    )
    op.create_index('ix_courses_name', 'courses', ['name'], unique=True)
    op.create_index('ix_courses_instructor_id', 'courses', ['instructor_id'], unique=False)
    op.create_index('ix_courses_id', 'courses', ['id'], unique=False)
    op.create_index('ix_courses_faculty_id', 'courses', ['faculty_id'], unique=False)
    op.create_index('ix_courses_code', 'courses', ['code'], unique=True)
    # ### end Alembic commands ###
