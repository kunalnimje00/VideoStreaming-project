import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Video } from "../models/video.model.js";

const getAllVideosByChannel = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized access");
  }

  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);
  if (
    !Number.isSafeInteger(page) ||
    page < 1 ||
    !Number.isSafeInteger(limit) ||
    limit < 1
  ) {
    throw new ApiError(400, "Page and limit must be positive integers");
  }

  const videos = await Video.find({ owner: userId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("owner", "username fullName avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const channelStats = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized access");
  }

  const [videoStats, totalSubscribers] = await Promise.all([
    Video.aggregate([
      { $match: { owner: userId } },
      {
        $lookup: {
          from: Like.collection.name,
          let: { videoId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$video", "$$videoId"] } } },
            { $count: "count" },
          ],
          as: "likeCount",
        },
      },
      {
        $group: {
          _id: null,
          totalVideos: { $sum: 1 },
          totalViews: { $sum: { $ifNull: ["$views", 0] } },
          totalLikes: {
            $sum: {
              $ifNull: [{ $arrayElemAt: ["$likeCount.count", 0] }, 0],
            },
          },
        },
      },
      { $project: { _id: 0, totalVideos: 1, totalViews: 1, totalLikes: 1 } },
    ]),
    Subscription.countDocuments({ channel: userId }),
  ]);

  const stats = videoStats[0] ?? {
    totalVideos: 0,
    totalViews: 0,
    totalLikes: 0,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...stats, totalSubscribers },
        "Channel stats fetched successfully",
      ),
    );
});

export { getAllVideosByChannel, channelStats };
