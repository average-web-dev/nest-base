import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
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
    const gqlExecutionContext = GqlExecutionContext.create(context);
    const gqlContext = gqlExecutionContext.getContext<{ req: { body: Record<string, unknown> } }>();
    const gqlArgs = gqlExecutionContext.getArgs<Record<string, unknown>>();

    gqlContext.req.body = { ...gqlContext.req.body, ...gqlArgs };
    return gqlContext.req;
  }
}
