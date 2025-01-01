const chatModel = require("../Model/ChatModel");
const userModel = require("../Model/UserModel");
const { ObjectId } = require("mongoose").Types;

exports.postChat = async (req, res) => {
  const { sender, receiver, content, time, roomId, isRead, name } = req.body;
 
  try {
    const newChat = await chatModel.create({
      sender,
      receiver,
      content,
      time,
      roomId,
      isRead: isRead || false,
      name
    });

    res.status(201).json({
      success: true,
      message: "Chat message sent successfully!",
      data: newChat,
    });
  } catch (error) {
    console.log("Error occurred:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while sending the chat message.",
    });
  }
};

exports.getChat = async (req, res) => {
  const { id, userId } = req.params;

  try {
    const messages = await chatModel
      .find({
        $or: [
          { sender: userId, receiver: id },
          { sender: id, receiver: userId },
        ],
      })
      .sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json("Server error");
  }
};

exports.getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!userId) {
      return res.status(400).json({ error: "Invalid userId provided" });
    }

    const chattedAccounts = await chatModel.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $sort: { time: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ["$sender", userId] }, "$receiver", "$sender"],
          },
          latestMessage: { $first: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          latestMessage: {
            content: "$latestMessage.content",
            time: "$latestMessage.time",
            isRead: "$latestMessage.isRead",
            sender: "$latestMessage.sender",
            receiver: "$latestMessage.receiver",
          },
        },
      },
    ]);

    if (chattedAccounts.length === 0) {
      return res.status(404).json({ error: "No chatted accounts found" });
    }

    res.status(200).json(chattedAccounts);
  } catch (error) {
    console.error("Error fetching chatted accounts:", error);
    res.status(500).json({ error: "Failed to fetch chatted accounts" });
  }
};

exports.markMessagesAsRead = async (req, res) => {
  const { roomId } = req.params;

  try {
    

    await chatModel.updateMany(
      { roomId: roomId },
      { $set: { isRead: true } } 
    );

    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ error: "Failed to mark messages as read" });
  }
};

exports.getUserName = async (req, res) => {
  
  const { userIds } = req.body;
 
  try {
    const users = await userModel.find({ _id: { $in: userIds } });

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }

    const usersNames = users.map((user) => ({
      userId: user._id,
      name: user.name,
      picture: user.profile_photo,
    }));

    res.status(200).json(usersNames);
  } catch (error) {
    console.error("Error fetching user names:", error);
    res.status(500).json({ error: "Failed to fetch user names" });
  }
};

exports.getChatHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const chats = await chatModel.find({
      $or: [{ sender: userId }, { receiver: userId }],
    });

    if (!chats || chats.length === 0) {
      return res.status(404).json({ message: "No chat history found" });
    }

    res
      .status(200)
      .json({ message: "Chat history fetched successfully", chats });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
