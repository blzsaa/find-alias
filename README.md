# FIND ALIAS

**Find-alias** is an interactive alias finder and executor.

## Pre requirements

- xdotool on PATH
- to install xdotool
  - on linux [see](https://github.com/jordansissel/xdotool)
  - on Windows (for git bash) [see](https://github.com/ebranlard/xdotool-for-windows)

## Installation

- `git clone https://github.com/blzsaa/find-alias.git $HOME/.find-alias`
- `cd $HOME/.find-alias; npm ci`
- Add the following line to your \*rc (.zshrc, .bashrc, .bash_profile in OSX):  
  `[[ -s "$HOME/.find-alias/index.js" ]] && alias fa='node $HOME/.find-alias/index.js $(tput lines) $(alias)'`

## Usage

- run `fa`
- write in any keyword in the quick filter and choose any of the aliases to run

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
