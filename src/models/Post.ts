import { Document, model, Schema, Types } from "mongoose";

export interface IPost extends Document {
  _id: Types.ObjectId;
  title: string;
  body: string;
  authorId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    authorId: { type: Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

// Index definitions
postSchema.index({ authorId: 1, createdAt: -1 });

export const Post = model<IPost>("Post", postSchema);