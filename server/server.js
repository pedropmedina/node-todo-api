const express = require('express');
const { ObjectId } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();
const port = process.env.PORT || 3001;

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// post route
app.post('/todos', (req, res) => {
	const todo = new Todo({
		text: req.body.text,
	});

	todo.save().then(
		doc => {
			res.send(doc);
		},
		err => {
			res.status(400).send(err);
		},
	);
});

// get all todos route
// always send an object as it allows for us to add more properties to the client in the future if needed versus sending an array which limits us as we can't add to it. THIS MAKES A LOT OF SENSE!
app.get('/todos', (req, res) => {
	Todo.find().then(
		todos => {
			res.send({ todos });
		},
		err => {
			res.status(400).send(err);
		},
	);
});

// get todo by id in params
app.get('/todos/:id', (req, res) => {
	const id = req.params.id;

	if (!ObjectId.isValid(id)) {
		res.status(404).send();
		return;
	}
	Todo.findById(id)
		.then(todo => {
			if (!todo) {
				res.status(404).send();
				return;
			}
			res.send({ todo });
		})
		.catch(err => res.status(404).send());
});

app.listen(port, () => {
	console.log(`Server up in port ${port}`);
});

module.exports = { app };
