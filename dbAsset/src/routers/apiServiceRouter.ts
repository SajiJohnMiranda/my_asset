/**
 * This file handles the CRUD functionality.
 */
import express from 'express';
import path from 'path';
import { DbService } from '../services/apiService';
import { Logger } from '../utils/logger';
import { BuildUpsertObject } from '../services/buildUpsertObject';
import { BuildInsertObject } from '../services/buildInsertObject';
import { BuildUpdateObject } from '../services/buildUpdateObject';
import {BuildDeleteObject}from '../services/buildDeleteObject';
const logger = Logger.child({ source_service: 'API SERVICE', filename: path.basename(__filename) });

export class ApiServiceRouter {
    public router = express.Router();
    private dbService = new DbService();
    private buildUpsertObj = new BuildUpsertObject();
    private buildInsertObj = new BuildInsertObject();
    private buildUpdateObj = new BuildUpdateObject();
    private buildDeleteObj = new BuildDeleteObject();
    

    constructor() {

        this.router.post('/genericselect', this.genericSelect);

        this.router.post('/insert', this.bulkInsert);

        this.router.put('/update', this.updateApi);

        this.router.put('/bulkupdate', this.bulkUpdate);

        this.router.post('/upsert', this.bulkUpsert);

        this.router.delete('/delete/:id', this.deleteApi);
    }
    /*
     * This is used to add rows.
     * Input Parameters
     * @param {json Object}  Argument1 Name   - objJsonData
     * @returns {status 400} If any error response
     * @returns {json Object} If success response
     */
        
    bulkInsert = async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            if (Object.keys(req.body.objJsonData).length === 0) { throw new Error(`req.body.objJsonData is empty`); }
            let reqBodyObj: any = req.body;
            if (!(reqBodyObj.endPoint)) { throw new Error(`Error in endpoint url`); }
            reqBodyObj = await this.buildInsertObj.buildInsertObject(reqBodyObj);
            const dbres = await this.fnBulkInsert(reqBodyObj);
            res.status(201).send(dbres);
        }
        catch (e) {
            console.log(e);
            // logger.error({ source_function: 'Api ROUTER - bulkUpsert', payload: req.body }, e.message);
            res.status(400).send(e);
        }
    }
    fnBulkInsert = async (reqBodyObj: any): Promise<any> => {
        try {
            if (Object.keys(reqBodyObj.objJsonData).length === 0) { throw new Error(`reqBodyObj.objJsonData is empty`); }
            // strCallerFunction is a placeholder to identify from where the function is called in case of error
            const strCallerFunction = reqBodyObj.strCallerFunction;
            // objJsonData hold the json object from which the SQL query will be generated
            const objJsonData = reqBodyObj.objJsonData;
            // strTablename holds the name of the table on which the SQL is getting build
            const strTablename = reqBodyObj.tableName;
            // arrNumFields includes the numeric fields
            const arrNumFields = reqBodyObj.arrNumFields;
            // boolAtomic will decide whether to have atomoic transaction default false, i.e non atomic
            const boolAtomic = reqBodyObj.boolAtomic;
            const objInsert: any = await this.dbService.buildBulkInsertQuery(strCallerFunction, objJsonData, strTablename, arrNumFields);
            logger.debug({ source_function: 'Api ROUTER - bulkInsert' }, 'objInsertQuery : %o', objInsert);
            // the below function fires the generated sql against the database
            return await this.dbService.bulkInsertOperation(strCallerFunction, objInsert.insertQueryWithResult, objInsert.insertValues, boolAtomic);

        }
        catch (e) {
            console.log(e);
            // logger.error({ source_function: 'Api ROUTER - bulkInsertWithResult', payload: reqBodyObj }, e.message);
            throw new Error(`Error occured in fnBulkInsertWithResult ${e}`);
        }
    }
    /*
     * This is used to add an row.
     * Input Parameters
     * @param {json Object}  Argument1 Name   - objJsonData
     * @returns {status 400} If any error response
     * @returns {json Object} If success response
     */
    bulkUpsert = async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            if (Object.keys(req.body.objJsonData).length === 0) { throw new Error(`req.body.objJsonData is empty`); }
            let reqBodyObj: any = req.body;
            if (!(reqBodyObj.endPoint)) { throw new Error(`Error in endpoint url`); }
            reqBodyObj = await this.buildUpsertObj.buildUpsertObject(reqBodyObj);
            const dbres = await this.fnBulkUpsert(reqBodyObj);
            res.status(201).send(dbres);
        }
        catch (e) {
            console.log(e);
            // logger.error({ source_function: 'Api ROUTER - bulkUpsert', payload: req.body }, e.message);
            res.status(400).send(e);
        }
    }

    fnBulkUpsert = async (reqBodyObj: any): Promise<any> => {
        try {
            if (Object.keys(reqBodyObj.objJsonData).length === 0) { throw new Error(`reqBodyObj.objJsonData is empty`); }
            // strCallerFunction is a placeholder to identify from where the function is called in case of error
            const strCallerFunction = reqBodyObj.strCallerFunction;
            // objJsonData hold the json object from which the SQL query will be generated
            const objJsonData = reqBodyObj.objJsonData;
            // strTablename holds the name of the table on which the SQL is getting build
            const strTablename = reqBodyObj.tableName;
            // arrNumFields includes the numeric fields
            const arrNumFields = reqBodyObj.arrNumFields;
            // strConstraintName will decide on which constrain the update should happen in an upsert statement.
            const strConstraintName = reqBodyObj.strConstraintName;
            // boolAtomic will decide whether to have atomoic transaction default false, i.e non atomic
            const boolAtomic = reqBodyObj.boolAtomic;
            // the below function creates the SQL and inserts into the database
            return await this.dbService.directBulkUpsert(strCallerFunction, objJsonData, strTablename, arrNumFields, strConstraintName, boolAtomic);

        }
        catch (e) {
            console.log(e);
            // logger.error({ source_function: 'Api ROUTER - fnBulkUpsert', payload: reqBodyObj }, e.message);
            throw new Error(`Error occured in fnBulkUpsert ${e}`);
        }
    }

    /*
     * This is used to add or update a row.
     * Input Parameters
     * @param {json Object}  Argument1 Name   - objJsonData
     * @returns {status 400} If any error response
     * @returns {json Object} If success response
     */
    upsertApi = async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            if (Object.keys(req.body.objJsonData).length === 0) { throw new Error(`req.body.objJsonData is empty`); }
            let reqBodyObj: any = req.body;
            if (!(reqBodyObj.endPoint)) { throw new Error(`Error in endpoint url`); }
            reqBodyObj = await this.buildInsertObj.buildInsertObject(reqBodyObj);
            const dbres = await this.fnUpsertApi(reqBodyObj);
            res.status(201).send(dbres);
        }
        catch (e) {
            console.log(e);
            // logger.error({ source_function: 'Api ROUTER - insertApi', payload: req.body }, e.message);
            res.status(400).send(e);
        }
    }

    fnUpsertApi = async (reqBodyObj: any): Promise<any> => {
        try {
            if (Object.keys(reqBodyObj.objJsonData).length === 0) { throw new Error(`reqBodyObj.objJsonData is empty`); }
            const strCallerFunction = reqBodyObj.strCallerFunction;
            // objJsonData hold the json object from which the SQL query will be generated
            const objJsonData = reqBodyObj.objJsonData;
            // strTablename holds the name of the table on which the SQL is getting build
            const strTablename = reqBodyObj.tableName;
            // arrNumFields includes the numeric fields
            const arrNumFields = reqBodyObj.arrNumFields;
            // strConstraintName will decide on which constrain the update should happen in an upsert statement.
            const strConstraintName = reqBodyObj.strConstraintName;
            // boolAtomic will decide whether to have atomoic transaction default false, i.e non atomic
            const boolAtomic = reqBodyObj.boolAtomic;

            const objInsert: any = await this.dbService.buildUpsertQuery(strCallerFunction,objJsonData,strTablename,arrNumFields,[],strConstraintName);
            logger.debug({ source_function: 'Api ROUTER - addApi' }, 'objInsertQuery : %o', objInsert);
            // the below function fires the generated sql against the database
            return await this.dbService.insertOperation(strCallerFunction, objInsert.insertQuery, objInsert.insertValues, boolAtomic);
        }
        catch (e) {
            console.log(e);
            // logger.error({ source_function: 'Api ROUTER - addApi', payload: reqBodyObj }, e.message);
            throw new Error(`Error occured in fnInsertApi ${e}`);
        }
    }


    /*
     * This is used to update an row.
     * Input Parameters
     * @param {json}  Argument1 Name   - bbe_id (This can be any name or value)
     * @returns {status 400} If any error response
     * @returns {json Object} If success response
     */
    updateApi = async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            if (Object.keys(req.body.objJsonData).length === 0) { throw new Error(`req.body.objJsonData is empty`); }
            let reqBodyObj: any = req.body;
            if (!(reqBodyObj.endPoint)) { throw new Error(`Error in endpoint url`); }
            reqBodyObj = await this.buildUpdateObj.buildUpdateObject(reqBodyObj);
            const dbres = await this.fnUpdateApi(reqBodyObj);
            res.status(200).send(dbres);
        }
        catch (e) {
            console.log(e);
            // logger.error({ source_function: 'Api ROUTER - bulkUpsert', payload: req.body }, e.message);
            res.status(400).send(e);
        }
    }

    fnUpdateApi = async (reqBodyObj: any): Promise<any> => {
        try {
            if (Object.keys(reqBodyObj.objJsonData).length === 0) { throw new Error(`reqBodyObj.objJsonData is empty`); }
            // strCallerFunction is a placeholder to identify from where the function is called in case of error
            const strCallerFunction = reqBodyObj.strCallerFunction;
            // objJsonData hold the json object from which the SQL query will be generated
            const objJsonData = reqBodyObj.objJsonData;
            // strTablename holds the name of the table on which the SQL is getting build
            const strTablename = reqBodyObj.tableName;
            // arrNumFields includes the string array of db field names which will hold numeric values in the database
            const arrNumFields = reqBodyObj.arrNumFields;
            // arrKeyFields includes the string array of db field names used to create the simple where clause
            const arrKeyFields = reqBodyObj.arrKeyFields;
            // boolAtomic will decide whether to have atomoic transaction default false, i.e non atomic
            const boolAtomic = reqBodyObj.boolAtomic;
            // the below function creates the SQL string
            const objUpdateQuery: any = await this.dbService.buildUpdateQuery(strCallerFunction, objJsonData, strTablename, arrNumFields, arrKeyFields);
            logger.debug({ source_function: 'Api ROUTER - updateApi' }, 'objUpdateQuery : %o', objUpdateQuery);
            console.log(`objUpdateQuery: ${JSON.stringify(objUpdateQuery)}`);
            return await this.dbService.updateOperation(strCallerFunction, objUpdateQuery.updateQuery, objUpdateQuery.updateValues, boolAtomic);
        }
        catch (e) {
            console.log(e);
            // logger.error({ source_function: 'Api ROUTER - updateApi', payload: reqBodyObj }, e.message);
            throw new Error(`Error occured in fnUpdateApi ${e}`);
        }
    }

    /*
     * This is used to bulk update a table.
     * Input Parameters
     * @param {string}  Argument1 Name   - bbe_id
     * @returns {status 400} If any error response
     * @returns {json Object} If success response
     */
    bulkUpdate = async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            if (Object.keys(req.body.objJsonData).length === 0) { throw new Error(`req.body.objJsonData is empty`); }
            let reqBodyObj: any = req.body;
            if (!(reqBodyObj.endPoint)) { throw new Error(`Error in endpoint url`); }
            reqBodyObj = await this.buildUpdateObj.buildUpdateObject(reqBodyObj);
            const dbres = await this.fnbulkUpdate(reqBodyObj);
            res.status(200).send(dbres);
        }
        catch (e) {
            console.log(e);
            // logger.error({ source_function: 'Api ROUTER - bulkUpsert', payload: req.body }, e.message);
            res.status(400).send(e);
        }
    }

    fnbulkUpdate = async (reqBodyObj: any): Promise<any> => {
        try {
            if (Object.keys(reqBodyObj.objJsonData).length === 0) { throw new Error(`reqBodyObj.objJsonData is empty`); }
            // strCallerFunction is a placeholder to identify from where the function is called in case of error
            const strCallerFunction = reqBodyObj.strCallerFunction;
            // objJsonData hold the json object from which the SQL query will be generated
            const objJsonData = reqBodyObj.objJsonData;
            // strTablename holds the name of the table on which the SQL is getting build
            const strTablename = reqBodyObj.tableName;
            // arrNumFields includes the numeric fields
            const arrNumFields = reqBodyObj.arrNumFields;
            // arrKeyFields includes the string array of db field names used to create the simple where clause
            const arrKeyFields = reqBodyObj.arrKeyFields;
            // boolAtomic will decide whether to have atomoic transaction default false, i.e non atomic
            const boolAtomic = reqBodyObj.boolAtomic;
            // the below function creates the SQL string
            const objUpdateQuery: any = await this.dbService.buildBulkUpdateQuery(strCallerFunction, objJsonData, strTablename, arrNumFields, arrKeyFields);
            logger.debug({ source_function: 'Api ROUTER - bulkUpdate' }, 'objUpdateQuery : %o', objUpdateQuery);
            console.log(`objUpdateQuery.bulkUpdateQuery:${objUpdateQuery.bulkUpdateQuery}`);
            return await this.dbService.updateOperation(strCallerFunction, objUpdateQuery.bulkUpdateQuery, objUpdateQuery.bulkUpdateValues, boolAtomic);
        }
        catch (e) {
            console.log(e);
            // logger.error({ source_function: 'Api ROUTER - bulkUpdate', payload: reqBodyObj }, e.message);
            throw new Error(`Error occured in fnbulkUpdate ${e}`);
        }
    }

    /*
      * This is used to retrieve a data records using generic select.
      * Input Parameters
      * @param {string}  Argument1 Name   - unique query id
      * @param {array of objects} Argument2 Name - paramArray
      * @param {string} Argument3 Name - strCallerFunction
      * @returns {status 400} If any error response
      * @returns {json Object} If success response
      */
    genericSelect = async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            if (Object.keys(req.body.paramObject).length === 0) { throw new Error(`req.body.paramObject is empty`); }
            const reqBodyObj: any = req.body;
            const dbres = await this.fnGenericSelect(reqBodyObj);
            res.status(200).send(dbres);
        }
        catch (e) {
            console.log(e);
            // logger.error({ source_function: 'Api ROUTER - bulkUpsert', payload: req.body }, e.message);
            res.status(400).send(e);
        }
    }

    fnGenericSelect = async (reqBodyObj: any): Promise<any> => {
        try {
            console.log(`reqBodyObj: ${JSON.stringify(reqBodyObj)}`);
            if (reqBodyObj.paramObject.queryId && reqBodyObj.paramObject.paramArray && reqBodyObj.paramObject.strCallerFunction) {
                // paramObject holds the query id and the query parameters as an array.
                const paramObject = reqBodyObj.paramObject;
                logger.debug({ source_function: 'Api ROUTER - genericSelect' }, 'paramObject : %o', paramObject);
                // the below function executes the above sql with the required parameters
                const dbres: any = await this.dbService.genericSelect(paramObject.strCallerFunction, [paramObject.queryId, paramObject.paramArray]);
                if (dbres[0].response === null) {
                    return [];
                } else {
                    return dbres[0].response;
                }
            } else {
                throw new Error(`(reqBodyObj.paramObject is missing either queryId or paramArray or strCallerFunction`);
            }
        }
        catch (e) {
            console.log(e);
            // logger.error({ source_function: 'Api ROUTER - genericSelect', payload: reqBodyObj }, e.message);
            throw new Error(`Error occured in fnGenericSelect ${e}`);
        }
    }

    deleteApi = async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            if (!(req.body.endPoint)) { throw new Error(`Error in endpoint url`); }
            let reqBodyObj: any = req.body;
            const selectId = req.params.id;
            // strCallerFunction is a placeholder to identify from where the function is called in case of error
            reqBodyObj = await this.buildDeleteObj.buildDeleteObject(reqBodyObj);
            const strCallerFunction = reqBodyObj.strCallerFunction;
            // strTablename holds the name of the table on which the SQL is getting build
            const strTablename = reqBodyObj.tableName;
            // strWhereCriteria includes the where criteria
            const strWhereCriteria = reqBodyObj.strWhereCriteria;
            // the below function creates the SQL string
            const objDeleteQuery: any = await this.dbService.buildDeleteQuery(strCallerFunction, strTablename, strWhereCriteria);
            logger.debug({ source_function: 'GROUP ROUTER - deleteGroup' }, 'objDeleteQuery : %o', objDeleteQuery);
            // let objSelectQuery = await this.dbService.buildSelectQuery(strCallerFunction,strTablename,strWhereCriteria,arrSelectFields);
            await this.dbService.deleteOperation(strCallerFunction, objDeleteQuery.deleteQuery, [selectId]);
            res.status(200).send();
        }
        catch (e) {
            logger.error({ source_function: 'GROUP ROUTER - deleteGroup', payload: req.params }, e.message);
            res.status(400).send(e);
        }
    }


}