import { JsonController, Get } from "routing-controllers";

@JsonController('/chat-process')
export class ChatProcess {
  @Get("/")
  index() {
    return { message: "Hello, chat-process!" };
  }
}
