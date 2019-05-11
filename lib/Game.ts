import { TweenGroup } from "@mousepox/tween";
import { Actor } from "./Actor";
import { Surface } from "./Surface";

/** A 2D game */
export class Game {

  /** Main drawing surfadce */
  public stage: Surface;

  /** Scene graph root */
  public scene = new Actor();

  /** Tween animations */
  public tweens = new TweenGroup();

  /** Last update time */
  private updateTime = -1;

  /** Whether the game is currently running */
  private running = false;

  /** Animation callback */
  private animFrameHandler: (time: number) => void;

  constructor(width: number, height: number) {
    // Initialize stage
    this.stage = new Surface(width, height);
    const style = this.stage.canvas.style;
    style.position = "absolute";
    style.left = "0";
    style.top = "0";

    document.body.appendChild(this.stage.canvas);

    this.fitStageToWindow();

    // Automatically adjust stage to window size when it changes
    window.addEventListener("resize", this.fitStageToWindow.bind(this), false);

    this.animFrameHandler = this.update.bind(this);
  }

  public onUpdateBegin = () => { return; };

  public onUpdateEnd = () => { return; };

  /** Start game */
  public start() {
    this.running = true;
    this.updateTime = performance.now();
    window.requestAnimationFrame(this.animFrameHandler);
  }

  /** Stop game */
  public stop() {
    this.running = false;
  }

  /** Update game */
  private update(time: number) {
    // Calculate delta time
    const dt = time - this.updateTime;
    this.updateTime = time;

    this.onUpdateBegin();

    // Update tween animations
    this.tweens.update(dt);

    // Render game
    this.render();

    this.onUpdateEnd();

    // While running, keep requesting animation frames
    if (this.running) {
      window.requestAnimationFrame(this.animFrameHandler);
    }
  }

  /** Render game */
  private render() {
    const ctx = this.stage.context;

    // Reset transformation matrix
    ctx.resetTransform();

    // Render scene graph
    this.scene.render(ctx);
  }

  /** Fit stage canvas to current window size */
  private fitStageToWindow() {
    const canvas = this.stage.canvas;

    // Viewport width
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Determine scale while maintaining aspect ratio
    const scale = Math.min(width / canvas.width, height / canvas.height);

    // Calculate centered position for scaled canvas
    const left = width / 2 - (canvas.width / 2 * scale);
    const top = height / 2 - (canvas.height / 2 * scale);

    // Apply styles
    canvas.style.transformOrigin = "0 0";
    canvas.style.transform = `scale(${scale}, ${scale})`;
    canvas.style.left = `${left}px`;
    canvas.style.top = `${top}px`;
  }

}
