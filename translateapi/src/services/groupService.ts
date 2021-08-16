/**
 * This file handles the services/ functions of group.
 */

import axios from 'axios';
import path from 'path';
import { Logger } from '../utils/logger';

const logger = Logger.child({ source_service: 'GROUP SERVICE', filename: path.basename(__filename) });

export class DbService {

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
      let objInsert;
      const dburl = process.env.DBENDPOINT;
      const url = dburl + '/buildinsertquery';
      logger.info({ source_function: 'GROUP DB SERVICE - buildInsertQuery', called_service: 'DATABASE SERVICE' }, 'ServiceEndpoint : %s', url);
      await axios.post(url, dataObject)
        .then((response) => {
          objInsert = response.data;
        })
        .catch((error) => {
          throw new Error(error);
        });
      return objInsert;
    } catch (e) {
      logger.error({ source_function: 'GROUP DB SERVICE - buildInsertQuery', payload: dataObject }, e.message);
      throw new Error(e);
    }
  }

  /*
   * This function is used to bulk insert/update db
   * Input Parameters
   * @param {string}  Argument1 strCallerFunction   - name of the calling function
   * @param {string} Argument2 objJsonData   - json data
   * @param {string} Argument3 strTablename   - table name
   * Output
   * @returns {error obect} If any error response
   * @returns {json object} If success response
   */
  apiBulkUpsert = async (strCallerFunction: any, objJsonData: any, strTablename: any, arrNumFields: any = [], arrKeyFields: any = [], strConstraintName: any = '', toLedgerData: string = '') => {
    const dataObject = {
      dataObject: {
        arrNumFields,
        arrKeyFields,
        strCallerFunction,
        objJsonData,
        strTablename,
        strConstraintName,
        toLedgerData
      }
    };
    try {
      let objInsert;
      const dburl = process.env.DBENDPOINT;
      const url = dburl + '/apibulkupsert';
      logger.info({ source_function: 'GROUP DB SERVICE - apiBulkUpsert', called_service: 'DATABASE SERVICE' }, 'ServiceEndpoint : %s', url);
      await axios.post(url, dataObject)
        .then((response) => {
          objInsert = response.data;
        })
        .catch((error) => {
          throw new Error(error);
        });
      return objInsert;
    } catch (e) {
      logger.error({ source_function: 'GROUP DB SERVICE - apiBulkUpsert', payload: dataObject }, e.message);
      throw new Error(e);
    }
  }

  /*
   * This function is used to bulk insert db
   * Input Parameters
   * @param {string}  Argument1 strCallerFunction   - name of the calling function
   * @param {string} Argument2 objJsonData   - json data
   * @param {string} Argument3 strTablename   - table name
   * Output
   * @returns {error obect} If any error response
   * @returns {json object} If success response
   */
  apiBulkInsert = async (strCallerFunction: any, objJsonData: any, strTablename: any, arrNumFields: any = [], arrKeyFields: any = [], strConstraintName: any = '', toLedgerData: string = '') => {
    const dataObject = {
      dataObject: {
        arrNumFields,
        arrKeyFields,
        strCallerFunction,
        objJsonData,
        strTablename,
        strConstraintName,
        toLedgerData
      }
    };
    try {
      let objInsert;
      const dburl = process.env.DBENDPOINT;
      const url = dburl + '/apibulkinsert';
      logger.info({ source_function: 'GROUP DB SERVICE - apiBulkInsert', called_service: 'DATABASE SERVICE' }, 'ServiceEndpoint : %s', url);
      await axios.post(url, dataObject)
        .then((response) => {
          objInsert = response.data;
        })
        .catch((error) => {
          throw new Error(error);
        });
      return objInsert;
    } catch (e) {
      logger.error({ source_function: 'GROUP DB SERVICE - apiBulkInsert', payload: dataObject }, e.message);
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
      let objInsert;
      const dburl = process.env.DBENDPOINT;
      const url = dburl + '/buildbulkinsertquery';
      logger.info({ source_function: 'GROUP DB SERVICE - buildBulkInsertQuery', called_service: 'DATABASE SERVICE' }, 'ServiceEndpoint : %s', url);
      await axios.post(url, dataObject)
        .then((response) => {
          objInsert = response.data;
        })
        .catch((error) => {
          throw new Error(error);
        });
      return objInsert;
    } catch (e) {
      logger.error({ source_function: 'GROUP DB SERVICE - buildBulkInsertQuery', payload: dataObject }, e.message);
      throw new Error(e);
    }
  }

  /*
   * This function is used to create an select query
   * Input Parameters
   * @param {string}  Argument1 strCallerFunction   - name of the calling function
   * @param {string} Argument2 objJsonData   - json data
   * @param {string} Argument3 strTablename   - table name
   * Output
   * @returns {error obect} If any error response
   * @returns {json object} If success response
   */

  buildSelectQuery = async (strCallerFunction: any, strTablename: any, strWhereCriteria: any, arrSelectFields: any = []) => {
    const dataObject = {
      dataObject: {
        arrSelectFields,
        strCallerFunction,
        strWhereCriteria,
        strTablename
      }
    };
    try {
      let objInsert;
      const dburl = process.env.DBENDPOINT;
      const url = dburl + '/buildselectquery';
      logger.info({ source_function: 'GROUP DB SERVICE - buildSelectQuery', called_service: 'DATABASE SERVICE' }, 'ServiceEndpoint : %s', url);
      await axios.post(url, dataObject)
        .then((response) => {
          objInsert = response.data;
        })
        .catch((error) => {
          throw new Error(error);
        });
      return objInsert;
    } catch (e) {
      logger.error({ source_function: 'GROUP DB SERVICE - buildSelectQuery', payload: dataObject }, e.message);
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
  genericSelect = async (dataObject: any) => {
    try {
      let objResData;
      const dburl = process.env.DBENDPOINT;
      const url = dburl + '/genericselect';
      logger.info({ source_function: 'genericSelect', called_service: 'DATABASE SERVICE' }, 'ServiceEndpoint : %s', url);
      await axios.post(url, dataObject)
        .then((response) => {
          objResData = response.data;
        })
        .catch((error) => {
          throw new Error(error);
        });
      return objResData;
    } catch (e) {
      logger.error({ source_function: 'GROUP DB SERVICE - genericSelect;', payload: dataObject }, e.message);
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
  insert = async (dataObject: any) => {
    try {
      let objResData;
      const dburl = process.env.DBENDPOINT;
      const url = dburl + '/insert';
      logger.info({ source_function: 'insert', called_service: 'DATABASE SERVICE' }, 'ServiceEndpoint : %s', url);
      await axios.post(url, dataObject)
        .then((response) => {
          objResData = response.data;
        })
        .catch((error) => {
          throw new Error(error);
        });
      return objResData;
    } catch (e) {
      logger.error({ source_function: 'GROUP DB SERVICE - insert', payload: dataObject }, e.message);
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
      let objInsert;
      const dburl = process.env.DBENDPOINT;
      const url = dburl + '/buildupdatequery';
      logger.info({ source_function: 'GROUP DB SERVICE - buildUpdateQuery', called_service: 'DATABASE SERVICE' }, 'ServiceEndpoint : %s', url);
      await axios.post(url, dataObject)
        .then((response) => {
          objInsert = response.data;
        })
        .catch((error) => {
          throw new Error(error);
        });
      return objInsert;
    } catch (e) {
      logger.error({ source_function: 'GROUP DB SERVICE - buildUpdateQuery', payload: dataObject }, e.message);
      throw new Error(e);
    }
  }

  /*
   * This function is used to create bulk update query
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
      let objInsert;
      const dburl = process.env.DBENDPOINT;
      const url = dburl + '/buildbulkupdatequery';
      logger.info({ source_function: 'GROUP DB SERVICE - buildBulkUpdateQuery', called_service: 'DATABASE SERVICE' }, 'ServiceEndpoint : %s', url);
      await axios.post(url, dataObject)
        .then((response) => {
          objInsert = response.data;
        })
        .catch((error) => {
          throw new Error(error);
        });
      return objInsert;
    } catch (e) {
      logger.error({ source_function: 'GROUP DB SERVICE - buildBulkUpdateQuery', payload: dataObject }, e.message);
      throw new Error(e);
    }
  }

  /*
   * This function is used to create a delete query
   * Input Parameters
   * @param {string}  Argument1 strCallerFunction   - name of the calling function
   * @param {string} Argument2 objJsonData   - json data
   * @param {string} Argument3 strTablename   - table name
   * Output
   * @returns {error obect} If any error response
   * @returns {json object} If success response
   */
  buildDeleteQuery = async (strCallerFunction: any, strTablename: any, strWhereCriteria: any) => {
    const dataObject = {
      dataObject: {
        strCallerFunction,
        strTablename,
        strWhereCriteria
      }
    };
    try {
      let objInsert;
      const dburl = process.env.DBENDPOINT;
      const url = dburl + '/builddeletequery';
      logger.info({ source_function: 'GROUP DB SERVICE - buildDeleteQuery', called_service: 'DATABASE SERVICE' }, 'ServiceEndpoint : %s', url);
      await axios.post(url, dataObject)
        .then((response) => {
          objInsert = response.data;
        })
        .catch((error) => {
          throw new Error(error);
        });
      return objInsert;
    } catch (e) {
      logger.error({ source_function: 'GROUP DB SERVICE - buildDeleteQuery', payload: dataObject }, e.message);
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
  insertOperation = async (strCallerFunction: any, insertQuery: any, insertValues: any = []) => {
    const dataObject = {
      dataObject: {
        insertQuery,
        insertValues,
        strCallerFunction
      }
    };
    try {
      let objInsert;
      const dburl = process.env.DBENDPOINT;
      const url = dburl + '/insertoperation';
      logger.info({ source_function: 'GROUP DB SERVICE - insertOperation', called_service: 'DATABASE SERVICE' }, 'ServiceEndpoint : %s', url);
      await axios.post(url, dataObject)
        .then((response) => {
          objInsert = response.data;
        })
        .catch((error) => {
          throw new Error(error);
        });
      return objInsert;
    } catch (e) {
      logger.error({ source_function: 'GROUP DB SERVICE - insertOperation', payload: dataObject }, e.message);
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
      let objInsert;
      const dburl = process.env.DBENDPOINT;
      const url = dburl + '/selectoperation';
      logger.info({ source_function: 'GROUP DB SERVICE - selectOperation', called_service: 'DATABASE SERVICE' }, 'ServiceEndpoint : %s', url);
      await axios.post(url, dataObject)
        .then((response) => {
          objInsert = response.data;
        })
        .catch((error) => {
          throw new Error(error);
        });
      return objInsert;
    } catch (e) {
      logger.error({ source_function: 'GROUP DB SERVICE - seledctOperation', payload: dataObject }, e.message);
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
  updateOperation = async (strCallerFunction: any, updateQuery: any, updateValues: any = []) => {
    const dataObject = {
      dataObject: {
        updateQuery,
        updateValues,
        strCallerFunction
      }
    };
    try {
      let objInsert;
      const dburl = process.env.DBENDPOINT;
      const url = dburl + '/updateoperation';
      logger.info({ source_function: 'GROUP DB SERVICE - updateOperation', called_service: 'DATABASE SERVICE' }, 'ServiceEndpoint : %s', url);
      await axios.post(url, dataObject)
        .then((response) => {
          objInsert = response.data;
        })
        .catch((error) => {
          throw new Error(error);
        });
      return objInsert;
    } catch (e) {
      logger.error({ source_function: 'GROUP DB SERVICE - selectOperation', payload: dataObject }, e.message);
      throw new Error(e);
    }
  }

  /*
   * This function is used to delete from the database, This is using a internal post call to the
   * database service. This is because the delete operation api is a generic api which accepts object which contains
   * the delete query and the array of delete paramenter. Converting all the object into query parameters will take off
   * the generic behaviour of the api as the query parameter numbers can vary of each api call
   * Input Parameters
   * @param {string}  Argument1 strCallerFunction   - name of the calling function
   * @param {string} Argument1 strInsertQuery   - delete sql query
   * @param {string} Argument1 arrInsertValues   - parameter values
   * Output
   * @returns {error obect} If any error response
   * @returns {database rows} If success response
   */
  deleteOperation = async (strCallerFunction: any, deleteQuery: any, selectId: any) => {
    const dataObject = {
      dataObject: {
        deleteQuery,
        selectId,
        strCallerFunction
      }
    };
    try {
      let objInsert;
      const dburl = process.env.DBENDPOINT;
      const url = dburl + '/deleteoperation';
      logger.info({ source_function: 'GROUP DB SERVICE - deleteOperation', called_service: 'DATABASE SERVICE' }, 'ServiceEndpoint : %s', url);
      await axios.post(url, dataObject)
        .then((response) => {
          objInsert = response.data;
        })
        .catch((error) => {
          throw new Error(error);
        });
      return objInsert;
    } catch (e) {
      logger.error({ source_function: 'GROUP DB SERVICE - deleteOperation', payload: dataObject }, e.message);
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
  bulkInsertOperation = async (strCallerFunction: any, insertQuery: any, insertValues: any = []) => {
    const dataObject = {
      dataObject: {
        insertQuery,
        insertValues,
        strCallerFunction
      }
    };
    try {
      let objInsert;
      const dburl = process.env.DBENDPOINT;
      const url = dburl + '/bulkInsertOperation';
      logger.info({ source_function: 'GROUP DB SERVICE - bulkInsertOperation', called_service: 'DATABASE SERVICE' }, 'ServiceEndpoint : %s', url);
      await axios.post(url, dataObject)
        .then((response) => {
          objInsert = response.data;
        })
        .catch((error) => {
          throw new Error(error);
        });
      return objInsert;
    } catch (e) {
      logger.error({ source_function: 'GROUP DB SERVICE - bulkInsertOperation', payload: dataObject }, e.message);
      throw new Error(e);
    }
  }


}