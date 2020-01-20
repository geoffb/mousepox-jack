type ActionHandler = (...params: any[]) => Promise<void>;

interface IAction {
  type: number;
  params: any[];
}

export class ActionQueue {

  private readonly handlers: Map<number, ActionHandler> = new Map();

  private readonly queue: IAction[] = [];

  private processing = 0;

  public get busy(): boolean {
    return this.processing > 0;
  }

  public reset() {
    this.queue.length = 0;
    this.processing = 0;
  }

  public handle(type: number, handler: ActionHandler) {
    this.handlers.set(type, handler);
  }

  public process(type: number, params: any[], immediate = false) {
    const action = { type, params };
    if (immediate || !this.busy) {
      this.execute(action, !immediate);
    } else {
      this.queue.push(action);
    }
  }

  private async execute(action: IAction, block = true) {
    // Ensure a handler is defined for this action type
    const handler = this.handlers.get(action.type);
    if (handler === undefined) {
      return;
    }

    // When blocking, this action must finish before others can begin
    if (block) { this.processing++; }

    // Invoke action handler
    await handler(...action.params);

    // When blocking, reduce the count of in-progress actions
    if (block) {
      this.processing = Math.max(this.processing - 1, 0);
    }

    // Process the next item in the queue, if any
    if (!this.busy) {
      const next = this.queue.shift();
      if (next !== undefined) {
        this.execute(next);
      }
    }
  }

}
