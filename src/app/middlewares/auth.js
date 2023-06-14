import jwt from'jsonwebtoken'
import { promisify } from 'util'
import {createError} from '../../utils/error'

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.access_token

  //if(token === 'undefined') return next(createError(401, 'Unauthorized! Token not Provided.'))

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.APP_SECRET)

    req.user = decoded.user

    return next()
  } catch (err) {
    return res.status(401).json({
       status: false,
       data: null,
       message: err.message
    })
  }
}

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    try {
      if(req.user._id === req.params.id || req.user.isAdmin) {
        return next()
      }else{
        return res.status(401).json({
          status: false,
          data: null,
          message: 'Unauthorized!'
        })
      }
    } catch (error) {
      return res.status(401).json({
        status: false,
        data: null,
        message: err.message
     })
    }
  })
}

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    try {
      if(req.user.isAdmin) {
        return next()
      }else{
        return res.status(401).json({
          status: false,
          data: null,
          message: 'Unauthorized!'
        })
      }
    } catch (error) {
      return res.status(401).json({
        status: false,
        data: null,
        message: err.message
      })
    }
  })
}

