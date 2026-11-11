import { Request,Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

interface TokenPayload {
    id: string;
    role: "user" | "admin";
}

export const authenticate = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log("Authenticating request:", req.method, req.url);
try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
         res.status(401).json({ message: "Unauthorized" });
         return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;

    const user = await User.findById(decoded.id);
    if (!user) {
         res.status(401).json({ message: "Unauthorized" });
         return;    
    }

    req.user = user;
    next();
}   
catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Unauthorized" });
}
};

export const authorize = (roles: Array<"user" | "admin">) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        next();
    };
};