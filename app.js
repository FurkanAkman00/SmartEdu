const express = require('express')
const app = express()
const mongoose = require('mongoose')
var session = require('express-session')
const flash = require('connect-flash');
var methodOverride = require('method-override')
const MongoStore = require('connect-mongo');


mongoose.connect('mongodb://localhost:27017/smartedu').then(() => {
    console.log('CONNECTED')
});

//Template
app.set("view engine","ejs")

global.userIN = null //Global variable

// Middleware
app.use(express.static("public")) // static file location
app.use(express.json())
app.use(express.urlencoded({extended:true})) //Body parser
app.use(session({
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/smartedu' }), // To stay connected even after we refresh our server not very important
    secret: 'my_laptop_cat',
    resave: false,
    saveUninitialized: true,
  }))
app.use(flash());
app.use((req, res, next)=> {
res.locals.flashMessages = req.flash();
next();
})
app.use(methodOverride('_method',{
    methods: ['POST','GET'],
  })
)

// Routes
app.use('*',(req,res,next) =>{
    userIN = req.session.userID
    next() // (req,res)'da res.send tarzı şeylerle döngüyü bitirebiliyosun burda döngüyü bitirmek için next() kullanılıyor.
})

const indexRouter = require('./routes/index')
app.use('/',indexRouter)

const courseRouter = require('./routes/courses')
app.use('/courses',courseRouter)

const categoryRouter = require('./routes/categories')
app.use('/categories',categoryRouter)

const userRouter = require('./routes/auth');
app.use('/users',userRouter)




app.listen(3000)