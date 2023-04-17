import { Response } from "express"
import { Body, JsonController, Post, Res } from "routing-controllers"
import { CreateUserDto } from "../dto/loginDto"
import { checkoutApiKey } from "../services/login.service"

@JsonController('/login')
export class Login {
  @Post("/")
  async index(@Body() body: CreateUserDto, @Res() res: Response) {
    const { key } = body;
    const checkout = await checkoutApiKey(key, res)
    return checkout
  }
}
