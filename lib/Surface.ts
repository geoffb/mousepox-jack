/** 2D rendering surface */
export class Surface {

  /** Canvas element */
  public canvas: HTMLCanvasElement;

  /** Canvas 2D rendering context */
  public context: CanvasRenderingContext2D;

  public get width(): number {
    return this.canvas.width;
  }

  public get height(): number {
    return this.canvas.height;
  }

  public set pixelated(value: boolean) {
    this.context.imageSmoothingEnabled = !value;
    this.canvas.style.setProperty("image-rendering", value ? "crisp-edges" : "auto");
  }

  constructor(width: number, height: number, pixelated = true) {
    // Initialize canvas
    this.canvas = document.createElement("canvas");
    this.canvas.className = "jack-surface";
    this.resize(width, height);

    // Initialize rendering context
    this.context = this.canvas.getContext("2d", {
      alpha: false,
    }) as CanvasRenderingContext2D;

    this.pixelated = pixelated;
  }

  public resize(width: number, height: number) {
    this.canvas.width = Math.ceil(width);
    this.canvas.height = Math.ceil(height);
  }

}
