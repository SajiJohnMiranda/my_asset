/**
 * This file handles the services/ functions of API.
 */

import path from 'path';
import { Logger } from '../utils/logger';
import { QueryBuilderUtil } from './queryBuilderUtil';
import { DatabaseUtil } from './databaseUtil';

const logger = Logger.child({ source_service: 'API SERVICE', filename: path.basename(__filename) });

export class DbService {
  private dbUtil = new DatabaseUtil();
  private queryBuildUtil = new QueryBuilderUtil();

  /*
   * This function is used to create an insert query
   * Input Parameters
   * @param {string}  Argument1 strCallerFunction   - name of the calling function
   * @param {string} Argument2 objJsonData   - json data
   * @param {string} Argument3 strTablename   - table name
   * Output
   * @returns {error obect} If any error response
   * @returns {json object} If success response
   */
  buildInsertQuery = async (strCallerFunction: any, objJsonData: any, strTablename: any, arrIntFields: any = []) => {
    const dataObject = {
      dataObject: {
        arrIntFields,
        strCallerFunction,
        objJsonData,
        strTablename
      }
    };
    try {
      console.log(`dataObject: ${JSON.stringify(dataObject.dataObject)}`);
      return await this.queryBuildUtil.buildInsertQuery(dataObject.dataObject);
    } catch (e) {
      logger.error({ source_function: 'API SERVICE - buildInsertQuery', payload: dataObject }, e.message);
      throw new Error(e);
    }
  }

  /*
 * This function is used to create a bulk insert query
 * Input Parameters
 * @param {string}  Argument1 strCallerFunction   - name of the calling function
 * @param {string} Argument2 objJsonData   - json data
 * @param {string} Argument3 strTablename   - table name
 * Output
 * @returns {error obect} If any error response
 * @returns {json object} If success response
 */
  buildBulkInsertQuery = async (strCallerFunction: any, objJsonData: any, strTablename: any, arrIntFields: any = []) => {
    const dataObject = {
      dataObject: {
        arrIntFields,
        strCallerFunction,
        objJsonData,
        strTablename
      }
    };
    try {
      return await this.queryBuildUtil.buildBulkInsertQuery(dataObject.dataObject);
    } catch (e) {
      logger.error({ source_function: 'API SERVICE - buildBulkInsertQuery', payload: dataObject }, e.message);
      throw new Error(e);
    }
  }

  /*
   * This function is used to create a bulk insert query with result
   * Input Parameters
   * @param {string}  Argument1 strCallerFunction   - name of the calling function
   * @param {string} Argument2 objJsonData   - json data
   * @param {string} Argument3 strTablename   - table name
   * Output
   * @returns {error obect} If any error response
   * @returns {json object} If success response
   */
  buildBulkInsertQueryWithResult = async (strCallerFunction: any, objJsonData: any, strTablename: any, arrIntFields: any = []) => {
    const dataObject = {
      dataObject: {
        arrIntFields,
        strCallerFunction,
        objJsonData,
        strTablename
      }
    };
    try {
      return await this.queryBuildUtil.buildBulkInsertQueryWithResult(dataObject.dataObject);
    } catch (e) {
      logger.error({ source_function: 'API SERVICE - buildBulkInsertQueryWithResult', payload: dataObject }, e.message);
      throw new Error(e);
    }
  }

  /*
   * This function is used to create an insert query
   * Input Parameters
   * @param {string}  Argument1 strCallerFunction   - name of the calling function
   * @param {string} Argument2 objJsonData   - json data
   * @param {string} Argument3 strTablename   - table name
   * Output
   * @returns {error obect} If any error response
   * @returns {json object} If success response
   */
  buildUpsertQuery = async (strCallerFunction: any, objJsonData: any, strTablename: any, arrNumFields: any = [], arrKeyFields: any = [], strConstraintName: any = '') => {
    const dataObject = {
      dataObject: {
        arrNumFields,
        arrKeyFields,
        strCallerFunction,
        objJsonData,
        strTablename,
        strConstraintName
      }
    };
    try {
      return await this.queryBuildUtil.buildUpsertQuery(dataObject.dataObject);
    } catch (e) {
      logger.error({ source_function: 'API SERVICE - buildUpsertQuery', payload: dataObject }, e.message);
      throw new Error(e);
    }
  }  


  buildDeleteQuery = async (strCallerFunction: any, strTablename: any, strWhereCriteria: any) => {
    const dataObject = {
      dataObject: {
        strCallerFunction,
        strTablename,
        strWhereCriteria
      }
    };
    try {
      return await this.queryBuildUtil.buildDeleteQuery(dataObject.dataObject);
    } catch (e) {
      logger.error({ source_function: 'API SERVICE - buildDeleteQuery', payload: dataObject }, e.message);
      throw new Error(e);
    }
  }
  /*
   * This function is used to create an insert query
   * Input Parameters
   * @param {string}  Argument1 strCallerFunction   - name of the calling function
   * @param {string} Argument2 objJsonData   - json data
   * @param {string} Argument3 strTablename   - table name
   * Output
   * @returns {error obect} If any error response
   * @returns {json object} If success response
   */
  buildBulkUpsertQuery = async (strCallerFunction: any, objJsonData: any, strTablename: any, arrNumFields: any = [], arrKeyFields: any = [], strConstraintName: any = '') => {
    const dataObject = {
      dataObject: {
        arrNumFields,
        arrKeyFields,
        strCallerFunction,
        objJsonData,
        strTablename,
        strConstraintName
      }
    };
    try {
      return await this.queryBuildUtil.buildBulkUpsertQuery(dataObject.dataObject);
    } catch (e) {
      logger.error({ source_function: 'API SERVICE - buildBulkUpsertQuery', payload: dataObject }, e.message);
      throw new Error(e);
    }
  }

  directBulkUpsert = async (strCallerFunction: any, objJsonData: any, strTablename: any, arrNumFields: any = [],  strConstraintName: any = '', boolAtomic: boolean = false) => {
    const dataObject = {
      dataObject: {
        arrNumFields,
        strCallerFunction,
        objJsonData,
        strTablename,
        strConstraintName,
        boolAtomic
      }
    };
    try {
      return await this.queryBuildUtil.directBulkUpsert(dataObject.dataObject);
    } catch (e) {
      logger.error({ source_function: 'API SERVICE - directBulkUpsert', payload: dataObject }, e.message);
      throw new Error(e);
    }
  }

  directBulkInsert = async (strCallerFunction: any, objJsonData: any, strTablename: any, arrNumFields: any = [], arrKeyFields: any = [], strConstraintName: any = '', boolAtomic: boolean = false) => {
    const dataObject = {
      dataObject: {
        arrNumFields,
        arrKeyFields,
        strCallerFunction,
        objJsonData,
        strTablename,
        strConstraintName,
        boolAtomic
      }
    };
    try {
      return await this.queryBuildUtil.directBulkInsert(dataObject.dataObject);
    } catch (e) {
      logger.error({ source_function: 'API SERVICE - directBulkInsert', payload: dataObject }, e.message);
      throw new Error(e);
    }
  }

  /*
   * This function is used to call generic select from the database, This is using a internal post call to the
   * database service. This is because the select operation api is a generic api which accepts object which contains
   * the select query and the array of select paramenter. Converting all the object into query parameters will take off
   * the generic behaviour of the api as the query parameter numbers can vary of each api call
   * Input Parameters
   * @param {object}  Argument1 dataObject   - name of the calling function, Queryid and Parmeters
   * Output
   * @returns {error obect} If any error response
   * @returns {database rows} If success response
   */
  genericSelect = async (strCallerFunction: any, selectId: any) => {
    const dataObject = {
      dataObject: {
        selectId,
        strCallerFunction
      }
    };
    try {
      return await this.dbUtil.genericSelect(dataObject.dataObject);
    } catch (e) {
      logger.error({ source_function: 'API SERVICE - genericSelect', payload: dataObject }, e.message);
      throw new Error(e);
    }
  }

  /*
   * This function is used to create an update query
   * Input Parameters
   * @param {string}  Argument1 strCallerFunction   - name of the calling function
   * @param {string} Argument2 objJsonData   - json data
   * @param {string} Argument3 strTablename   - table name
   * @param {string} Argument4 strWhereCriteria   - where condition
   * Output
   * @returns {error obect} If any error response
   * @returns {json object} If success response
   */
  buildUpdateQuery = async (strCallerFunction: any, objJsonData: any, strTablename: any, arrNumFields: any = [], arrKeyFields: any = []) => {
    const dataObject = {
      dataObject: {
        arrNumFields,
        arrKeyFields,
        strCallerFunction,
        objJsonData,
        strTablename
      }
    };
    try {
      return await this.queryBuildUtil.buildUpdateQuery(dataObject.dataObject);
    } catch (e) {
      logger.error({ source_function: 'API SERVICE - buildUpdateQuery', payload: dataObject }, e.message);
      throw new Error(e);
    }
  }

  /*
   * This function is used to create an update query
   * Input Parameters
   * @param {string}  Argument1 strCallerFunction   - name of the calling function
   * @param {string} Argument2 objJsonData   - json data
   * @param {string} Argument3 strTablename   - table name
   * @param {string} Argument4 strWhereCriteria   - where condition
   * Output
   * @returns {error obect} If any error response
   * @returns {json object} If success response
   */
  buildBulkUpdateQuery = async (strCallerFunction: any, objJsonData: any, strTablename: any, arrNumFields: any = [], arrKeyFields: any = []) => {
    const dataObject = {
      dataObject: {
        arrNumFields,
        arrKeyFields,
        strCallerFunction,
        updateSetObjectValue: objJsonData.updateSetObjectValue,
        whereInObject: objJsonData.whereInObject,
        strTablename
      }
    };
    try {
      return await this.queryBuildUtil.buildBulkUpdateQuery(dataObject.dataObject);
    } catch (e) {
      logger.error({ source_function: 'API SERVICE - buildBulkUpdateQuery', payload: dataObject }, e.message);
      throw new Error(e);
    }
  }

  /*
   * This function is used to insert into the database
   * Input Parameters
   * @param {string}  Argument1 strCallerFunction   - name of the calling function
   * @param {string} Argument1 strInsertQuery   - insert sql query
   * @param {string} Argument1 arrInsertValues   - parameter values
   * Output
   * @returns {error obect} If any error response
   * @returns {database rows} If success response
   */
  insertOperation = async (strCallerFunction: any, insertQuery: any, insertValues: any = [], boolAtomic: boolean = false) => {
    const dataObject = {
      dataObject: {
        insertQuery,
        insertValues,
        strCallerFunction,
        boolAtomic
      }
    };
    try {
      return await this.dbUtil.insertOperation(dataObject.dataObject);
    } catch (e) {
      logger.error({ source_function: 'API SERVICE - insertOperation', payload: dataObject }, e.message);
      throw new Error(e);
    }
  }

  /*
   * This function is used to select from the database, This is using a internal post call to the
   * database service. This is because the select operation api is a generic api which accepts object which contains
   * the select query and the array of select paramenter. Converting all the object into query parameters will take off
   * the generic behaviour of the api as the query parameter numbers can vary of each api call
   * Input Parameters
   * @param {string}  Argument1 strCallerFunction   - name of the calling function
   * @param {string} Argument1 strInsertQuery   - select sql query
   * @param {string} Argument1 arrInsertValues   - parameter values
   * Output
   * @returns {error obect} If any error response
   * @returns {database rows} If success response
   */
  selectOperation = async (strCallerFunction: any, selectQuery: any, selectId: any) => {
    const dataObject = {
      dataObject: {
        selectQuery,
        selectId,
        strCallerFunction
      }
    };
    try {
      return await this.dbUtil.selectOperation(dataObject.dataObject);
    } catch (e) {
      logger.error({ source_function: 'API SERVICE - selectOperation', payload: dataObject }, e.message);
      throw new Error(e);
    }
  }

  /*
   * This function is used to update the database
   * Input Parameters
   * @param {string}  Argument1 strCallerFunction   - name of the calling function
   * @param {string} Argument1 strSqlQuery   - update sql query
   * @param {string} Argument1 arrQueryValues   - parameter values
   * Output
   * @returns {error obect} If any error response
   * @returns {database rows} If success response
   */
  updateOperation = async (strCallerFunction: any, updateQuery: any, updateValues: any = [], boolAtomic: boolean = false) => {
    const dataObject = {
      dataObject: {
        updateQuery,
        updateValues,
        strCallerFunction,
        boolAtomic
      }
    };
    try {
      return await this.dbUtil.updateOperation(dataObject.dataObject);
    } catch (e) {
      logger.error({ source_function: 'API SERVICE - updateOperation', payload: dataObject }, e.message);
      throw new Error(e);
    }
  }

  /*
* This function is used to bulk insert into the database
* Input Parameters
* @param {string}  Argument1 strCallerFunction   - name of the calling function
* @param {string} Argument1 strInsertQuery   - insert sql query
* @param {string} Argument1 arrInsertValues   - parameter values
* Output
* @returns {error obect} If any error response
* @returns {database rows} If success response
*/
  bulkInsertOperation = async (strCallerFunction: any, insertQuery: any, insertValues: any = [], boolAtomic: boolean = false) => {
    const dataObject = {
      dataObject: {
        insertQuery,
        insertValues,
        strCallerFunction,
        boolAtomic
      }
    };
    try {
      return await this.dbUtil.bulkInsertOperation(dataObject.dataObject);
    } catch (e) {
      logger.error({ source_function: 'API SERVICE - bulkInsertOperation', payload: dataObject }, e.message);
      throw new Error(e);
    }
  }

  /*
* This function is used to bulk insert into the database
* Input Parameters
* @param {string}  Argument1 strCallerFunction   - name of the calling function
* @param {string} Argument1 strInsertQuery   - insert sql query
* @param {string} Argument1 arrInsertValues   - parameter values
* Output
* @returns {error obect} If any error response
* @returns {database rows} If success response
*/
  deleteOperation = async (strCallerFunction: any, deleteQuery: any, selectId: any = [], boolAtomic: boolean = false) => {
    const dataObject = {
      dataObject: {
        deleteQuery,
        selectId,
        strCallerFunction,
        boolAtomic
      }
    };
    try {
      return await this.dbUtil.deleteOperation(dataObject.dataObject);
    } catch (e) {
      logger.error({ source_function: 'API SERVICE - bulkInsertOperation', payload: dataObject }, e.message);
      throw new Error(e);
    }
  }
}