# find-alias
function fa {
  if [[ -n "$BASH" ]]; then
    history -s fa "$@"
  fi

  tmp_file=$(mktemp -t find-alias.XXXXXXX)
  command fa "$@" --aliases="$(alias | cat)" --height="$(tput lines)" --output-file="$tmp_file"
  result="$(<"$tmp_file")"
  rm -f "$tmp_file"
  eval "$result"

  if [[ -n "$BASH" ]]; then
    history -s "$result"
  elif [[ -n "$ZSH_VERSION" ]]; then
    print -s "$result"
  fi
}
