

## [1.0.1](https://github.com/blzsaa/find-alias/compare/1.0.0...1.0.1) (2022-09-18)


### Bug Fixes

* add find-alias being installed as a requirement for loading find-alias.sh at shell startup time ([428ac59](https://github.com/blzsaa/find-alias/commit/428ac59453a4a13f7e4ea24590c50655530046ac))
* **history:** ignore adding empty commands to bash and zsh history ([1dac966](https://github.com/blzsaa/find-alias/commit/1dac96650bdd86b3668fa0e37885b198f9a5cd62))

# [1.0.0](https://github.com/blzsaa/find-alias/compare/0.1.0-0...1.0.0) (2022-06-20)


### Features

* add option to run without installation with npx ([9457d26](https://github.com/blzsaa/find-alias/commit/9457d26eae5bb99d794a43e1cfdd36d039061539))
* **install:** add option to configure find-alias's command-name, default remains: fa ([47b8217](https://github.com/blzsaa/find-alias/commit/47b821752da2e16872388caa4f01c5acfd606210))

# 0.1.0-0 (2022-06-15)


### Bug Fixes

* **exit:** fix `undefined: command not found` error when exit option is chosen ([ffdb467](https://github.com/blzsaa/find-alias/commit/ffdb4678c605cf4b77fdcd3337f0287ffcd2f70b))
* make exit command to quit without any error ([2271914](https://github.com/blzsaa/find-alias/commit/2271914ebb06f352dadc1123515d291a67f31c8b))
* **search:** fix search to include both shortcut and the command sequence ([b0240d5](https://github.com/blzsaa/find-alias/commit/b0240d5a9c65ba14e4cbc7815a770ef3ec4177cf))
* **shell script:** fix reading inputs with leading hyphen ([20e562b](https://github.com/blzsaa/find-alias/commit/20e562b2b5aae7751ab1765702d45334575d5f14))


### Features

* add basic find-alias functionalities: searching and executing aliases ([64711ae](https://github.com/blzsaa/find-alias/commit/64711ae1d84a3ae5162f525659cecc5800a9758d))
* add global installation ([09658d9](https://github.com/blzsaa/find-alias/commit/09658d90268f9fb6191b02508a0121f4e6f761e6))
* add names to arguments, rename bin from find-alias to fa so from now only fa is added to path ([da7fd73](https://github.com/blzsaa/find-alias/commit/da7fd73ec3c47b71e671ee6da32d15bb82343ee1))
* add option to add extra arguments to a chosen alias with tab button ([dafd4ce](https://github.com/blzsaa/find-alias/commit/dafd4ce2f3364878d8baff24d6873558d32e37bb))
* **alias execution:** make possible to execute aliases that use other aliases and env variables ([9798b95](https://github.com/blzsaa/find-alias/commit/9798b954f877e326ec5c91aeeaa300903195806a)), closes [/github.com/paxtonhare/demo-magic/blob/828ae78/demo-magic.sh#L158](https://github.com//github.com/paxtonhare/demo-magic/blob/828ae78/demo-magic.sh/issues/L158)
* migrate command execution to native linux solution from xdotool ([e61f828](https://github.com/blzsaa/find-alias/commit/e61f82839304268fdfabd15046a57b25cefe1cee))
* **publish:** make find-alias publishable to npm registry ([5b3cd64](https://github.com/blzsaa/find-alias/commit/5b3cd64005b7079b5076d36bdefa235fa83e6b8f))
* **ui:** make the number of rendered lines to depend on the height of the terminal ([5d39f95](https://github.com/blzsaa/find-alias/commit/5d39f95cd95d5cf44337369be386291af2beb072))
* **uninstall:** rewire no args calling to installation ([a4e1c88](https://github.com/blzsaa/find-alias/commit/a4e1c88e0001ecc2e8d04ab4c618bbca295c5dbc))