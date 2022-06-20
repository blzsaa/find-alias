import * as fs from "fs";

export default class OutputWriter {
  static write(outputFile: string | undefined, command: string) {
    if (outputFile) {
      try {
        fs.writeFileSync(outputFile, `${command}\n`);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log(command);
    }
  }
}
