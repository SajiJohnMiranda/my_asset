import {configure, getLogger, Logger} from 'log4js';
import path from 'path';
import {v4 as uuid} from 'uuid';

/**
 * Configuration of Log4js
 */
configure({
    appenders: {
        file: {type: 'file', filename: 'error.log', layout: {type: 'pattern', pattern: '[%d] [%p] [%z] %c %l: %m'}},
        out: {type: 'console', layout: {type: 'pattern', pattern: '%[[%d] [%p] [%z] %c %l%]: %m'}}
    },
    categories: {
        default: {appenders: ['out', 'file'], enableCallStack: true, level: 'debug'}
    }
});

/**
 * This class provides utility methods used by multiple classes in this service
 */
export class CommonUtils {

    /**
     * Returns a Log4JS logger
     *
     * @param currentFile - the name of the class file to be show in the logs
     */
    public static log = (currentFile?: string | undefined): Logger => {
        const logger = getLogger((currentFile !== undefined) ? `[ ${currentFile} ]` : `[ ${path.basename(__filename)} ]`);
        logger.level = 'ALL';
        return logger;
    }

    /**
     * Utility method to quickly decode a BASE64 string
     * @param encodedText {string} A BASE64 encoded string as an argument
     */
    public static decodeBase64 = (encodedText: string): string => {
        if( !encodedText ){
            return encodedText;
        }
        return Buffer.from(encodedText, 'base64').toString();
    }

    /**
     * Utility method to quickly encode a string as BASE64
     * @param plainText
     */
    public static encodeBase64 = (plainText: string): string => {
        const buff = Buffer.from(plainText);
        return buff.toString('base64');
    }

    /**
     * Generates a UUID v4 formatted ID
     */
    public static generateID() {
        return uuid();
    }
}
