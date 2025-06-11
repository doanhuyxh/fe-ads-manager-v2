export default interface ScheduleData {
  _id: string
  name:string
  time: string // HH:mm format
  startDate: string // YYYY-MM-DD format
  keywords: string
  typeSchedule: string
  accountId: string
  chatZaloId: string // Thêm trường này
  status: "active" | "inactive"
  templateZalo: string
  distance: number,
  lastRun:string
}
