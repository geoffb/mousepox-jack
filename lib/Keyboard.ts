export class Keyboard {

  private element: HTMLElement;

  private keyTime: Map<number, number> = new Map();

  private suppressed: number[] = [
    13, 32, 37, 38, 39, 40,
  ];

  private frame = 0;

  private firstInteract = false;

  constructor(element: HTMLElement) {
    this.element = element;
    this.element.addEventListener("keydown", this.keyDown.bind(this));
    this.element.addEventListener("keyup", this.keyUp.bind(this));
  }

  public onFirstInteract: () => void = () => undefined;

  public suppress(...keys: number[]) {
    for (const key of keys) {
      if (this.suppressed.indexOf(key) === -1) {
        this.suppressed.push(key);
      }
    }
  }

  public endFrame() {
    this.frame++;
  }

  public getKeyState(keyCode: number, frames = 0): boolean {
    const start = this.keyTime.get(keyCode);
    if (start !== undefined) {
      return (this.frame - start) <= frames;
    } else {
      return false;
    }
  }

  private keyDown(ev: KeyboardEvent) {
    if (!this.keyTime.has(ev.keyCode)) {
      this.keyTime.set(ev.keyCode, this.frame);
    }
    if (this.suppressed.indexOf(ev.keyCode) !== -1) {
      ev.preventDefault();
    }
    this.triggerFirstInteract();
  }

  private keyUp(ev: KeyboardEvent) {
    this.keyTime.delete(ev.keyCode);
    if (this.suppressed.indexOf(ev.keyCode) !== -1) {
      ev.preventDefault();
    }
    this.triggerFirstInteract();
  }

  private triggerFirstInteract() {
    if (this.firstInteract) { return; }
    this.onFirstInteract();
    this.firstInteract = true;
  }

}
