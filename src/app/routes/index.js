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

export default routes