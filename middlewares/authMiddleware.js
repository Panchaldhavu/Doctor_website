const JWT = require("jsonwebtoken");
const { promisify } = require("util");

module.exports = async (req, res, next) => {
    try {
        const token = req.headers["authorization"] && req.headers["authorization"].split(" ")[1];

        if (!token) {
            return res.status(401).send({
                message: "Auth Failed - Token not provided",
                success: false,
            });
        }

        const verifyAsync = promisify(JWT.verify);

        const decode = await verifyAsync(token, process.env.JWT_SECRETE);


        if (!decode.id) {
            return res.status(401).send({
                message: "Auth Failed - Invalid Token (No User ID)",
                success: false,
            });
        }

        req.userId = decode.id
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        res.status(401).send({
            message: "Auth Failed - Invalid Token",
            success: false,
            error,
        });
    }
};
