import { JsonController, Post, Req, Res, UseBefore } from "routing-controllers";
import { auth } from "../middleWares/auth";
import { checkoutApiKey } from "../services/login.service";
import { Request, Response } from "express";

@JsonController('/session')
export class Session {
  @Post()
  @UseBefore(auth)
  async index(@Req() req: Request, @Res() res: Response) {
    const chatkey = req.cookies?.chatkey
    const AUTH_SECRET_KEY = chatkey
    const checkout = await checkoutApiKey(AUTH_SECRET_KEY, res)
    return checkout
  }
}
