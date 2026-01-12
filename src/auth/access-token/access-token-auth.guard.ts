import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { IncomingMessage } from 'http';
import { Context } from 'graphql-ws';
import { IS_PUBLIC_KEY } from '../public.decorator';

type CtxContext = {
  req:
    | IncomingMessage
    | Context<Record<string, string>, { socket: WebSocket; request: IncomingMessage, connectionParams: Record<string, string> }>;
};

@Injectable()
export class AccessTokenAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  getRequest(context: ExecutionContext): any {
    switch (context.getType<GqlContextType>()) {
      default:
        return super.getRequest(context);
        break;

      case 'graphql':
        return this.getRequestGraphQL(context);
        break;
    }
  }

  getRequestGraphQL(context: ExecutionContext) {
    const requestOrContext = GqlExecutionContext.create(context).getContext<CtxContext>().req;
    if ('extra' in requestOrContext) {
      // GraphQL WS
      const request: IncomingMessage = requestOrContext.extra.request;
      const authorizationKey = Object.keys(requestOrContext.extra.connectionParams).find(
        (key) => key.toLowerCase() === 'authorization'
      );
      if (authorizationKey) {
        request.headers.authorization = requestOrContext.extra.connectionParams[authorizationKey];
      }

      return request;
    }

    return requestOrContext;
  }
}
