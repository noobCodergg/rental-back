const applicationModel = require("../Model/ApplicationModel");

exports.postApplication = async (req, res) => {
  const { applicationData } = req.body;

  try {
    await applicationModel.create({
      userId: applicationData.userId,
      landlordid: applicationData.landlordid,
      propertyid: applicationData.propertyid,
      applicationStatus: applicationData.applicationStatus,
      applicationBody: applicationData.applicationBody,
      applicantName: applicationData.userName,
      propertyName: applicationData.propertyname,
    });
    res.status(200).json("Application send successfully");
  } catch (error) {
    res.status(500).json("Error sending application");
  }
};

exports.getMyApplications = async (req, res) => {
  const { userId } = req.params;

  try {
    const applications = await applicationModel.find({ userId });

    if (!applications.length) {
      return res
        .status(404)
        .json({ message: "No applications found for this user." });
    }

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error occurred while fetching applications:", error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

exports.getApplications = async (req, res) => {
  const { userId } = req.params;

  try {
    const application = await applicationModel.find({ landlordid: userId });
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json("Error occured");
  }
};

exports.updateApplication = async (req, res) => {
  const { id } = req.params;
  const { update } = req.body;

  try {
    const updatedApplication = await applicationModel.findByIdAndUpdate(
      id,
      { applicationStatus: update },
      { new: true }
    );
    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.status(200).json({
      message: "Application updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating application", error: error.message });
  }
};
