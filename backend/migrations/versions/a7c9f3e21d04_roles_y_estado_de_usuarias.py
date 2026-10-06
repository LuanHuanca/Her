"""roles y estado de usuarias

Revision ID: a7c9f3e21d04
Revises: ee2dd811eba5
Create Date: 2026-09-23 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = 'a7c9f3e21d04'
down_revision: Union[str, None] = 'ee2dd811eba5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        'usuarios',
        sa.Column('rol', sa.Enum('usuaria', 'admin', name='rol', native_enum=False), nullable=False, server_default='usuaria'),
    )
    op.add_column(
        'usuarios',
        sa.Column('activo', sa.Boolean(), nullable=False, server_default=sa.true()),
    )


def downgrade() -> None:
    op.drop_column('usuarios', 'activo')
    op.drop_column('usuarios', 'rol')
