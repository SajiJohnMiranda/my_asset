
export class BuildInsertObject {

  buildInsertObject = async (reqBodyObj: any): Promise<any> => {
    try {
        switch (reqBodyObj.endPoint) {
            case "insertOperation1":
                reqBodyObj.strCallerFunction = 'post /bulkupsert-insertOperation1';
                // strTablename holds the name of the table to which the insertion need to be performed
                reqBodyObj.tableName = 'demo';
                // arrNumFields includes the list of numeric fields in the table. string array of fields ['field1','field2']
                reqBodyObj.arrNumFields = ['intfield'];
                // boolAtomic decides whether the transaction need to be atomic. False will be for non atomic transaction.
                reqBodyObj.boolAtomic = true;
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