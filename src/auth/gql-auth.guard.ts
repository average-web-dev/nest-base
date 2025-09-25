import { Context } from 'graphql-ws';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtAuthGuard } from './jwt-auth.guard';
import { IncomingMessage } from 'http';

type CtxContext = {
  req:
    | IncomingMessage
    | Context<Record<string, string>, { socket: WebSocket; request: IncomingMessage }>;
};

@Injectable()
export class GqlAuthGuard extends JwtAuthGuard {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const requestOrContext = ctx.getContext<CtxContext>().req;

    if ('extra' in requestOrContext) {
      // GraphQL WS
      const request: IncomingMessage = requestOrContext.extra.request;

      Object.entries(requestOrContext.connectionParams || {}).forEach(([key, value]) => {
        request.headers[key.toLowerCase()] = value;
      });

      return request;
    }

    return requestOrContext;
  }
}
