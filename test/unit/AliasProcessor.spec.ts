import * as chai from "chai";

import inquirer from "inquirer";
import pc from "picocolors";
import AliasProcessor from "@/AliasProcessor";
import { PromptLine } from "@/types";
import sinon from "ts-sinon";
import fs from "fs";

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
  let readFileSync: sinon.SinonStub;

  beforeEach(() => {
    readFileSync = sinon.stub(fs, "readFileSync");
  });

  afterEach(() => {
    actual?.should.deep.contain(new inquirer.Separator()).and.deep.contain({
      name: pc.red("<<exit>>"),
      value: { key: "", command: "" },
      original: "<<exit>>",
    });
    actual = undefined;
    sinon.restore();
  });
  describe("when no alias is sent to processAliases", () => {
    describe("input aliasList is: emptyString", () => {
      it("should return with separator and exit", () => {
        readFileSync.withArgs("aliasFile").returns("");
        actual = AliasProcessor.processAliases("aliasFile");
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
      readFileSync.withArgs("aliasFile").returns("alias asd='echo asd'");
      actual = AliasProcessor.processAliases("aliasFile");
      actual[0].should.be.deep.equal(expected);
    });
    it("should ignore double dash", () => {
      readFileSync.withArgs("aliasFile").returns("alias -- asd='echo asd'");

      actual = AliasProcessor.processAliases("aliasFile");
      actual[0].should.be.deep.equal(expected);
    });
    it("should process ZSH format aliases well", () => {
      readFileSync.withArgs("aliasFile").returns("asd='echo asd'");

      actual = AliasProcessor.processAliases("aliasFile");
      actual[0].should.be.deep.equal(expected);
    });
  });

  describe("when the input is multiple aliases", () => {
    it("should split them and process them separately", () => {
      readFileSync
        .withArgs("aliasFile")
        .returns(
          [
            "alias asd0='echo asd0'",
            "alias -- asd1='echo asd1'",
            "asd2='echo asd2'",
          ].join("\n")
        );
      actual = AliasProcessor.processAliases("aliasFile");
      actual[0].should.be.deep.equal(expectedDummyAlias("asd0"));
      actual[1].should.be.deep.equal(expectedDummyAlias("asd1"));
      actual[2].should.be.deep.equal(expectedDummyAlias("asd2"));
    });
  });
});
