const express = require('express')
const redirectMiddleware = require('../middlewares/redirectMiddleware')
const router = express.Router()
const nodemailer = require('nodemailer')

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

router.get('/contact',(req,res)=>{
    res.render('contact',{
        name:'contact'
    })
})

router.get('/login',redirectMiddleware,(req,res) =>{
    res.render('login',{
        name:'login'
    })
})

router.post('/contact',async (req,res)=>{ // it doesnt work because i dont have 2 gmail accounts.
    try{
    const userMessage = 
    `<h1>Mail details</h1>
    <ul>
        <li>Name: ${req.body.name}</li>
        <li>Mail: ${req.body.email}</li>
    </ul
    <h1>Message</h1>
    <p>${req.body.message}</p>
    
    `

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'jakerkane99@gmail.com', // gmail account
         
          pass: testAccount.pass, // gmail password, i didnt enter my password so it doesnt work !!!!!!!!!!!!!!!!!!
        },
      });
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Contact Form 👻" <furkan_akman_41@hotmail.com>', // sender address
        to: "jakerkane99@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        html: userMessage, // html body
      });
    
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

      req.flash("success", "We Received your message succesfully");


      res.status(200).redirect('/contact')

    } catch(err){
       req.flash('error','Something Happened')
       res.status(200).redirect('/contact')
    }
})


module.exports = router