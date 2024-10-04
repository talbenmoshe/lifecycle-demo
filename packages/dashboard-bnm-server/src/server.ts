import { NodeBootstrap } from 'node-infra';
import app from './app';

NodeBootstrap.bootstrap().withWebServer(app).start();
