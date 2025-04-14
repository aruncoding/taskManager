import jwt from "jsonwebtoken";
import db from "../models/index.js";
const user = db.user;

const checkUserAuth = async (req, res, next) => {
    let token;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ status: 401, message: "Unauthorized User, No Token" });
    }

    try {
        const { UserId } = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await user.findOne({
            where: { id: UserId },
            attributes: { exclude: ['userPassword'] }
        });

        if (!req.user) {
            return res.status(401).json({ status: 401, message: "Unauthorized User, user not found" });
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ status: 401, message: "Unauthorized User" });
    }
};

export default checkUserAuth;
