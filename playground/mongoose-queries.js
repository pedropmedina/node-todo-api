const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');

const id = '5ac7fbcdef4c16d29d6fb50b';

Todo.find({
	_id: id,
}).then(todos => {
	console.log('Todos', todos);
});

Todo.findOne({
	_id: id,
}).then(todo => {
	console.log(todo);
});
