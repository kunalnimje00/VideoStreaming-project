import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {addVideoToPlaylist, createPlaylist, deletePlaylist, deleteVideoFromPlaylist, getPlaylistById, getUserPlaylists, updatePlaylist} from "../controllers/playlist.controller.js"

const router = Router()

router.route("/create").post(verifyJWT,createPlaylist)
router.route("/user/:userId").get(verifyJWT,getUserPlaylists)
router.route("/getById/:playlistId").get(verifyJWT,getPlaylistById);
router.route("/add/:playlistId/:videoId").patch(verifyJWT,addVideoToPlaylist)
router.route("/deletevideo/:playlistId/:videoId").patch(verifyJWT,deleteVideoFromPlaylist)
router.route("/update/:playlistId").patch(verifyJWT,updatePlaylist);
router.route("/delete/:playlistId").delete(verifyJWT,deletePlaylist);

export default router;