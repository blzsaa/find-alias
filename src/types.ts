import Separator from "inquirer/lib/objects/separator";

export type PromptLine =
  | { original: string; name: string; value: { key: string; command: string } }
  | Separator;
