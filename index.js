
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_Pass}@cluster0.5va2jyw.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const blogsCollection = client.db('blogWebsite').collection('blogs');
        const commentCollection = client.db('blogWebsite').collection('comments');
        const guidesCollection = client.db('blogWebsite').collection('guides');
        const addBlogCollection = client.db('blogWebsite').collection('addBlog');

        app.get('/blogs', async (req, res) => {
            const cursor = blogsCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })


        // blog details
        app.get('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await blogsCollection.findOne(query);
            res.send(result)
        })



        // comments show
        app.get('/comments', async (req, res) => {
            const result = await commentCollection.find().toArray();
            res.send(result)
        })
        // comments
        app.post('/comments', async (req, res) => {
            const comment = req.body;
            console.log(comment)
            const result = await commentCollection.insertOne(comment);
            res.send(result)
        })

        // guides
        app.get('/guides', async (req, res) => {
            const cursor = guidesCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })


        // guides details
        app.get('/guides/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await guidesCollection.findOne(query);
            res.send(result)
        })
        //  data UI red 
        app.get('/addBlog', async (req, res) => {
            const cursor = addBlogCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        // update to blog
        app.get('/addBlog/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await addBlogCollection.findOne(query);
            res.send(result)
        })

        // update set 
        app.put('/addBlog/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateBLog = req.body;
            const update = {
                $set: {
                    title: updateBLog.title,
                    category: updateBLog.category,
                    sortDescription: updateBLog.sortDescription,
                    longDescription: updateBLog.longDescription,
                    photo: updateBLog.photo
                }

            }
            const result = await addBlogCollection.updateOne(filter, update, options);
            res.send(result);
        })


        // addBlog
        app.post('/addBlog', async (req, res) => {
            const newBlog = req.body;
            console.log(newBlog)
            const result = await addBlogCollection.insertOne(newBlog)
            res.send(result)
        })


        // my add blogs show
        app.get('/wishlist/:email', async (req, res) => {
            // console.log(req.params.email)
            const result = await addBlogCollection.find({ email: req.params.email }).toArray();
            res.send(result)
        })

        // my add blog delete
        app.delete('/addBlog/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await addBlogCollection.deleteOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('travel is running')
})


app.listen(port, () => {
    console.log(`travel server is running ${port}`)
})