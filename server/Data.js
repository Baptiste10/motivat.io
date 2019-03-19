// /backend/data.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const DataSchema = new Schema(
  {
    id: Number,
    message: String
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Transcripts", new Schema({}), "Transcripts");
module.exports = mongoose.model("Sentences", new Schema({}), "Sentences");
module.exports = mongoose.model("Clauses", new Schema({}), "Clauses");

module.exports = mongoose.model("Data", DataSchema);

