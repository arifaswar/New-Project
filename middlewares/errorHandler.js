const errorHandler = (error, req, res, next) => {
    if(error.name === "SequelizeValidationError"){
        res.status(400).json({message: error.errors[0].message})
    } else if(error.name === "SequelizeUniqueConstraintError"){
        res.status(400).json({message: error.errors[0].message})
    }else if(error.name === "EmailRequired"){
        res.status(400).json({message: 'Email is required'})
    }else if(error.name === "PasswordRequired"){
        res.status(400).json({message: 'Password is required'})
    }else if(error.name === "RoleRequired"){
        res.status(400).json({message: 'Role is required'})
    }else if(error.name === "UserNotFound"){
        res.status(404).json({message: 'User is not found'})
    }else if(error.name === "PasswordInvalid"){
        res.status(401).json({message: 'Invalid password/email'})
    }else if(error.name === "JsonWebTokenError"){
        res.status(401).json({message: 'Invalid token'})
    }else if(error.name === "ProductNotFound"){
        res.status(404).json({message: 'Product is not found'})
    }else if(error.name === "Forbidden"){
        res.status(404).json({message: 'Your not authorized'})
    }
    res.status(500).json({message:'Internal server error'})
}
module.exports = errorHandler