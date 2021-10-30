import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-fastify';
import {
  ApolloServerPluginInlineTraceDisabled,
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageDisabled,
} from 'apollo-server-core';
import { buildSchema } from 'type-graphql';
import type { ApolloServerPlugin } from 'apollo-server-plugin-base';
import fastify, { FastifyInstance } from 'fastify';
import { Container } from 'typedi';
import { createConnection, getConnectionOptions } from 'typeorm';

import resolvers from './resolvers';
import { authChecker, registerAuthPlugin } from './auth';
import env from './env';
import registerSocket from './socket';
import entities from './types/entities';
import createContext from './context';

const fastifyAppClosePlugin = (app: FastifyInstance): ApolloServerPlugin => ({
  serverWillStart: () =>
    Promise.resolve({
      drainServer: () => app.close(),
    }),
});

const start = async (): Promise<void> => {
  const app = fastify();
  const schema = await buildSchema({
    authChecker,
    authMode: 'error',
    resolvers,
    container: Container,
  });
  const plugins = [
    ApolloServerPluginInlineTraceDisabled(),
    fastifyAppClosePlugin(app),
    ApolloServerPluginDrainHttpServer({ httpServer: app.server }),
  ];
  if (process.env.NODE_ENV === 'production') {
    plugins.push(ApolloServerPluginLandingPageDisabled());
  }
  const server = new ApolloServer({
    schema,
    context: createContext,
    plugins,
  });
  const ops = await getConnectionOptions();
  await createConnection({
    ...ops,
    entities,
  });
  await server.start();
  await registerAuthPlugin(
    registerSocket(
      app.register(server.createHandler({ path: env.GRAPHQL_PATH })),
    ),
  ).listen({ host: env.HOST, port: env.PORT });

  // eslint-disable-next-line no-console
  console.log(`Server is running at ${env.HOST}:${env.PORT}`);
};

start().catch(err => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
