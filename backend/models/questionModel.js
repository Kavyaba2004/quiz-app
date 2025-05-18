const mongoose = require("mongoose");

const questionSchema = mongoose.Schema(
  {
    language_id: { type: String, required: true },
    category: { type: String, required: true },
    desc: { type: String, required: true },
    options: {
      type: [String],
      required: true,
    },
    answer: { type: String, required: true },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
