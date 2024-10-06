const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  SessionID: { type: mongoose.Schema.Types.ObjectId, ref: 'ConversationSession', required: true  },
  administrative_area: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  continent: {
    type: String,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lon: {
    type: Number,
    required: true
  },
  links: {
    type: [String], // Mảng các đường link liên quan đến địa điểm
    required: true
  },
  summaries: {
    type: [String], // Mảng tóm tắt các thông tin liên quan đến địa điểm
    required: true
  },
  sentiment: {
    type: String, // Giá trị cảm xúc, ví dụ: 'positive', 'neutral', 'negative'
    enum: ['positive', 'neutral', 'negative'],
    required: true
  }
}, { timestamps: true });

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
