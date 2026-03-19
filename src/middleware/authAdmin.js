

export const authAdmin = (req , res , next) => {
    const {role} = req.userInfo

    if(role !== "ADMIN") {
        return res.status(403).json({
            message : "Access denied. Admin only."
        })
    }
    next()
}