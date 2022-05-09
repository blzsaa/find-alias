import fs from "fs";

export default class FileWriter {
  static writeToFile(outputFile, command) {
    try {
      fs.writeFileSync(outputFile, `${command}\n`);
    } catch (err) {
      console.error(err);
    }
  }
}
