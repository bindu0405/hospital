const express = require('express');
const { MongoClient } = require('mongodb');
const socketio = require('socket.io');

const app = express();
const server = require('http').createServer(app);
const io = socketio(server);

const MONGO_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'your_database_name';
const COLLECTION_NAME = 'sales';

const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const database = client.db(DATABASE_NAME);
        const salesCollection = database.collection(COLLECTION_NAME);

        const changeStream = salesCollection.watch();
        changeStream.on('change', async () => {
            const pipeline = [
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: "%Y-%m-%dT%H:00:00",
                                date: "$timestamp"
                            }
                        },
                        totalSales: { $sum: "$amount" }
                    }
                }
            ];

            const result = await salesCollection.aggregate(pipeline).toArray();
            io.emit('salesData', result);
        });

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

connectToMongoDB();

io.on('connection', (socket) => {
    console.log('A client connected');
    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});