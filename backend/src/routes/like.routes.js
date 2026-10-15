import { Router } from "express";
import { getLikedVideos } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router= Router();

router.route("/likedVideos").get(verifyJWT, getLikedVideos)


export default router;