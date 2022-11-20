import { Router } from 'express'

import hotelController from '../controllers/HotelController'

import {verifyAdmin} from '../middlewares/auth'

const routes = new Router()

routes.get('/find/:id?', hotelController.index)

routes.get('/count-by-city', hotelController.countByCity)
routes.get('/count-by-type', hotelController.countByType)

routes.post('/', verifyAdmin, hotelController.store)
routes.put('/:id', verifyAdmin, hotelController.update)
routes.delete('/:id', verifyAdmin, hotelController.remove)

export default routes