import mongoose from "mongoose";
import { Playlist} from "../models/playlist.model.js";
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Tweet } from "../models/tweet.model.js";

// // create playlist
const createPlaylist = asyncHandler(async(req,res) => {
    const {name, description} = req.body;
    if([name,description].some((fields) => fields?.trim() === "")){
        throw new ApiError(400, "name and desciption is required");
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner:req.user._id
    })

    const createdPlaylist = await Playlist.findById(playlist._id).populate(
        "owner",
        "fullName username avatar"
    )
    if(!createdPlaylist){
        throw new ApiError(500, "Something went wrong while creating playlist")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, createdPlaylist ,"Playlist created successfully"))
});

// // get user playlist
const getUserPlaylists = asyncHandler(async(req, res) =>{
    const {userId}= req.params;

    const playlist = await Playlist.find({owner:userId})
    .sort({createdAt:-1})
    .populate("owner", "fullName username avatar");

    if(!playlist){ throw new ApiError(404, "Playlist not exists")}

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist found successfully"))
})

// get playlist by ID
const getPlaylistById = asyncHandler(async(req, res) =>{
    const {playlistId} = req.params

    const playlist = await Playlist.findOne({
        _id:playlistId,
        owner:req.user._id
    })

    if(!playlist){
        throw new ApiError(404, "Playslist not found or invalid access")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200, playlist, "Playlist got successfully")
    )
})

// //
const addVideoToPlaylist = asyncHandler(async(req, res) =>{
    const {playlistId, videoId} = req.params
})

// // 
const deleteVideoFromPlaylist = asyncHandler(async(req, res) =>{
    const {playlistId,videoId} = req.params;
})

// // const delete playlist
const deletePlaylist = asyncHandler(async(req, res) =>{
    const {playlistId}= req.params;

    const playslist = await Playlist.findOneAndDelete({
        _id :playlistId,
        owner : req.user._id,
    })

    if(!playslist){
        throw new ApiError(404, "Playlist not found or unauthorised access")
    }
    return res
    .status(201)
    .json(
        new ApiResponse(200, {}, "Playlist deleted successfully")
    )
})

const updatePlaylist = asyncHandler(async(req,res) =>{
    const {playlistId} = req.params
    const {name, description} = req. body
    
    if([name,description].some((fields) => fields.trim() ==="")){
        throw new ApiError(400, "name and description is required")
    }

    const playlist = Playlist.findByIdAndUpdate(
        {
            _id:playlistId,
            owner:req.user._id,
        },
        {
            $set:{
                name:name,
                description:description
            }
        },
        {
            new:true
        }
    ).populate("owner", "fullName username avatar")
    if(!playlist){
        throw new ApiError(404, "Playlist not found or Unauthorized access")
    }
    return res
    .status(201)
    .json(
        new ApiResponse(200, playlist, "Playlist updated successfully")
    )
})


export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    deletePlaylist,
    updatePlaylist
}

