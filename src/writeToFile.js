import fs from "fs";

export default function writeToFile(outputFile, answers) {
  try {
    fs.writeFileSync(outputFile, `${answers.result}\n`);
  } catch (err) {
    console.error(err);
  }
}
