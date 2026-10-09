import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// // create tweet
const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if ([content].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Content is required");
  }

  const tweet = await Tweet.create({
    content,
    owner: req.user._id,
  });

  const createdTweet = await Tweet.findById(tweet._id).populate(
    "owner",
    "fullName username avatar",
  );

  if (!createdTweet) {
    throw new ApiError(500, "Something went wrong while creating a tweet");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdTweet, "Tweet posted successfully"));
});


// // update tweet
const updateTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if ([content].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Content is required");
  }

  const { tweetId } = req.params;
  const tweet = await Tweet.findOneAndUpdate(
    {
      _id: tweetId,
      owner: req.user._id,
    },
    {
      $set: {
        content,
      },
    },
    { new: true },
  ).populate("owner", "fullName username avatar");

  if (!tweet) {
    throw new ApiError(404, "Tweet not found or you are not authorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});


// // delete tweet
const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const tweet = await Tweet.findOneAndDelete({
    _id: tweetId,
    owner: req.user._id,
  });

  if (!tweet) {
    throw new ApiError(404, "Tweet not found or you are not authorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet deleted successfully"));
});


// get all tweets
const getTweets = asyncHandler(async (req, res) => {
  const tweets = await Tweet.find({})
    .sort({ createdAt: -1 })
    .populate("owner", "fullName username avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
});


// get user tweets
const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const tweets = await Tweet.find({ owner: userId })
    .sort({ createdAt: -1 })
    .populate("owner", "fullName username avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "User tweets fetched successfully"));
});

export {
  createTweet,
  deleteTweet,
  updateTweet,
  getTweets,
  getUserTweets,
};