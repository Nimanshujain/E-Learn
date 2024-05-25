import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Stats } from "../models/Stats.js";
export const getDashboardStats = catchAsyncError(async(req,res,next) => {
    const stats = await Stats.find({}).sort({createdAt:"descending"}).limit(12);
    const statsData = [];
    
    for(let i=0 ;i<stats.length;i++){
        statsData.unshift(stats[i]);    
    }
    const requiredSize = 12 - stats.length;
    for(let i=0 ;i<arequiredSize;i++){
        statsData.unshift({
            user:0,
            subscription:0,
            views:0,
        });    
    }
    const userCount = statsData[11].users;
    const subscriptionCount = statsData[11].subscription;
    const viewCount = statsData[11].views;
    let userProfit = true,
        viewsProfit = true,
        subscriptionProfit = true;
        let userPercentage = 0,
        viewsPercentage = 0,
        subscriptionPercentage = 0;
        if(statsData[10].users === 0) userPercentage = userCount * 100;
        if(statsData[10].subscription === 0) 
        subscriptionPercentage = subscriptionCount * 100;
    else{
        const difference = {
            users:statsData[11].users - statsData[10].users,
            views:statsData[11].views - statsData[10].users,
            subscription:statsData[11].subscription - statsData[10].users,
        };
        usersPercentage = (difference.users / statsData[10].users) * 100;
        viewsPercentage = (difference.views / statsData[10].views) * 100;
        subscriptionPercentage = (difference.subscription / statsData[10].subscription) * 100;
        if(usersPercentage < 0) usersProfit=false;
        if(viewsPercentage < 0) viewsProfit=false;
        if(subscriptionPercentage < 0) subscriptionProfit=false;

    }
        if(statsData[10].views === 0) viewsPercentage = views * 100;


    res.status(200).json({
        success: true,
        stats: statsData,
        userCount,
        viewCount,
        subscriptionCount,
        subscriptionPercentage,
        viewsPercentage,
        userPercentage,
        subscriptionProfit,
        viewsProfit,
        userProfit,
    });
});