
export default interface ApiResponse<T = any> {
  status: boolean;
  data: T | null;
  message: string;
}