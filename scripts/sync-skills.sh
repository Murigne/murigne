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
  if [ ! -d "$target" ]; then
    echo "⚠ skipped target $target (directory does not exist)"
    continue
  fi
  for skill in "${SKILLS[@]}"; do
    src="$SKILLS_SRC/$skill/SKILL.md"
    dst_dir="$target/$skill"
    dst="$dst_dir/SKILL.md"
    if [ -f "$src" ]; then
      mkdir -p "$dst_dir"
      cp "$src" "$dst"
      echo "✓ $skill → $target"
    else
      echo "⚠ skipped $skill (source does not exist: $src)"
    fi
  done
done

echo ""
echo "✓ sync complete"
