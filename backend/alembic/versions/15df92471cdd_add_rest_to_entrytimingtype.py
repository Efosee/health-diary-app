"""add rest to entrytimingtype

Revision ID: 15df92471cdd
Revises: f26b28319fe3
Create Date: 2025-04-07 00:30:25.551278

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '15df92471cdd'
down_revision: Union[str, None] = 'f26b28319fe3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("ALTER TYPE entrytimingtype ADD VALUE 'rest'")


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("""
            CREATE TYPE entrytimingtype_new AS ENUM ('before', 'after');
            ALTER TABLE personal_training_entries
                ALTER COLUMN entry_timing TYPE entrytimingtype_new
                USING (entry_timing::text::entrytimingtype_new),
                ALTER COLUMN entry_timing SET DEFAULT 'before';
            ALTER TABLE event_training_entries
                ALTER COLUMN entry_timing TYPE entrytimingtype_new
                USING (entry_timing::text::entrytimingtype_new),
                ALTER COLUMN entry_timing SET DEFAULT 'before';
            DROP TYPE entrytimingtype;
            ALTER TYPE entrytimingtype_new RENAME TO entrytimingtype;
        """)
