import run, { DOWN, ENTER } from "inquirer-test";
import { fileURLToPath } from "url";
import { dirname } from "path";
import * as chai from "chai";

import tmp from "tmp";
import fs from "fs";

chai.should();
const filename = fileURLToPath(import.meta.url);
const pathToMainScript = `${dirname(filename)}/../../src/index.js`;
const TAB = "\t";

describe("find-alias", () => {
  let outputFile;

  async function runFa(aliases, combo) {
    const a = aliases.join("\n");
    const aa = [
      pathToMainScript,
      "--aliases",
      a,
      "--output-file",
      outputFile.name,
    ];
    return run(aa, combo, 300);
  }

  beforeEach(() => {
    outputFile = tmp.fileSync();
  });
  after(() => {
    tmp.setGracefulCleanup();
  });
  describe("when calling with only one alias", () => {
    describe("and pressing enter", () => {
      it("should write alias key to output file", async () => {
        await runFa(["alias asd1='echo asd1'"], [ENTER]);

        const data = fs.readFileSync(outputFile.name, "utf8");
        data.should.equal("asd1\n");
      });
    });
  });
  describe("when calling with multiple aliases", () => {
    describe("and pressing down and enter", () => {
      it("should write second alias key to output file", async () => {
        await runFa(
          ["alias asd1='echo asd1'", "alias asd2='echo asd2'"],
          [DOWN, ENTER]
        );

        const data = fs.readFileSync(outputFile.name, "utf8");
        data.should.equal("asd2\n");
      });
    });
    describe("and filtering to the second alias and pressing enter", async () => {
      it("should write second alias key to output file", async () => {
        await runFa(
          ["alias asd1='echo asd1'", "alias asd2='echo asd2'"],
          ["d2", ENTER]
        );
        const data = fs.readFileSync(outputFile.name, "utf8");
        data.should.equal("asd2\n");
      });
      it("should only show matching aliases on screen", async () => {
        await runFa(
          ["alias www='echo www'", "alias asd2='echo asd2'"],
          ["d2", DOWN, ENTER]
        );
        const data = fs.readFileSync(outputFile.name, "utf8");
        data.should.equal("asd2\n");
      });
    });
    describe("and filtering to the second alias and pressing tab", async () => {
      it("should write second alias key to output file", async () => {
        // this.timeout(60000);
        await runFa(
          ["alias www='echo www'", "alias asd2='echo asd2'"],
          ["d2", TAB, "suffix", ENTER]
        );
        const data = fs.readFileSync(outputFile.name, "utf8");
        data.should.equal("asd2 suffix\n");
      });
    });
  });
  describe("when opening from ZSH", () => {
    it("should work as well", async () => {
      await runFa(["asd1='echo asd1'", "asd2='echo asd2'"], [DOWN, ENTER]);

      const data = fs.readFileSync(outputFile.name, "utf8");
      data.should.equal("asd2\n");
    });
  });
});
