import { Vector2 } from "@mousepox/math";

/** 2D scene graph node */
export class Actor {

  /** Position */
  public position = new Vector2();

  /** drawOrder: higher = closer to camera, lower = farther away */
  public drawOrder = 0;

  /** Scale */
  public scale = new Vector2(1, 1);

  /** Rotation, in radians */
  public rotation = 0;

  /** Parent actor */
  public parent: Actor | null = null;

  /** Visibility flag */
  public visible = true;

  /** Opacity value, between 0 (transparent) and 1 (opaque) */
  public opacity = 1;

  /** Child actors, rendered relative to this one */
  public children: Actor[] = [];

  /** Dispose of this Actor */
  public dispose() {
    // Remove from parent
    if (this.parent !== null) {
      this.parent.removeChild(this);
    }

    // Dispose children
    this.disposeChildren();
  }

  /** Dispose of this Actor's children */
  public disposeChildren() {
    // Loop through children in reverse order to prevent any .length issues
    for (let i = this.children.length - 1; i >= 0; --i) {
      this.children[i].dispose();
      this.children.splice(i, 1);
    }
  }

  /** Add a child actor */
  public addChild(child: Actor) {
    child.parent = this;
    this.children.push(child);

    this.sortChildren();
  }

  /** Remove a child actor */
  public removeChild(child: Actor) {
    if (child.parent === this) {
      child.parent = null;
    }
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }

  /** Render actor (and children) */
  public render(ctx: CanvasRenderingContext2D) {
    // Bail out if Actor isn't visible
    if (!this.visible || this.opacity <= 0) { return; }

    ctx.save();

    // Apply translation
    if (this.position.x !== 0 || this.position.y !== 0) {
      ctx.translate(
        Math.round(this.position.x),
        Math.round(this.position.y));
    }

    // Apply rotations
    if (this.rotation !== 0) {
      ctx.rotate(this.rotation);
    }

    // Apply scale
    if (this.scale.x !== 1 || this.scale.y !== 1) {
      ctx.scale(this.scale.x, this.scale.y);
    }

    if (this.opacity < 1) {
      ctx.globalAlpha = this.opacity;
    }

    // Render self
    this.renderSelf(ctx);

    // Render children
    for (const child of this.children) {
      child.render(ctx);
    }

    ctx.restore();
  }

  protected sortChildren(): void {
    this.children.sort((a: Actor, b: Actor) => {
      return a.drawOrder - b.drawOrder;
    });
  }

  // /** Invoked before rendering has begun; override in sublass */
  // protected renderBefore(_ctx: CanvasRenderingContext2D) {
  //   // Do custom setup before self and children are rendered
  //   return;
  // }

  /** Invoked when the actor should perform non-child rendering; override in subclass */
  protected renderSelf(_ctx: CanvasRenderingContext2D) {
    // Custom rendering
    return;
  }

  // /** Invoked after rendering has occurred; override in subclass */
  // protected renderAfter(_ctx: CanvasRenderingContext2D) {
  //   // Do custom cleanup after self and children have rendered
  //   return;
  // }

}
