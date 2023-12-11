const mongoose = require('mongoose')
const User = require('./User');
const Comment = require('./Comment');

const recipeSchema = new mongoose.Schema({
//link user to recipe
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    ingredients: {
        type: [String],
        required: true,
    },
    instructions: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    totalTime:{
        type: Number,
        required: true

    },
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            text: {type: String},
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
})
const Recipe = mongoose.model('recipe', recipeSchema);

module.exports = Recipe;