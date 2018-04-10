// bring in the config file to be use as soon as we run the server
require('./config/config');

const express = require('express');
const { ObjectId } = require('mongodb');
const _ = require('lodash');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();
const port = process.env.PORT;

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ----------------- //
// ----- Todos ----- //
// ----------------- //
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
// always send an object to the client as it allows for us to add more properties to the client in the future if needed versus sending an array which limits us as we can't add to it. THIS MAKES A LOT OF SENSE!
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

// remove todo
app.delete('/todos/:id', (req, res) => {
	const id = req.params.id;
	if (!ObjectId.isValid(id)) {
		res.status(404).send();
		return;
	}
	Todo.findByIdAndRemove(id)
		.then(todo => {
			if (!todo) {
				res.status(404).send();
				return;
			}
			res.status(200).send(todo);
		})
		.catch(err => {
			res.status(400).send();
		});
});

// update todo
app.patch('/todos/:id', (req, res) => {
	const id = req.params.id;
	const body = _.pick(req.body, ['text', 'completed']);

	if (!ObjectId.isValid(id)) {
		res.status(404).send();
		return;
	}

	if (_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}

	Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
		.then(todo => {
			if (!todo) {
				res.status(404).send();
			}

			res.send(todo);
		})
		.catch(err => res.status(400).send());
});

// ----------------- //
// ------ User ----- //
// ----------------- //
// POST /users
app.post('/users', (req, res) => {
	const body = _.pick(req.body, ['email', 'password']);
	const user = new User(body);

	user
		.save()
		.then(() => {
			return user.generateAuthToken();
		})
		.then(token => {
			res.header('x-auth', token).send(user);
		})
		.catch(err => {
			res.status(400).send(err);
		});
});

app.listen(port, () => {
	console.log(`Server up in port ${port}`);
});

module.exports = { app };
