import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3500;
const API_URL = "http://localhost:4500";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine","ejs");

//route to main page
app.get("/",async(req,res)=>{
    try {
        const response = await axios.get(`${API_URL}/posts`);
        res.render("index.ejs",{posts : response.data});
    } catch (error) {
        res.status(500).json({message: "error fetching posts"});   
    }
})

//route to new post page
app.get("/new",(req,res)=>{
    res.render("modify.ejs",{
        heading : "New post",
        submit : "Create",
    });
});

//route to edit page
app.get("/edit/:id",async(req,res)=>{
    try {
        const response = await axios.get(`${API_URL}/posts/${req.params.id}`);
    res.render("modify.ejs",{
        heading : "Edit post",
        submit : "Update post",
        post : response.data,
    });
    
    } catch (error) {
        res.status(500).json({message: "error fetching posts"});   
    }
});

//create a new post
app.post("/api/posts",async(req,res)=>{
    try {
        console.log(req.body)
        const response = await axios.post(`${API_URL}/posts`,req.body);
        
        res.redirect("/");
    } catch (error) {
        res.status(500).json({ message: "Error creating post" });
    }
})

//update a post by id
app.post("/api/post/:id",async(req,res)=>{
    try {
        const response = await axios.patch(`${API_URL}/posts/${req.params.id}`,req.body);
        res.redirect("/");
    } catch (error) {
        res.status(500).json({ message: "Error in updating post" });
    }
});

//delete a post
app.get("/api/posts/delete/:id",async(req,res)=>{
    try {
        const response = await axios.delete(`${API_URL}/posts/${req.params.id}`);
        res.redirect("/");
    } catch (error) {
        res.status(500).json({ message: "Error deleting post" });
    }
})

app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`);
})