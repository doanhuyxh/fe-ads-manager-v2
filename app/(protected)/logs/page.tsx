'use client'

import { useState, useEffect } from "react"
import { Table, Card, Typography, Empty, Spin, Alert, Tag, Pagination, Input, Button } from "antd"
import { ReloadOutlined, SearchOutlined, ClockCircleOutlined, InfoCircleOutlined } from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import { getLog } from "../../../libs/ApiClient/LogApi"
import { LogData } from "../../../libs/types/LogRespone"

const { Title, Text } = Typography

export default function Page() {
    const [data, setData] = useState<LogData[]>([])
    const [loading, setLoading] = useState(false)
    const [searchText, setSearchText] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalLogs, setTotalLogs] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const limit = 10

    useEffect(() => {
        fetchLogs()
    }, [currentPage, searchText])

    const fetchLogs = async () => {
        setLoading(true)
        try {
            const res = await getLog(
                currentPage,
                limit,
                searchText
            )
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
            render: (_, record) => {
                return <Tag color={getLogLevelColor(record.level)} className="uppercase font-medium">{record.level}</Tag>
            }
        },
        {
            title: "Message",
            dataIndex: "message",
            key: "message",
            render: (message: string) => <Text className="text-sm">{message}</Text>
        },
    ]

    return (

        <div className="px-8 py-4 max-w-[800px]">
            <div className="mb-6 flex flex-col items-center">
                <Title level={2} className="flex items-center gap-3">
                    <InfoCircleOutlined />
                    System Logs
                </Title>
                <Text type="secondary">Monitor and analyze system activities and events</Text>
            </div>

            <Card className="!mb-4 !p-2">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <Input
                        placeholder="Search logs..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => {
                            setCurrentPage(1)
                            setSearchText(e.target.value)
                        }}
                        allowClear
                        className="max-w-xs"
                    />
                    <Button icon={<ReloadOutlined />} onClick={fetchLogs} loading={loading} type="primary">
                        Refresh
                    </Button>
                </div>
            </Card>

            <Card className="!pb-2">
                <Spin spinning={loading}>
                    {data.length === 0 ? (
                        <Empty description="No logs found" className="py-12" />
                    ) : (
                        <>
                            <Table
                                columns={columns}
                                dataSource={data}
                                pagination={false}
                                scroll={{ x: 800 }}
                                rowKey={(record) => record._id}
                                rowClassName={(record) => {
                                    const level = record.message
                                    return level === "error"
                                        ? "bg-red-50"
                                        : level === "warning"
                                            ? "bg-orange-50"
                                            : level === "success"
                                                ? "bg-green-50"
                                                : ""
                                }}
                            />
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-6">
                                    <Pagination
                                        current={currentPage}
                                        total={totalLogs}
                                        pageSize={limit}
                                        showSizeChanger={false}
                                        onChange={(page) => setCurrentPage(page)}
                                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} logs`}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </Spin>
            </Card>
        </div>

    )
}
