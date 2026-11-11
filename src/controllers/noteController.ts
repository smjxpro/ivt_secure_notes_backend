import { Request, Response } from "express";
import { Note } from "../models/Note";

export const getNotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
    const skip = (page - 1) * limit;

    const filter = req.user?.role === "admin" ? {} : { userId: req.user?._id };

    const [notes, total] = await Promise.all([
      Note.find(filter)
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Note.countDocuments(filter),
    ]);
    
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
        data: notes,
        pagination: {
            total,
            page,
            limit,
            totalPages,
            pages: totalPages,
        },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  } 
};

export const getNoteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const note = await Note.findById(id);
    if (!note) {
      res.status(404).json({ message: "Note not found" });
      return;
    }

    if (req.user?.role !== "admin" && note.userId.toString() !== req.user?._id.toString()) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    res.status(200).json(note);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const createNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body;

    const note = await Note.create({
      title,
      content,
      userId: req.user!._id,
    });
    res.status(201).json(note);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const updateNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const note = await Note.findById(id);
    if (!note) {
      res.status(404).json({ message: "Note not found" });
      return;
    }

    if (req.user?.role !== "admin" && note.userId.toString() !== req.user?._id.toString()) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    note.title = title || note.title;
    note.content = content || note.content;
    await note.save();

    res.status(200).json(note);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const note = await Note.findById(id);
    if (!note) {
      res.status(404).json({ message: "Note not found" });
      return;
    }

    if (req.user?.role !== "admin" && note.userId.toString() !== req.user?._id.toString()) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    await note.deleteOne();
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
