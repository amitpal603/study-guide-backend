
export const validate = (req, res, next) => {
    const { name, course, semester, password, university, email } = req.body;

    if (!name || !course || !semester || !password || !university || !email) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    next();
};