import { Actor } from "./Actor";
import { SpriteSheet } from "./SpriteSheet";

export interface ISpriteFont {
  glyphs: string;
  sheet: SpriteSheet;
}

/** Parses text into lines */
function parseLines(text: string, size: number, maxWidth: number): string[] {
  // Parsed lines
  const lines: string[] = [];

  // If no maximum width is set, create a single line
  if (maxWidth === 0) {
    lines.push(text);
    return lines;
  }

  // Track current line index
  let lineIndex = 0;

  // Split source text into words
  const words = text.split(" ");

  // Iterate over each word and either append to current line
  // or break and start and new line
  for (const word of words) {
    if (lines.length === 0) {
      // If the current line has no text, always append the current word
      lines.push(word);
    } else {
      // Otherwise measure the word size and check
      // if it can be appended to the current line
      const width = ((word.length + 1) * size); // +1 for the space prefix
      const len = lines[lineIndex].length * size;
      if (len + width <= maxWidth) {
        // Append to current line
        lines[lineIndex] += " " + word;
      } else {
        // Break to next line
        lines.push(word);
        lineIndex++;
      }
    }
  }

  return lines;
}

export class SpriteText extends Actor {

  /** Default font for new SpriteText objects */
  public static DefaultFont: ISpriteFont | undefined;

  /** Maximum width before line breaking; 0 = no limit */
  public maxWidth = 0;

  /** Amount of spacing between horizontal lines */
  public lineSpacing = 4;

  /** Text size */
  public size: number;

  /** Font */
  public font: ISpriteFont;

  /** Parsed lines */
  private lines: string[] = [];

  /** The height of a single line */
  public get lineHeight(): number {
    return this.size + this.lineSpacing;
  }

  /** Set displayed text */
  public set text(text: string | undefined) {
    if (text !== undefined) {
      this.lines = parseLines(text, this.size, this.maxWidth);
    } else {
      this.lines.length = 0;
    }
  }

  constructor(text?: string, size?: number, font?: ISpriteFont) {
    super();
    if (font === undefined && SpriteText.DefaultFont === undefined) {
      throw new Error("A font must be specified or SpriteText.Default font must be set");
    }
    this.text = text;
    this.size = size ?? 8;
    this.font = font ?? SpriteText.DefaultFont!;
  }

  protected renderSelf(ctx: CanvasRenderingContext2D) {
    const { glyphs, sheet } = this.font;

    // Iterate over each line and render
    let x = 0;
    let y = 0;
    for (const line of this.lines) {
      // Iterate over each character and render sprite glyph
      for (const char of line) {
        // Lookup sprite glyph index
        const index = glyphs.indexOf(char.toUpperCase());

        // Only render valid glyphs
        // Spaces are considerd invalid glyphs
        if (index !== -1) {
          // Render sprite
          const sprite = sheet.getSpriteBounds(index);
          ctx.drawImage(sheet.image,
            sprite.x, sprite.y, sprite.width, sprite.height,
            x, y, this.size, this.size);
        }

        // Increment render x
        x += this.size;
      }

      // Break to next line
      x = 0;
      y += this.size + this.lineSpacing;
    }
  }

}
