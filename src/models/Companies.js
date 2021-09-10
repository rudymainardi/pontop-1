const mongoose = require('mongoose');

const CompaniesSchema = new mongoose.Schema({
  cnpj: {
    type: String,
    required: true,
    unique: true,
  },
  socialReason: {
    type: String,
    required: true,
  },
  fantasyName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  collaborators: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model('Companies', CompaniesSchema);