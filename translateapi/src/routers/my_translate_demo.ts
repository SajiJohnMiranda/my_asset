import express from 'express';
require('dotenv').config();
const {Translate} = require('@google-cloud/translate').v2;
import {DbService} from  '../services/groupService'

const env_CRED: any = process.env.CREDENTIALS;
const CREDENTIALS = JSON.parse(env_CRED);
let translate: any;

export class TranslatorRouter {
    public router = express.Router();
    private dbService = new DbService();
    private translate = new Translate({
        credentials: CREDENTIALS,
        projectId: CREDENTIALS.project_id
    });
    constructor() {
        this.router.post('/translatejson', this.translateText);


    }

    translateText = async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            // console.log(JSON.stringify(req.body));
            if (req.body.appName && req.body.targetLanguage) {
                const targetLanguage =req.body.targetLanguage;
                const reqBodyObj= {
                    "paramObject" : {
                        "queryId":"PULL_JSON",
                        "paramArray":[req.body.appName],
                        "strCallerFunction" :"DEMO DATA"
                    }
                }
            const jsonArray:any = await this.dbService.genericSelect(reqBodyObj);
            // console.log(`objJsonData1:${JSON.stringify(jsonArray)}`);
            // console.log(`jsonArray:${JSON.stringify(jsonArray)}`);
            for ( let obj of jsonArray){
                obj.language_id =targetLanguage;
                console.log(`obj:${JSON.stringify(obj.page_json)}`);
                let page_json = obj.page_json;
                for (let [key,val] of Object.entries(page_json)) {
                    console.log(`key:${key}, val:${val}`);
                    const ret = await this.translate.translate(val, targetLanguage);
                    console.log(`ret:${ret[0]}`);
                    page_json[key]= ret[0];
                    
                }
            }
            const objJsonData = {
                objJsonData:jsonArray,
                endPoint:"multilingualdatainsert"
            };
            // console.log(`objJsonData2:${JSON.stringify(jsonArray)}`);
            await this.dbService.insert(objJsonData);
            res.status(200).send(jsonArray);
            
            // res.status(200).send(jsonArray[0]);
        }else {
            throw new Error (`No app name and targetLanguage provided`);
        }

        } catch (error) {
            console.log(`Error at translateText --> ${error}`);
                        
            res.status(400).send(error);
        }
    };
    
    // translateText('I LOVE YOU JESUS', 'ml')
    //     .then((res) => {
    //         console.log(res);
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
}

// Your credentials


// Configuration for the client


// const detectLanguage = async (text) => {

//     try {
//         let response = await translate.detect(text);
//         return response[0].language;
//     } catch (error) {
//         console.log(`Error at detectLanguage --> ${error}`);
//         return 0;
//     }
// }

// detectLanguage('Oggi è lunedì')
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(error);
//     });

