
export const validate = (req , res , next) => {
    const {username , course , semester , password , university} = req.body

    if(!university || !course || !semester || !username || !password) {
        return res.status(400).json({
            message :" all fields required"
        })
    }
    next()
}