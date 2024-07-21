import { app, connectDb } from "./app";
import { SETTINGS } from "./settings";

app.listen(SETTINGS.PORT, async () => {
  await connectDb();
  console.log("...server started in port " + SETTINGS.PORT);
});

// http://localhost:3003/
// ssh -R 80:localhost:3003 serveo.net
