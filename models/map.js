import mongoose from "mongoose";

const Schema = mongoose.Schema;

const MapSchema = new Schema({
  mapId: {
    type: String,
    immutable: true,
    required: true
  },

  characters: [{
    name: {
      type: String,
      immutable: true,
      required: true
    },

    x: {
      type: Number,
      immutable: true,
      required: true
    },

    y: {
      type: Number, 
      immutable: true,
      required: true
    }
  }]
});

export default mongoose.model('Map', MapSchema);