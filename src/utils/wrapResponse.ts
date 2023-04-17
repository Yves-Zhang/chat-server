export interface ResponseData {
  code: number;
  success: boolean;
  message: string;
  data?: any;
}

export default function wrapResponse(data: ResponseData): ResponseData {
  return { code: data.code, success: data.success, message: data.message, data: data.data };
}