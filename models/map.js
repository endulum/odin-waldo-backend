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

    xLeftBound: {
      type: Number,
      immutable: true,
      required: true
    },

    xRightBound: {
      type: Number,
      immutable: true,
      required: true
    },

    yUpperBound: {
      type: Number, 
      immutable: true,
      required: true
    },

    yLowerBound: {
      type: Number, 
      immutable: true,
      required: true
    }
  }]
});

export default mongoose.model('Map', MapSchema);