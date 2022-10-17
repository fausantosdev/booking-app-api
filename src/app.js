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
    }
}

export default new App().server