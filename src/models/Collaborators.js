const mongoose = require('mongoose');

const CollaboratorsSchema = new mongoose.Schema({
  isAdmin: {
    type: Boolean,
    default: false
  },
  company: {
    type: String,
    required: true
  },
  
  points: {
    type: [
      {
        type: {
          type: String,
          required: true
        },
        hours: {
          type: String,
          required: true
        },
        date: {
          type: Date,
          default: Date.now(),
          required: true
        },
      }
    ],
    default: []
  },

  cpf: {
    type: String,
    required: true
  },
  
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: false,
    select: false
  },

  address: {
    type: String,
    required: true
  },

  role: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model('collaborators', CollaboratorsSchema);