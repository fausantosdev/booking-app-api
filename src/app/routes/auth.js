import { Router } from 'express'

import UserController from '../controllers/UserController'
import AuthController from '../controllers/AuthController'

const routes = new Router()

routes.post('/register', UserController.store)
routes.post('/login', AuthController.login)

export default routes