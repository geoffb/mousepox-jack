export class Keyboard {

  private element: HTMLElement;

  private keyTime: Map<number, number> = new Map();

  private frame = 0;

  constructor(element: HTMLElement) {
    this.element = element;
    this.element.addEventListener("keydown", this.keyDown.bind(this));
    this.element.addEventListener("keyup", this.keyUp.bind(this));
  }

  public endFrame() {
    this.frame++;
  }

  public getKeyState(keyCode: number): boolean {
    const start = this.keyTime.get(keyCode);
    if (start !== undefined) {
      return (this.frame - start) === 0;
    } else {
      return false;
    }
  }

  private keyDown(ev: KeyboardEvent) {
    // console.log("keydown", ev);
    if (!this.keyTime.has(ev.keyCode)) {
      this.keyTime.set(ev.keyCode, this.frame);
    }
  }

  private keyUp(ev: KeyboardEvent) {
    // console.log("keyup", ev);
    this.keyTime.delete(ev.keyCode);
  }

}
