const subscriptionModel = require('../Model/SubscriptionModel');
const userModel = require('../Model/UserModel');
const incomeModel=require('../Model/IncomeModel')
exports.postSubscription = async (req, res) => {
    const { subscriptionName, subscriptionDuration, rideAvailabilityFrom, rideAvailabilityTo, areaCoverage, price, otherFeatures } = req.body.data;
    try {
        await subscriptionModel.create({ subscriptionName, subscriptionDuration, rideAvailabilityFrom, rideAvailabilityTo, areaCoverage, price, otherFeatures });
        res.status(200).json("Subscription Created");
    } catch (error) {
        res.status(500).json("Error creating subscription");
    }
}

exports.getSubscription = async (req, res) => {
    try {
        const subscription = await subscriptionModel.find();
        res.status(200).json(subscription);
    } catch (error) {
        res.status(500).json("Error occured");
    }
}

exports.updateUserSubscription = async (req, res) => {
    const { userId, subscriptionId, subscriptionCreated } = req.body;

    try {
        if (!userId || !subscriptionId || !subscriptionCreated) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const subscription = await subscriptionModel.findById(subscriptionId);
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        user.subscriptionId = subscriptionId;
        user.subscriptionCreated = subscriptionCreated;

        await user.save();

        return res.status(200).json({ message: 'Subscription updated successfully', user });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.validation = async (req, res) => {
    const { userId } = req.params;
    const date = new Date();

    try {
        const user = await userModel.findById(userId);
        if (user.subscriptionCreated >= date && user.subscriptionId !== "") {
            res.status(200).json(true);
        } else {
            res.status(200).json(false);
        }
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.getAvailableDriver = async (req, res) => {
    const { userId } = req.params;
    const date = new Date();

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.subscriptionCreated >= date && user.subscriptionId !== "") {
            const assignedDrivers = await userModel.find({
                subscriptionId: user.subscriptionId,
                role: "Driver",
            });

            res.status(200).json(assignedDrivers);
        } else {
            res.status(400).json({ message: "Invalid subscription" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error occurred", error: error.message });
    }
};


exports.postIncome=async(req,res)=>{
    const {price}=req.body;
     
    try{
        await incomeModel.create({price})
    }catch(error){
        console.log("Error occured")
    }
}

exports.updatedSubscription= async (req, res) => {
    const { id } = req.params;
    const {updates} = req.body; 
    
    try {
        const updatedSubscription = await subscriptionModel.findByIdAndUpdate(
            {_id:id},
            updates,
            { new: true } 
        );

        if (!updatedSubscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        res.status(200).json({
            message: 'Subscription updated successfully',
            data: updatedSubscription,
        });
    } catch (error) {
        console.error('Error updating subscription:', error);
        res.status(500).json({ message: 'Failed to update subscription' });
    }
};

