// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

// We can create a database by just naming it in the connect function path.
// MongoDB will not create the Database until we start adding to it
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
	if (err) {
		console.log('Unable to connect to MongoDB server');
		return;
	}
	console.log('Connected to MongoDB server');
	const db = client.db('TodoApp');

	// findOneAndUpdate
	db
		.collection('Todos')
		.findOneAndUpdate(
			{
				_id: new ObjectID('5ac70e94def6be887a94ec40'),
			},
			{
				$set: {
					completed: true,
				},
			},
			{
				returnOriginal: false,
			},
		)
		.then(res => {
			console.log(res);
		});

	// client.close();
});

// favor promises over callbacks when working with mongodb
