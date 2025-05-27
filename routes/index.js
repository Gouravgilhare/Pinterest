var express = require('express');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./posts');
const passport = require('passport');
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate())); 


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
  const post = await postModel.create({
    postText: "This is a test post 2 for Pintrest",  
    user: "68359e317e997a3d9e97f1ef"
  })
  let user = await userModel.findById("68359e317e997a3d9e97f1ef");
  user.posts.push(post._id);
  await user.save();
  res.send(post);
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

router.get('/profile',  function(req, res, next) {

    res.render('profile');
});

router.get('/login', function(req, res, next) {
  res.render('login' );
});

router.get('/feed', function(req, res, next) {
  res.render('feed' );
});

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});
module.exports = router;
