const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const ejs = require('ejs');
const mongoose = require('mongoose');


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));



mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});



const articleSchema = {
  title: String,
  content: String
};
const Article = mongoose.model("article", articleSchema);


app.route('/articles')

  .get(function(req, res) {
    Article.find({}, function(err, articles) {
      (err) ? res.send(err): res.send(articles);
    });
  })

  .post(function(req, res) {



    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });


    newArticle.save(function(err) {
      (err) ? res.send(err): res.send("Successfully added new Article");
    });
  })


  .delete(function(req, res) {
    Article.deleteMany({}, function(err) {
      (err) ? res.send(err): res.send("Deleted all articles");
    });
  })



///////////////////////////////////////////////////////////////4

app.route('/articles/:articleTitle')

  .get(function(req, res) {
    var requestedTitle = req.params.articleTitle;

    Article.findOne({
      title: requestedTitle
    }, function(err, article) {
      (err) ? res.send("No article with matching title"): res.send(article);
    });
  })


  .put(function(req, res) {
    var requestedTitle = req.params.articleTitle;

    var newTitle = req.body.title;
    var newContent = req.body.content;

    Article.findOneAndUpdate({
      title: requestedTitle
    }, {
      title: newTitle,
      content: newContent
    }, {
      overwrite: true
    }, function(err) {
      (err) ? res.send("No article with matching title"): res.send("Update Successfully");
    });
  })




  .patch(function(req, res) {
    var requestedTitle = req.params.articleTitle;

    Article.update({
      title: requestedTitle
    }, {
      $set: req.body
    }, function(err) {
      (err) ? res.send("No article with matching title"): res.send("Update Successfully");
    });

  })


  .delete(function(req, res) {
    var requestedTitle = req.params.articleTitle;
    Article.deleteOne({
        title: requestedTitle
      }, function(err){
      (err) ? res.send(err) : res.send("Deleted Sucessfully");
      }
    );

  })






app.listen('3000', function(res) {
  console.log("Server started on port 3000");
});
