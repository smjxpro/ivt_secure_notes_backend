import { Router } from "express";
import * as authController from "../controllers/authController";
import * as noteController from "../controllers/noteController";
import * as adminController from "../controllers/adminController";
import * as aggregationController from "../controllers/aggregationController";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

// Auth routes
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/auth/profile", authenticate, authController.getProfile);

// Note routes
router.get("/notes", authenticate, noteController.getNotes);
router.get("/notes/:id", authenticate, noteController.getNoteById);
router.post("/notes", authenticate, noteController.createNote);
router.put("/notes/:id", authenticate, noteController.updateNote);
router.delete("/notes/:id", authenticate, noteController.deleteNote);

// Admin routes
router.get("/admin/users", authenticate, authorize(["admin"]), adminController.getAllUsers);
router.post("/admin/users", authenticate, authorize(['admin']), adminController.createUser);
router.put("/admin/users/:id", authenticate, authorize(['admin']), adminController.updateUser);
router.delete("/admin/users/:id", authenticate, authorize(['admin']), adminController.deleteUser);

// Aggregation routes
router.get("/aggregation/interests", aggregationController.getUsersByInterest);
router.get(
  "/aggregation/users/:userId/posts",
  aggregationController.getUserPosts,
);

export default router;
