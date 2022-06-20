import Separator from "inquirer/lib/objects/separator";

export type PromptLine =
  | { original: string; name: string; value: { key: string; command: string } }
  | Separator;

export type Command =
  | {
      configure: string;
    }
  | { aliases: string; outputFile: string | undefined; pageSize: number };
