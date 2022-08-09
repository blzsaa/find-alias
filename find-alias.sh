function <find-alias-caller> {
  if [[ -n "$BASH" ]]; then
    history -s <find-alias-caller >"$@"
  fi

  tmp_file=$(mktemp -t find-alias.XXXXXXX)
  aliases_tmp_file=$(mktemp -t find-alias.XXXXXXX)
  alias | cat >>"$aliases_tmp_file"
  command find-alias "$@" "$aliases_tmp_file" --page-size="$(tput lines)" --output-file="$tmp_file"
  result="$(<"$tmp_file")"
  rm -f "$tmp_file"
  rm -f "$aliases_tmp_file"
  if [[ -n "$result" ]]; then
    eval "$result"

    if [[ -n "$BASH" ]]; then
      history -s "$result"
    elif [[ -n "$ZSH_VERSION" ]]; then
      print -s "$result"
    fi
  fi
}
