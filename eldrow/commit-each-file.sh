#!/bin/bash
# Commit each file in eldrow directory as a separate commit
cd /home/lynndabel/mini/eldrow

git init # Only runs if not already initialized

find . -type f | while read file; do
  git add "$file"
  git commit -m "Add $file"
  git reset
  git add "$file"
done
