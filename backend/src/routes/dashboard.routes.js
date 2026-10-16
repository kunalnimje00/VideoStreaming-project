import { Router } from "express";
import { channelStats, getAllVideosByChannel } from "../controllers/dashboard.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/channel-videos").get(verifyJWT, getAllVideosByChannel);
router.route("/channel-stats").get(verifyJWT, channelStats);

export default router;