import { Router } from 'express'

import UserController from '../controllers/UserController'

import {verifyUser, verifyAdmin} from '../middlewares/auth'

const routes = new Router()

routes.post('/',UserController.store)
routes.get('/', verifyAdmin, UserController.index)
routes.get('/:id', verifyUser, UserController.show)
routes.put('/:id', verifyUser,UserController.update)
routes.delete('/:id', verifyUser, UserController.remove)

export default routes