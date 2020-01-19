type ActionHandler = (...params: any[]) => Promise<void>;

interface IAction {
  type: number;
  params: any[];
}

export class ActionQueue {

  private readonly handlers: Map<number, ActionHandler> = new Map();

  private readonly queue: IAction[] = [];

  private processing = false;

  public get busy(): boolean {
    return this.processing;
  }

  public handle(type: number, handler: ActionHandler) {
    this.handlers.set(type, handler);
  }

  public process(type: number, params: any[]) {
    const action = { type, params };
    if (this.processing) {
      this.queue.push(action);
    } else {
      this.execute(action);
    }
  }

  private async execute(action: IAction) {
    const handler = this.handlers.get(action.type);
    if (handler === undefined) {
      return;
    }

    this.processing = true;

    await handler(...action.params);

    this.processing = false;

    // Process the next item in the queue, if any
    const next = this.queue.shift();
    if (next !== undefined) {
      this.execute(next);
    }
  }

}
