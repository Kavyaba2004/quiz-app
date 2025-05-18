const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Language = require("./models/languageModel");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    const languages = [
      { language: "Python" },
      { language: "Java" },
      { language: "C" },
      { language: "C++" },
      { language: "JavaScript" },
    ];

    await Language.insertMany(languages);
    console.log("Languages inserted successfully!");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("Error inserting languages:", err);
  });
