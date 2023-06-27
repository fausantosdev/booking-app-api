import * as Yup from 'yup'

import {createError} from '../../utils/error'
import Hotel from '../schemes/Hotel'

class HotelController {
    async index(req, res, next) {
        try {
            const hotels = await Hotel.find({})
                .populate({ path: 'user', select: 'username' })
                .sort({ createdAt: -1 })

            return res.status(201).json({
                status: true,
                data: hotels
            })
        } catch (error) {
            return next(error)
        }
    }

    async countByCity(req, res, next) {
        const cities = req.query.cities.split(',')
        
        try {
            const list = await Promise.all(cities.map(city => {
                return Hotel.countDocuments({ city })
            }))

            //const hotels = await Hotel.find({}).sort({ createdAt: -1 })

            return res.status(201).json({
                status: true,
                data: list
            })
        } catch (error) {
            return next(error)
        }
    }

    async countByType(req, res, next) {
        /*const failed = true
        if(failed) return next(createError(401,'You are not autenticated'))*/
        const { id: _id } = req.params
        
        try {
            if(_id){
                const hotels = await Hotel.findOne({ _id })
            }

            const hotels = await Hotel.find({}).sort({ createdAt: -1 })

            return res.status(201).json({
                status: true,
                data: hotels
            })
        } catch (error) {
            return next(error)
        }
    }

    async store(req, res, next){
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            type: Yup.string().required(),
            city: Yup.string().required(),
            address: Yup.string().required(),
            distance: Yup.string().required(),
            description: Yup.string().required(),
            rating: Yup.number().required(),
            cheapestPrice: Yup.number().required(),
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({
                status: false,
                message: 'Erro de validação' 
            })
        }

        const { name, type, city, address, distance, description, rating, cheapestPrice } = req.body

        try {
            const newHotel = new Hotel({
                user: req.user._id,
                name,
                type,
                city,
                address,
                distance,
                description,
                rating,
                cheapestPrice
            })
    
            const savedHotel = await newHotel.save()    
        
            return res.status(201).json({
                status: true,
                data: savedHotel
            })
        } catch (error) {
            return next(error)
        }
    }

    async update(req, res, next){
        const _id = req.params.id

        try {
            const hotelExists = await Hotel.findById({_id})

            if (!hotelExists) return next(createError(200, 'Hotel não encontrado'))

            const updated = await Hotel.findByIdAndUpdate(
                { _id },
                { $set: req.body },
                { new: true }
            )

            return res.json({
                status: true,
                data: updated
            })
        } catch (error) {
            return next(error)
        }
    }

    async remove(req, res){
        const _id = req.params.id

        try {
            const userExists = await Hotel.findById({_id})

            if (!userExists)  return next(createError(200, 'Hotel não encontrado'))
                
            const removed = await Hotel.deleteOne({_id})

            return res.json({
                status: true,
                data: removed
            })
        } catch (error) {
            return next(error)
        }
    }
}

export default new HotelController() 