import Yup from 'yup'
import bcrypt from 'bcryptjs'

import { createError } from '../../utils/error'

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

            if (!user) return next(createError(200, 'Usuário não encontrado'))

            return res.json({
                status: true,
                data: user
            })
        } catch (error) {
            return next(error)
        }
    }

    async store(req, res, next){   

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            username: Yup.string().required(),
            email: Yup.string().required(),
            password: Yup.string().required()
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({
                status: false,
                message: 'Validation fails'
            })
        } 

        try {
            const emailExists = await User.findOne({email: req.body.email})

            if (emailExists) return next(createError(200, 'O email fornecido já está em uso. Por favor, forneça um email diferente para prosseguir.'))
    
            const usernameExists = await User.findOne({username: req.body.username})

            if(usernameExists) return next(createError(200, 'Ops! O nome de usuário que você escolheu já está sendo utilizado. Por favor, selecione outro nome de usuário.'))
        
            const {name, username, email, password} = req.body

            let password_hash = await bcrypt.hash(password, 8)

            const newUser = new User({
                username,
                email,
                password: password_hash
            })
    
            const savedUser = await newUser.save()    
        
            return res.status(200).json({
                status: true,
                data: savedUser
            })
        } catch (error) {
            return next(error)
        }
    }

    async update(req, res, next){

        const _id = req.params.id
        
        try {
            const userExists = await User.findById({_id})// Verifica se o usuário existe

            if (!userExists) return next(createError(200, 'Usuário não encontrado'))

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

            if (!userExists)  return next(createError(200, 'Usuário não encontrado'))
                
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