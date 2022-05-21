import * as fs from "fs";

export default class FileWriter {
  static writeToFile(outputFile: string, command: string) {
    try {
      fs.writeFileSync(outputFile, `${command}\n`);
    } catch (err) {
      console.error(err);
    }
  }
}
