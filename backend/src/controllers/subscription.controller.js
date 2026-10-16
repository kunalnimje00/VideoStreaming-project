import { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//  toggle subscription
const toggleSubscription = asyncHandler(async(req, res) => {
    const { channelId } = req.params;
    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel id");
    }
    const userId = req.user?._id;
    if(!userId) {
        throw new ApiError(401, "Unauthorized access");
    }

    const channel = await User.findById(channelId);
    if(!channel){
        throw new ApiError(404, "Channel does not exist");
    }

    const isSubscribed = await Subscription.findOne({
        subscriber: userId,
        channel: channelId
    });
    if(isSubscribed){
        await Subscription.findByIdAndDelete(isSubscribed._id);
        return res
        .status(200)
        .json(new ApiResponse(200, { isSubscribed: false }, "Channel unsubscribed successfully"));
    }

    await Subscription.create({ subscriber: userId, channel: channelId });
    return res
    .status(200)
    .json(new ApiResponse(200, { isSubscribed: true }, "Channel subscribed successfully"));
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async(req,res) => {
    const {channelId} = req.params
    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel id")
    }
    const channel = await User.findById(channelId)
    if(!channel){
        throw new ApiError(404, "Channel does not exists")
    }

    const subscriberList = await Subscription.find({channel:channelId, })
    if(!subscriberList.length){
        return res
        .status(200)
        .json(new ApiResponse(200, {}, "Zero subscribers"))
    }
    return res
    .status(200)
    .json(new ApiResponse(200, subscriberList, "Subscribers fetched successfully"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async(req,res) => {
    const userId = req.user?._id;
    if(!userId){
        throw new ApiError(401, "Unauthorized access");
    }
    const channels = await Subscription.find({ subscriber: userId });
    if(!channels.length){
        return res
        .status(200)
        .json(new ApiResponse(200, [], "No channels subscribed"));
    }
    return res
    .status(200)
    .json(new ApiResponse(200, channels, "Subscribed channels fetched successfully"));
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}