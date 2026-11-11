import {Document, model, Schema, Types } from "mongoose";

export interface INote extends Document{
_id: Types.ObjectId;
title: string;
content: string;
userId: Types.ObjectId;
createdAt: Date;
updatedAt: Date;
}

const noteSchema = new Schema<INote>(
{
title: { type: String, required: true },
content: { type: String, required: true },
userId: { type: Types.ObjectId, ref: "User", required: true },
},
{
timestamps: true,
}
);

// Index definitions
noteSchema.index({ userId: 1, createdAt: -1 });
noteSchema.index({ createdAt: -1 });

export const Note = model<INote>("Note", noteSchema);