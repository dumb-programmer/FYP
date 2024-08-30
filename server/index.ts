import app from "./app";
import { io } from "./socket";
import "./setupMongo";

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});

io.listen(3001);