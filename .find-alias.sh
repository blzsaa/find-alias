# find-alias
function fa {
  tmp_file=$(mktemp -t find-alias.XXXXXXX)
  command fa "$1" --aliases "$(alias | cat)" --height "$(tput lines)" --output-file "$tmp_file"
  result=$(<"$tmp_file")
  rm -f "$tmp_file"
  READLINE_LINE=$result
  ${READLINE_LINE}
  READLINE_POINT=${#result}
}
