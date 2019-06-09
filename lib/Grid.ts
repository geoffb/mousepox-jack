/** forEach callback signature */
type GridForEachCallback = (value: number, x: number, y: number) => void;

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

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.cells = new Array(width * height);
    this.cells.fill(0);
  }

  public get(x: number, y: number): number {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return -1;
    } else {
      const index = this.indexFromXY(x, y);
      return this.cells[index];
    }
  }

  public set(x: number, y: number, value: number) {
    const index = this.indexFromXY(x, y);
    this.cells[index] = value;
  }

  public forEach(fn: GridForEachCallback) {
    const len = this.cells.length;
    for (let i = 0; i < len; ++i) {
      fn(this.cells[i], i % this.width, Math.floor(i / this.width));
    }
  }

  public forEachInRect(x: number, y: number, width: number, height: number, fn: GridForEachCallback) {
    for (let iy = y; iy < y + height; ++iy) {
      for (let ix = x; ix < x + width; ++ix) {
        fn(this.get(ix, iy), ix, iy);
      }
    }
  }

  private indexFromXY(x: number, y: number): number {
    return y * this.width + x;
  }

}
