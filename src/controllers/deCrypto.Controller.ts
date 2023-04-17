import { Get, QueryParam, JsonController } from 'routing-controllers';
import { enCrypto } from "../utils/crypt"

@JsonController('/decrypt')
export class DeCrypto {

  @Get('/')
  async index(@QueryParam('key') key: string) {
    const decryptKey = enCrypto(key)
    const result = {
      key: decryptKey,
    };
    return result;
  }
}

