import express from 'express';
import path from 'path';
import { Logger } from '../utils/logger';

const logger = Logger.child({ source_service: 'GROUP SERVICE', filename: path.basename(__filename) });

export class AuthRouter {
    public router = express.Router();

    constructor() {
        this.router.get('', this.authOperation);
    }

    authOperation = async (req: express.Request, res: express.Response): Promise<void> => {
        logger.info({ source_function: 'AUTH ROUTER - authOperation' }, 'Group api is accessible');
        res.status(200).send({ status: 'Group api is accessible' });
    }
}