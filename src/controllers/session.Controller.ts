import { JsonController, Post } from "routing-controllers";

@JsonController('/session')
export class Session {
  @Post("/")
  index() {
    return { message: "Hello, session!" };
  }
}
