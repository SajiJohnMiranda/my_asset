import {Router} from 'express';

/**
 * Interface for all controllers within the service
 */
export interface IRoutingController {
    router: Router;
}
