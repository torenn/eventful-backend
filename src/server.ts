import app from "./app";
import dotenv from "dotenv";

dotenv.config(); // This loads the .env file

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
