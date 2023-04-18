import { JsonController, Post, UseBefore } from "routing-controllers";
import { auth } from "../middleWares/auth";

@JsonController('/chat-process')
export class ChatProcess {

  @Post("/")
  @UseBefore(auth)
  index() {
    return { message: "Hello, chat-process!" };
  }
}
