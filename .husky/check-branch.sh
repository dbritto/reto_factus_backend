#!/usr/bin/env sh

# Obtener el nombre de la rama actual
LC_ALL=C
local_branch_name="$(git rev-parse --abbrev-ref HEAD)"

# Expresión regular para nombres válidos (puedes ajustarla a tu gusto)
valid_branch_regex="^(feature|fix|bugfix|hotfix|chore|refactor|docs|style|test|perf|ci|build|revert|experimental)\/[a-z0-9._-]+$|^(master|dev|qa)$"

if [[ ! $local_branch_name =~ $valid_branch_regex ]]; then
    echo "❌ ERROR: Nombre de rama inválido: '$local_branch_name'"
    echo "Formatos permitidos: feature/, fix/, hotfix/, chore/, docs/ o master/dev/qa"
    exit 1
fi

exit 0