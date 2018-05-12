const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const passport = require('passport');

const app = express();
// //map global promis - get rid of warning
// mongoose.Promise = global.Promise;

//load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//DB config
const db = require('./config/database');

//connect to mongoose
mongoose.connect(db.mongoURI)
.then(() => console.log('MongoDB connected..'))
.catch(err => console.log(err));

//passport config
require('./config/passport')(passport);

//handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//method-override middleware
app.use(methodOverride('_method'))

//express-session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//global variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;

    next();
});

//main route
app.get('/', (req, res) => {
    const title = 'hello';
    res.render('index', {title: title});
});

//about route
app.get('/about', (req, res)=>{
    res.render('about');
});

//use routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = process.env.PORT || 5000;
app.listen(port, ()=> {
    console.log(`Server started on port ${port}`);
});