const express = require("express");
const app = express();
const port = 3000;

//Importing the data from our fake database files
const users = require("./data/users");
const posts = require("./data/posts");

app.get("/api/users", (req, res) => {
    res.json(users);
});

//GET/api/users/posts
app.get("/api/users/:id/posts", (req, res) => {
    const userId = req.params.id;
    const userPosts = posts.filter(post => post.userId === userId)
    res.json(userPosts);
});

//GET/api/post?userId =<VALUE>
app.get("/api/posts", (req, res) => {
    const userId = req.query.userId;
    if (userId) {
        const userPosts = posts.filter(post => post.userId === userId);
        res.json(userPosts);
    } else {
        res.json(posts)
    }
    
});

//GET /comments
let comments = []; //Initial empty array for comments

app.get('/comments', (req, res) => {
    res.json(comments);  // Sends an empty array if there are no comments
});

//POST /comments

app.post('/comments', (req, res) => {
    const newComment = {
        id: comments.length + 1,
        userId: req.body.userId,
        postId: req.body.postId,
        body: req.body.body
    };
    comments.push(newComment);
    res.status(201).json(newComment);
});

//GET /comments/
app.get('/comments/:id', (req, res) => {
    const comment = comments.find(c => c.id === parseInt(req.params.id));
    if (comment) {
        res.json(comment);
    } else {
        res.status(404).send('Comment not found');
    }
});

//PATCH /comments/

app.patch('/comments/:id', (req, res) => {
    const comment = comments.find(c => c.id === parseInt(req.params.id));
    if (comment) {
        comment.body = req.body.body || comment.body;
        res.json(comment);
    } else {
        res.status(404).send('Comment not found');
    }
});

//DELETE /comments/

app.delete('/comments/:id', (req, res) => {
    const commentIndex = comments.findIndex(c => c.id === parseInt(req.params.id));
    if (commentIndex !== -1) {
        comments.splice(commentIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Comment not found');
    }
});

//GET /comments?userId=<VALUE>

app.get('/comments', (req, res) => {
    const userId = req.query.userId;
    if (userId) {
        const userComments = comments.filter(c => c.userId === userId);
        res.json(userComments);
    } else {
        res.json(comments);
    }
});

//GET /comments?postId=<VALUE>

app.get('/comments', (req, res) => {
    const postId = req.query.postId;
    if (postId) {
        const postComments = comments.filter(c => c.postId === postId);
        res.json(postComments);
    } else {
        res.json(comments);
    }
});

//GET /posts/comments

app.get('/posts/:id/comments', (req, res) => {
    const postId = req.params.id;
    const postComments = comments.filter(c => c.postId === postId);
    res.json(postComments);
});

//GET /users/comments

app.get('/users/:id/comments', (req, res) => {
    const userId = req.params.id;
    const userComments = comments.filter(c => c.userId === userId);
    res.json(userComments);
});

//GET /posts/comments?userId=<VALUE>

app.get('/posts/:id/comments', (req, res) => {
    const postId = req.params.id;
    const userId = req.query.userId;
    if (userId) {
        const userComments = comments.filter(c => c.postId === postId && c.userId === userId);
        res.json(userComments);
    } else {
        const postComments = comments.filter(c => c.postId === postId);
        res.json(postComments);
    }
});
//GET /users/comments?postId=<VALUE>

app.get('/users/:id/comments', (req, res) => {
    const userId = req.params.id;
    const postId = req.query.postId;
    if (postId) {
        const userComments = comments.filter(c => c.userId === userId && c.postId === postId);
        res.json(userComments);
    } else {
        const userComments = comments.filter(c => c.userId === userId);
        res.json(userComments);
    }
});

app.get("/api/posts/:id", (req, res, next) => {
    const post = posts.find((p) => p.id == req.params.id);
    if (post) res.json(post);
    else next();
});

app.get("/api/users", (req,res) => {
    res.send("Work in Progress!");
});

// Custom 404 (not found) middleware.
// Since we place this last, it will only process
// if no other routes have already sent a response!
// We also don't need next(), since this is the
// last stop along the request-response cycle.
app.use((req, res) => {
    res.status(404);
    res.json({ error: "Resource Not Found" });
});

app.listen(port,() => {
    console.log(`Server listening on port: ${port}.`);
});

