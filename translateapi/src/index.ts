// tslint:disable-next-line:no-var-requires
require('dotenv').config();
import { AppController } from './app';
import { AuthRouter } from './routers/authRouter';
import { TranslatorRouter } from './routers/my_translate_demo';

/**
 * Main entry point for the service
 */
const routerController = new AppController([
    new TranslatorRouter(), new AuthRouter()
], (process.env.TRANSLATE_SERVICE_LOCAL_PORT as unknown) as number || 8080);

routerController.listen();