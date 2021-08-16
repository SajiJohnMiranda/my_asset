import pino from 'pino';

let lineCount: number = 0;

const Pino = pino({
    enabled: true,
    prettyPrint: {
        colorize: true,
        translateTime: false,
        messageFormat: `{appname} - {source_service} - [{linecount}] - [{filename}] - {custom_message}`,
        ignore: 'filename,appname,source_service,linecount',
        messageKey: 'custom_message',
        singleLine: true
    },
    prettifier: require('pino-pretty'),
    level: process.env.NODE_ENV !== 'DEVELOPMENT' ? 'info' : 'debug',
    mixin() {
        return {
            appname: 'BBE',
            linecount: ++lineCount
        };
    },
    formatters: {
        level(label: string, number: number) {
            return { Severity: label.toUpperCase() }
        },
        bindings(bindings: pino.Bindings) {
            return { pid: bindings.pid }
        }
    },
    timestamp: () => `, "Timestamp":"${new Date(Date.now()).toLocaleString('en-US', { timeZone: 'America/Chicago' })}"`,
    messageKey: 'custom_message',
    redact: {
        paths: ['key', 'path.to.key', 'stuff.thats[*].secret', 'path["with-hyphen"]', 'req.authorization', 'password', 'username', 'email', 'payload.username', 'payload.password', 'payload.email', 'payload.jsonArray', 'payload.dataObject.objJsonData', 'payload.authorization', 'payload.auth'],
        // censor: '**GDPR COMPLAINT**',
        // remove: true
    }
});

export const Logger = Pino;