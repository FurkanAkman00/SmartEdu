const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const authMiddleware = require('../middlewares/authMiddleware')
const Category  = require('../models/Category')
const Course = require('../models/Course')

router.post('/signup',async (req,res) => {
    try{
        const user = await User.create(req.body)
        res.redirect('/login')
    }
    catch (error){
        res.status(400).json({
            status:'fail',
            error
        })
    }
})

router.post('/release',async (req,res) =>{
    try{
    const user = await User.findById(req.session.userID)
    await user.courses.pull({_id:req.body.course_id})
    await user.save()
    res.redirect('/users/dashboard')
    }
    catch (error){
        res.status(400).json({
            status: 'fail',
            error,
          });
    }
})

router.post('/enroll' , async (req,res) =>{
    try{
    const user = await User.findById(req.session.userID)
    await user.courses.push(req.body.course_id)
    await user.save()

    res.redirect('/users/dashboard')
    }
    catch (error){
        res.status(400).json({
            status: 'fail',
            error,
        })
    }
})

router.get('/dashboard',authMiddleware, async (req,res) =>{

    const user = await User.findById(req.session.userID).populate('courses') // bir schemayı ararken o schema içindeki başka schemayı da aramak için populate kullanılır
    const categories = await Category.find()
    const courses = await Course.find({user:req.session.userID})

    res.render('dashboard',{
        name: 'dashboard',
        user,
        categories,
        courses
    })
})

router.post('/login',async (req,res) => {
    try{
        const {email,password} = req.body
        
        const user = await User.findOne({email:email})

        if(user){
            bcrypt.compare(password,user.password, (err,same) =>{
                if(same){
                    // USER SESSION
                 
                    req.session.userID = user._id // UserID is var, session is created

                    res.redirect('/users/dashboard')
                }
                else{
                    console.log('HELO')
                }
            })
        }
        else{
            error
        }
    }
    catch (error){
        res.status(400).json({
            status:'fail',
            error
        })
    }
})

router.get('/logout',async (req,res) => {
    try{
       
        req.session.destroy(() =>{
            res.redirect('/')
        })
    }
    catch (error){
        res.status(400).json({
            status:'fail',
            error
        })
    }
})


module.exports = router