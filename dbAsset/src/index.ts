// tslint:disable-next-line:no-var-requires
require('dotenv').config();
import { AppController } from './app';
import { AuthRouter } from './routers/authRouter';
import { ApiServiceRouter } from './routers/apiServiceRouter';

/**
 * Main entry point for the service
 */
const routerController = new AppController([
    new ApiServiceRouter(), new AuthRouter()
], (process.env.API_SERVICE_LOCAL_PORT as unknown) as number || 8080);

routerController.listen();