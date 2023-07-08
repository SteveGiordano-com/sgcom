import { Router } from "express";
import userController from "../controllers/user.controller.js";

const router = Router();

router.get("/id/:id", userController.getById);
router.get("/login", userController.authenticate);
router.get("/login/redirect", userController.redirect);
router.post("/validate", userController.checkLogin);
router.post("/logout", userController.logout);
router.patch("/id/:id", userController.updateUser);

export { router as userRouter };
