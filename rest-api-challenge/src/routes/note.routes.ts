import { Router } from "express";
import { NoteController } from "../controllers/note.controller";

const router = Router();
const controller = new NoteController();

router.get('/', controller.getAllNotes);
router.get('/:id', controller.getNoteById);
router.post('/', controller.createNote);
router.delete('/:id', controller.deleteNote);

// Summary routes
router.post('/:id/summary', controller.generateSummary);
router.get('/:id/summary', controller.getSummary);

export default router;