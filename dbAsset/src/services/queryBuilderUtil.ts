/**
 * This file handles the functionality of query building.
 */
import path from 'path';
import { PostgresUtil } from '../helper/postgresUtil';
import { Logger } from '../utils/logger';

const logger = Logger.child({ source_service: 'DATABASE SERVICE', filename: path.basename(__filename) });

export class QueryBuilderUtil {
    public dbUtil = new PostgresUtil();

    constructor() {
        // this.router.post('/buildinsertquery', this.buildInsertQuery);

        // this.router.post('/buildselectquery', this.buildSelectQuery);

        // this.router.post('/buildupdatequery', this.buildUpdateQuery);

        // this.router.post('/buildupsertquery', this.buildUpsertQuery);

        // this.router.post('/builddeletequery', this.buildDeleteQuery);

        // this.router.post('/buildbulkupdatequery', this.buildBulkUpdateQuery);

        // this.router.post('/buildbulkinsertquery', this.buildBulkInsertQuery);

        // this.router.post('/buildbulkinsertquerywithresult', this.buildBulkInsertQueryWithResult);

        // this.router.post('/buildbulkupsertquery', this.buildBulkUpsertQuery);

        // this.router.post('/directBulkUpsert', this.directBulkUpsert);

        // this.router.post('/directBulkInsert', this.directBulkInsert);

    }

    /*
     * This is used to build an bulk upsert query and execute the query at one go
     * Input Parameters
     * @param {json Object}  Argument1 Name   - dataObject
     * @returns {status 400} If any error response
     * @returns {json Object} If success response
     */
    directBulkUpsert = async (dataObj: any): Promise<any> => {
        try {
            if (dataObj) {
                return await this.fnBuildBulkUpsertQuery(dataObj);
            } else {
                logger.error({ source_function: 'QUERY BUILDER ROUTER - directBulkUpsert', payload: dataObj }, 'Called without proper dataObject');
                throw new Error(`directBulkUpsert called without proper dataObj`);
            }
        }
        catch (e) {
            logger.error({ source_function: 'QUERY BUILDER ROUTER - directBulkUpsert', payload: dataObj }, e.message);
            throw new Error(e);
        }
    }

    fnBuildBulkUpsertQuery = async (dataObject: any) => {
        try {
            if (dataObject) {
                const dataObj = dataObject;
                const objUpsert = await this.dbUtil.buildBulkUpsertQuery(dataObj.strCallerFunction, dataObj.objJsonData, dataObj.strTablename, dataObj.arrIntFields, dataObj.strConstraintName);
                return await this.dbUtil.bulkInsertOperation(dataObj.strCallerFunction, objUpsert.upsertQueryWithResult, objUpsert.upsertValues,dataObj.boolAtomic);
            } else {
                logger.error({ source_function: 'QUERY BUILDER ROUTER - fnBuildBulkUpsertQuery', payload: dataObject }, 'Called without proper dataObject');
                throw new Error(`post fnBuildBulkUpsertQuery called without proper dataObject`);
            }
        } catch (e) {
            logger.error({ source_function: 'QUERY BUILDER ROUTER - fnBuildBulkUpsertQuery', payload: dataObject }, e.message);
            throw new Error(e);
        }
    }
    /*
     * This is used to build an bulk insert query and execute the query at one go
     * Input Parameters
     * @param {json Object}  Argument1 Name   - dataObject
     * @returns {status 400} If any error response
     * @returns {json Object} If success response
     */
    directBulkInsert = async (dataObj: any): Promise<any> => {
        try {
            if (dataObj) {
                return await this.fnBuildBulkInsertQuery(dataObj);
            } else {
                logger.error({ source_function: 'QUERY BUILDER ROUTER - directBulkInsert', payload: dataObj }, 'Called without proper dataObject');
                throw new Error(`directBulkInsert called without proper dataObj`);
            }
        }
        catch (e) {
            logger.error({ source_function: 'QUERY BUILDER ROUTER - directBulkInsert', payload: dataObj }, e.message);
            throw new Error(e);
        }
    }

    fnBuildBulkInsertQuery = async (dataObject: any) => {
        try {
            if (dataObject) {
                const dataObj = dataObject;
                const objInsert = await this.dbUtil.buildBulkInsertQuery(dataObj.strCallerFunction, dataObj.objJsonData, dataObj.strTablename, dataObj.arrIntFields);
                return await this.dbUtil.bulkInsertOperation(dataObj.strCallerFunction, objInsert.insertQuery, objInsert.insertValues);
            } else {
                logger.error({ source_function: 'QUERY BUILDER ROUTER - fnBuildBulkInsertQuery', payload: dataObject }, 'Called without proper dataObject');
                throw new Error(`fnBuildBulkInsertQuery called without proper dataObject`);
            }
        } catch (e) {
            logger.error({ source_function: 'QUERY BUILDER ROUTER - fnBuildBulkInsertQuery', payload: dataObject }, e.message);
            throw new Error(e);
        }
    }

    /*
     * This is used to build an insert query.
     * Input Parameters
     * @param {json Object}  Argument1 Name   - dataObject
     * @returns {status 400} If any error response
     * @returns {json Object} If success response
     */

    buildInsertQuery = async (dataObj: any): Promise<any> => {
        try {
            if (dataObj) {
                console.log(`dataObj-QUERYBUILDER: ${JSON.stringify(dataObj)}`);
                return await this.dbUtil.buildInsertQuery(dataObj.strCallerFunction, dataObj.objJsonData, dataObj.strTablename, dataObj.arrIntFields);
            } else {
                throw new Error(`directBulkUpsert called without proper dataObj`);
            }
        }
        catch (e) {
            throw new Error(`error at querybuilderrouter buildInsertQuery ${e}`);
        }
    }
    
    /*
     * This is used to build a bulk insert query.
     * Input Parameters
     * @param {json Object}  Argument1 Name   - dataObject
     * @returns {status 400} If any error response
     * @returns {json Object} If success response
     */
    buildBulkInsertQuery = async (dataObj: any): Promise<any> => {
        try {
            if (dataObj) {
                return await this.dbUtil.buildBulkInsertQuery(dataObj.strCallerFunction, dataObj.objJsonData, dataObj.strTablename, dataObj.arrIntFields);
            } else {
                logger.error({ source_function: 'QUERY BUILDER ROUTER - buildBulkInsertQuery', payload: dataObj }, 'Called without proper dataObject');
                throw new Error(`buildBulkInsertQuery called without proper dataObj`);
            }
        }
        catch (e) {
            logger.error({ source_function: 'QUERY BUILDER ROUTER - buildBulkInsertQuery', payload: dataObj }, e.message);
            throw new Error(e);
        }
    }

    /*
     * This is used to build a bulk insert query with result.
     * Input Parameters
     * @param {json Object}  Argument1 Name   - dataObject
     * @returns {status 400} If any error response
     * @returns {json Object} If success response
     */
    buildBulkInsertQueryWithResult = async (dataObj: any): Promise<any> => {
        try {
            if (dataObj) {
                return await this.dbUtil.buildBulkInsertQueryWithResult(dataObj.strCallerFunction, dataObj.objJsonData, dataObj.strTablename, dataObj.arrIntFields);
            } else {
                logger.error({ source_function: 'QUERY BUILDER ROUTER - buildBulkInsertQueryWithResult', payload: dataObj }, 'Called without proper dataObject');
                throw new Error(`buildBulkInsertQueryWithResult called without proper dataObj`);
            }
        }
        catch (e) {
            logger.error({ source_function: 'QUERY BUILDER ROUTER - buildBulkInsertQueryWithResult', payload: dataObj}, e.message);
            throw new Error(e);
        }
    }

    /*
     * This is used to build an bulk upsert query.
     * Input Parameters
     * @param {json Object}  Argument1 Name   - dataObject
     * @returns {status 400} If any error response
     * @returns {json Object} If success response
     */
    buildBulkUpsertQuery = async (dataObj: any): Promise<any> => {
        try {
            if (dataObj) {
                return await this.dbUtil.buildBulkUpsertQuery(dataObj.strCallerFunction, dataObj.objJsonData, dataObj.strTablename, dataObj.arrIntFields, dataObj.strConstraintName);
            } else {
                logger.error({ source_function: 'QUERY BUILDER ROUTER - buildBulkUpsertQuery', payload: dataObj }, 'Called without proper dataObject');
                throw new Error(`buildBulkUpsertQuery called without proper dataObj`);
            }
        }
        catch (e) {
            logger.error({ source_function: 'QUERY BUILDER ROUTER - buildBulkUpsertQuery', payload: dataObj }, e.message);
            throw new Error(e);
        }
    }

    /*
     * This is used to build an update query.
     * Input Parameters
     * @param {json Object}  Argument1 Name   - dataObject
     * @returns {status 400} If any error response
     * @returns {json Object} If success response
     */
    buildUpdateQuery = async (dataObj: any): Promise<any> => {
        try {
            if (dataObj) {
                return await this.dbUtil.buildUpdateQuery(dataObj.strCallerFunction, dataObj.objJsonData, dataObj.strTablename, dataObj.arrNumFields, dataObj.arrKeyFields);
            } else {
                logger.error({ source_function: 'QUERY BUILDER ROUTER - buildUpdateQuery', payload: dataObj }, 'Called without proper dataObject');
                throw new Error(`buildUpdateQuery called without proper dataObj`);
            }
        }
        catch (e) {
            logger.error({ source_function: 'QUERY BUILDER ROUTER - buildUpdateQuery', payload: dataObj }, e.message);
            throw new Error(e);
        }
    }

    /*
     * This is used to build an update query.
     * Input Parameters
     * @param {json Object}  Argument1 Name   - dataObject
     * @returns {status 400} If any error response
     * @returns {json Object} If success response
     */
    buildBulkUpdateQuery = async (dataObj: any): Promise<any> => {
        try {
            if (dataObj) {
                return await this.dbUtil.buildBulkUpdateQuery(dataObj.strCallerFunction, dataObj, dataObj.strTablename, dataObj.arrNumFields, dataObj.arrKeyFields);
            } else {
                logger.error({ source_function: 'QUERY BUILDER ROUTER - buildBulkUpdateQuery', payload: dataObj }, 'Called without proper dataObject');
                throw new Error(`buildBulkUpdateQuery called without proper dataObj`);
            }
        }
        catch (e) {
            logger.error({ source_function: 'QUERY BUILDER ROUTER - buildBulkUpdateQuery', payload: dataObj }, e.message);
            throw new Error(e);
        }
    }

    /*
     * This is used to build an insert query.
     * Input Parameters
     * @param {json Object}  Argument1 Name   - dataObject
     * @returns {status 400} If any error response
     * @returns {json Object} If success response
     */
    buildUpsertQuery = async (dataObj: any): Promise<any> => {
        try {
            if (dataObj) {
                return await this.dbUtil.buildUpsertQuery(dataObj.strCallerFunction, dataObj.objJsonData, dataObj.strTablename, dataObj.arrNumFields, dataObj.arrKeyFields);
            } else {
                logger.error({ source_function: 'QUERY BUILDER ROUTER - buildUpsertQuery', payload: dataObj }, 'Called without proper dataObject');
                throw new Error(`buildUpsertQuery called without proper dataObj`);
            }
        }
        catch (e) {
            logger.error({ source_function: 'QUERY BUILDER ROUTER - buildUpsertQuery', payload: dataObj }, e.message);
            throw new Error(e);
        }
    }

    /*
     * This is used to build an insert query.
     * Input Parameters
     * @param {json Object}  Argument1 Name   - dataObject
     * @returns {status 400} If any error response
     * @returns {json Object} If success response
     */
    buildDeleteQuery = async (dataObj: any): Promise<any> => {
        try {
            if (dataObj) {
                return await this.dbUtil.buildDeleteQuery(dataObj.strCallerFunction, dataObj.strTablename, dataObj.strWhereCriteria);
            } else {
                logger.error({ source_function: 'QUERY BUILDER ROUTER - buildDeleteQuery', payload: dataObj }, 'Called without proper dataObject');
                throw new Error(`buildDeleteQuery called without proper dataObj`);
            }
        }
        catch (e) {
            logger.error({ source_function: 'QUERY BUILDER ROUTER - buildDeleteQuery', payload: dataObj }, e.message);
            throw new Error(e);
        }
    }
}