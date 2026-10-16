import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js"
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

const getVideoComments = asyncHandler(async(req , res) =>{
    const {videoId} =req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }
    const userId= req.user?._id
    if(!userId){
        throw new ApiError(401, "Unauthorised access")
    }

    const { page = 1, limit = 10 } = req.query;
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Number(limit));
    const sort = {};
    sort.createdAt = -1;

    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404, "Video not found")
    }

    const comments = await Comment.find({video:videoId})
    .sort(sort)
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber)
    .populate("video")

    return res
    .status(200)
    .json(new ApiResponse(200, comments ,"Video comments fetched successfully"))
})

const addComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {content}= req.body
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }
    if ([content].some((field) => field?.trim() ==="")){
        throw new ApiError(400, "Contend is required")
    }

    const comment = await Comment.create({
        content,
        video:videoId,
        owner:req.user._id
    })

    const commented = await Comment.findById(comment._id)
    .populate("owner", "fullname username avatar")

    if(!commented){
        throw new ApiError(500, "Something went wrong while creating comment")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, commented, "Comment posted successfully"))
})

const updateComment = asyncHandler(async (req,res) =>{
    const {content} = req.body
    const {commentId} = req.params

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid commentId")
    }
    if ([content].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Content is required");
    }

    const comment = await Comment.findOneAndUpdate(
        {
            _id: commentId,
            owner:req.user._id
        },
        {
            $set:{
                content,
            }
        },
        {
            new:true
        }
    ).populate("owner", "fullName username avatar");
    if(!comment){
        throw new ApiError(404, "Comment not found or unauthorized access")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"))
})


const deleteComment = asyncHandler(async(req, res) =>{
    const {commentId} = req.params

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid commentId")
    }
    const a=await Comment.findById(commentId);

    console.log(a);

    const comment = await Comment.findOneAndDelete(
        {
            _id:commentId,
            owner:req.user._id
        }
    )
    if(!comment){
        throw new ApiError(404, "Comment not found or you are not authorised")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment deleted successfully"))
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}