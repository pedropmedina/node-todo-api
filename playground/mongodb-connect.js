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

	// db.collection('Todos').insertOne(
	// 	{
	// 		text: 'Something to do',
	// 		completed: false,
	// 	},
	// 	(err, result) => {
	// 		if (err) {
	// 			console.log('Unable to insert todo', err);
	// 			return;
	// 		}

	// 		console.log(JSON.stringify(result.ops, undefined, 2));
	// 	},
	// );
	// db.collection('Users').insertOne(
	// 	{
	// 		name: 'Pedro',
	// 		age: 28,
	// 		location: 'Miami',
	// 	},
	// 	(err, result) => {
	// 		if (err) {
	// 			console.log('Unable to insert user', err);
	// 			return;
	// 		}

	// 		console.log(JSON.stringify(result.ops[0]._id, undefined, 2));
	// 	},
	// );

	client.close();
});
