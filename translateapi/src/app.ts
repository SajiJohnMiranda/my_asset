
import express from 'express';
import expressPinoLogger from 'express-pino-logger';
import path from 'path';
// tslint:disable-next-line:no-var-requires
const cors = require('cors');
import { IRoutingController } from './interfaces/routing-controller';
import { Logger } from './utils/logger';

const logger = Logger.child({ source_service: 'GROUP SERVICE', filename: path.basename(__filename) });

/**
 * The application Router Controller for the service
 */
export class AppController {
  public service: express.Application;
  public port: number;

  /**
   * Router constructor. Initializes middleware and controllers
   *
   * @param controllers - list of controllers used by the service
   * @param port - the port number for the service to use. Defaults to 8080
   */
  constructor(controllers: IRoutingController[], port?: number) {
    this.port = port || 8081;
    this.service = express();
    this.initMiddleware();
    this.initControllers(controllers);
  }

  /**
   * Initializes any required middleware
   */
  private initMiddleware = (): void => {
    this.service.disable('x-powered-by');
    this.service.use(express.json({ limit: '150mb' }));
    this.service.use(express.urlencoded({ extended: false }));
    this.service.use(cors());
    this.service.use(expressPinoLogger({
      logger: logger,
      serializers: {
        req: (req: any) => ({
          id: req.id,
          method: req.method,
          url: req.url,
          authorization: req.headers.authorization,
          host: req.headers.host
        }),
        res: (res: any) => ({
          statusCode: res.statusCode
        })
      }
    }));
    this.service.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-auth');
      next();
    });
  }

  /**
   * Initializes all of the controllers under the specified route
   *
   * @param controllers
   */
  private initControllers = (controllers: IRoutingController[]): void => {
    controllers.forEach((controller: IRoutingController) => {
      this.service.use('/translateapi', controller.router);
    });
  }

  /**
   * Starts the service listening on the specified port.
   */
  public listen() {
    this.service.listen(this.port, () => {
      logger.info(`Group Service started on PORT : [ ${this.port} ]`);
    });
  }

}