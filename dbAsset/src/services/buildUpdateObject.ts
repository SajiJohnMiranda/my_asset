
export class BuildUpdateObject {

    buildUpdateObject = async (reqBodyObj: any): Promise<any> => {
        try {
            switch (reqBodyObj.endPoint) {
                case "updateOperation1":
                    reqBodyObj.strCallerFunction = 'post /update-updateOperation1';
                    // strTablename holds the name of the table on which the SQL is getting build
                    reqBodyObj.tableName = 'demo';
                    // arrNumFields includes the numeric fields
                    reqBodyObj.arrNumFields = ['intfield'];
                    // arrKeyFields includes the string array of db field names used to create the simple where clause.
                    // These fields should come as an input data totally based on the data to update. This can be an array of field names
                    // and all the fields mentioned in this array should be passed in the input json.
                    // reqBodyObj.arrKeyFields = ['boolfield'];
                    
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