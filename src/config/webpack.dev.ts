import webpackCommon from './webpack.common'
import * as webpackMerge from 'webpack-merge';
import { DIST } from "./paths";

export default webpackMerge(webpackCommon, {
    // Define webpack mode to development
    mode: "development",

    output: {
        path: DIST,
        publicPath: '/',
        filename: '[name].[hash].js',
        chunkFilename: '[id].chunk.js'
    }
});