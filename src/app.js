import express from 'express'
import morgan from 'morgan'
import cors from'cors'
import cookieParser from 'cookie-parser'
import routes from './app/routes'

import './database'

class App {
    constructor() {
        this.server = express()

        this.middlewares()
        this.routes()
    }

    middlewares() {
        this.server.set('port', process.env.PORT || 3002)

        this.server.use(morgan('dev'))

        this.server.use(cors())
        
        this.server.use(express.json())

        this.server.use(cookieParser())
    }

    routes() {
        this.server.use(routes)
        
        this.server.use((error, req, res, next) => {
            return res.status(error.status || 500).json({
                status: false,
                message: error.message || 'Ops, ocorreu um erro!',
                //stack: error.stack || null
            })
        })
    }
}

export default new App().server