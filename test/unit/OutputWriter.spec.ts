import sinon from "ts-sinon";
import fs from "fs";
import chai from "chai";
import sinonChai = require("sinon-chai");

import OutputWriter from "@/OutputWriter";

chai.should();
chai.use(sinonChai);

describe("OutputWriter", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("when called with outputFile", function () {
    describe("and everything is okay", () => {
      it("should add a newline to command and write it to file", () => {
        const stub = sinon.stub(fs, "writeFileSync");

        OutputWriter.write("foo.txt", "asd");

        sinon.assert.calledWith(stub, "foo.txt", "asd\n");
      });
    });
    describe("and file writing throws an exception", () => {
      it("should write exception to console.error", () => {
        sinon.stub(fs, "writeFileSync").throws(new Error("error-message"));
        const consoleStub = sinon.stub(console, "error");

        OutputWriter.write("foo.txt", "asd");

        sinon.assert.calledOnce(consoleStub);
        consoleStub.should.have.been.calledOnce;
        consoleStub
          .getCall(0)
          .args[0].should.be.instanceof(Error)
          .and.have.property("message", "error-message");
      });
    });
  });
  describe("when called without outputFile", function () {
    it("should write command to the console", () => {
      const writeFileSync = sinon.stub(fs, "writeFileSync");
      const consoleStub = sinon.stub(console, "log");

      OutputWriter.write(undefined, "asd");

      consoleStub.should.be.calledWith("asd");
      writeFileSync.should.not.be.called;
    });
  });
});
