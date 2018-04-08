const expect = require('expect');
const request = require('supertest');
const { ObjectId } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');

const todos = [
	{ text: 'First test todo', _id: new ObjectId() },
	{
		text: 'Second test todo',
		_id: new ObjectId(),
		completed: true,
		completedAt: 333,
	},
];

beforeEach(done => {
	Todo.remove({})
		.then(() => {
			Todo.insertMany(todos);
			return;
		})
		.then(() => done());
});

describe('POST /todos', () => {
	it('should create a new todo', done => {
		const text = 'Test todo text';
		request(app)
			.post('/todos')
			.send({ text })
			.expect(200)
			.expect(res => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if (err) {
					done(err);
					return;
				}
				Todo.find({ text })
					.then(todos => {
						expect(todos.length).toBe(1);
						expect(todos[0].text).toBe(text);
						done();
					})
					.catch(err => done(err));
			});
	});

	it('should not create todo with invalid body data', done => {
		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end((err, res) => {
				if (err) {
					done(err);
					return;
				}
				Todo.find()
					.then(todos => {
						expect(todos.length).toBe(2);
						done();
					})
					.catch(err => done(err));
			});
	});
});

describe('GET /todos', () => {
	it('should return all documents in the TodoApp database', done => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect(res => {
				expect(res.body.todos.length).toBe(2);
			})
			.end(done);
	});
});

describe('GET /todos/:id', () => {
	it('should return todo based on params.id', done => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect(res => {
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end(done);
	});

	it('should return 404 if todo not found', done => {
		const hexId = new ObjectId().toHexString();

		request(app)
			.get(`/todos/${hexId}`)
			.expect(404)
			.end(done);
	});

	it('should return 404 for non-object ids', done => {
		request(app)
			.get('/todos/123abc')
			.expect(404)
			.end(done);
	});
});

describe('DELETE /todos/:id', () => {
	it('should remove a todo by the id', done => {
		const hexId = todos[1]._id.toHexString();

		request(app)
			.delete(`/todos/${hexId}`)
			.expect(200)
			.expect(res => {
				expect(res.body._id).toBe(hexId);
			})
			.end((err, res) => {
				if (err) {
					done(err);
					return;
				}
				Todo.findById(hexId)
					.then(todo => {
						expect(todo).toNotExist();
						done();
					})
					.catch(err => done(err));
			});
	});

	it('should return 404 if todo not found', done => {
		const hexId = todos[1]._id.toHexString();
		request(app)
			.delete(`/todos/${hexId}`)
			.expect(404)
			.expect(done);
	});

	it('should return 404 if object id is invalid', done => {
		const hexId = todos[1]._id.toHexString();
		request(app)
			.delete(`/todos/${hexId}`)
			.expect(404)
			.expect(done);
	});
});

describe('PATCH /todos/:id', () => {
	it('should update the todo', done => {
		const id = todos[0]._id.toHexString();
		request(app)
			.patch(`/todos/${id}`)
			.send({ text: "Go get Philippe's food", completed: true })
			.expect(200)
			.expect(res => {
				console.log(res.body);
				expect(res.body.text).toBe("Go get Philippe's food");
				expect(res.body.completed).toBe(true);
				expect(res.body.completedAt).toBeA('number');
			})
			.end(done);
	});

	it('should clear completed at when todo is not completed', done => {
		const id = todos[1]._id.toHexString();
		request(app)
			.patch(`/todos/${id}`)
			.send({ text: 'This is the new text', completed: false })
			.expect(200)
			.expect(res => {
				expect(res.body.text).toBe('This is the new text');
				expect(res.completed).toNotExist();
			})
			.end((err, res) => {
				if (err) {
					done(err);
					return;
				}
				done();
			});
	});
});
