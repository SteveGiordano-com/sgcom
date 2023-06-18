import { Router } from "express";
import tweetController from "../controllers/tweet.controller.js";

const router = Router();

router.get("/search", tweetController.getByKeyword);
router.get("/id/:id", tweetController.getById);
router.get("/date/:date", tweetController.getByDate);
router.get("/dates/first", tweetController.getFirstDayOfYear);
router.get("/dates", tweetController.getUniqueDates);
router.get("/", tweetController.getAll);

export { router as tweetsRouter };
