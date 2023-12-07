import path from 'path'
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`) });
import { v4 as uuidv4 } from 'uuid';
import express from 'express'
import cluster from 'cluster'
import bodyParser from 'body-parser'
import responses from './controller/responseController';
// import MiddleWare from './securities/Middleware'
import routes from './routes/index'
import os from 'os';
import cors from 'cors'
import fs from 'fs'

if (cluster.isPrimary) {
    const cpuCount = os.cpus().length;
    for (let i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }
    cluster.on('exit', function (worker: any) {
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();
    })
}
else {
    let httpServer: any
    let $certificates: any
    if (process.env.NODE_ENV == 'local') {
        httpServer = require('http')
    } else {
        httpServer = require('https')
        $certificates = {
            "key": fs.readFileSync('/etc/letsencrypt/live/' + process.env.SSL_CERTS + '/privkey.pem'),
            "cert": fs.readFileSync('/etc/letsencrypt/live/' + process.env.SSL_CERTS + '/fullchain.pem'),
            "ca": fs.readFileSync('/etc/letsencrypt/live/' + process.env.SSL_CERTS + '/cert.pem')
        }
    }

    const corsOptions = {
        orign: "*",
        credentials: true,
        exposedHeaders: ["refresh_token", "authorization", "content-type"]
    };

    const app = express();
    app.use(bodyParser.json({ limit: '10mb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
    app.use(cors(corsOptions));
    app.use(function (req: any, res: any, next: any) {
        res.header("Access-Control-Allow-Origin", '*')
        next();
    });
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

    app.use('/health', (req: any, res: any) => {
        console.log("health checker")
        res.send(responses.getResponse(200, 'Ok', { "status": "Health ok" }));
    })

    // app.use(MiddleWare.verify)                                                                                        //Middleware

    app.use((req: any, res: any, next: any) => {
        if (!req.headers.requestId) {
            req.headers.requestId = uuidv4();
            next()
        }
    })

    app.use('/', routes);                                                                                              //Routes

    app.use((err: any, req: any, res: any, next: any) => {                                                             //Error Handling
        const status = err.response ? err.response.status : err.status;
        const error = err.response ? err.response.data.errors : err.error;
        console.log(err,'errrrrrrrrrrrrrrrr')
        res.status(status || 400).json({
            success: false,
            message: err.message || 'An error occurred.',
            errors: error || [],
        });
    });
    app.use(function (req: any, res: any) {
        console.log("Invalid Request");
        res.send(responses.getResponse(404, "Invalid Request!", null));
    });

    app.set('port', process.env.PORT);
    let server: any;
    if (process.env.NODE_ENV == 'local') {
        server = httpServer.createServer(app)
    } else {
        server = httpServer.createServer($certificates, app)
    }
    server.listen(app.get('port'), function () {
        console.log('Starting ' + process.env.HOST_NAME + ' @ ' + process.env.PORT);
        console.log('Waiting for Request...');
    });
}
