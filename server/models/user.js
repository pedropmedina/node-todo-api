const validator = require('validator');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = {
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email',
		},
	},
	password: {
		type: String,
		require: true,
		minlength: 6,
	},
	tokens: [
		{
			access: { type: String, require: true },
			token: { type: String, require: true },
		},
	],
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
