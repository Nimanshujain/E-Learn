import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Course } from "../models/Course.js";
import getDataUri from "../utils/dataUri.js";
import ErrorHandler from "../utils/errorHandler.js";
import cloudinary from "cloudinary";




export const getAllCourses = catchAsyncError( async (req, res, next) =>{
    const keyword = req.query.keyword || "";
    const category = req.query.category || "";
    const courses = await Course.find({
        title:{
            $regex:keyword,
            $options:"i"
        }, category:{
            $regex:category,
            $options:"i"
        }
    }).select("-lectures");
    res.status(200).json({
        success: true,
        courses,
    });
});
export const createCourse = catchAsyncError( async (req, res, next) =>{
    const{title,description,category,createdBy} = req.body;
    if(!title || !description || !category || !createdBy) 
       return next(new ErrorHandler("Please add all fields", 400));
     const file = req.file;
     const fileURI = getDataUri(file);
     const mycloud = await cloudinary.v2.uploader.upload(fileURI.content);
    await Course.create({
        title,description,category,createdBy,poster:{
            public_id:mycloud.public_id,
            url:mycloud.secure_url,
        },
    })

    
    res.status(201).json({
        success: true,
        message:"Course Created Successfully. You can add lectures now.",
    });
});

export const getCourseLectures = catchAsyncError( async (req, res, next) =>{
    const courses = await Course.findById("req.params.id");
    if(!course) return next(new ErrorHandler("Course not found",404));
    course.views+=1;
    await course.save();
    res.status(200).json({
        success: true,
        lectures: course.lectures,
    });
});
export const addLectures = catchAsyncError( async (req, res, next) =>{
    const {id} = req.params;
    const {title,description} = req.body;
    // const file = req.file;
    const courses = await Course.findById("req.params.id");
    if(!course) return next(new ErrorHandler("Course not found",404));
    const file = req.file;
     const fileURI = getDataUri(file);
     const mycloud = await cloudinary.v2.uploader.upload(fileURI.content,{
        resource_type:"video",
     });
    course.lectures.push({
        title,
        description,
        video: {
            public_id:mycloud.public_id,
            url:mycloud.secure_url,
        },
    });
    course.numOfVideos = course.lectures.length;
    await course.save();
    res.status(200).json({
        success: true,
        lectures: "lectures added in course",
    });
});
export const deleteCourse = catchAsyncError( async (req, res, next) =>{
    
    const {id} = req.params;
    const course = await Course.findById(id);
    if(!course) return next(new ErrorHandler("Course not found",404));
    // console.log(course.poster.public_id);
    await cloudinary.v2.uploader.destroy(course.poster.public_id);
    for(let i=0;i<course.lecture.length;i++){
        const singleLecture = course.lectures[i];
        await cloudinary.v2.uploader.destroy(singleLecture.video.public_id,{
            resource_type: "video",
        });
    }
    // console.log(singleLecture.video.public_id)
    await course.remove();
    res.status(200).json({
        success: true,
        message:"Course Deleted Successfully",
    })
    
});  
// export const deleteLecture = catchAsyncError( async (req, res, next) =>{
    
//     const {courseId, lectureId} = req.query;
//     const course = await Course.findById(courseId);
//     if(!course) return next(new ErrorHandler("Course not found",404));
    
//     }
export const deleteLecture = catchAsyncError( async (req, res, next) =>{
    
    const {courseId, lectureId} = req.query;
    const course = await Course.findById(courseId);
    if(!course) return next(new ErrorHandler("Course not found",404));
    const lecture = course.lectures.find(item=>{
        if(item._id.toString() === lectureId.toString()) return item;
    });
    await cloudinary.v2.uploader.destroy(lecture.video.public_id,{
        resource_type:"video",
    })
    course.lectures = course.lectures.filter(item=>{
        if(item._id.toString()!== lectureId.toString()) return item;
    });
    course.numOfVideos = course.lectures.length;
    await course.save();
    
    
    res.status(200).json({
        success: true,
        message:"Lectre Deleted Successfully",
    })
    
});  
Course.watch().on("change",async()=>{
    const stats = await Stats.find({}).sort({createdAt:"descending"}).limit(1);
    const courses = await course.find({});
     let totalViews = 0;
    for(let i=0;i<course.length;i++){
        totalViews+= courses[i].views;
        const course = course.views;
    }
    stats[0].views= totalViews;
    stats[0].createdAt = new Date(Date.now());
    await stats[0].save();

});  
