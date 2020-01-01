const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');


const app = express();

// Load Models
require('./models/User');
require('./models/Post');
// Passport Config
require('./config/passport')(passport);

// Load routes
const index = require('./routes/index');
const users = require('./routes/users');
const posts = require('./routes/posts');

// DB Config
const db = require('./config/database');

// Handlebars Helpers
const {
    truncate,
    stripTags,
    formatDate,
    select,
    editIcon
} = require('./helpers/hbs');

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect(db.mongoURI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));



// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'));

// Handlebars middleware
app.engine('handlebars', exphbs({
    helpers: {
        truncate: truncate,
        stripTags: stripTags,
        formatDate: formatDate,
        select: select,
        editIcon: editIcon
    },
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.use(cookieParser());

// Express session midleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Index Route
app.get('/', (req, res) => {
    const title = 'A Learner\'s Blog';
    res.render('index', {
        title: title
    });
});

// About Route
app.get('/about', (req, res) => {
    res.render('about');
});

// About Route
app.get('/contact', (req, res) => {
    res.render('contact');
});

// Use routes
app.use('/', index);
app.use('/users', users);
app.use('/posts', posts);

const port = process.env.PORT || 3000;

app.listen(port,() => {
    console.log("App runnig on port:3000");
});