// // import * as dotenv from 'dotenv'
import type { ChatGPTAPIOptions, ChatMessage, SendMessageOptions } from 'chatgpt'
import { ChatGPTAPI } from 'chatgpt'
import type { RequestOptions, ApiModel, ChatContext, ModelConfig } from './types'
import { isNotEmptyString } from '../../utils/is'
import { sendResponse } from './sendResponse'
import request from '../../utils/request'


// 读取环境变量配置
// dotenv.config()

const ErrorCodeMessage: Record<string, string> = {
  401: '[OpenAI] 提供错误的API密钥 | Incorrect API key provided',
  403: '[OpenAI] 服务器拒绝访问，请稍后再试 | Server refused to access, please try again later',
  502: '[OpenAI] 错误的网关 |  Bad Gateway',
  503: '[OpenAI] 服务器繁忙，请稍后再试 | Server is busy, please try again later',
  504: '[OpenAI] 网关超时 | Gateway Time-out',
  500: '[OpenAI] 服务器繁忙，请稍后再试 | Internal Server Error',
}

const timeoutMs: number = 30 * 1000

async function getApi() {
  let apiModel: ApiModel
  let api: ChatGPTAPI

  const model = 'gpt-3.5-turbo'
  const OPENAI_API_BASE_URL = 'https://new-bility.com'

  const options: ChatGPTAPIOptions = {
    apiKey: '',
    completionParams: { model },
    debug: false,
    maxModelTokens: 32768,
    maxResponseTokens: 8192,
    apiBaseUrl: `${OPENAI_API_BASE_URL}/v1`
  }

  const { ChatGPTAPI } = await import('chatgpt')
  api = new ChatGPTAPI({ ...options })
  return { apiModel, api: '' }
}

async function chatReplyProcess(options: RequestOptions) {
  let { apiModel, api }: { apiModel: string | undefined; api: any } = await getApi()
  const { message, lastContext, process, systemMessage } = options
  try {
    let options: SendMessageOptions = { timeoutMs }

    if (apiModel === 'ChatGPTAPI') {
      if (isNotEmptyString(systemMessage))
        options.systemMessage = systemMessage
    }

    if (lastContext != null) {
      if (apiModel === 'ChatGPTAPI')
        options.parentMessageId = lastContext.parentMessageId
      else
        options = { ...lastContext }
    }

    const response = await api.sendMessage(message, {
      ...options,
      onProgress: (partialResponse: any) => {
        process?.(partialResponse)
      },
    })

    return sendResponse({ type: 'Success', data: response })
  }
  catch (error: any) {
    const code = error.statusCode
    global.console.log(error)
    if (Reflect.has(ErrorCodeMessage, code))
      return sendResponse({ type: 'Fail', message: ErrorCodeMessage[code] })
    return sendResponse({ type: 'Fail', message: error.message ?? 'Please check the back-end console' })
  }
}

async function fetchBalance() {
  // 计算起始日期和结束日期

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY
  const OPENAI_API_BASE_URL = process.env.OPENAI_API_BASE_URL

  if (!isNotEmptyString(OPENAI_API_KEY))
    return Promise.resolve('-')

  const API_BASE_URL = isNotEmptyString(OPENAI_API_BASE_URL)
    ? OPENAI_API_BASE_URL
    : 'https://api.openai.com'

  const [startDate, endDate] = formatDate()

  // 每月使用量
  const urlUsage = `${API_BASE_URL}/v1/dashboard/billing/usage?start_date=${startDate}&end_date=${endDate}`

  const headers = {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  }

  try {
    // 获取已使用量
    const useResponse: any = await request.post(urlUsage, { headers })
    const usage = Math.round(useResponse.total_usage) / 100
    return Promise.resolve(usage ? `$${usage}` : '-')
  }
  catch {
    return Promise.resolve('-')
  }
}

function formatDate(): string[] {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const lastDay = new Date(year, month, 0)
  const formattedFirstDay = `${year}-${month.toString().padStart(2, '0')}-01`
  const formattedLastDay = `${year}-${month.toString().padStart(2, '0')}-${lastDay.getDate().toString().padStart(2, '0')}`
  return [formattedFirstDay, formattedLastDay]
}

async function chatConfig() {
  const balance = await fetchBalance()
  return sendResponse<ModelConfig>({
    type: 'Success',
    data: { balance },
  })
}

export type { ChatContext, ChatMessage }
export { chatReplyProcess, chatConfig }
