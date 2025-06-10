export interface LogData {
    _id: string;
    time: string;
    level: string;
    message: string;
}

export default interface LogRespone {
    logs: LogData[],
    total: number,
    page: number,
    totalPages: number
}

