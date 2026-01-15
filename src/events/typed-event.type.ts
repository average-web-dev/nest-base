export type EventType<TPayload> = string & {
  readonly __payload?: TPayload;
};

export function createEventType<TPayload>(name: string): EventType<TPayload> {
  return name as EventType<TPayload>;
}
