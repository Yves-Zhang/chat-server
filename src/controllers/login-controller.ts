import { JsonController, Get } from "routing-controllers";

@JsonController()
export class LoginController {
  @Get("/")
  index() {
    return { message: "Hello, World!" };
  }
}
