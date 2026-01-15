// typed-event-emitter.service.ts
import { Injectable } from '@nestjs/common';
import { event, EventEmitter2 } from 'eventemitter2';
import { EventType } from './typed-event.type';

type Listener<T> = (payload: T) => void;

@Injectable()
export class TypedEventEmitter {
  constructor(private readonly emitter: EventEmitter2) {}

  /* ------------------ EMIT ------------------ */

  emit<T>(event: EventType<T>, payload: T, ...args: any[]): boolean {
    return this.emitter.emit(event as string, payload, ...args);
  }

  //TODO: add the ability to type the result of emitAsync
  // emitAsync<T>(event: EventType<T>, payload: T, ...args: any[]): Promise<any[]> {
  //   return this.emitter.emitAsync(event as string, payload, ...args);
  // }

  /* ------------------ LISTENER ------------------ */

  on<T>(
    event: EventType<T>,
    listener: Listener<T>,
    options?: boolean | any,
  ): this {
    this.emitter.on(event as string, listener as any, options);
    return this;
  }

  once<T>(
    event: EventType<T>,
    listener: Listener<T>,
    options?: boolean | any,
  ): this {
    this.emitter.once(event as string, listener as any, options);
    return this;
  }

  prependListener<T>(
    event: EventType<T>,
    listener: Listener<T>,
    options?: boolean | any,
  ): this {
    this.emitter.prependListener(event as string, listener as any, options);
    return this;
  }

  prependOnceListener<T>(
    event: EventType<T>,
    listener: Listener<T>,
    options?: boolean | any,
  ): this {
    this.emitter.prependOnceListener(event as string, listener as any, options);
    return this;
  }

  many<T>(
    event: EventType<T>,
    times: number,
    listener: Listener<T>,
    options?: boolean | any,
  ): this {
    this.emitter.many(event as string, times, listener as any, options);
    return this;
  }

  prependMany<T>(
    event: EventType<T>,
    times: number,
    listener: Listener<T>,
    options?: boolean | any,
  ): this {
    this.emitter.prependMany(event as string, times, listener as any, options);
    return this;
  }

  off<T>(event: EventType<T>, listener: Listener<T>): this {
    this.emitter.off(event as string, listener as any);
    return this;
  }

  removeListener<T>(event: EventType<T>, listener: Listener<T>): this {
    this.emitter.removeListener(event as string, listener as any);
    return this;
  }

  removeAllListeners(event?: EventType<any>): this {
    this.emitter.removeAllListeners(event as string | undefined);
    return this;
  }

  /* ------------------ ANY ------------------ */

  onAny(listener: (event: string, payload: any) => void): this {
    this.emitter.onAny(listener);
    return this;
  }

  prependAny(listener: (event: string, payload: any) => void): this {
    this.emitter.prependAny(listener);
    return this;
  }

  offAny(listener: (...args: any[]) => void): this {
    this.emitter.offAny(listener);
    return this;
  }

  listenersAny(): Function[] {
    return this.emitter.listenersAny();
  }

  /* ------------------ QUERY ------------------ */

  eventNames(nsAsArray?: boolean): (string | symbol | event[])[] {
    return this.emitter.eventNames(nsAsArray);
  }

  listenerCount(event?: EventType<any>): number {
    return this.emitter.listenerCount(event as string | undefined);
  }

  listeners(event?: EventType<any>): Function[] {
    return this.emitter.listeners(event as string | undefined);
  }

  hasListeners(event?: EventType<any>): boolean {
    return this.emitter.hasListeners(event as string | undefined).valueOf();
  }

  /* ------------------ CONFIG ------------------ */

  setMaxListeners(n: number): void {
    this.emitter.setMaxListeners(n);
  }

  getMaxListeners(): number {
    return this.emitter.getMaxListeners();
  }

  /* ------------------ WAIT / PROMISE ------------------ */

  waitFor<T>(
    event: EventType<T>,
    options?: number | any,
  ): Promise<[T, ...any[]]> {
    return this.emitter.waitFor(event as string, options) as Promise<any>;
  }

  /* ------------------ INTEROP ------------------ */

  raw(): EventEmitter2 {
    // escape hatch
    return this.emitter;
  }
}
