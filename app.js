const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require('lodash');

mongoose.connect("mongodb://127.0.0.1:27017/BlogDB");

const postSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Post = mongoose.model("Post",postSchema);


// let posts = [];
const homeStartingContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Fermentum posuere urna nec tincidunt praesent. Donec adipiscing tristique risus nec feugiat in fermentum. Viverra adipiscing at in tellus integer feugiat scelerisque varius. Augue interdum velit euismod in. Ut pharetra sit amet aliquam id diam. Mi proin sed libero enim sed faucibus. Et egestas quis ipsum suspendisse ultrices gravida dictum fusce ut. Posuere morbi leo urna molestie. Enim praesent elementum facilisis leo vel. Dictum sit amet justo donec. Vitae congue eu consequat ac felis donec et odio pellentesque. Quis vel eros donec ac. Lectus quam id leo in vitae turpis massa. Tellus pellentesque eu tincidunt tortor. Purus sit amet luctus venenatis lectus. Quis auctor elit sed vulputate mi sit. Felis eget nunc lobortis mattis aliquam faucibus purus. Fermentum dui faucibus in ornare quam. Venenatis tellus in metus vulputate.";
const aboutContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Massa enim nec dui nunc. Aliquam purus sit amet luctus venenatis lectus magna fringilla urna. Faucibus scelerisque eleifend donec pretium vulputate sapien. Praesent tristique magna sit amet purus gravida. Aenean vel elit scelerisque mauris pellentesque pulvinar pellentesque. Arcu ac tortor dignissim convallis aenean et tortor at. Non quam lacus suspendisse faucibus interdum. Tortor at risus viverra adipiscing at in tellus integer feugiat. Mattis rhoncus urna neque viverra justo nec ultrices dui. Lacinia at quis risus sed vulputate odio. Mauris sit amet massa vitae tortor condimentum lacinia quis vel. Tellus at urna condimentum mattis pellentesque id nibh tortor id. Orci sagittis eu volutpat odio facilisis mauris sit amet. Dapibus ultrices in iaculis nunc sed. Iaculis eu non diam phasellus vestibulum lorem sed risus ultricies.";
const contactContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Aliquam vestibulum morbi blandit cursus risus. Dictumst quisque sagittis purus sit amet volutpat consequat mauris nunc. Nec feugiat in fermentum posuere urna nec tincidunt praesent. Vitae purus faucibus ornare suspendisse sed nisi. Elementum nisi quis eleifend quam. Sit amet cursus sit amet dictum sit amet justo donec. Sed egestas egestas fringilla phasellus faucibus scelerisque eleifend donec. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu. Enim eu turpis egestas pretium. Varius morbi enim nunc faucibus a pellentesque sit amet. Vel pretium lectus quam id leo in vitae turpis massa. Vel pretium lectus quam id leo. Ac odio tempor orci dapibus ultrices in. Pellentesque pulvinar pellentesque habitant morbi. Nec sagittis aliquam malesuada bibendum arcu vitae elementum. At volutpat diam ut venenatis tellus in metus vulputate eu.";

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set("view engine","ejs");

app.get("/",function(req,res){
    Post.find()
    .then(function(post){
        console.log("Retrieved posts successfully:", post);
        res.render("home",{
            homeStartingContent: homeStartingContent,
            posts: post
        });
    })
    .catch(function(err){
        console.log("There was an error retrieving the documents: ", err);
    });
    
});

app.get("/about",function(req,res){
    res.render("about",{
        aboutContent: aboutContent
    });
});

app.get("/contact",function(req,res){
    res.render("contact", {
        contactContent: contactContent
    });
});

app.get("/compose",function(req,res){
    res.render("compose");
});

app.get("/posts/:postId",function(req,res){
    // console.log(req.params.postName);
    const requestedPostId = req.params.postId;

    Post.findOne({_id:requestedPostId})
    .then(function(post){
        console.log("Post found successfully: ", post);
        res.render("post",{
            post: post
        });
    })
    .catch(function(err){
        console.log("Error finding the post", err);
    });

    // for (let i=0; i< posts.length; i++){
    //     if(_.lowerCase(posts[i].title) === _.lowerCase(req.params.postName)){
    //         res.render("post",{
    //             post:posts[i]
    //         })
    //     };
    // };
});

app.post("/compose",function(req,res){
    const post = new Post ({
        title: req.body.title,
        content: req.body.content
    });

    post.save().then(function(result){
        console.log("Post saved successfully.", result);
    })
    .catch(function(err){
        console.log("Error saving the post", err)
    });
    //posts.push(post);
    res.redirect("/");
});




app.listen(process.env.PORT || 3000, function(){
    console.log("Server is active.")
});