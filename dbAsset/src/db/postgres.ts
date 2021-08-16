import { Pool } from 'pg';
import path from 'path';
import { CommonUtils } from '../utils/common-utils';
import { Logger } from '../utils/logger';

const logger = Logger.child({ source_service: 'DATABASE SERVICE', filename: path.basename(__filename) });

const config = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: (process.env.PGPORT as unknown) as number,
  ssl: process.env.PGCERT ? {
    ca: CommonUtils.decodeBase64(process.env.PGCERT)
  } : false
};

export class PostgresService {

  /*
   * Create a connection pool
   * @public
   */
  public pool = new Pool(config);

  /*
   * Service constructor
   */
  constructor() {
    this.pool.on('error', (err: any) => {
      logger.error({ source_function: 'POSTGRES SERVICE - constructor' }, 'Error while connecting to DB pool : %s', err.message);
      this.handlePgPoolError(err, this.start.bind(this));
    });
  }

  /*
   * Get a connection pool
   * @public
   */
  public getPool() {
    return this.pool;
  }


  /*
   * Create a connection pool
   * @public
   */
  public start() {
    this.pool = new Pool(config);
    this.pool.on('error', (err: any) => {
      logger.error({ source_function: 'POSTGRES SERVICE - start' }, 'Error while connecting to DB pool : %s', err.message);
      this.handlePgPoolError(err, this.start.bind(this));
    });
  }

  /*
   * Handle error to reconnect to pg pool again.
   *
   * @param error
   * @param callback
   * @public
   */
  public handlePgPoolError(error: any, callback: () => void): void {
    setTimeout(() => callback(), 60000);
  }
}

