import express from 'express';
import { createUser, getAllUsers, signIn, updateEmail, updatePassword, updateUsername, requestPasswordReset, resetPassword } from '../controllers/userController.js';
import { verifyJWToken } from '../middlewares/jwtAuth.js';

const router = express.Router();

router.get("/all", verifyJWToken, getAllUsers );
router.post("/register", createUser );
router.post("/signin", signIn );
router.put("/update-password", updatePassword );
router.put("/update-username", updateUsername );
router.put("/update-email", updateEmail );
router.post("/request-password-reset", requestPasswordReset );
router.post("/reset-password", resetPassword );

export default router;