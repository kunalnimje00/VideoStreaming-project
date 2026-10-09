import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTweet,
  deleteTweet,
  getTweets,
  getUserTweets,
  updateTweet,
} from "../controllers/tweet.controller.js";

const router = Router();

router.route("/createTweet").post(verifyJWT, createTweet);
router.route("/").get(verifyJWT, getTweets);
router.route("/user/:userId").get(verifyJWT, getUserTweets);
router.route("/:tweetId").patch(verifyJWT, updateTweet);
router.route("/:tweetId").delete(verifyJWT, deleteTweet);

export default router;