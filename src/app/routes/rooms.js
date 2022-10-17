import { Router } from 'express'

import RoomController from '../controllers/RoomController'

import {verifyAdmin} from '../middlewares/auth'

const routes = new Router()

routes.post('/:hotelId', verifyAdmin, RoomController.store)
routes.get('/:id?', RoomController.index)
routes.put('/:id', verifyAdmin, RoomController.update)
routes.delete('/:id/:hotelId', verifyAdmin, RoomController.remove)

export default routes