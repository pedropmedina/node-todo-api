const expect = require('expect');
const request = require('supertest');

const { app } = require('../server');
const { Todo } = require('../models/todo');

const todos = [{ text: 'First test todo' }, { text: 'Second test todo' }];

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