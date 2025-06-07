//(protected)/scheduler/page.tsx
"use client"

import { useState, useEffect } from "react"
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    Space,
    message,
    Popconfirm,
    Tag,
    TimePicker,
    DatePicker,
} from "antd"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faPlus,
    faEdit,
    faTrash,
    faEye,
    faClock,
    faCalendar,
    faUser,
    faPlay,
    faPause,
    faMessage
} from "@fortawesome/free-solid-svg-icons"
import dayjs from "dayjs"
import ScheduleData from "../../../libs/types/Schedule"
import { getCompany } from "../../../libs/ApiClient/CompanyApi"
import { getTemplateZalo } from "../../../libs/ApiClient/TemplateZaloApi"
import { getSchedule, saveSchedule, deleteSchedule, updateSchedule } from "../../../libs/ApiClient/ScheduleApi"
import Company from "../../../libs/types/Company"

interface TemplateZaloItem {
    id: string;
    name: string;
}

export default function SchedulerPage() {
    const [schedules, setSchedules] = useState<ScheduleData[]>([])
    const [availableAccounts, setAvailableAccounts] = useState<Company[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isViewModalVisible, setIsViewModalVisible] = useState(false)
    const [editingSchedule, setEditingSchedule] = useState<ScheduleData | null>(null)
    const [viewingSchedule, setViewingSchedule] = useState<ScheduleData | null>(null)
    const [templateZalo, setTemplateZalo] = useState<TemplateZaloItem[]>([]);
    const [form] = Form.useForm()

    const showAddModal = () => {
        setEditingSchedule(null)
        form.resetFields()
        setIsModalVisible(true)
    }

    const showEditModal = (schedule: ScheduleData) => {
        setEditingSchedule(schedule)
        form.setFieldsValue({
            name: schedule.name,
            time: dayjs(schedule.time, "HH:mm"),
            startDate: dayjs(schedule.startDate),
            keywords: schedule.keywords,
            accountId: schedule.accountId,
            chatZaloId: schedule.chatZaloId,
            status: schedule.status,
            templateZalo: schedule.templateZalo
        })
        setIsModalVisible(true)
    }

    const showViewModal = (schedule: ScheduleData) => {
        setViewingSchedule(schedule)
        setIsViewModalVisible(true)
    }

    const handleSubmit = async (values: any) => {
        try {
            const scheduleData = {
                time: values.time.format("HH:mm"),
                name: values.name,
                startDate: values.startDate.format("YYYY-MM-DD"),
                keywords: values.keywords,
                accountId: values.accountId,
                chatZaloId: values.chatZaloId,
                status: values.status || "active",
                templateZalo: values.templateZalo
            }

            if (editingSchedule) {
                // Cập nhật schedule
                setSchedules(
                    schedules.map((schedule) =>
                        schedule._id === editingSchedule._id ? { ...schedule, ...scheduleData } : schedule,
                    ),
                )
                await saveSchedule({ "_id": editingSchedule._id, ...scheduleData })
                message.success("Cập nhật lịch trình thành công!")
            } else {
                // Thêm schedule mới
                const newSchedule: ScheduleData = {
                    _id: '',
                    ...scheduleData,
                }
                await saveSchedule({ ...newSchedule })
                await initSheduler();
                message.success("Thêm lịch trình thành công!")
            }

            setIsModalVisible(false)
            form.resetFields()
        } catch (error) {
            message.error("Có lỗi xảy ra!")
        }
    }

    const handleDelete = async (id: string) => {
        setSchedules(schedules.filter((schedule) => schedule._id !== id))
        await deleteSchedule(id)
        message.success("Xóa lịch trình thành công!")
    }

    const toggleStatus = async (id: string) => {
        setSchedules(
            schedules.map((schedule) =>
                schedule._id === id ? { ...schedule, status: schedule.status === "active" ? "inactive" : "active" } : schedule,
            ),
        )
        await updateSchedule(id)
        message.success("Cập nhật trạng thái thành công!")
    }

    const getAccountInfo = (accountId: string) => {
        return availableAccounts.find((account) => account._id === accountId)
    }

    const columns = [
        {
            title: "STT",
            key: "index",
            width: 60,
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: "Tên thông báo",
            key: "name",
            dataIndex: "name",
            render: (name: string) => {
                return <div className="">
                    <p className="text-nowrap text-sm text-gray-700 truncate" title={name}>
                        {name}
                    </p>
                </div>
            }
        },
        {
            title: "Giờ chạy",
            dataIndex: "time",
            key: "time",
            render: (time: string) => (
                <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faClock} className="text-blue-500" />
                    <span className="font-mono font-medium">{time}</span>
                </div>
            ),
        },
        {
            title: "Ngày bắt đầu",
            dataIndex: "startDate",
            key: "startDate",
            render: (date: string) => (
                <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faCalendar} className="text-green-500" />
                    <span>{dayjs(date).format("DD/MM/YYYY")}</span>
                </div>
            ),
        },
        {
            title: "Từ khóa",
            dataIndex: "keywords",
            key: "keywords",
            render: (keywords: string) => (
                <div className="max-w-xs">
                    <p className="text-sm text-gray-700 truncate" title={keywords}>
                        {keywords}
                    </p>
                </div>
            ),
        },
        {
            title: "Tài khoản",
            dataIndex: "accountId",
            key: "accountId",
            render: (accountId: string) => {
                const account = getAccountInfo(accountId)
                return account ? (
                    <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                        <div>
                            <p className="font-medium text-sm">{account.name}</p>
                            <p className="text-xs text-gray-500 font-mono">{account.fbToken.substring(0, 15)}...</p>
                        </div>
                    </div>
                ) : (
                    <span className="text-red-500">Không tìm thấy</span>
                )
            },
        },
        {
            title: "Chat Zalo ID",
            dataIndex: "chatZaloId",
            key: "chatZaloId",
            render: (chatZaloId: string) => (
                <span className="font-mono text-sm bg-blue-50 px-2 py-1 rounded text-blue-700">{chatZaloId}</span>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <Tag color={status === "active" ? "green" : "red"} className="font-medium">
                    {status === "active" ? "Đang chạy" : "Tạm dừng"}
                </Tag>
            ),
        },
        {
            title: "Thao tác",
            key: "actions",
            width: 180,
            render: (_: any, record: ScheduleData) => (
                <Space size="small">
                    <Button
                        type="text"
                        size="small"
                        icon={<FontAwesomeIcon icon={faEye} />}
                        onClick={() => showViewModal(record)}
                        className="!text-blue-600 !hover:text-blue-800"
                    />
                    <Button
                        type="text"
                        size="small"
                        icon={<FontAwesomeIcon icon={faEdit} />}
                        onClick={() => showEditModal(record)}
                        className="!text-green-600 !hover:text-green-800"
                    />
                    <Button
                        type="text"
                        size="small"
                        icon={<FontAwesomeIcon icon={record.status === "active" ? faPause : faPlay} />}
                        onClick={() => toggleStatus(record._id)}
                        className={
                            record.status === "active"
                                ? "!text-orange-600 !hover:text-orange-800"
                                : "!text-green-600 !hover:text-green-800"
                        }
                    />
                    <Popconfirm
                        title="Xác nhận xóa"
                        description="Bạn có chắc chắn muốn xóa lịch trình này?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            type="text"
                            size="small"
                            icon={<FontAwesomeIcon icon={faTrash} />}
                            className="!text-red-600 !hover:text-red-800"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    const initCompany = async () => {
        let json_data = await getCompany();
        if (json_data.status) {
            setAvailableAccounts(json_data.data || [])
        } else {
            message.error("Lấy danh sách trang thất bại")
        }
    }

    const initSheduler = async () => {
        let json_data = await getSchedule();
        if (json_data.status) {
            setSchedules(json_data.data || [])
        } else {
            message.error("Lấy danh sách người dùng thất bại")
        }
    }

    const initTemplateZalo = async () => {
        let json_data = await getTemplateZalo()
        if (json_data.status && Array.isArray(json_data.data)) {
            const mappedData: TemplateZaloItem[] = json_data.data.map((item: any) => ({
                id: item._id,
                name: item.name,
            }));
            setTemplateZalo(mappedData);
        }
    }

    useEffect(() => {
        initCompany();
        initSheduler();
        initTemplateZalo()
        setLoading(false)
    }, [])

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý Lịch trình</h1>
                        <p className="text-gray-600 mt-1">Lập lịch gửi thông báo tự động theo thời gian</p>
                    </div>
                    <Button
                        type="primary"
                        icon={<FontAwesomeIcon icon={faPlus} />}
                        onClick={showAddModal}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Thêm lịch trình
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Tổng lịch trình</p>
                            <p className="text-2xl font-bold text-gray-900">{schedules.length}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <FontAwesomeIcon icon={faCalendar} className="text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Đang chạy</p>
                            <p className="text-2xl font-bold text-green-600">
                                {schedules.filter((s) => s.status === "active").length}
                            </p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <FontAwesomeIcon icon={faPlay} className="text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Tạm dừng</p>
                            <p className="text-2xl font-bold text-red-600">
                                {schedules.filter((s) => s.status === "inactive").length}
                            </p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-full">
                            <FontAwesomeIcon icon={faPause} className="text-red-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Hôm nay</p>
                            <p className="text-2xl font-bold text-orange-600">
                                {schedules.filter((s) => dayjs(s.startDate).isSame(dayjs(), "day")).length}
                            </p>
                        </div>
                        <div className="bg-orange-100 p-3 rounded-full">
                            <FontAwesomeIcon icon={faClock} className="text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
                <Table
                    columns={columns}
                    dataSource={schedules}
                    loading={loading}
                    rowKey="_id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} lịch trình`,
                    }}
                    className="p-6"
                    scroll={{ x: 'max-content' }}
                />
            </div>

            <Modal
                title={editingSchedule ? "Chỉnh sửa Lịch trình" : "Thêm Lịch trình mới"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={600}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
                    <Form.Item
                        label="Tên thông báo (hiển thị trong tin nhắn thông báo zalo)"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập tên thông báo" }]}
                    >
                        <Input
                            placeholder="Ví dụ: KD1, KD2, ..."
                            maxLength={500}
                        />
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            label="Giờ chạy thông báo"
                            name="time"
                            rules={[{ required: true, message: "Vui lòng chọn giờ chạy!" }]}
                        >
                            <TimePicker
                                format="HH:mm"
                                placeholder="Chọn giờ"
                                className="w-full"
                                prefix={<FontAwesomeIcon icon={faClock} />}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Ngày bắt đầu"
                            name="startDate"
                            rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
                        >
                            <DatePicker
                                format="DD/MM/YYYY"
                                placeholder="Chọn ngày"
                                className="w-full"
                            />
                        </Form.Item>
                    </div>

                    <Form.Item
                        label="Từ khóa"
                        name="keywords"
                        rules={[{ required: true, message: "Vui lòng nhập từ khóa!" }]}
                        extra="Nhập các từ khóa sẽ xuất hiện trong chiến dịch"
                    >
                        <Input
                            placeholder="Ví dụ: chào buổi sáng, tin tức mới, khuyến mãi"
                            maxLength={500}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Chọn tài khoản"
                        name="accountId"
                        rules={[{ required: true, message: "Vui lòng chọn tài khoản!" }]}
                    >
                        <Select
                            placeholder="Chọn tài khoản để gửi thông báo"
                        >
                            {availableAccounts.map((account) => (
                                <Select.Option key={account._id} value={account._id}>
                                    <div className="flex items-center space-x-2">
                                        <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                                        <span>{account.name}</span>
                                    </div>
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Chat Zalo ID"
                        name="chatZaloId"
                        rules={[{ required: true, message: "Vui lòng nhập Chat Zalo ID!" }]}
                    >
                        <Input placeholder="Nhập Chat Zalo ID" prefix={<span className="text-blue-500 font-bold">Z</span>} />
                    </Form.Item>

                    <Form.Item label="Trạng thái" name="status">
                        <Select defaultValue="active">
                            <Select.Option value="active">
                                <Tag color="green">Đang chạy</Tag>
                            </Select.Option>
                            <Select.Option value="inactive">
                                <Tag color="red">Tạm dừng</Tag>
                            </Select.Option>
                        </Select>
                    </Form.Item>

                     <Form.Item
                        label="Chọn mẫu gửi thông báo"
                        name="templateZalo"
                        rules={[{ required: true, message: "Vui lòng chọn mẫu!" }]}
                    >
                        <Select
                            placeholder="Chọn mẫu gửi thông báo"
                        >
                            {templateZalo.map((temp) => (
                                <Select.Option key={temp.id} value={temp.id}>
                                    <div className="flex items-center space-x-2">
                                        <FontAwesomeIcon icon={faMessage} className="text-gray-500" />
                                        <span>{temp.name}</span>
                                    </div>
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <div className="flex justify-end space-x-2 mt-6">
                        <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
                        <Button type="primary" htmlType="submit" className="bg-blue-600">
                            {editingSchedule ? "Cập nhật" : "Thêm mới"}
                        </Button>
                    </div>
                </Form>
            </Modal>

            <Modal
                title="Chi tiết Lịch trình"
                open={isViewModalVisible}
                onCancel={() => setIsViewModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setIsViewModalVisible(false)}>
                        Đóng
                    </Button>,
                ]}
                width={600}
            >
                {viewingSchedule && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                    <FontAwesomeIcon icon={faClock} className="text-blue-600" />
                                    <span className="font-medium text-blue-800">Giờ chạy</span>
                                </div>
                                <p className="text-2xl font-bold text-blue-900">{viewingSchedule.time}</p>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                    <FontAwesomeIcon icon={faCalendar} className="text-green-600" />
                                    <span className="font-medium text-green-800">Ngày bắt đầu</span>
                                </div>
                                <p className="text-lg font-bold text-green-900">
                                    {dayjs(viewingSchedule.startDate).format("DD/MM/YYYY")}
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Từ khóa:</label>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-gray-900">{viewingSchedule.keywords}</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tài khoản thực hiện:</label>
                            {(() => {
                                const account = getAccountInfo(viewingSchedule.accountId)
                                return account ? (
                                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                                        <div className="bg-blue-100 p-2 rounded-full">
                                            <FontAwesomeIcon icon={faUser} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{account.name}</p>
                                            <p className="text-sm text-gray-600 font-mono">{account.fbToken.substring(0, 20)}...</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-red-500">Tài khoản không tồn tại</p>
                                )
                            })()}
                        </div>

                        <div className="flex justify-between">
                            <div className="flex flex-col gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Chat Zalo ID:</label>
                                    <p className="font-mono bg-blue-50 px-2 py-1 rounded inline-block text-blue-700">
                                        {viewingSchedule.chatZaloId}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mẫu tin nhắn:</label>
                                    <p className="font-mono bg-blue-50 px-2 py-1 rounded inline-block text-blue-700">
                                        {templateZalo.find(item => item.id == viewingSchedule.templateZalo)?.name || "Chưa chọn mẫu"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="m-auto">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái:</label>
                                    <Tag
                                        color={viewingSchedule.status === "active" ? "green" : "red"}
                                        className="font-medium text-base px-3 py-1"
                                    >
                                        {viewingSchedule.status === "active" ? "Đang chạy" : "Tạm dừng"}
                                    </Tag>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    )
}
