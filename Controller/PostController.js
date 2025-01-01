const propertyModel = require("../Model/PropertyModel");

exports.createProperty = async (req, res) => {
  try {
    const {
      propertyName,
      propertySize,
      roomNumber,
      location,
      price,
      category,
      rentalDate,
      images,
      landlord_id,
      status,
      description
    } = req.body;

   

    await propertyModel.create({
      propertyName,
      propertySize,
      roomNumber,
      location,
      price,
      category,
      rentalDate,
      images,
      landlord_id,
      status,
      description
    });

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getAllProperties = async (req, res) => {
  try {
    const properties = await propertyModel.find();
    res.status(200).json({ success: true, data: properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await propertyModel.findById(id);

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    res.status(200).json({ success: true, data: property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProprtyByUserID = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const property = await propertyModel.find({ landlord_id: userId });

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }
    res.status(200).json({ success: true, data: property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProperty = async (req, res) => {
  const {
    propertyName,
    location,
    price,
    propertySize,
    roomNumber,
    category,
    images,
  } = req.body;

  try {
    const updatedProperty = await propertyModel.findByIdAndUpdate(
      req.params.id,
      {
        ...(propertyName && { propertyName }),
        ...(location && { location }),
        ...(price && { price }),
        ...(propertySize && { propertySize }),
        ...(roomNumber && { roomNumber }),
        ...(category && { category }),
        ...(images && { images }),
      },
      { new: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    res
      .status(200)
      .json({
        message: "Property updated successfully",
        data: updatedProperty,
      });
  } catch (error) {
    console.error("Error updating property details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProperty = await propertyModel.findByIdAndDelete(id);

    if (!deletedProperty) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Property deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updatePropertyStatus = async (req, res) => {
  const { propertyid } = req.params;
  const { update } = req.body;

  

  try {
    const updatedProperty = await propertyModel.findByIdAndUpdate(
      { _id: propertyid },
      { status: true },
      { new: true }
    );
    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }
    res
      .status(200)
      .json({
        message: "Property updated successfully",
        property: updatedProperty,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating Property", error: error.message });
  }
};


