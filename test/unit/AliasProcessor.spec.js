import * as chai from "chai";

import inquirer from "inquirer";
import chalk from "chalk";
import AliasProcessor from "../../src/AliasProcessor.js";

chai.should();

function expectedDummyAlias(command) {
  return {
    name: chalk.bold(command) + chalk.gray(`='echo ${command}'`),
    value: { key: command, command: `echo ${command}` },
    original: `${command}='echo ${command}'`,
  };
}

describe("processAliases", () => {
  let actual;
  afterEach(() => {
    actual.should.deep.contain(new inquirer.Separator(), {
      name: chalk.red("<<exit>>"),
      value: { key: "", command: "" },
      original: "<<exit>>",
    });
    actual = undefined;
  });
  describe("when no alias is sent to processAliases", () => {
    [
      { value: "", name: "emptyString" },
      { value: null, name: "null" },
      { value: undefined, name: "undefined" },
    ].forEach((input) => {
      describe(`input aliasList is: ${input.name}`, () => {
        it("should return with separator and exit", () => {
          actual = AliasProcessor.processAliases(input.value);
          actual.should.be.deep.equal([
            new inquirer.Separator(),
            {
              name: chalk.red("<<exit>>"),
              value: { key: "", command: "" },
              original: "<<exit>>",
            },
          ]);
        });
      });
    });
  });

  describe("when the input is one alias", () => {
    const expected = expectedDummyAlias("asd");
    it("should be transformed", () => {
      actual = AliasProcessor.processAliases("alias asd='echo asd'");
      actual[0].should.be.deep.equal(expected);
    });
    it("should ignore double dash", () => {
      actual = AliasProcessor.processAliases("alias -- asd='echo asd'");
      actual[0].should.be.deep.equal(expected);
    });
    it("should process ZSH format aliases well", () => {
      actual = AliasProcessor.processAliases("asd='echo asd'");
      actual[0].should.be.deep.equal(expected);
    });
  });

  describe("when the input is multiple aliases", () => {
    it("should split them and process them separately", () => {
      actual = AliasProcessor.processAliases(
        [
          "alias asd0='echo asd0'",
          "alias -- asd1='echo asd1'",
          "asd2='echo asd2'",
        ].join("\n")
      );
      actual[0].should.be.deep.equal(expectedDummyAlias("asd0"));
      actual[1].should.be.deep.equal(expectedDummyAlias("asd1"));
      actual[2].should.be.deep.equal(expectedDummyAlias("asd2"));
    });
  });
});
