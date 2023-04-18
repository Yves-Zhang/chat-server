import { Request, Response } from 'express';
import type { ChatMessage, chatReplyProcess } from './chatgpt'

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
    return await chatReplyProcess({
      message: prompt,
      lastContext: options,
      process: (chat: ChatMessage) => {
        res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
        firstChunk = false
      },
      systemMessage,
    })
  }
  catch (error) {
    return JSON.stringify(error)
  }
}