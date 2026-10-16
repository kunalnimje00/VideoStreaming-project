import { Router } from "express";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/subscribe/:channelId").post(verifyJWT, toggleSubscription)
router.route("/subscribers/:channelId").get(verifyJWT,getUserChannelSubscribers)
router.route("/channels").get(verifyJWT, getSubscribedChannels)


export default router;