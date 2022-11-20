import { Router } from 'express'

import HotelController from '../controllers/HotelController'

import {verifyAdmin} from '../middlewares/auth'

const routes = new Router()

routes.get('/:id?', HotelController.index)

routes.post('/', verifyAdmin, HotelController.store)
routes.put('/:id', verifyAdmin, HotelController.update)
routes.delete('/:id', verifyAdmin, HotelController.remove)

export default routes