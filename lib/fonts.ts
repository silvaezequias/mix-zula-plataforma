import { FontStyle, Weight } from "@/types/font";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const FONT_CONFIG: {
  name: string;
  weight: Weight;
  style: FontStyle;
  file: string;
}[] = [
  { name: "Roboto", weight: 400, style: "normal", file: "Roboto-Regular.ttf" },
  {
    name: "Roboto",
    weight: 700,
    style: "normal",
    file: "Roboto-ExtraBold.ttf",
  },
  {
    name: "Roboto",
    weight: 700,
    style: "italic",
    file: "Roboto-ExtraBoldItalic.ttf",
  },
  { name: "Roboto", weight: 800, style: "normal", file: "Roboto-Bold.ttf" },
  {
    name: "Roboto",
    weight: 800,
    style: "italic",
    file: "Roboto-BoldItalic.ttf",
  },
  { name: "Roboto", weight: 900, style: "normal", file: "Roboto-Black.ttf" },
  {
    name: "Roboto",
    weight: 900,
    style: "italic",
    file: "Roboto-BlackItalic.ttf",
  },
];

export async function getFontData() {
  return Promise.all(
    FONT_CONFIG.map(async (font) => {
      const fontPath = join(process.cwd(), "/public/fonts", font.file);
      const data = (await readFile(fontPath)) as unknown as ArrayBuffer;

      return {
        name: font.name,
        data,
        weight: font.weight,
        style: font.style,
      };
    }),
  );
}
