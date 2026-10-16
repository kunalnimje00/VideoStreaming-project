import { Router } from "express";
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router= Router();

// router.route("/likedVideos").get(verifyJWT, getLikedVideos)
router.route("/video/:videoId").post(verifyJWT, toggleVideoLike)
router.route("/comment/:commentId").post(verifyJWT , toggleCommentLike)
router.route("/tweet/:tweetId").post(verifyJWT, toggleTweetLike)
router.route("/liked-videos").get(verifyJWT, getLikedVideos)

export default router;