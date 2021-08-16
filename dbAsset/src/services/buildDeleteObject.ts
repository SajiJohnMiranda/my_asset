
export class BuildDeleteObject {

    buildDeleteObject = async (reqBodyObj: any): Promise<any> => {
        try {
            switch (reqBodyObj.endPoint) {
                case "deleteOperation1":
                    reqBodyObj.strCallerFunction = 'post /bulkupsert-deleteOperation1';
                    // strTablename holds the name of the table on which the SQL is getting build
                    reqBodyObj.tableName = 'demo';
                    // strConstraintName will decide on which constrain the update should happen in an upsert statement.
                    reqBodyObj.strWhereCriteria = ' where slno::int4=$1::int4';
                    // boolAtomic decides whether the transaction need to be atomic. False will be for non atomic transaction.
                    reqBodyObj.boolAtomic = false;
                    break;
                default:
                    throw new Error('Not a valid endpoint');
            }
            return reqBodyObj;
        } catch (e) {
            throw new Error(`Error in endpoint url. ${e}`);
        }
    }
}