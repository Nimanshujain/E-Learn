import  express  from "express";
import { addLectures, getAllCourses, getCourseLectures,createCourse, deleteCourse } from "../controllers/courseController.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();
router.route("/courses").get(getAllCourses);
router.route("/createcourse").post(isAuthenticated,authorizeAdmin, singleUpload, createCourse);
router.route("/course/:id").get(isAuthenticated,getCourseLectures).post(isAuthenticated,authorizeAdmin,singleUpload,addLectures).delete(isAuthenticated,authorizeAdmin,deleteCourse);
router.route("/lecture").delete(isAuthenticated,authorizeAdmin,createCourse);
export default router;