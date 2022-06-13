const express = require('express')
const redirectMiddleware = require('../middlewares/redirectMiddleware')
const router = express.Router()

router.get('/',(req,res) => {
    console.log(req.session.userID)
    res.render('index',{
        name:'index'
    })
})

router.get('/about',(req,res) => {
    res.render('about',{
        name:'about'
    })
})

router.get('/register',redirectMiddleware,(req,res) => {
    res.render('register',{
        name:'register'
    })
})

router.get('/login',redirectMiddleware,(req,res) =>{
    res.render('login',{
        name:'login'
    })
})


module.exports = router