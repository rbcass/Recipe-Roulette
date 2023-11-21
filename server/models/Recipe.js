const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({

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
    imageURL: {type: String},
    totalTime:{
        type: Number,
        required: true

    }
})
const Recipe = mongoose.model('recipe', recipeSchema);

module.exports = Recipe;