import { AxiosError } from 'axios';
import chalk from 'chalk';
import request from '../utils/request'
import { Response } from 'express';
import { deCrypto, enCrypto } from '../utils/crypt';
import wrapResponse, { ResponseData } from '../utils/wrapResponse';

const apiEndpoint = 'https://new-bility.com/openai/v1/chat/completions';
const params = {
  "model": "gpt-3.5-turbo",
  "messages": [{ "role": "user", "content": "this is a test!" }
  ]
}
export async function checkoutApiKey(chatKey: string, res: Response): Promise<any> {
  // 如果cookie中没有chatkey，则返回错误
  if (!chatKey) {
    // response.status(401).send('Unauthorized');
    return wrapResponse({ code: 111, data: null, message: 'Unauthorized', success: false });
  }
  // 解密chatkey，获取openai key值
  const openaiKey = deCrypto(chatKey);
  // 调用OpenAI API验证openai key值是否合法
  try {
    request.defaults.headers.common['Authorization'] = `Bearer ${openaiKey}`;
    const ckeckoutRes: any = await request.post(apiEndpoint, params);
    // 如果验证通过，继续处理请求
    const deKey = enCrypto(chatKey)
    res.cookie("chatkey", deKey); // 将加密后的key设置到cookie中
    console.log(chalk.magenta(`\nGPT response: ` + ckeckoutRes.choices[0]?.message?.content))
    console.log(chalk.blue(`openaiKey: ${openaiKey} 检测成功 \n`))
    const responseData: ResponseData = { code: 200, success: true, message: "Login successful" };
    return wrapResponse(responseData); // 包装并返回
  } catch (error) {
    console.log(error)
    // 清空用户cookie
    res.clearCookie('chatkey');
    if (error instanceof AxiosError) {
      const { response } = error
      return wrapResponse({
        code: response?.status || 999,
        data: response?.data?.error,
        message: response?.statusText || 'error',
        success: false
      });
    }
  }
}