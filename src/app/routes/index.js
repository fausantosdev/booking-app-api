import {Router} from 'express'

import authRoutes from './auth'
import usersRoutes from './users'
import hotelsRoutes from './hotels'
import roomsRoutes from './rooms'


const routes = Router()

routes.use('/auth',authRoutes)
routes.use('/user',usersRoutes)
routes.use('/hotel',hotelsRoutes)
routes.use('/room',roomsRoutes)

routes.use((error, req, res, next) => {
    return res.status(error.status ||  500).json({
        status: false,
        message: error.message || 'Ops, ocorreu um erro!',
        stack: error.stack || null
    })
})

export default routes