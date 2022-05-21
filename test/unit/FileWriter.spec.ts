import sinon from "ts-sinon";
import fs from "fs";
import chai from "chai";

import FileWriter from "@/FileWriter";

chai.should();

describe("writeToFile", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("when everything is okay", () => {
    it("should add a newline to command and write it to file", () => {
      const stub = sinon.stub(fs, "writeFileSync");

      FileWriter.writeToFile("foo.txt", "asd");

      sinon.assert.calledWith(stub, "foo.txt", "asd\n");
    });
  });
  describe("when file writing throws an exception", () => {
    it("should write exception to console.error", () => {
      sinon.stub(fs, "writeFileSync").throws(new Error("error-message"));
      const consoleStub = sinon.stub(console, "error");

      FileWriter.writeToFile("foo.txt", "asd");

      sinon.assert.calledOnce(consoleStub);
      consoleStub.getCall(0).args.should.have.length(1);
      consoleStub
        .getCall(0)
        .args[0].should.be.instanceof(Error)
        .and.have.property("message", "error-message");
    });
  });
});
