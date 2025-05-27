var express = require('express');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./posts');


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


module.exports = router;
