import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { v2 as cloudinary } from "cloudinary";

const getPublicId = (url) => {
    if (typeof url !== "string" || !url.trim()) return null

    try {
        const pathname = new URL(url).pathname
        const uploadMarker = "/upload/"
        const uploadIndex = pathname.indexOf(uploadMarker)
        if (uploadIndex === -1) return null

        const pathAfterUpload = pathname.slice(uploadIndex + uploadMarker.length)
        const segments = pathAfterUpload.split("/")
        const versionIndex = segments.findIndex((segment) => /^v\d+$/.test(segment))
        const publicId = (versionIndex === -1
            ? segments
            : segments.slice(versionIndex + 1)
        ).join("/")

        return decodeURIComponent(publicId).replace(/\.[^/.]+$/, "") || null
    } catch {
        return null
    }
}

const deleteFromCloudinary = async (url, resourceType = "image") => {
    try {
        const publicId = getPublicId(url)
        if (!publicId) return
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
    } catch (error) {
        console.error("Cloudinary delete failed:", error.message)
    }
}


// //
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    // TODO: get all videos based on query, sort, pagination
    const filter = {};
    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ];
    }
    if (userId) {
        filter.owner = userId;
    }
    // Sorting
    const sort = {};

    if (sortBy) {
        sort[sortBy] = sortType === "asc" ? 1 : -1;
    } else {
        sort.createdAt = -1; // Latest videos first
    }
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Number(limit));
    const videos = await Video.find(filter)
        .sort(sort)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

    return res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    );

})

// //
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body

    if (!title?.trim() || !description?.trim()) {
        throw new ApiError(400, "Title and description are required")
    }
    const videoLocalPath = req.files?.video?.[0]?.path;
    if(!videoLocalPath){
        throw new ApiError(400, "Video file is missing");
    }
    const videoUploaded = await uploadOnCloudinary(videoLocalPath);
    if(!videoUploaded?.url){
        throw new ApiError(500, "Error while uploading video")
    }
    const duration = videoUploaded.duration
    if (typeof duration !== "number" || !Number.isFinite(duration)) {
        throw new ApiError(500, "Unable to determine uploaded video duration")
    }

    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
    if(!thumbnailLocalPath){
        throw new ApiError(400, "Thumbnail file is missing");
    }

    const thumbnailUploaded= await uploadOnCloudinary(thumbnailLocalPath)
    if(!thumbnailUploaded){
        throw new ApiError(500, "Error while uploading thumbnail")
    }

    const video = await Video.create({
        title,
        description,
        video:videoUploaded.url,
        thumbnail:thumbnailUploaded.url,
        duration,
        owner:req.user._id
    })
    if(!video){
        throw new ApiError(500, "Something went wrong while publishing video")
    }
    return res
    .status(201)
    .json(new ApiResponse(201, video, "Video published successfully"))
})

// //
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "invalid video id")
    }
    const video = await Video.findById(videoId).populate("owner", "username avatar")
    if(!video){
        throw new ApiError(404, "Video not found")
    }
    return res
    .status(201)
    .json(new ApiResponse(200, video, "Video found successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const {title,description} = req.body;
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "invalid video id")
    }
    
    const video = await Video.findOne(
        {
            _id:videoId,
            owner:req.user._id
        }
    )
    if(!video){
        throw new ApiError(404, "Video not found or you are not authorized")
    }
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path
    const hasTitle = title !== undefined
    const hasDescription= description !== undefined

    if(!hasTitle && !hasDescription && !thumbnailLocalPath){
        throw new ApiError(400, "Provide at least one title , description or thumbnail")
    }
    if(hasTitle){
        if(!title.trim()) throw new ApiError(400, "Title cannot be empty")
        video.title = title.trim()
    }
    if(hasDescription){
        if(!description.trim()) throw new ApiError(400, "description cannot be empty")
        video.description = description.trim()
    }
    let oldThumbnail= null
    if(thumbnailLocalPath){
        const thumbnailUploaded = await uploadOnCloudinary(thumbnailLocalPath)
        if(!thumbnailUploaded?.url){
            throw new ApiError(500, "Error while uploading thumbnail")
        }
        oldThumbnail = video.thumbnail
        video.thumbnail = thumbnailUploaded.url
    }
    await video.save()

    if (oldThumbnail) {
        await deleteFromCloudinary(oldThumbnail, "image")
    }
    const updatedVideo = await Video.findById(videoId).populate("owner", "username avatar")
    return res
    .status(201)
    .json(new ApiResponse(200, updatedVideo, "Video updated successfully"))

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }
    const video = await Video.findOne(
        {
            _id:videoId,
            owner:req.user._id
        }
    )
    if(!video){
        throw new ApiError(404, "Video not found or you are not authorized")
    }

    const deletedVideo = await Video.findByIdAndDelete(videoId);
    if(!deletedVideo){
        throw new ApiError(404, "Unable to delete video")
    }
    
    await deleteFromCloudinary(video.video, "video")
    await deleteFromCloudinary(video.thumbnail, "image")
    return res
    .status(201)
    .json( new ApiResponse(200, {}, "Video deleted successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    const video = await Video.findOne({
        _id:videoId,
        owner:req.user._id
    })
    if(!video){
        throw new ApiError(404, "video not found or unauthorised access")
    }
    video.isPublished=!video.isPublished
    await video.save();
    return res
    .status(201)
    .json(200, {isPublished:video.isPublished }, "Video toggle changed successfully")
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}