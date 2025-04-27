"""rename outside to rest in entry_timing

Revision ID: 59a08837b958
Revises: 94c15a07da82
Create Date: 2025-04-06 17:21:11.147592

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '59a08837b958'
down_revision: Union[str, None] = '94c15a07da82'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
