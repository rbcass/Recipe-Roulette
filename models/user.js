const { default: mongoose } = require("mongoose")
mongoose.connect('')

const userSchema = new mongoose.Schema({

    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    
  });
  
  const User = mongoose.model('user', userSchema);
  
  module.exports = User;