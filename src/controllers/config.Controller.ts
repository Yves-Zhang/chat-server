import { JsonController, Post } from "routing-controllers";

@JsonController('/config')
export class Config {
  @Post("/")
  index() {
    return { message: "Hello, config!" };
  }
}
