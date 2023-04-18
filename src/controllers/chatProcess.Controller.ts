import { Body, JsonController, Post, Res, UseBefore } from "routing-controllers";
import { auth } from "../middleWares/auth";
import { Response } from "express";
import { chatService } from "../services/chatProcess.service";

@JsonController('/chat-process')
export class ChatProcess {
  @Post()
  @UseBefore(auth)
  async index(@Body() body: any, @Res() res: Response) {
    const { prompt, options, systemMessage } = body
    await chatService({ prompt, options, systemMessage }, res)
  }
}
