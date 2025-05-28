var express = require('express');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./posts');
const passport = require('passport');
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate())); 
const upload = require('./multer'); 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/createuser', async function(req, res, next) {
  
  const user = await userModel.create({
    username: "testuser",
     password : "testpassword",
      email:"testuser@example.com",
      fullname: "Test User"

  })

  res.send(user);
});

router.get('/alluserpost', async function(req, res, next) {
  let user = await userModel.findOne({_id: "68359e317e997a3d9e97f1ef"}).populate('posts');

  res.send(user);
});


router.get("/createpost", async function(req, res, next) {
  res.render('createpost', {error: req.flash('error')});
});


router.post('/createpost', async function(req, res, next) {
  
  const {description,image}= req.body;
  if ( !description || !image) {
    return res.status(400).send("All fields are required.");
  }
  const post = new postModel({
    postText: description,
    image: image
  })
  post.save();
  res.redirect('/profile');
});

router.post('/register', async function (req, res, next) {
  const { username, email, fullname, password } = req.body;

  if (!username || !email || !fullname || !password) {
    return res.status(400).send("All fields are required.");
  }

  const user = new userModel({ username, email, fullname });

  userModel.register(user, password)
    .then(function () {
      passport.authenticate('local')(req, res, function () {
        res.redirect('/profile');
      });
    })
    .catch(function (err) {
      console.error("Registration error:", err);
      res.status(500).send("Registration failed: " + err.message);
    });
});



function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

router.get('/profile',isLoggedIn,  async function(req, res, next) {

    const user = await userModel.findOne({username : req.session.passport.user});

    res.render('profile',{username : user.username, fullname: user.fullname, email: user.email, dp: user.dp, posts: user.posts});
});

router.get('/login', function(req, res, next) {
  
  res.render('login',{error: req.flash('error')} );
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/feed', function(req, res, next) {
  res.render('feed' );
});

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});



router.get('/upload', function(req, res, next) {
  res.render('upload', {error: req.flash('error')});
});


router.post('/upload', upload.single('file'),(req,res) => {
  
  if(!req.file){
    return res.status(400).send("No file uploaded.");
  }
  // res.send("File uploaded successfully.");

  res.redirect('/profile'  );
});

module.exports = router;



