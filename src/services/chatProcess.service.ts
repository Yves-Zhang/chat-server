import { Response } from 'express'
import type { ChatMessage } from './chatgpt'
import { chatReplyProcess } from './chatgpt'
import wrapResponse from '../utils/wrapResponse'

interface Configs {
  prompt: string
  options: any
  systemMessage: any
}

export async function chatService(config: Configs, res: Response) {
  res.setHeader('Content-type', 'application/octet-stream')
  try {
    const { prompt, options = {}, systemMessage } = config
    let firstChunk = true
    const chatRes = await chatReplyProcess({
      message: prompt,
      lastContext: options,
      process: (chat: ChatMessage) => {
        res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
        firstChunk = false
      },
      systemMessage,
    })

    console.log(chatRes, 111)

    return wrapResponse({
      code: 0,
      data: 'success',
      message: 'success',
      success: true
    });
  }
  catch (error) {
    console.log(error, 222)
    return wrapResponse({
      code: 999,
      data: 'null',
      message: 'error',
      success: false
    });
  }
}