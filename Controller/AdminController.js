const incomeModel=require('../Model/IncomeModel')

const mongoose = require("mongoose"); 
const PropertyModel = require('../Model/PropertyModel');
const SuggestionsModel = require('../Model/SuggestionsModel');

exports.earningSubscription = async (req, res) => {
   
    try {
      
      const incomeData = await incomeModel.find({}, 'price time'); 
      
      const monthlyIncome = {}; 
  
      
      incomeData.forEach((entry) => {
        const incomePrice = entry.price;
        const incomeDate = new Date(entry.time);
  
        
        const monthKey = `${incomeDate.getFullYear()}-${(incomeDate.getMonth() + 1)
          .toString()
          .padStart(2, '0')}`;
  
        
        if (!monthlyIncome[monthKey]) {
          monthlyIncome[monthKey] = 0;
        }
        monthlyIncome[monthKey] += incomePrice;
      });
  
     
      const sortedMonths = Object.keys(monthlyIncome).sort(); 
      const cumulativeIncome = [];
      let cumulativeTotal = 0;
  
     
      sortedMonths.forEach((month) => {
        cumulativeTotal += monthlyIncome[month];
        cumulativeIncome.push({
          month,
          totalIncome: monthlyIncome[month],
          cumulativeIncome: cumulativeTotal,
        });
      });
  
      
      res.status(200).json({
        labels: cumulativeIncome.map((item) => item.month), 
        data: cumulativeIncome.map((item) => item.cumulativeIncome), 
      });
    } catch (err) {
      console.error("Error calculating earning subscription:", err.message);
      res.status(500).json({ error: err.message });
    }
  };
  
  
  exports.earningRental = async (req, res) => {
    try {
        
        const incomeData = await PropertyModel.find(); 

        if (!incomeData || incomeData.length === 0) {
            return res.status(404).json({ message: "No rental data found." });
        }

        const monthlyIncome = {}; 

        
        incomeData.forEach((entry) => {
            const incomePrice = entry.price;
            const incomeDate = new Date(entry.rentalDate);

            
            const monthKey = `${incomeDate.getFullYear()}-${(incomeDate.getMonth() + 1)
                .toString()
                .padStart(2, '0')}`;

            
            if (!monthlyIncome[monthKey]) {
                monthlyIncome[monthKey] = 0;
            }
            monthlyIncome[monthKey] += incomePrice;
        });

       
        const sortedMonths = Object.keys(monthlyIncome).sort(); 
        const cumulativeIncome = [];
        let cumulativeTotal = 0;

       
        sortedMonths.forEach((month) => {
            cumulativeTotal += monthlyIncome[month];
            cumulativeIncome.push({
                month,
                totalIncome: monthlyIncome[month],
                cumulativeIncome: cumulativeTotal,
            });
        });

       
        if (cumulativeIncome.length === 0) {
            return res.status(404).json({ message: "No income data available for the calculated period." });
        }

        
        const percentageData = cumulativeIncome.map((item) => ({
            month: item.month,
            percentage: (5 * item.cumulativeIncome) / 100, 
        }));

        
        res.status(200).json({
            labels: cumulativeIncome.map((item) => item.month), 
            data: percentageData.map((item) => item.percentage), 
        });
    } catch (err) {
        console.error("Error calculating earning rental:", err.message);
        res.status(500).json({ error: err.message });
    }
};



exports.earningRentalUser = async (req, res) => {
    const { userId } = req.params; 
    
    try {
        const incomeData = await PropertyModel.find({ landlord_id: userId });

       
        if (!incomeData || incomeData.length === 0) {
            return res.status(404).json({ message: "No income data found for the specified user." });
        }

        const monthlyIncome = {}; 

        
        incomeData.forEach((entry) => {
            if (entry.status) { 
                const incomePrice = entry.price;
                const incomeDate = new Date(entry.rentalDate);

                
                const monthKey = `${incomeDate.getFullYear()}-${(incomeDate.getMonth() + 1)
                    .toString()
                    .padStart(2, '0')}`;

               
                if (!monthlyIncome[monthKey]) {
                    monthlyIncome[monthKey] = 0;
                }
                monthlyIncome[monthKey] += incomePrice;
            }
        });

        
        const sortedMonths = Object.keys(monthlyIncome).sort(); 
        const cumulativeIncome = [];
        let cumulativeTotal = 0;

      
        sortedMonths.forEach((month) => {
            cumulativeTotal += monthlyIncome[month];
            cumulativeIncome.push({
                month,
                totalIncome: monthlyIncome[month],
                cumulativeIncome: cumulativeTotal,
            });
        });

        
        const percentageData = cumulativeIncome.map((item) => ({
            month: item.month,
            percentage: (95 * item.cumulativeIncome) / 100, 
        }));

        
        res.status(200).json({
            labels: cumulativeIncome.map((item) => item.month), 
            data: percentageData.map((item) => item.percentage),
        });
    } catch (err) {
        console.error("Error calculating user earning rental:", err.message);
        res.status(500).json({ error: err.message });
    }
};


exports.getsugg=async(req,res)=>{
    
    try{
        const response=await SuggestionsModel.find()
        res.status(200).json(response)
    }catch(error){
        res.status(500).json("Error occured")
    }
}


