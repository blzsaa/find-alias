import sinon from "ts-sinon";

export function verifyLogs(
  consoleStub: sinon.SinonStub,
  ...expectedLogs: (string | undefined)[]
) {
  function stripAnsi(actual: unknown) {
    if (typeof actual === "string") {
      return actual.replace(
        /[\u001b\u009b][[()#;?]*(?:\d{1,4}(?:;\d{0,4})*)?[\dA-ORZcf-nqry=><]/g,
        ""
      );
    } else {
      return actual;
    }
  }
  consoleStub
    .getCalls()
    .map((call) => call.args[0])
    .map(stripAnsi)
    .should.be.deep.equal(expectedLogs);
  consoleStub.getCalls().should.have.length(expectedLogs.length);
}

export function transform(strings: string[]) {
  return strings.map((a) => {
    return { original: a, name: a, value: { key: a, command: a } };
  });
}
