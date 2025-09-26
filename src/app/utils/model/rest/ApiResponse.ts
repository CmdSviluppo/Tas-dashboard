export type ApiResponse<T> = {
  success: boolean,
  code: string,
  message: string,
  data: T,
  traceId: string,
  errors?: string []
}
