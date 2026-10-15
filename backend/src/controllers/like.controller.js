import {isValidObjectId} from "mongoose";
import { Video } from "../models/video.model.js"
import { Like } from "../models/like.model.js"
import { Tweet } from "../models/tweet.model.js"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js";



const toggleVideoLike = asyncHandler(async(req, res) => {
    const {videoId} = req.params;
    if (!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video Id")
    }
    const userId = req.user?._id;
    if(!userId){
        throw new ApiError(401, "Unauthorised access")
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404, "Video does not exists")
    }

    const existingLike = await Like.findOne({video:videoId, likedBy:userId})
    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id);
        return res
        .status(200)
        .json(new ApiResponse(200, {isLiked:false} , "Video unliked successfully"))
    }

    await Like.create({video:videoId, likedBy:userId});
    return res
    .status(200)
    .json(new ApiResponse(200, {isLiked:true} , "Video liked successfully"))
})

const toggleCommentLike = asyncHandler(async(req, res) => {
    const {commentId} = req.params
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment id")
    }
    const userId = req.user?._id;
    if(!userId){
        throw new ApiError(401, "Unauthorised access")
    }
    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(404, "comment does not exists")
    }

    const existingLike = await Like.findOne({comment:commentId, likedBy:userId})
    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id);
        return res
        .status(200)
        .json(new ApiResponse(200, {isLiked:false} , "Comment unliked successfully"))
    }

    await Like.create({comment:commentId, likedBy:userId});
    return res
    .status(200)
    .json(new ApiResponse(200, {isLiked:true} , "Comment liked successfully"))
    
})

const toggleTweetLike = asyncHandler(async(req, res) => {
    const {tweetId} = req.params
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid comment id")
    }
    const user = req.user?._id;
    if(!user){
        throw new ApiError(401, "Unauthorised access")
    }
    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404, "Tweet does not exsits")
    }

    const existingLike = await Like.findOne({tweet:tweetId, likedBy:user})
    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id)
        return res
        .status(200)
        .json(new ApiResponse(200, {isLiked:false}, "Tweet unliked successfuly"))
    }

    await Like.create({tweet:tweetId, likedBy:user})
    return res
        .status(200)
        .json(new ApiResponse(200, { isLiked: true }, "Tweet liked successfully"));

})

const getLikedVideos = asyncHandler(async(req, res) => {
    const {page = 1, limit = 10} = req.query
    const user = req.user?._id
    if(!user){
        throw new ApiError(401, "Unauthorised access")
    }

    const pageNumber = Math.max(1, Number(page));
    const sort = {};
    sort.createdAt = -1;
    const limitNumber = Math.max(1, Number(limit));

    const likedVideos = await Like.find(
        {
            likedBy:user,
            video:{ $exists: true, $ne: null }
        }
    )
        .populate("video")
        .sort(sort)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

    if(!likedVideos.length){
        throw new ApiError(404, "No liked videos found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"))
})


export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}