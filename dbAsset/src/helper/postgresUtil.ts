import { PostgresService } from '../db/postgres';
import path from 'path';
import { Logger } from '../utils/logger';
import { Console } from 'console';
const strInsertCount: any = process.env.BULK_INSERT_COUNT;
const insertCount: any = parseInt(strInsertCount);

const logger = Logger.child({ source_service: 'DATABASE SERVICE', filename: path.basename(__filename) });

export class PostgresUtil {

    private pool = new PostgresService().getPool();

    constructor() {
        logger.debug({ source_function: 'POSTGRES UTIL - constructor' }, 'Pool Obj : %o', this.pool);
        logger.info({ source_function: 'POSTGRES UTIL - constructor' }, 'Postgres DB is ready and configured');
    }

    /*
      * This is used to prepare a bulk upsert query
      * Input Parameters
      * @param {json}  Argument1 objJsonData
      * @param {string}  Argument1 strTableName
      * @param {string}  Argument1 strWhereKey
      * @returns {status 400} If any error response
      * @returns {returnObj} If success response
      */

    buildBulkUpsertQuery = async (strCallerFunction: any, objJsonData: any, strTablename: any, arrNumFields: any = [], strConstraintName: any = '') => {
        try {
            const objInsertUpsert = await this.buildBulkInsertAndUpsertQuery(strCallerFunction, objJsonData, strTablename, arrNumFields, strConstraintName);
            logger.debug({ source_function: 'POSTGRES UTIL - buildBulkUpsertQuery', called_from: strCallerFunction }, 'objInsertUpsert : %o', objInsertUpsert);
            return {
                insertQuery: objInsertUpsert.bulkInsertSQL,
                insertQueryWithResult: objInsertUpsert.bulkInsertWithResult,
                upsertQuery: objInsertUpsert.bulkUpsertQuery,
                upsertQueryWithResult: objInsertUpsert.bulkUpsertWithResult,
                upsertValues: objInsertUpsert.insertUpsertValues
            };
        } catch (e) {
            logger.error({ source_function: 'POSTGRES UTIL - buildBulkUpsertQuery', called_from: strCallerFunction, table_name: strTablename, payload: objJsonData }, e.message);
            throw new Error(e);
        }
    }

    buildBulkInsertAndUpsertQuery = async (strCallerFunction: any, objJsonData: any, strTablename: any, arrNumFields: any = [], strConstraintName: any = '', strInsertFields: any = '') => {
        let arrInsertValues: any[] = [];
        try {
            let strInsertSeq = '';
            let strUpdateSetQuery: any;
            let i = 0;
            const arrInsertSql: any[] = [];
            const arrInsertWithResultSql: any[] = [];
            const arrUpsertQueryWithResult: any[] = [];
            const arrInsertVal: any[] = [];
            const arrUpsertQuery: any[] = [];
            const objJsonDataCopy = JSON.parse(JSON.stringify(objJsonData));
            const dbFields = objJsonDataCopy.shift();
            // if (strInsertFields == '') {
                Object.entries(dbFields).forEach(([key, value]) => {
                    strInsertFields = (strInsertFields == '') ? key : strInsertFields + ',' + key;
                    strUpdateSetQuery = !strUpdateSetQuery ? ` set ${key} = EXCLUDED.${key} ` : strUpdateSetQuery + `, ${key} = EXCLUDED.${key}`;
                });
            // } else {
            //     Object.entries(dbFields).forEach(([key, value]) => {
            //         strUpdateSetQuery = !strUpdateSetQuery ? ` set ${key} = EXCLUDED.${key} ` : strUpdateSetQuery + `, ${key} = EXCLUDED.${key}`;
            //     });
            // }
            let j = 0;
            for (const [key, value] of Object.entries(objJsonData)) {
                const val: any = value;
                strInsertSeq = strInsertSeq + `(`;
                let counter = 0;
                for (const [key1, value1] of Object.entries(val)) {
                    const val1: any = value1;
                    i++;
                    strInsertSeq = (counter === 0) ? strInsertSeq + '$' + i : strInsertSeq + ',$' + i;
                    counter++;
                    arrNumFields.includes(key1) ? arrInsertValues.push(parseFloat(val1)) : arrInsertValues.push(val1);
                    // arrInsertValues.push(val1);
                }

                strInsertSeq = strInsertSeq + `),`;
                if (++j === insertCount) {
                    i = 0;
                    j = 0;
                    await this.buildInsertArrays(strInsertSeq, strTablename, strInsertFields, strConstraintName, strUpdateSetQuery, arrInsertSql, arrInsertWithResultSql, arrUpsertQuery, arrUpsertQueryWithResult, arrInsertVal, arrInsertValues);
                    arrInsertValues = [];
                    strInsertSeq = '';
                }
            }
            if (j > 0) {
                await this.buildInsertArrays(strInsertSeq, strTablename, strInsertFields, strConstraintName, strUpdateSetQuery, arrInsertSql, arrInsertWithResultSql, arrUpsertQuery, arrUpsertQueryWithResult, arrInsertVal, arrInsertValues);
            }
            const objBulkInsertUpsert = {
                bulkInsertSQL: arrInsertSql,
                bulkInsertWithResult: arrInsertWithResultSql,
                bulkUpsertQuery: arrUpsertQuery,
                bulkUpsertWithResult: arrUpsertQueryWithResult,
                insertUpsertValues: arrInsertVal
            };
            logger.debug({ source_function: 'POSTGRES UTIL - buildBulkInsertAndUpsertQuery', called_from: strCallerFunction }, 'objBulkInsertUpsert : %o', objBulkInsertUpsert);
            return objBulkInsertUpsert;
        } catch (e) {
            logger.error({ source_function: 'POSTGRES UTIL - buildBulkInsertAndUpsertQuery', called_from: strCallerFunction, table_name: strTablename, payload: objJsonData }, e.message);
            throw new Error(e);
        }
    }

    buildInsertArrays = async (strInsertSeq: any, strTablename: any, strInsertFields: any, strConstraintName: any, strUpdateSetQuery: any,
        arrInsertSql: any[], arrInsertWithResultSql: any[], arrUpsertQuery: any[], arrUpsertQueryWithResult: any[], arrInsertVal: any[], arrInsertValues: any[]) => {

        strInsertSeq = strInsertSeq.substr(0, strInsertSeq.length - 1);
        const strinsertQuery1 = `INSERT INTO ${strTablename}(${strInsertFields}) VALUES ${strInsertSeq}`;
        const strinsertQueryWithResult = `INSERT INTO ${strTablename}(${strInsertFields}) VALUES ${strInsertSeq}  RETURNING *`;
        const strinsertQueryWithResult2 = `ON CONFLICT ON CONSTRAINT ${strConstraintName} DO UPDATE ${strUpdateSetQuery} RETURNING *`;
        const strinsertQuery2 = `ON CONFLICT ON CONSTRAINT ${strConstraintName} DO UPDATE ${strUpdateSetQuery}`;
        const strUpsertQuery = strinsertQuery1 + strinsertQuery2;
        const strUpsertQueryWithResult = strinsertQuery1 + strinsertQueryWithResult2;
        arrInsertSql.push(strinsertQuery1);
        arrInsertWithResultSql.push(strinsertQueryWithResult);
        arrUpsertQuery.push(strUpsertQuery);
        arrUpsertQueryWithResult.push(strUpsertQueryWithResult);
        arrInsertVal.push(arrInsertValues);
    }

    /*
      * This is used to prepare a bulk insert query
      * Input Parameters
      * @param {json}  Argument1 objJsonData
      * @param {string}  Argument1 strTableName
      * @param {string}  Argument1 strWhereKey
      * @returns {status 400} If any error response
      * @returns {returnObj} If success response
      */
    buildBulkInsertQuery = async (strCallerFunction: any, objJsonData: any, strTablename: any, arrNumFields: any = []) => {
        try {
            const objInsertUpsert = await this.buildBulkInsertAndUpsertQuery(strCallerFunction, objJsonData, strTablename, arrNumFields);
            const returnObj = {
                insertQuery: objInsertUpsert.bulkInsertSQL,
                insertQueryWithResult: objInsertUpsert.bulkInsertWithResult,
                insertValues: objInsertUpsert.insertUpsertValues
            };
            logger.debug({ source_function: 'POSTGRES UTIL - buildBulkInsertQuery', called_from: strCallerFunction }, 'objBulkInsert : %o', returnObj);
            return returnObj;
        } catch (e) {
            logger.error({ source_function: 'POSTGRES UTIL - buildBulkInsertQuery', called_from: strCallerFunction, table_name: strTablename, payload: objJsonData }, e.message);
            throw new Error(e);
        }
    }
    /*
      * This is used to prepare a bulk insert query with result
      * Input Parameters
      * @param {json}  Argument1 objJsonData
      * @param {string}  Argument1 strTableName
      * @param {string}  Argument1 strWhereKey
      * @returns {status 400} If any error response
      * @returns {returnObj} If success response
      */

    buildBulkInsertQueryWithResult = async (strCallerFunction: any, objJsonData: any, strTablename: any, arrNumFields: any = []) => {
        try {
            const objInsertUpsert = await this.buildBulkInsertAndUpsertQuery(strCallerFunction, objJsonData, strTablename, arrNumFields);
            const returnObj = {
                insertQuery: objInsertUpsert.bulkInsertWithResult,
                insertValues: objInsertUpsert.insertUpsertValues
            };
            logger.debug({ source_function: 'POSTGRES UTIL - buildBulkInsertQueryWithResult', called_from: strCallerFunction }, 'objInsertUpsert : %o', returnObj);
            return returnObj;
        } catch (e) {
            logger.error({ source_function: 'POSTGRES UTIL - buildBulkInsertQueryWithResult', called_from: strCallerFunction, table_name: strTablename, payload: objJsonData }, e.message);
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
    bulkInsertOperation = async (strCallerFunction: any, arrSqlQuery: any[], arrQueryValues: any[], boolAtomic: boolean = false) => {
        let client: any;
        let arrdata: any[] = [];
        // We need to have some value in the boolAtomic for managing transaction. else pool will be used.
        if (boolAtomic) {
            logger.info({ source_function: 'POSTGRES UTIL - bulkInsertOperation' }, 'Creating CLIENT');
            client = await this.pool.connect();
        }
        try {
            if (client) {
                await client.query('BEGIN');
                for (let i = 0; i < arrSqlQuery.length; i++) {
                    const dbrows = await client.query(arrSqlQuery[i], arrQueryValues[i]);
                    const data: any = dbrows.rows;
                    arrdata = [...arrdata, ...data];
                }
                await client.query('COMMIT');

            } else {
                logger.info({ source_function: 'POSTGRES UTIL - bulkInsertOperation' }, 'Atomic transaction: %o', boolAtomic);
                for (let i = 0; i < arrSqlQuery.length; i++) {
                    const dbrows = await this.pool.query(arrSqlQuery[i], arrQueryValues[i]);
                    arrdata = [...arrdata, ...dbrows.rows];
                }
            }
            return arrdata;
        } catch (e) {
            logger.error({ source_function: 'POSTGRES UTIL - bulkInsertOperation', called_from: strCallerFunction }, e.message);
            if (client) {
                await client.query('ROLLBACK');
            }
            throw e;
        } finally {
            if (client) {
                logger.info({ source_function: 'POSTGRES UTIL - bulkInsertOperation', called_from: strCallerFunction }, 'CLIENT Releasing');
                client.release();
            }
        }
    }

    /*
     * This function is used to create an upsert query. In this fuction we need to clreate both insert and the update statements and
     * then concatenate it. both the queries are created in a
     * Input Parameters
     * @param {string}  Argument1 strCallerFunction   - name of the calling function
     * @param {string} Argument2 objJsonData   - json data
     * @param {string} Argument3 strTablename   - table name
     * Output
     * @returns {error obect} If any error response
     * @returns {json object} If success response
     */

    buildUpsertQuery = async (strCallerFunction: any, objJsonData: any, strTablename: any, arrNumFields: any = [], arrKeyFields: any = [],strConstraintName: any='') => {
        const arrInsertValues = [];
        try {
            let strInsertFields;
            let intInsertSeq;
            let strUpdateSetQuery;
            let strWhereQuery;
            let i = 0;
            for (const [key, value] of Object.entries(objJsonData)) {
                const valueStr: any = value;
                i++;
                strInsertFields = !strInsertFields ? key : strInsertFields + ',' + key;
                arrNumFields.includes(key) ? arrInsertValues.push(parseFloat(valueStr)) : arrInsertValues.push(value);
                intInsertSeq = !intInsertSeq ? '$' + i : intInsertSeq + ',$' + i;
                if (arrKeyFields.includes(key)) {
                    // put the update where condition
                    strWhereQuery = !strWhereQuery ? ` WHERE ${key} =$${i} ` : strWhereQuery + ` AND ${key} =$${i}`;
                } else {
                    // put the update set values
                    strUpdateSetQuery = !strUpdateSetQuery ? ` set ${key} =$${i} ` : strUpdateSetQuery + `, ${key} =$${i}`;
                }
            }

            const strinsertQuery1 = `INSERT INTO ${strTablename}(${strInsertFields}) VALUES(${intInsertSeq}) ON CONFLICT (`;
            const strinsertQuery2 = `) DO UPDATE ${strUpdateSetQuery} RETURNING *`;
            const objUpsert = {
                upsertQueryPart1: strinsertQuery1,
                upsertQueryPart2: strinsertQuery2,
                upsertValues: arrInsertValues
            };
            logger.debug({ source_function: 'POSTGRES UTIL - buildUpsertQuery', called_from: strCallerFunction }, 'objUpsert : %o', objUpsert);
            return objUpsert;
        } catch (e) {
            logger.error({ source_function: 'POSTGRES UTIL - buildUpsertQuery', called_from: strCallerFunction, table_name: strTablename, payload: objJsonData }, e.message);
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

    buildInsertQuery = async (strCallerFunction: any, objJsonData: any, strTablename: any, arrNumFields: any = []) => {
        let strinsertQuery;
        const arrInsertValues = [];
        try {
            let strInsertFields;
            let intInsertSeq;
            let i = 0;
            for (const [key, value] of Object.entries(objJsonData)) {
                const valueStr: any = value;
                i++;
                strInsertFields = !strInsertFields ? key : strInsertFields + ',' + key;

                arrNumFields.includes(key) ? arrInsertValues.push(parseFloat(valueStr)) : arrInsertValues.push(value);
                intInsertSeq = !intInsertSeq ? '$' + i : intInsertSeq + ',$' + i;

            }

            strinsertQuery = `INSERT INTO ${strTablename}(${strInsertFields}) VALUES(${intInsertSeq}) RETURNING *`;
            const objInsert = {
                insertQuery: strinsertQuery,
                insertValues: arrInsertValues
            };
            logger.debug({ source_function: 'POSTGRES UTIL - buildInsertQuery', called_from: strCallerFunction }, 'objInsert : %o', objInsert);
            return objInsert;
        } catch (e) {
            logger.error({ source_function: 'POSTGRES UTIL - buildInsertQuery', called_from: strCallerFunction, table_name: strTablename, payload: objJsonData }, e.message);
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
        let strUpdateQuery;
        try {
            const updateObj = await this.buildUpdateSetQuery(strCallerFunction, objJsonData, arrNumFields, arrKeyFields);
            strUpdateQuery = `UPDATE ${strTablename} ${updateObj.updateSetQuery} ${updateObj.updateWhereQuery} RETURNING *`;
            const objUpdate = {
                updateQuery: strUpdateQuery,
                updateValues: updateObj.updateValues
            };
            logger.debug({ source_function: 'POSTGRES UTIL - buildUpdateQuery', called_from: strCallerFunction }, 'objUpdate : %o', objUpdate);
            return objUpdate;

        } catch (e) {
            logger.error({ source_function: 'POSTGRES UTIL - buildUpdateQuery', called_from: strCallerFunction, table_name: strTablename, payload: objJsonData }, e.message);
            throw new Error(e);
        }
    }

    /*
     * This function is used to create a bulk update query
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
        let strUpdateQuery;
        let updateObj;
        let updateInObj;
        try {
            // The query preperation is split into 2 parts
            // the objJsonData.updateSetObjectValue will contain the json object for the set operator. This will not create the where clause
            // if arrKeyFields is not having any values.
            if (objJsonData.updateSetObjectValue) {
                updateObj = await this.buildUpdateSetQuery(strCallerFunction, objJsonData.updateSetObjectValue, arrNumFields, arrKeyFields);
            } else {
                logger.error({ source_function: 'POSTGRES UTIL - buildBulkUpdateQuery' }, 'buildBulkUpdateQuery called without proper req.body.dataObject.updateObjectValue');
                throw new Error(`buildBulkUpdateQuery called without proper req.body.dataObject.updateObjectValue`);
            }

            if (objJsonData.whereInObject) {
                const strWhereOrLogicalOperator = (arrKeyFields.length === 0) ? ` WHERE ` : ` AND `;
                updateInObj = await this.buildWhereInCondition(strCallerFunction, objJsonData.whereInObject, updateObj.updateValues, arrNumFields, strWhereOrLogicalOperator);

            } else {
                logger.error({ source_function: 'POSTGRES UTIL - buildBulkUpdateQuery' }, 'buildBulkUpdateQuery called without proper req.body.dataObject.whereInArray');
                throw new Error(`buildBulkUpdateQuery called without proper req.body.dataObject.whereInArray`);
            }

            strUpdateQuery = `UPDATE ${strTablename} ${updateObj.updateSetQuery} `;
            strUpdateQuery = (arrKeyFields.length === 0) ? `${strUpdateQuery} ${updateInObj.InWhereQuery}` : `${strUpdateQuery} ${updateObj.updateWhereQuery} ${updateInObj.InWhereQuery}`;
            strUpdateQuery = strUpdateQuery + ` RETURNING *`;
            const objBulkUpdate = {
                bulkUpdateQuery: strUpdateQuery,
                bulkUpdateValues: updateInObj.updateValues
            };
            logger.debug({ source_function: 'POSTGRES UTIL - buildBulkUpdateQuery', called_from: strCallerFunction }, 'objBulkUpdate : %o', objBulkUpdate);
            return objBulkUpdate;

        } catch (e) {
            logger.error({ source_function: 'POSTGRES UTIL - buildBulkUpdateQuery', called_from: strCallerFunction, table_name: strTablename, payload: objJsonData }, e.message);
            throw new Error(e);
        }
    }


    /*
     * This function is used to create an set part of update query
     * Input Parameters
     * @param {string}  Argument1 strCallerFunction   - name of the calling function
     * @param {string} Argument2 objJsonData   - json data
     * @param {string} Argument3 strWhereCriteria   - where condition
     * Output
     * @returns {error obect} If any error response
     * @returns {json object} If success response
     */

    buildUpdateSetQuery = async (strCallerFunction: any, objJsonData: any, arrNumFields: any = [], arrKeyFields: any = []) => {
        let strUpdateSetQuery;
        const arrUpdateValues = [];
        try {
            let strWhereQuery='';
            let i = 0;
            for (const [key, value] of Object.entries(objJsonData)) {
                const valueStr: any = value;
                i++;
                if (arrKeyFields.includes(key)) {
                    // put the update where condition
                    strWhereQuery = !strWhereQuery ? ` WHERE ${key} =$${i} ` : strWhereQuery + ` AND ${key} =$${i}`;
                } else {
                    // put the update set values
                    strUpdateSetQuery = !strUpdateSetQuery ? ` set ${key} =$${i} ` : strUpdateSetQuery + `, ${key} =$${i}`;
                }
                arrNumFields.includes(key) ? arrUpdateValues.push(parseFloat(valueStr)) : arrUpdateValues.push(value);
            }
            const objUpdateSet = {
                updateSetQuery: strUpdateSetQuery,
                updateWhereQuery: strWhereQuery,
                updateValues: arrUpdateValues
            };
            logger.debug({ source_function: 'POSTGRES UTIL - buildUpdateSetQuery', called_from: strCallerFunction }, 'objUpdateSet : %o', objUpdateSet);
            return objUpdateSet;
        } catch (e) {
            logger.error({ source_function: 'POSTGRES UTIL - buildUpdateSetQuery', called_from: strCallerFunction, payload: objJsonData }, e.message);
            throw new Error(e);
        }
    }

    /*
     * This function is used to create "in" query for bulk update
     * Input Parameters
     * @param {string}  Argument1 strCallerFunction   - name of the calling function
     * @param {string} Argument2 objJsonData   - single element json data which hold the database field anem and array of values
     * @param {string} Argument3 strLogicalOperator   - this is the logical operator for this part of quer, Default AND
     * @param {string} Argument4 arrUpdateValues   - This can be an empty array (incase of select), or the array of values to which the values will be appended
     * @param {string} Argument5 arrNumFields   - this can be an empty array or the field names which hold numberic values
     * Output
     * @returns {error obect} If any error response
     * @returns {json object} If success response
     */

    buildWhereInCondition = async (strCallerFunction: any, whereInObject: any, arrUpdateValues: any = [], arrNumFields: any = [], strWhereOrLogicalOperator: string = ` AND `) => {
        let strInWhereQuery;
        let i = arrUpdateValues.length;
        try {
            for (const [key, value] of Object.entries(whereInObject)) {
                const arrVal: any = value;
                for (const strInValues of arrVal) {
                    const valueStr: any = strInValues;
                    i++;
                    // put the update where condition
                    strInWhereQuery = !strInWhereQuery ? ` ${strWhereOrLogicalOperator} ${key} in ($${i} ` : strInWhereQuery + `, $${i}`;
                    arrNumFields.includes(key) ? arrUpdateValues.push(parseFloat(valueStr)) : arrUpdateValues.push(valueStr);
                }
            }
            strInWhereQuery = strInWhereQuery + `)`;

            const objWhereIn = {
                InWhereQuery: strInWhereQuery,
                updateValues: arrUpdateValues
            };
            logger.debug({ source_function: 'POSTGRES UTIL - buildWhereInCondition', called_from: strCallerFunction }, 'objWhereIn : %o', objWhereIn);
            return objWhereIn;
        } catch (e) {
            logger.error({ source_function: 'POSTGRES UTIL - buildWhereInCondition', called_from: strCallerFunction, payload: whereInObject }, e.message);
            throw new Error(e);
        }
    }

    /*
     * This function is used to create an select query
     * Input Parameters
     * @param {string}  Argument1 strCallerFunction   - name of the calling function
     * @param {string} Argument2 strTablename   - table name
     * @param {string} Argument3 strWhereCriteria   - where condition
     * @param {string} Argument4 arrSelectFields   - fields to be selected default *
     * Output
     * @returns {error obect} If any error response
     * @returns {json object} If success response
     */

    buildSelectQuery = async (strCallerFunction: any, strTablename: any, strWhereCriteria: any, arrSelectFields: any = ['*']) => {
        let strSelectQuery;
        try {
            let strSelectFields;
            for (const strFieldName of arrSelectFields) {
                strSelectFields = !strSelectFields ? strFieldName : strSelectFields + ',' + strFieldName;
            }

            strSelectQuery = `SELECT ${strSelectFields} from ${strTablename} ${strWhereCriteria}`;

            const objSelect = {
                selectQuery: strSelectQuery
            };
            logger.debug({ source_function: 'POSTGRES UTIL - buildSelectQuery', called_from: strCallerFunction }, 'objSelect : %o', objSelect);
            return objSelect;
        } catch (e) {
            logger.error({ source_function: 'POSTGRES UTIL - buildSelectQuery', called_from: strCallerFunction, table_name: strTablename, payload: strTablename }, e.message);
            throw new Error(e);
        }
    }

    /*
     * This function is used to create an delete query
     * Input Parameters
     * @param {string}  Argument1 strCallerFunction   - name of the calling function
     * @param {string} Argument2 strTablename   - table name
     * @param {string} Argument3 strWhereCriteria   - where condition
     * @param {string} Argument4 arrSelectFields   - fields to be selected default *
     * Output
     * @returns {error obect} If any error response
     * @returns {json object} If success response
     */

    buildDeleteQuery = async (strCallerFunction: any, strTablename: any, strWhereCriteria: any) => {
        let strDeleteQuery;
        try {
            strDeleteQuery = `DELETE from ${strTablename} ${strWhereCriteria}`;

            const objDelete = {
                deleteQuery: strDeleteQuery
            };
            logger.debug({ source_function: 'POSTGRES UTIL - buildDeleteQuery', called_from: strCallerFunction }, 'objDelete : %o', objDelete);
            return objDelete;
        } catch (e) {
            logger.error({ source_function: 'POSTGRES UTIL - buildDeleteQuery', called_from: strCallerFunction, table_name: strTablename, payload: strTablename }, e.message);
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
    insertOperation = async (strCallerFunction: any, strSqlQuery: any, arrQueryValues: any, boolAtomic: boolean = false) => {
        let client: any;
        if (boolAtomic) {
            logger.info({ source_function: 'POSTGRES UTIL - insertOperation' }, 'Creating CLIENT');
            client = await this.pool.connect();
        }
        try {
            if (client) {
                await client.query('BEGIN');
                const dbrows = await client.query(strSqlQuery, arrQueryValues);
                const data: any = dbrows.rows;
                await client.query('COMMIT');
                return data;
            } else {
                logger.info({ source_function: 'POSTGRES UTIL - insertOperation' }, 'Atomic transaction : %o', boolAtomic);
                const dbrows = await this.pool.query(strSqlQuery, arrQueryValues);
                return dbrows.rows;
            }
        } catch (e) {
            logger.error({ source_function: 'POSTGRES UTIL - insertOperation', payload: strSqlQuery, query_values: arrQueryValues }, e.message);
            if (client) {
                await client.query('ROLLBACK');
            }
            throw new Error(e);
        } finally {
            if (client) {
                logger.info({ source_function: 'POSTGRES UTIL - insertOperation' }, 'CLIENT Releasing');
                client.release();
            }
        }
    }


    /*
     * This function is used to select from the database
     * Input Parameters
     * @param {string}  Argument1 strCallerFunction   - name of the calling function
     * @param {string} Argument1 strSqlQuery   - select sql query
     * @param {string} Argument1 arrQueryValues   - parameter values
     * Output
     * @returns {error obect} If any error response
     * @returns {database rows} If success response
     */
    selectOperation = async (strCallerFunction: any, strSqlQuery: any, arrQueryValues: any) => {
        try {
            const dbrows = await this.pool.query(strSqlQuery, arrQueryValues);
            return dbrows.rows;
        } catch (e) {
            logger.error({ source_function: 'POSTGRES UTIL - selectOperation', payload: strSqlQuery, query_values: arrQueryValues }, e.message);
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
    updateOperation = async (strCallerFunction: any, strSqlQuery: any, arrQueryValues: any, boolAtomic: boolean = false) => {
        let client: any;
        if (boolAtomic) {
            logger.info({ source_function: 'POSTGRES UTIL - updateOperation' }, 'Creating CLIENT');
            client = await this.pool.connect();
        }
        try {
            if (client) {
                await client.query('BEGIN');
                const dbrows = await client.query(strSqlQuery, arrQueryValues);

                const data: any = dbrows.rows;
                await client.query('COMMIT');
                return data;
            } else {
                logger.info({ source_function: 'POSTGRES UTIL - updateOperation' }, 'Atomic transaction : %o', boolAtomic);
                const dbrows = await this.pool.query(strSqlQuery, arrQueryValues);
                return dbrows.rows;
            }
        } catch (e) {
            logger.error({ source_function: 'POSTGRES UTIL - updateOperation', payload: strSqlQuery, query_values: arrQueryValues }, e.message);
            if (client) {
                await client.query('ROLLBACK');
            }
            throw new Error(e);
        } finally {
            if (client) {
                logger.info({ source_function: 'POSTGRES UTIL - updateOperation' }, 'CLIENT Releasing');
                client.release();
            }
        }
    }

    /*
     * This function is used to delete from the database
     * Input Parameters
     * @param {string}  Argument1 strCallerFunction   - name of the calling function
     * @param {string} Argument1 strSqlQuery   - delete sql query
     * @param {string} Argument1 arrCriteriaValues   - parameter values
     * Output
     * @returns {error obect} If any error response
     * @returns {null} If success response
     */
    deleteOperation = async (strCallerFunction: any, strSqlQuery: any, arrQueryValues: any, boolAtomic: boolean = false) => {
        let client: any;
        if (boolAtomic) {
            logger.info({ source_function: 'POSTGRES UTIL - deleteOperation' }, 'Creating CLIENT');
            client = await this.pool.connect();
        }
        try {
            if (client) {
                await client.query('BEGIN');
                const dbrows = await client.query(strSqlQuery, arrQueryValues);
                const data: any = dbrows.rows;
                await client.query('COMMIT');
                return data;
            } else {
                logger.info({ source_function: 'POSTGRES UTIL - deleteOperation' }, 'Atomic transaction : %o', boolAtomic);
                const dbrows = await this.pool.query(strSqlQuery, arrQueryValues);
                return dbrows.rows;
            }
        } catch (e) {
            logger.error({ source_function: 'POSTGRES UTIL - deleteOperation', payload: strSqlQuery, query_values: arrQueryValues }, e.message);
            if (client) {
                await client.query('ROLLBACK');
            }
            throw new Error(e);
        } finally {
            if (client) {
                logger.info({ source_function: 'POSTGRES UTIL - deleteOperation' }, 'CLIENT Releasing');
                client.release();
            }
        }
    }

    /*
     * This function is used to create and delete tables
     * Input Parameters
     * @param {string}  Argument1 strCallerFunction   - name of the calling function
     * @param {string} Argument1 strSqlQuery   - create table or delete table query
     * @param {string} Argument1 arrQueryValues   - parameter values
     * Output
     * @returns {error obect} If any error response
     * @returns {null} If success response
     */
    ddlOperation = async (strCallerFunction: any, strSqlQuery: any, arrQueryValues: any) => {
        try {
            const dbrows = await this.pool.query(strSqlQuery, arrQueryValues);
            return dbrows.rows;
        } catch (e) {
            logger.error({ source_function: 'POSTGRES UTIL - ddlOperation', payload: strSqlQuery, query_values: arrQueryValues }, e.message);
            throw new Error(e);
        }
    }
}