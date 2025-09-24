const express=require("express");
const router=express.Router();
const { createCourse,getAllCourses,getCourseById,updateCourse,deleteCourse }=require("../controllers/courseController");
const { protect, isInstructor}=require("../middleware/authMiddleware");


router
    .route("/")
    .post(protect,isInstructor,createCourse)
    .get(getAllCourses);

router
    .route("/:id")
    .get(getCourseById)
    .put(protect,isInstructor,updateCourse)
    .delete(protect,isInstructor,deleteCourse);

module.exports=router;