import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createStaticsProviderMiddleware } from './staticsProviderMiddleware';
import { ConfigurationClient, IConfigurationClient } from './ConfigurationClient';
import { IStaticsProviderFactory, StaticsProviderFactory } from './StaticsProviderFactory';
import { errorNotFoundHandler, errorHandler } from '../express/middlewares/errorHandler';

export interface INodeBootstrap {
  withWebServer(webServerBootstrap: WebServerCallback): this;
  start(): void;
}

export type WebServerCallback = (app: Application) => void;

export class NodeBootstrap implements INodeBootstrap {
  private webServerBootstrap: WebServerCallback | undefined;
  constructor(private staticsProviderFactory: IStaticsProviderFactory) {

  }

  static bootstrap(): INodeBootstrap {
    const configurationClient: IConfigurationClient = new ConfigurationClient();
    const staticsProviderFactory: IStaticsProviderFactory = new StaticsProviderFactory(configurationClient);

    return new NodeBootstrap(staticsProviderFactory);
  }

  withWebServer(webServerBootstrap: WebServerCallback): this {
    this.webServerBootstrap = webServerBootstrap;

    return this;
  }

  private bootstrapWebServer(): Application | undefined {
    let returnValue: Application | undefined;

    if (this.webServerBootstrap) {
      const app = express();
      app.use(cors());
      app.use(bodyParser.json());
      app.use(createStaticsProviderMiddleware(this.staticsProviderFactory));

      this.webServerBootstrap(app);

      app.use(errorNotFoundHandler);
      app.use(errorHandler);
      returnValue = app;
    }

    return returnValue;
  }

  start() {
    const app = this.bootstrapWebServer();

    if (app) {
      const port = process.env.PORT!;
      const server = app.listen(port, onListening);
      server.on('error', onError);

      function onError(error: NodeJS.ErrnoException) {
        if (error.syscall !== 'listen') {
          throw error;
        }

        const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

        // handle specific listen errors with friendly messages
        switch (error.code) {
          case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
          case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
          default:
            throw error;
        }
      }

      function onListening() {
        const addr = server.address();
        const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;

        // eslint-disable-next-line no-console
        console.log(`Listening on ${bind}`);
      }
    }
  }
}