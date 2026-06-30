import { startsWith } from "zod";

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'A token is required' });
    }

    const token = authHeader.split(' ')[1];
};
