const express=require('express')
const multer  = require('multer')
const db=require('./db/db')
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const adminRouter = require('./routes/admin');
const path = require('path');
const bodyParser = require('body-parser');
const port=process.env.PORT || 8000
const categoryModel=require("./db/models/category")
const passport = require('passport');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const {getCategories}=require('./middlewares/common')

const dotenv=require('dotenv')
dotenv.config()
const databaseUrl=process.env.DATABASE_URL
const dbName=process.env.DB_NAME
// console.log(process.env);
const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/blog',
    collection: 'userSessions'
  });



var app=express()



app.use(express.static(path.join(__dirname,'static')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// app.use(bodyParser.json())

app.use(session({
secret: 'keyboard cat',
resave: false,
saveUninitialized: false,
store:store,
cookie:{
  maxAge:1000*60*60*24,
}
}));
app.use(passport.authenticate('session'));

app.use(getCategories)
/**routers */
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/admin', adminRouter);


/**set template engine */
app.set('view engine', 'ejs');
/** database connection */
const DB=new db(databaseUrl,dbName)
DB.connect()
app.listen(port,()=>{
    console.log(`Server is listening on http://127.0.0.1:${port}`)
    
})

