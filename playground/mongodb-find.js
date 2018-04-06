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

	// db
	// 	.collection('Todos')
	// 	.find({ _id: new ObjectID('5ac6d2c5def6be887a94e7a3') })
	// 	.toArray()
	// 	.then(
	// 		docs => {
	// 			console.log('Todos');
	// 			console.log(JSON.stringify(docs, undefined, 2));
	// 		},
	// 		err => {
	// 			console.log('Unable to fetch todos', err);
	// 		},
	// 	);

	db
		.collection('Todos')
		.find()
		.count()
		.then(
			count => {
				console.log(`Todos count: ${count}`);
			},
			err => {
				console.log('Unable to fetch todos', err);
			},
		);

	// client.close();
});
