import { JsonController, Get } from "routing-controllers";

@JsonController('/login')
export class Login {
  @Get("/")
  index() {
    return { message: "Hello, World!" };
  }
}
