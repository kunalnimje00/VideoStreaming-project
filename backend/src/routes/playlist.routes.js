import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, updatePlaylist} from "../controllers/playlist.controller.js"

const router = Router()

router.route("/create").post(verifyJWT,createPlaylist)
router.route("/user/:userId").get(verifyJWT,getUserPlaylists)
router.route("/playlist/:playlistId").get(verifyJWT,getPlaylistById);
router.route("/playlist/:playlistId").patch(verifyJWT,updatePlaylist);
router.route("/playlist/:playlistId").delete(verifyJWT,deletePlaylist);

export default router;