import jwt from'jsonwebtoken'
import {createError} from '../../utils/error'

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token

  if(!token){
    return next(createError(401, 'Unauthorized, token not provided!'))
  }

  jwt.verify(token, process.env.APP_SECRET , function(err, decoded) {
    if(err) return next(createError(401, err.message))
    
    const { user } = decoded

    req.user = user

    next()
  });
}

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if(req.user._id === req.params.id || req.user.isAdmin) {
      return next()
    }else{
      return next(createError(401, 'Unauthorized!'))
    }
  })
}

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if(req.user.isAdmin) {
      return next()
    }else{
      return next(createError(401, 'Unauthorized!'))
    }
  })
}

