import * as chai from "chai";

import inquirer from "inquirer";
import pc from "picocolors";
import AliasProcessor from "@/AliasProcessor";
import { PromptLine } from "@/types";

chai.should();

function expectedDummyAlias(command: string) {
  return {
    name: pc.bold(command) + pc.gray(`='echo ${command}'`),
    value: { key: command, command: `echo ${command}` },
    original: `${command}='echo ${command}'`,
  };
}

describe("processAliases", () => {
  let actual: PromptLine[] | undefined = undefined;
  afterEach(() => {
    actual?.should.deep.contain(new inquirer.Separator()).and.deep.contain({
      name: pc.red("<<exit>>"),
      value: { key: "", command: "" },
      original: "<<exit>>",
    });
    actual = undefined;
  });
  describe("when no alias is sent to processAliases", () => {
    describe("input aliasList is: emptyString", () => {
      it("should return with separator and exit", () => {
        actual = AliasProcessor.processAliases("");
        actual.should.be.deep.equal([
          new inquirer.Separator(),
          {
            name: pc.red("<<exit>>"),
            value: { key: "", command: "" },
            original: "<<exit>>",
          },
        ]);
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
