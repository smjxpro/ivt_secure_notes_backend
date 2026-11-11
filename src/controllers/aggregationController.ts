import { Request, Response } from "express";
import { Types } from "mongoose";
import { User } from "../models/User";

export const getUsersByInterest = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const reult = await User.aggregate([
      { $unwind: "$interests" },
      {
        $group: {
          _id: "$interests",
          usersCount: { $sum: 1 },
          users: { $push: { id: "$_id", name: "$name", email: "$email" } },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          interest: "$_id",
          usersCount: 1,
          users: 1,
        },
      },
    ]);

    res.status(200).json(reult);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserPosts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = Array.isArray(req.params.userId)
      ? req.params.userId[0]
      : req.params.userId;

    if (!Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const result = await User.aggregate([
      { $match: { _id: new Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "userId",
          pipeline: [{ $sort: { createdAt: -1 } }],
          as: "posts",
        },
      },
      {
        $project: {
          password: 0,
        },
      },
    ]);
    if (result.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(result[0]);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
