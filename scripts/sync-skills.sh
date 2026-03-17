#!/bin/bash
# sync-skills.sh
# Syncs canonical skills/ to all agent .claude/skills/ locations.
# Run this after updating any skill in skills/.
# .claude/ is intentionally excluded from git (gastown convention).

set -e
REPO="$(git rev-parse --show-toplevel)"
SKILLS_SRC="$REPO/skills"

TARGETS=(
  "$REPO/.claude/skills"
  "$REPO/../../crew/herbert/.claude/skills"
  "$REPO/../../refinery/rig/.claude/skills"
)

SKILLS=(financial-data frontend-design pm-spec backend-api database testing performance security accessibility)

for target in "${TARGETS[@]}"; do
  for skill in "${SKILLS[@]}"; do
    src="$SKILLS_SRC/$skill/SKILL.md"
    dst="$target/$skill/SKILL.md"
    if [ -f "$src" ] && [ -f "$dst" ]; then
      cp "$src" "$dst"
      echo "✓ $skill → $target"
    elif [ -f "$src" ] && [ ! -f "$dst" ]; then
      echo "⚠ skipped $skill → $target (destination does not exist)"
    fi
  done
done

echo ""
echo "✓ sync complete"
