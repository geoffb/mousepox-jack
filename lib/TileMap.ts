import { clamp, Grid, IPoint } from "@mousepox/math";
import { Box } from "./Box";
import { SpriteSheet } from "./SpriteSheet";

/** A scrolling tile map */
export class TileMap extends Box {

  public sheet: SpriteSheet;

  public grid?: Grid;

  /** The scrolling offset of this map, in pixels */
  private readonly offset: IPoint;

  private readonly renderOrigin: IPoint;

  private readonly renderTerminus: IPoint;

  public get offsetX(): number {
    return this.offset.x;
  }

  public set offsetX(value: number) {
    this.offset.x = clamp(value, 0, this.maxOffsetX);
    this.calculateRenderBoundsX();
  }

  public get offsetY(): number {
    return this.offset.y;
  }

  public set offsetY(value: number) {
    this.offset.y = clamp(value, 0, this.maxOffsetY);
    this.calculateRenderBoundsY();
  }

  private get maxOffsetX(): number {
    return Math.max((this.grid?.width ?? 0) * this.sheet.width - this.width, 0);
  }

  private get maxOffsetY(): number {
    return Math.max((this.grid?.height ?? 0) * this.sheet.height - this.height, 0);
  }

  private get drawOffsetX(): number {
    return (-this.width / 2) - (this.offset.x % this.sheet.width);
  }

  private get drawOffsetY(): number {
    return (-this.height / 2) - (this.offset.y % this.sheet.height);
  }

  constructor(width: number, height: number, sheet: SpriteSheet, grid?: Grid) {
    super(width, height, undefined, true);
    this.offset = { x: 0, y: 0 };
    this.renderOrigin = { x: 0, y: 0 };
    this.renderTerminus = { x: 0, y: 0 };
    this.sheet = sheet;
    this.grid = grid;
    this.calculateRenderBoundsX();
    this.calculateRenderBoundsY();
  }

  protected renderSelf(ctx: CanvasRenderingContext2D): void {
    if (this.grid === undefined) { return; }
    super.renderSelf(ctx);

    const dx = this.drawOffsetX;
    const dy = this.drawOffsetY;

    const tw = this.sheet.width;
    const th = this.sheet.height;

    for (let y = this.renderOrigin.y; y <= this.renderTerminus.y; y++) {
      for (let x = this.renderOrigin.x; x <= this.renderTerminus.x; x++) {
        if (!this.grid.valid(x, y)) { continue; }
        const index = this.grid.get(x, y);
        const bounds = this.sheet.getSpriteBounds(index);
        ctx.drawImage(this.sheet.image,
          bounds.x, bounds.y, tw, th,
          Math.round(dx + (x - this.renderOrigin.x) * tw),
          Math.round(dy + (y - this.renderOrigin.y) * th),
          tw, th);
      }
    }
  }

  /** Calculate the origin and terminus tile bounds from current scroll offset */
  private calculateRenderBoundsX(): void {
    this.renderOrigin.x = Math.floor(this.offset.x / this.sheet.width);
    this.renderTerminus.x = Math.floor((this.offset.x + this.width) / this.sheet.width);
  }

  private calculateRenderBoundsY(): void {
    this.renderOrigin.y = Math.floor(this.offset.y / this.sheet.height);
    this.renderTerminus.y = Math.floor((this.offset.y + this.height) / this.sheet.height);
  }

}
