export default interface ScheduleData {
  _id: string
  time: string // HH:mm format
  startDate: string // YYYY-MM-DD format
  keywords: string
  accountId: string
  chatZaloId: string // Thêm trường này
  status: "active" | "inactive"
}
