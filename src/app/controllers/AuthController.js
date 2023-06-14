import Yup from 'yup'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import authConfig from '../../config/auth'

import User from '../schemes/User'

import {createError} from '../../utils/error'

class AuthController {

    async login(req, res, next){

        //if (true) return next(createError(401, 'Errrrrooooouu'))
        
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
                .cookie('access_token', accessToken, {// OBS: pesqusar
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