import sinon from "ts-sinon";
import chai, { assert } from "chai";
import { verifyLogs } from "./helper";
import FindAliasCommandInterpreter from "../../src/FindAliasCommandInterpreter";

chai.should();

const helpMessage = [
  "find-alias [--pageSize <pageSize>] [--output-file <output-file>] <aliases>",
  "find-alias --configure",
  "find-alias --configure <command-name>",
  "",
  "Options:",
  "  -v, --version     Show version number                                [boolean]",
  "  -c, --configure   configure find-alias to be called by <command-name>, if not",
  "                    specified, it will be called fa                     [string]",
  "  -o, --outputFile  output-file                                         [string]",
  "  -p, --pageSize    number of lines that will be rendered  [number] [default: 4]",
  "  -h, --help        Show help                                          [boolean]",
].join("\n");

describe("FindAliasCommandInterpreter", () => {
  let consoleLogStub: sinon.SinonStub;
  let consoleErrorStub: sinon.SinonStub;

  beforeEach(() => {
    sinon.stub(process, "exit").throws(new Error("process.exit"));
    consoleLogStub = sinon.stub(console, "log");
    consoleErrorStub = sinon.stub(console, "error");
  });

  afterEach(() => {
    sinon.restore();
  });

  [
    { testName: "when calling with --help", args: ["--help"] },
    { testName: "when calling with -h", args: ["-h"] },
  ].forEach((test) => {
    describe(test.testName, () => {
      it("should print out the help", () => {
        assert.throws(
          () => FindAliasCommandInterpreter.interpret(test.args),
          "process.exit"
        );

        verifyLogs(consoleLogStub, helpMessage);
      });
    });
  });
  describe("when calling with configure flag", () => {
    it("should add fa as default value of configure object", () => {
      const actual = FindAliasCommandInterpreter.interpret(["--configure"]);

      actual.should.be.deep.equal({
        configure: "fa",
      });
      verifyLogs(consoleLogStub);
      verifyLogs(consoleErrorStub);
    });
  });
  describe("when calling with configure flag and a value", () => {
    it("should add the value to configure object", () => {
      const actual = FindAliasCommandInterpreter.interpret([
        "--configure",
        "value",
      ]);

      actual.should.be.deep.equal({
        configure: "value",
      });
      verifyLogs(consoleLogStub);
      verifyLogs(consoleErrorStub);
    });
  });
  describe("calling without any parameter", () => {
    it("should write out aliases file is required and show help", () => {
      assert.throws(
        () => FindAliasCommandInterpreter.interpret([]),
        "process.exit"
      );

      verifyLogs(
        consoleErrorStub,
        helpMessage,
        undefined,
        "aliases file is required"
      );
    });
  });
  describe("calling without alias", () => {
    it("should write out aliases file is required and show help", () => {
      assert.throws(
        () =>
          FindAliasCommandInterpreter.interpret([
            "--output-file",
            "outputFile",
            "--page-size",
            "5",
          ]),
        "process.exit"
      );

      verifyLogs(
        consoleErrorStub,
        helpMessage,
        undefined,
        "aliases file is required"
      );
    });
  });
  describe("calling with two aliases", () => {
    it("should write out only one aliases file is allowed and show help", () => {
      assert.throws(
        () => FindAliasCommandInterpreter.interpret(["alias1", "alias2"]),
        "process.exit"
      );

      verifyLogs(
        consoleErrorStub,
        helpMessage,
        undefined,
        "only one aliases file is allowed"
      );
    });
  });
  describe("calling with one alias and no extra arguments", () => {
    it("should return with the alias and 4 as default value for page-size", () => {
      const actual = FindAliasCommandInterpreter.interpret(["aliasFile"]);

      actual.should.be.deep.equal({
        aliases: "aliasFile",
        outputFile: undefined,
        pageSize: 4,
      });
      verifyLogs(consoleLogStub);
      verifyLogs(consoleErrorStub);
    });
  });
  describe("calling with one alias and output", () => {
    it("should return with the alias, output-file and 4 as default value for page-size", () => {
      const actual = FindAliasCommandInterpreter.interpret([
        "aliasFile",
        "--output-file",
        "outputFile",
      ]);

      actual.should.be.deep.equal({
        aliases: "aliasFile",
        outputFile: "outputFile",
        pageSize: 4,
      });
      verifyLogs(consoleLogStub);
      verifyLogs(consoleErrorStub);
    });
  });
  describe("calling with alias, output and page-size", () => {
    it("should return with full object", () => {
      const actual = FindAliasCommandInterpreter.interpret([
        "aliasFile",
        "--output-file",
        "outputFile",
        "--page-size",
        "5",
      ]);

      actual.should.be.deep.equal({
        aliases: "aliasFile",
        outputFile: "outputFile",
        pageSize: 5,
      });
      verifyLogs(consoleLogStub);
      verifyLogs(consoleErrorStub);
    });
  });
});
