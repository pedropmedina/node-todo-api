const validator = require('validator');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const userSchema = new Schema({
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
});

// With toObject() mongoose converts the Schema into an object. Here we are using it to return an object with the properties we want to send to the user and ommiting the rest of the properties. In this case we are overwriting the existing toJSON() method from mongoose to make it return what we want instead of the whole thing when the toJSON() method is called
userSchema.methods.toJSON = function() {
	const user = this;
	const userObject = user.toObject();

	return _.pick(userObject, ['_id', 'email']);
};

// In .methods we can add methods onto this instance of the Schema
// we user a function statement instead of an arrow function because we need the this keyword bound to the instance and the arrow functions does not have the this keyword
userSchema.methods.generateAuthToken = function() {
	const user = this;
	const access = 'auth';
	const token = jwt
		.sign({ _id: user._id.toHexString(), access }, 'abc123')
		.toString();

	user.tokens = [...user.tokens, { access, token }];

	return user.save().then(() => {
		return token;
	});
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
