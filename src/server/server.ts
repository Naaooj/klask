import { SocketServer } from './game/socket-server';
import * as express from "express";
import * as path from "path";
import * as favicon from "serve-favicon";
import * as http from 'http'
import * as debug from "debug";
import * as socketIo from 'socket.io';
import webpackDevConfig from "../config/webpack.dev";
import "../config/environment";
import {DIST} from "../config/paths";

const log = debug('app:server');

class Server {

    public express: express.Application;

    private server: http.Server;

    constructor() {
        this.express = express();
        this.express.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
        this.express.use('/asset', express.static(__dirname + '/asset'));
        this.middleware();
    }

    public listen(port: number) {
        this.server = http.createServer(this.express);
        let io = socketIo(this.server);
        let socketServer = new SocketServer(io);

        this.server.listen(port, () => {
            log(`listening at http://localhost:${port}`);
            socketServer.listen();
        });
    }

    private middleware(): void {
        if (process.env.NODE_ENV === 'development') {
            const webpack = require('webpack');
            const compiler = webpack(webpackDevConfig);

            this.express.use(require('webpack-dev-middleware')(compiler, {
                quiet: false,
                noInfo: true,
                lazy: false,
                stats: {
                    colors: true,
                    chunks: false,
                    chunkModules: false
                },
                publicPath: compiler.options.output.publicPath
            }));

            this.express.use('/assets', express.static('src/client/assets'));
        } else {
            this.express.use('/', express.static(DIST));
        }
    }

}

const server = new Server();
server.listen(+process.env.PORT);