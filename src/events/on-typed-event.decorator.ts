// on-typed-event.decorator.ts
import { OnEvent } from '@nestjs/event-emitter';
import { OnEventOptions } from '@nestjs/event-emitter/dist/interfaces';
import { EventType } from './typed-event.type';

//TODO: evaluate Exact<> type to prevent handler having type string while event pushes unknown
export type MethodeType<Payload> = (payload: Payload) => any

export type StrictMethodDecorator<TFn extends Function> =
  (
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<TFn>
  ) => void;

export function OnTypedEvent<TPayload>(
  event: EventType<TPayload>,
  options?: OnEventOptions,
): StrictMethodDecorator<MethodeType<TPayload>> {
  // zur Laufzeit ist event ein string
  return OnEvent(event, options);
}
