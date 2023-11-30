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
    imageUrl: {
        type: String,
        required: true,
    },
    totalTime:{
        type: Number,
        required: true

    }
})
const Recipe = mongoose.model('recipe', recipeSchema);

module.exports = Recipe;