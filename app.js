const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const crypto = require('crypto')

const app = express()

const indexRouter = require('./routes/index')
const signupRouter = require('./routes/signup')
const loginRouter = require('./routes/login')
const homeRouter = require('./routes/home')
const adminRouter = require('./routes/admin')
const connectDB = require('./config/connection')

app.set('view engine', 'hbs')
app.set('views', __dirname + "/views")



const randomCrypto = () => {
    return crypto.randomBytes(32).toString('hex')
}

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'));
app.use(
    session({
        secret: randomCrypto(),
        resave: false,
        saveUninitialized: false
    })
)


connectDB()
app.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});

app.use('/', indexRouter)
app.use('/signup', signupRouter)
app.use('/login', loginRouter)
app.use('/home', homeRouter)
app.use('/administration', adminRouter)

// Add this middleware at the end of your route handlers
app.use((req, res, next) => {
    res.status(404).render('error'); // Send a 404 status and error message
});

app.listen(8888)