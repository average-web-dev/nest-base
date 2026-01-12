import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      graphiql: true,
      sortSchema: true,
      autoSchemaFile: join(process.cwd(), 'gen/schema.gql'),
      definitions: {
        path: join(process.cwd(), 'gen/graphql.schema.ts'),
      },
      subscriptions: {
        'graphql-ws': {
          onConnect: (context) => {
            const { connectionParams, extra } = context;

            extra.connectionParams = connectionParams;
          },
        },
      },
      context: ({ req, res }) => ({ req, res }),
    }),
  ],
})
export class GraphqlModule {}
