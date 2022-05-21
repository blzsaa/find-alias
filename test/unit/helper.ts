import sinon from "ts-sinon";

export function verifyLogs(
  consoleStub: sinon.SinonStub,
  ...expectedLogs: string[]
) {
  function stripAnsi(actual: string) {
    return actual.replace(
      /[\u001b\u009b][[()#;?]*(?:\d{1,4}(?:;\d{0,4})*)?[\dA-ORZcf-nqry=><]/g,
      ""
    );
  }
  expectedLogs.forEach((expectedLog, index) => {
    const actualMessage = consoleStub.getCall(index).args[0];
    stripAnsi(actualMessage).should.be.equal(expectedLog);
  });
  consoleStub.getCalls().should.have.length(expectedLogs.length);
}

export function transform(strings: string[]) {
  return strings.map((a) => {
    return { original: a, name: a, value: { key: a, command: a } };
  });
}
