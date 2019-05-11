import { IPoint } from "@mousepox/math";

interface IAStarNode {
  index: number;
  f: number;
  g: number;
  parent?: IAStarNode;
}

export class Grid {

  public width: number;

  public height: number;

  public cells: number[];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.cells = new Array(width * height);
    this.cells.fill(0);
  }

  public get(x: number, y: number): number {
    const index = this.indexFromXY(x, y);
    return this.cells[index];
  }

  public set(x: number, y: number, value: number) {
    const index = this.indexFromXY(x, y);
    this.cells[index] = value;
  }

  public forEach(fn: (value: number, x: number, y: number) => void) {
    const len = this.cells.length;
    for (let i = 0; i < len; ++i) {
      fn(this.cells[i], i % this.width, Math.floor(i / this.width));
    }
  }

  public findPath(ox: number, oy: number, tx: number, ty: number): IPoint[] | undefined {

    // TODO: Find path from ox/oy to tx/ty

    const origin = {
      f: 0,
      g: 0,
      index: this.indexFromXY(ox, oy),
    };

    const terminus = {
      f: 0,
      g: 0,
      index: this.indexFromXY(tx, ty),
    };

    const open: IAStarNode[] = [origin];
    const closed: IAStarNode[] = [];

    while (open.length > 0) {
      // todo stuff
    }

    // No valid path found
    return undefined;
  }

  private indexFromXY(x: number, y: number): number {
    return y * this.width + x;
  }

}
