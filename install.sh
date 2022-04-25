function fa {
  tmp_file=$(mktemp -t find-alias.XXXXXXX)
  node ~/.find-alias "$(tput lines)" "$tmp_file" "$(alias | cat)"
  result=$(<"$tmp_file")
  rm -f "$tmp_file"
  READLINE_LINE=$result
  ${READLINE_LINE}
  READLINE_POINT=${#result}
}
