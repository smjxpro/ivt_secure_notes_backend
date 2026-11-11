import { Router } from "express";
import * as authController from "../controllers/authController";
import * as noteController from "../controllers/noteController";
import * as adminController from "../controllers/adminController";
import * as aggregationController from "../controllers/aggregationController";

const router = Router();

// Auth routes
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/auth/profile", authController.getProfile);

// Note routes
router.get("/notes", noteController.getNotes);
router.get("/notes/:id", noteController.getNoteById);
router.post("/notes", noteController.createNote);
router.put("/notes/:id", noteController.updateNote);
router.delete("/notes/:id", noteController.deleteNote);

// Admin routes
router.get("/admin/users", adminController.getAllUsers);
router.post("/admin/users", adminController.createUser);
router.put("/admin/users/:id", adminController.updateUser);
router.delete("/admin/users/:id", adminController.deleteUser);

// Aggregation routes
router.get("/aggregation/interests", aggregationController.getUsersByInterest);
router.get("/aggregation/users/:userId/posts", aggregationController.getUserPosts);

export default router;