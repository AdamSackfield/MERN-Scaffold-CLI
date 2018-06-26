const Schema = require('mongoose').Schema()

const [MODELNAME]Schema = new Schema({
  [FIRSTNAME]: {
    type: String,
    required: true
  },
  [LASTNAME]: {
    type: String,
    required: true
  },
  [USERNAME]: {
    type: String,
    required: true
  },
  [EMAIL]: {
    type: String,
    required: true
  },
  [ADDRESS]: {
    type: Object
  },
  [PHONENUMBER]: {
    type: Number
  },
  [BIRTHDATE]: {
    type: Date
  },
  [HASHEDPASSWORD]: {
    type: String,
    required: true
  }
})

const [MODELNAME] = module.exports = mongoose.model('User', [MODELNAME]Schema)

