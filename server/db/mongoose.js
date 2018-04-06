const mongoose = require('mongoose');

// prefer promises over callbacks. They're easier to manage and scale
// The line below tells mongoose to user the global promises that come
// with javascript
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
	mongoose,
};
