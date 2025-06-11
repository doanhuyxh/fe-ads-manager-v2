'use client'

import { useState, useEffect } from "react"
import { Table, Card, Typography, Empty, Spin, Tag, Pagination, Input, Button } from "antd"
import { ReloadOutlined, SearchOutlined, ClockCircleOutlined, InfoCircleOutlined } from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import { getLog } from "../../../libs/ApiClient/LogApi"
import { LogData } from "../../../libs/types/LogRespone"
import { useMediaQuery } from 'react-responsive'

const { Title, Text } = Typography

export default function Page() {
    const [data, setData] = useState<LogData[]>([])
    const [loading, setLoading] = useState(false)
    const [searchText, setSearchText] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalLogs, setTotalLogs] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const limit = 10

    const isMobile = useMediaQuery({ maxWidth: 639 })

    useEffect(() => {
        fetchLogs()
    }, [currentPage, searchText])

    const fetchLogs = async () => {
        setLoading(true)
        try {
            const res = await getLog(currentPage, limit, searchText)
            if (res.status) {
                setData(res.data?.logs || [])
                setTotalLogs(res.data?.total || 0)
                setTotalPages(res.data?.totalPages || 1)
            }
        } catch (error) {
            console.error("Error fetching logs:", error)
        } finally {
            setLoading(false)
        }
    }

    const getLogLevelColor = (level: string) => {
        switch (level) {
            case "error":
                return "red"
            case "warning":
                return "orange"
            case "success":
                return "green"
            default:
                return "blue"
        }
    }

    const columns: ColumnsType<LogData> = [
        {
            title: "Time",
            dataIndex: "time",
            key: "time",
            width: 180,
            render: (time: string) => (
                <div className="flex items-center gap-2">
                    <ClockCircleOutlined className="text-gray-400" />
                    <Text code className="text-sm !text-red-800">{time}</Text>
                </div>
            )
        },
        {
            title: "Level",
            key: "level",
            width: 100,
            render: (_, record) => (
                <Tag color={getLogLevelColor(record.level)} className="uppercase font-medium">
                    {record.level}
                </Tag>
            )
        },
        {
            title: "Message",
            dataIndex: "message",
            key: "message",
            render: (message: string) => <Text className="text-sm">{message}</Text>
        },
    ]

    return (
        <div className="px-4 sm:px-8 py-4 max-w-7xl m-auto">
            {/* Header */}
            <div className="mb-6 text-center">
                <Title level={2} className="flex items-center justify-center gap-3">
                    <InfoCircleOutlined />
                    System Logs
                </Title>
                <Text type="secondary">Monitor and analyze system activities and events</Text>
            </div>

            {/* Controls */}
            <Card className="!mb-4 !p-4">
                <div className="flex flex-col sm:flex-row gap-4 sm:justify-between items-stretch sm:items-center">
                    <Input
                        placeholder="Search logs..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => {
                            setCurrentPage(1)
                            setSearchText(e.target.value)
                        }}
                        allowClear
                        className="w-full sm:max-w-xs"
                    />
                    <Button icon={<ReloadOutlined />} onClick={fetchLogs} loading={loading} type="primary" className="w-full sm:w-auto">
                        Refresh
                    </Button>
                </div>
            </Card>

            {/* Logs */}
            <Card className="!p-3">
                <Spin spinning={loading}>
                    {data.length === 0 ? (
                        <Empty description="No logs found" className="py-12" />
                    ) : (
                        <>
                            {isMobile ? (
                                <div className="flex flex-col gap-3">
                                    {data.map((log) => (
                                        <Card
                                            key={log._id}
                                            size="small"
                                            className={`!p-1 ${log.level === "error"
                                                ? "border-red-500 bg-red-50"
                                                : log.level === "warning"
                                                    ? "border-orange-500 bg-orange-50"
                                                    : log.level === "success"
                                                        ? "border-green-500 bg-green-50"
                                                        : "border-blue-500 bg-blue-50"
                                                }`}
                                        >
                                            <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                                                <ClockCircleOutlined />
                                                {log.time}
                                                <Tag color={getLogLevelColor(log.level)}>{log.level}</Tag>
                                            </div>
                                            <div className="font-semibold text-sm mb-1">{log.message}</div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Table
                                    columns={columns}
                                    dataSource={data}
                                    pagination={false}
                                    rowKey={(record) => record._id}
                                    scroll={{ x: '100%' }}
                                    rowClassName={(record) => {
                                        const level = record.level
                                        return level === "error"
                                            ? "bg-red-50"
                                            : level === "warning"
                                                ? "bg-orange-50"
                                                : level === "success"
                                                    ? "bg-green-50"
                                                    : ""
                                    }}
                                />
                            )}


                            {totalPages > 1 && (
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-6">
                                    <Pagination
                                        current={currentPage}
                                        total={totalLogs}
                                        pageSize={limit}
                                        showSizeChanger={false}
                                        onChange={(page) => setCurrentPage(page)}
                                        className="flex-1"
                                    />
                                    <div className="text-center sm:text-right text-sm text-gray-600">
                                        {`${(currentPage - 1) * limit + 1}-${Math.min(currentPage * limit, totalLogs)} of ${totalLogs} logs`}
                                    </div>
                                </div>

                            )}
                        </>
                    )}
                </Spin>
            </Card>
        </div>
    )
}
