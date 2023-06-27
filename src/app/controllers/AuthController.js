import Yup from 'yup'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import authConfig from '../../config/auth'

import User from '../schemes/User'

import {createError} from '../../utils/error'

class AuthController {
    async login(req, res, next){
        const schema = Yup.object().shape({
            username: Yup.string().required(),
            password: Yup.string().required()
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({
                status: false,
                message: 'Validation fails'
            })
        }   

        const {username: _username, password} = req.body

        try {
            //const {password, ...data} = await User.findOne({email})
            const user = await User.findOne({username: _username})

            if (!user)  return next(createError(200, 'Usuário não encontrado'))

            if(!(await bcrypt.compare(password, user.password)))  return next(createError(200, 'Senha incorreta'))

            const {_id, username, email, isAdmin} = user

            const accessToken = jwt.sign({ user: { _id, isAdmin } }, authConfig.secret, { expiresIn: authConfig.expiresIn })

            return res
                .cookie('access_token', accessToken, {// OBS: pesquisar
                    httpOnly: true,
                    expiresIn: new Date(Date.now() + 1)// Data atual mais uma(1) hora
                })
                .status(200)
                .json({
                    status: true,
                    data: {
                        user: {
                            _id,
                            username,
                            email
                        }
                    }
                })
        } catch (error) {
            return next(error)
        }
    }
}

export default new AuthController()