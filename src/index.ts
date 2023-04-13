import "reflect-metadata";
import { createExpressServer } from "routing-controllers";

const port = process.env.PORT || 3002;

const app = createExpressServer({
  controllers: [],
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
