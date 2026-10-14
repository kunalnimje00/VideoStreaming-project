import { Router } from "express"

import { deleteVideo, getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo } from "../controllers/video.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(verifyJWT,getAllVideos)
router.route("/publish").post(
    upload.fields([
        {
            name:"video",
            maxCount:1
        },
        {
            name:"thumbnail",
            maxCount:1
        }
    ]),verifyJWT,publishAVideo
)
router.route("/getById/:videoId").get(verifyJWT,getVideoById)
router.route("/update/:videoId").patch(
    upload.fields([
        {
            name:"thumbnail",
            maxCount:1
        }
    ]),verifyJWT,updateVideo
)
router.route("/delete/:videoId").delete(verifyJWT,deleteVideo)
router.route("/togglePublish/:videoId").patch(verifyJWT,togglePublishStatus)


export default router;
