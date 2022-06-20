function <find-alias-caller> {
  if [[ -n "$BASH" ]]; then
    history -s <find-alias-caller> "$@"
  fi

  tmp_file=$(mktemp -t find-alias.XXXXXXX)
  command find-alias "$@" "$(alias | cat)" --page-size="$(tput lines)" --output-file="$tmp_file"
  result="$(<"$tmp_file")"
  rm -f "$tmp_file"
  eval "$result"

  if [[ -n "$BASH" ]]; then
    history -s "$result"
  elif [[ -n "$ZSH_VERSION" ]]; then
    print -s "$result"
  fi
}
