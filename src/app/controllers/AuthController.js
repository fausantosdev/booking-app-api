//const Yup = require('yup')
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import authConfig from '../../config/auth'

import User from '../schemes/User'

import {createError} from '../../utils/error'

class AuthController {

    async login(req, res, next){
        
        /*const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required()
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({
                status: false,
                message: 'Validation fails'
            })
        }*/

        const {username: _username, password} = req.body


        try {
            //const {password, ...data} = await User.findOne({email})
            const user = await User.findOne({username: _username})

            if(!user){
                return res.json({
                    status: false,
                    message: 'Usuário não existe'
                })
            }

            if(!(await bcrypt.compare(password, user.password))){
                return res.json({
                    status: false,
                    message: 'Senha incorreta'
                })
            }

            const {_id, username, email, isAdmin} = user

            const accessToken = jwt.sign({ user: { _id, isAdmin } }, authConfig.secret, { expiresIn: authConfig.expiresIn })

            return res
                .cookie('access_token', accessToken, {
                    httpOnly: true
                })
                .status(200)
                .json({
                    status: true,
                    data: {
                        user: {
                            _id,
                            username,
                            email
                        },
                        accessToken,
                    }
                })
        } catch (error) {
            return next(error)
        }
        
    }
}

export default new AuthController()