module.exports = async (user, statusCode, res) => {
    const token = await user.getJwtToken();

    const options = {
        httpOnly: true, 
        // secure: true,    
        // sameSite: 'None',
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        )
    }
         
    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user
    })
}