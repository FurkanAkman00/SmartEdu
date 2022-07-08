const express = require('express')
const router = express.Router()
const Course = require('../models/Course')
const Category = require('../models/Category')
const roleMiddleware = require('../middlewares/roleMiddleware')
const User = require('../models/User')

router.get('/:slug' , async (req,res) => {
    try{
        const course = await Course.findOne({slug: req.params.slug})
        const user = await User.findOne({_id: course.user._id})
        const categories = await Category.find()

        res.render('course',{
            course:course,
            name:'courses',
            user:user,
            categories
        })
    }
    catch {
        res.send('Hata')
    }
})


router.get('/', async (req,res) => {
    try{

        const category = await Category.findOne({slug:req.query.categories})
        const query = req.query.search

        let filter = {}

        if(req.query.categories){
             filter = {category: category._id}
        }

        if(query){
            filter = {name:query} //query search='aksdkadkas' gibi bişey o yüzden direk queryi atıyosun
        }

        if(!query && !req.query.categories){  // categories='' şeklinde bir query atamıştık
            filter.name=''
            filter.categories=''
        }


        const courses = await Course.find({
            $or:[
              {name: { $regex: '.*' + filter.name + '.*', $options: 'i'}},
              {category: filter.category}
            ]
          }).sort('-createdAt').populate('user');

        const categories = await Category.find()


        res.render('courses', {
            name:'courses',
            courses,
            categories
        })
    }
    catch{
        res.send('HATA')
    }
})

router.put('/:slug',async (req,res)=>{
    try{

        const newCourse = await Course.findOne({slug:req.params.slug})
        newCourse.name = req.body.name
        newCourse.description = req.body.description
        newCourse.category = req.body.category
        newCourse.save()

        res.status(200).redirect('/users/dashboard')

    }catch(err){
        res.status(400).json({
            status:'fail',
            error,
        })
    }
})

router.delete('/:slug',async(req,res)=>{
    try{
        const deleteData = await Course.findOneAndDelete({slug:req.params.slug})
        req.flash('error','Course removed successfully')
        res.status(200).redirect('/users/dashboard')
    } catch(err){
        res.status(400).json({
            status:'fail',
            error
        })
    }
})

router.post('/',roleMiddleware(["teacher", "admin"]),async (req,res) => { // We gave roles as parameters
    try{
        const course = await Course.create({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            user: req.session.userID
        })
            req.flash("success", "Course Created Successfully");
            res.status(201).redirect('/courses')
    }
    catch (error){
        req.flash("error", "Something Went Wrong");
        res.status(400).redirect('/courses')
    }
})

module.exports = router