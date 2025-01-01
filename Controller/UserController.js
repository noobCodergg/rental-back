const { json } = require("body-parser");
const userModel = require("../Model/UserModel");
const SuggestionsModel = require("../Model/SuggestionsModel");

exports.getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findById(id);
    res.status(200).json(user);
  } catch (error) {
  }
};

exports.updateRating = async (req, res) => {
  const { id } = req.params;
  const { rating, ratingScore, totalRating } = req.body;
  try {
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json("User not found");
    }

    const updatedUser = await userModel.updateOne(
      { _id: id },
      {
        $set: {
          rating: rating,
          rating_score: ratingScore,
          total_rating: totalRating,
        },
      }
    );

    if (updatedUser.modifiedCount === 0) {
      return res.status(400).json("Rating update failed");
    }

    res.status(200).json("Rating updated successfully");
  } catch (error) {
    res.status(500).json("Error updating rating");
  }
};

exports.fetchAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json("Error fetching data");
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    phone,
    gender,
    religion,
    bio,
    profile_photo,
    cover_photo,
    rating_score,
    total_rating,
  } = req.body;

  try {
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.gender = gender || user.gender;
    user.religion = religion || user.religion;
    user.bio = bio || user.bio;
    user.profile_photo = profile_photo || user.profile_photo;
    user.cover_photo = cover_photo || user.cover_photo;
    user.rating_score = rating_score || user.rating_score;
    user.total_rating = total_rating || user.total_rating;

    await user.save();

    return res
      .status(200)
      .json({ message: "User updated successfully", data: user });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};

exports.updateIsAvailable = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json("User not found");
    }

    const updatedUser = await userModel.updateOne(
      { _id: userId },
      {
        $set: {
          isAvailable: !user.isAvailable,
        },
      }
    );

    if (updatedUser.modifiedCount === 0) {
      return res.status(400).json("Rating update failed");
    }

    res.status(200).json("Rating updated successfully");
  } catch (error) {
    res.status(500).json("Error updating rating");
  }
};


exports.getUsers = async (req, res) => {
  
  try {
      
      const users = await userModel.find();

      if (!users || users.length === 0) {
          return res.status(404).json({ message: "No users found." });
      }

      
      res.status(200).json(users);
  } catch (error) {
      console.error("Error occurred while fetching users:", error.message);
      res.status(500).json({ error: "An error occurred while fetching users. Please try again later." });
  }
};


exports.deleteUser=async(req,res)=>{
  const {userId}=req.params
  try{
    await userModel.deleteOne({_id:userId})
    res.status(200).json("User Deleted")
  }catch(error){
     res.status(500).json("Failed")
  }
}

exports.postSuggestion=async(req,res)=>{
  const {userId,id,content,type}=req.body
  
  try{
    await SuggestionsModel.create({userId,id,content,type})
  }catch(error){
    console.log("Error occured")
  }
}