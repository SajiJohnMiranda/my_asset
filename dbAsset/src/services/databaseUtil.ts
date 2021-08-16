/**
 * This file handles the functionality of database operations.
 */

import path from 'path';
import { PostgresUtil } from '../helper/postgresUtil';
import { Logger } from '../utils/logger';

const logger = Logger.child({ source_service: 'DATABASE SERVICE', filename: path.basename(__filename) });

export class DatabaseUtil {
    public dbUtil = new PostgresUtil();

    constructor() {}

    /*
     * This is used to execute insert query.
     * Input Parameters
     * @param {json Object}  Argument1 Name   - dataObject
     * @returns {status 400} If any error response
     * @returns {json Object} If success response
     */
    insertOperation = async (dataObj: any): Promise<any> => {
        try {
            if (dataObj) {
                    return await this.dbUtil.insertOperation(dataObj.strCallerFunction, dataObj.insertQuery, dataObj.insertValues);
            } else {
                logger.error({ source_function: 'DATABASE ROUTER - insertOperation', payload: dataObj }, 'Called without proper dataObj');
                throw new Error(`insertOperation called without proper dataObj`);
            }
        }
        catch (e) {
            logger.error({ source_function: 'DATABASE ROUTER - insertOperation', payload: dataObj }, e.message);
            throw new Error(e);
        }
    }

    /*
     * This is used to execute insert query.
     * Input Parameters
     * @param {json Object}  Argument1 Name   - dataObj
     * @returns {status 400} If any error response
     * @returns {json Object} If success response
     */
    bulkInsertOperation = async (dataObj: any): Promise<any> => {
        try {
            if (dataObj) {
                    return await this.dbUtil.bulkInsertOperation(dataObj.strCallerFunction, dataObj.insertQuery, dataObj.insertValues);
            } else {
                logger.error({ source_function: 'DATABASE ROUTER - bulkInsertOperation', payload: dataObj }, 'Called without proper dataObj');
                throw new Error(`bulkInsertOperation called without proper dataObj`);
            }
        }
        catch (e) {
            logger.error({ source_function: 'DATABASE ROUTER - bulkInsertOperation', payload: dataObj }, e.message);
            throw new Error(e);
        }
    }

    /*
     * This is used to execute select query.
     * Input Parameters
     * @param {json Object}  Argument1 Name   - dataObj
     * @returns {status 400} If any error response
     * @returns {json Object} If success response
     */
    selectOperation = async (dataObj: any): Promise<any> => {
        try {
            if (dataObj) {
                // the below function fires the generated sql against the database
                return await this.dbUtil.selectOperation(dataObj.strCallerFunction, dataObj.selectQuery, dataObj.selectId);
            } else {
                logger.error({ source_function: 'DATABASE ROUTER - selectOperation', payload: dataObj }, 'Called without proper dataObj');
                throw new Error(`selectOperation called without proper dataObj`);
            }
        }
        catch (e) {
            logger.error({ source_function: 'DATABASE ROUTER - insertOperation', payload: dataObj }, e.message);
            throw new Error(e);
        }
    }

    /*
     * This is used to execute select query.
     * Input Parameters
     * @param {json Object}  Argument1 Name   - dataObj
     * @returns {status 400} If any error response
     * @returns {json Object} If success response
     */
    genericSelect = async (dataObj: any): Promise<any> => {
        try {
            if (dataObj) {
                console.log(`dataObj:${JSON.stringify(dataObj)}`);
                // strStandardQuery holds the SQL for calling the stored procedure
                const strStandardQuery = 'select * from generic_select($1,$2)';
                return await this.dbUtil.selectOperation(dataObj.strCallerFunction, strStandardQuery, dataObj.selectId);
            } else {
                logger.error({ source_function: 'DATABASE ROUTER - genericSelect', payload: dataObj }, 'Called without proper dataObj');
                throw new Error(`genericSelect called without proper dataObj`);
            }
        }
        catch (e) {
            logger.error({ source_function: 'DATABASE ROUTER - insertOperation', payload: dataObj }, e.message);
            throw new Error(e);
        }
    }

    /*
     * This is used to execute delete query.
     * Input Parameters
     * @param {json Object}  Argument1 Name   - dataObj
     * @returns {status 400} If any error response
     * @returns {json Object} If success response
     */
    updateOperation = async (dataObj: any): Promise<any> => {
        try {
            if (dataObj) {
                    return await this.dbUtil.updateOperation(dataObj.strCallerFunction, dataObj.updateQuery, dataObj.updateValues);
            } else {
                logger.error({ source_function: 'DATABASE ROUTER - updateOperation', payload: dataObj }, 'Called without proper dataObj');
                throw new Error(`updateOperation called without proper dataObj`);
            }
        }
        catch (e) {
            logger.error({ source_function: 'DATABASE ROUTER - updateOperation', payload: dataObj }, e.message);
            throw new Error(e);
        }
    }

    /*
     * This is used to execute delete query.
     * Input Parameters
     * @param {json Object}  Argument1 Name   - dataObj
     * @returns {status 400} If any error response
     * @returns {json Object} If success response
     */
    deleteOperation = async (dataObj: any): Promise<any> => {
        try {
            if (dataObj) {
                    return await this.dbUtil.deleteOperation(dataObj.strCallerFunction, dataObj.deleteQuery, dataObj.selectId,dataObj.boolAtomic);
            } else {
                logger.error({ source_function: 'DATABASE ROUTER - deleteOperation', payload: dataObj }, 'Called without proper dataObj');
                throw new Error(`deleteOperation called without proper dataObj`);
            }
        }
        catch (e) {
            logger.error({ source_function: 'DATABASE ROUTER - deleteOperation', payload: dataObj }, e.message);
            throw new Error(e);
        }
    }

    /*
     * This is used to execute ddl query.
     * Input Parameters
     * @param {json Object}  Argument1 Name   - dataObj
     * @returns {status 400} If any error response
     * @returns {json Object} If success response
     */
    ddlOperation = async (dataObj: any): Promise<any> => {
        try {
            if (dataObj) {
                // the below function fires the generated sql against the database
                return await this.dbUtil.ddlOperation(dataObj.strCallerFunction, dataObj.strSqlQuery, dataObj.arrQueryValues);
            } else {
                logger.error({ source_function: 'DATABASE ROUTER - ddlOperation', payload: dataObj }, 'Called without proper dataObj');
                throw new Error(`ddlOperation called without proper dataObj`);
            }
        }
        catch (e) {
            logger.error({ source_function: 'DATABASE ROUTER - insertOperation', payload: dataObj }, e.message);
            throw new Error(e);
        }
    }
}
