const express = require("express")
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors')

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())

// user = mytodo-01
// password = TSmluhjatteLBI17

const uri = "mongodb+srv://mytodo-01:TSmluhjatteLBI17@cluster0.w6iptv2.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const todoCollection = client.db('todo').collection('todoList')
        // get the list of my todo item 
        app.get('/milestone', async (req, res) => {
            const query = {};
            const cursor = todoCollection.find(query);
            const result = await cursor.toArray();
            console.log(result)
            res.send(result)
        })
        // insetting my todo list data 
        app.post('/milestone', async (req, res) => {
            const body = req.body;
            const result = await todoCollection.insertOne(body)
            res.send(result)
            console.log(result)
        })
        //finding one data 
        app.get('/findOne', async (req, res) => {
            const id = req.query.id;
            const query = { _id: new ObjectId(id) }
            const result = await todoCollection.findOne(query)
            res.send(result)
        })
        // update a goal
        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const newBody = req.body;
            console.log(newBody)
            // this option instructs the method to create a document if no documents match the filter
            const options = { upsert: true };
            const updateGoal = {
                $set: {
                    todo: newBody.todo,
                    time: newBody.time
                }
            }
            const result = await todoCollection.updateOne(filter, updateGoal, options)
            res.send(result)
        })

        // delete a goal
        app.delete('/deleteOne', async (req, res) => {
            const id = req.query.id;
            const query = { _id: new ObjectId(id) }
            const final = await todoCollection.deleteOne(query)
            res.send(final)
        })
    }
    finally {

    }
}

run().catch(console.dir);


// app.post('/milestone', (req, res) => {
//     const body = req.body;
//     milestone.push(body)
//     res.send(milestone)
//     console.log(milestone)
// })
// app.get('/milestone', (req, res) => {
//     res.send(milestone)
// })

app.listen(port, () => {
    console.log(`port is running on ${port}`)
})