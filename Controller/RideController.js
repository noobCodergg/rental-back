const rideModel = require("../Model/RideModel");
const TimeModel = require("../Model/TimeModel");
const userModel = require("../Model/UserModel");
const scheduleModel = require('../Model/ScheduleModel');
const cron = require("node-cron");
const mongoose = require("mongoose");

exports.postRide = async (req, res) => {
  const { userName, userId, id, pending } = req.body;

  try {
    await rideModel.create({
      name: userName,
      sender: userId,
      receiver: id,
      isRead: false,
      rideStatus: pending,
    });
    res.status(200).json("Request created");
  } catch (error) {
    console.log("error");
  }
};

exports.updateAvailability = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await userModel.updateOne(
      { _id: id },
      { $set: { isAvailable: false } }
    );

    if (result.modifiedCount > 0) {
      return res
        .status(200)
        .json({ message: "User availability updated successfully." });
    } else {
      return res
        .status(404)
        .json({ message: "User not found or already unavailable." });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while updating availability." });
  }
};

exports.getRequest = async (req, res) => {
  const { userId } = req.params;

  try {
    const rides = await rideModel.find({ receiver: userId });

    if (!rides || rides.length === 0) {
      return res.status(404).json({ message: "No ride requests found." });
    }

    const readRides = rides.filter((ride) => !ride.isRead);
    return res.status(200).json(readRides);
  } catch (error) {
    console.error("Error occurred:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching ride requests." });
  }
};

exports.updateIsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await rideModel.updateOne(
      { _id: id },
      { $set: { isRead: true } }
    );

    res.status(200).json("Updated Successfully");
  } catch (error) {
    console.error("Error updating notification:", error);
    return res
      .status(500)
      .json({ message: "Server error, please try again later." });
  }
};

exports.updateRideStatus = async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  try {
    const result = await rideModel.updateOne(
      { _id: id },
      { $set: { rideStatus: data } }
    );
    res.status(200).json("Updated Successfully");
  } catch (error) {
    console.log("Error occured");
  }
};

exports.postScedule = async (req, res) => {
  const { driverId, userId, time, route, rideStatus } = req.body;
 console.log(route)
  try {
    await TimeModel.create({ driverId, userId, time, route, rideStatus });
    res.status(200).json("Success");
  } catch (error) {
    res.status(500).json("failed");
  }
};

exports.getSchedule = async (req, res) => {
  const { userId } = req.params;
  const currentDate = new Date();

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const subscriptionExpiryDate = new Date(user.subscriptionCreated);

    if (currentDate > subscriptionExpiryDate || user.subscriptionId === "") {
      await TimeModel.deleteMany({ driverId: userId });
      return res
        .status(400)
        .json({
          message:
            "Your subscription has expired. Please renew to access the schedule.",
        });
    }

    const schedule = await TimeModel.find({ driverId: userId });
    res.status(200).json(schedule);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while fetching the schedule." });
  }
};

exports.updateTimeStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await TimeModel.updateOne(
      { _id: id },
      { $set: { rideStatus: true } }
    );

    if (result.nModified === 0) {
      return res.status(404).json({ message: "Ride not found or already updated." });
    }

    res.status(200).json({ message: "Ride status updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while updating the ride status." });
  }
};

exports.postHistory = async (req, res) => {
  const { driverId, userId, time } = req.body;

  try {
    await scheduleModel.create({ driverId, userId, time, rideStatus: true });
    res.status(200).json("Success");
  } catch (error) {
    res.status(500).json("failed");
  }
};

exports.getRideDetails = async (req, res) => {
  const { userId } = req.params;

  try {
    const rideDetails = await scheduleModel.aggregate([
      { $match: { userId } },
      {
        $addFields: {
          driverId: { $toObjectId: "$driverId" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "driverId",
          foreignField: "_id",
          as: "driverDetails",
        },
      },
      { $unwind: { path: "$driverDetails", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          time: 1,
          rideStatus: 1,
          driverName: "$driverDetails.name",
          driverEmail: "$driverDetails.email",
        },
      },
    ]);

    res.status(200).json(rideDetails);
  } catch (error) {
    res.status(500).json({ message: "Error fetching ride details" });
  }
};

cron.schedule("1 0 * * *", async () => {
  try {
    await TimeModel.updateMany({}, { $set: { rideStatus: false } });
  } catch (error) {
    console.error("Error occurred while resetting ride statuses:", error);
  }
});
