import { Router } from 'express'

import HotelController from '../controllers/HotelController'

import {verifyAdmin} from '../middlewares/auth'

const routes = new Router()

routes.post('/', verifyAdmin, HotelController.store)
routes.get('/:id?', verifyAdmin, HotelController.index)
routes.put('/:id', verifyAdmin, HotelController.update)
routes.delete('/:id', verifyAdmin, HotelController.remove)

export default routes