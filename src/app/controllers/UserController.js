//const Yup = require('yup')
import bcrypt from 'bcryptjs'

import User from '../schemes/User'

class UserController {
    async index(req, res, next) {
        try {
            const users = await User.find().sort({ createdAt: -1 })

            return res.json({
                status: true,
                data: users
            })
        } catch (error) {
            return next(error)
        }
    }

    async show(req, res, next) {

        const { id: _id } = req.params

        try {
            const user = await User.findById({ _id })

            if(!user){
                return res.json({
                    status: false,
                    message: 'Usuário não encontrado!'
                })
            }

            return res.json({
                status: true,
                data: user
            })
        } catch (error) {
            return next(error)
        }
    }

    async store(req, res, next){   
        try {
            const emailExists = await User.findOne({email: req.body.email})

            if(emailExists){
                return res.json({
                    status: false,
                    message: 'Email já registrado'
                })
            }

            const usernameExists = await User.findOne({username: req.body.username})

            if(usernameExists){
                return res.json({
                    status: false,
                    message: 'Nome de usuário já esta sendo utilizado'
                })
            }
        
            const {username, email, password} = req.body

            let password_hash = await bcrypt.hash(password, 8)

            const newUser = new User({
                username,
                email,
                password: password_hash
            })
    
            const savedUser = await newUser.save()    
        
            return res.status(200).json(savedUser)
        } catch (error) {
            return next(error)
        }
    }

    async update(req, res, next){

        const _id = req.params.id
        
        try {
            const userExists = await User.findById({_id})// Verifica se o usuário existe

            if(!userExists){
                return res.json({
                    status: false,
                    message: 'Usuário não encontardo'
                })
            }

            const updated = await User.findByIdAndUpdate(// Atualiza o usuário
                { _id },
                { $set: req.body },
                { new: true }// Para retornar os dados atualizados
            )

            // Se mudar o isAdmin, ele mudará no banco, porém continuara salvo na sessão, seria bom dar um refresh no token

            return res.json({
                status: true,
                data: updated
            })

        } catch (error) {
            return next(error)
        }
    }

    async remove(req, res, next){
        const _id = req.params.id

        try {
            const userExists = await User.findById({_id})

            if(!userExists){
                return res.json({
                    status: false,
                    message: 'Usuário não encontrado'
                })
            }
            
            const removed = await User.deleteOne({_id})

            return res.json({
                status: true,
                data: removed
            })
        } catch (error) {
            return next(error)
        } 
    }
}

export default new UserController()