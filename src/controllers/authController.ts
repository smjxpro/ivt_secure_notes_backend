import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) : Promise<void> => {   
    try{
        const {name, email, password, role, interest} = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
             res.status(400).json({ message: "User already exists" });
             return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role === "admin" ? "admin" : "user",
            interests: Array.isArray(interest) ? interest : [],
        });

        const token = jwt.sign(
            {id: user._id, role: user.role},
             process.env.JWT_SECRET as string,
              { expiresIn: '1h' }
            );

            res.status(201).json({
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    interests: user.interests
                }
            });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
             res.status(400).json({ message: "Invalid credentials" });
             return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                interests: user.interests
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};  

export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const user = await User.findById(userId).select("-password");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({
            user: {
                id: user._id,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                interests: user.interests
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};  