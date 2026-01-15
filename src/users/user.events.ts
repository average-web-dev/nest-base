import { createEventType } from "@/events/typed-event.type";

export const USER_EVENTS = {
  FOUND: createEventType<{ id: unknown }>('user.found')
} as const
