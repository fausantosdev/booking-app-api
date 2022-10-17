import {createError} from '../../utils/error'
import Room from '../schemes/Room'
import Hotel from '../schemes/Hotel'

class RoomController {
    async index(req, res, next) {
        const { id: _id } = req.params
        
        try {
            if(_id){
                const room = await Room.findOne({ _id })
            }

            const rooms = await Room.find({}).sort({ createdAt: -1 })

            return res.status(201).json({
                status: true,
                data: rooms
            })
        } catch (error) {
            return next(error)
        }
    }

    async store(req, res, next){   
        const { hotelId } = req.params

        try {
            const newRoom = new Room(req.body)
    
            const savedRoom = await newRoom.save() 
            
            try{
                await Hotel.findByIdAndUpdate(hotelId, {
                    $push: { rooms: savedRoom._id }
                })    

            } catch (error) {
                return next(error)
            }
        
            return res.status(201).json({
                status: true,
                data: savedRoom
            })
        } catch (error) {
            return next(error)
        }
    }

    async update(req, res, next){
        const _id = req.params.id

        try {
            const roomExists = await Room.findById({_id})

            if(!roomExists){
                return res.json({
                    status: false,
                    message: 'Quarto não encontrado'
                })
            }

            const updated = await Room.findByIdAndUpdate(
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
        const { id: _id, hotelId } = req.params

        try {
            const roomExists = await Room.findById({_id})

            if(!roomExists){
                return res.json({
                    status: 'Quarto não encontrado'
                })
            }
            
            const removed = await Room.deleteOne({_id})

            try{
                await Hotel.findByIdAndUpdate(hotelId, {
                    $pull: { rooms: _id }
                })    

            } catch (error) {
                return next(error)
            }

            return res.json({
                status: true,
                data: removed
            })
        } catch (error) {
            return next(error)
        }
    }
}

export default new RoomController() 