import 'reflect-metadata';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import morgan from 'morgan';

import { ConfigService, errorHandlerMiddleware, notFoundMiddleware } from '@modules/core';
import { initializeContainer } from '@modules/server.module';

async function init(): Promise<void> {
  try {
    const container = await initializeContainer();

    const configService = await container.getAsync(ConfigService);
    const port = configService.get('PORT');

    const server = new InversifyExpressServer(container, null, { rootPath: '/api/v1' }, null, null);

    server
      .setConfig((app) => {
        app.use(cors({ credentials: true, origin: configService.get('ORIGIN') }));
        app.use(cookieParser());
        app.use(express.json());
        app.use(morgan('combined'));
      })
      .setErrorConfig((app) => {
        app.use(notFoundMiddleware);
        app.use(errorHandlerMiddleware);
      })
      .build()
      .listen(port, () => console.log(`Listening on ${port}`));
  } catch (error) {
    console.error(error);
  }
}

init().catch(console.error);
