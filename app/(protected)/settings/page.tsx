"use client"

//(protected)/setings/page

import { useEffect, useState } from "react"
import { Table, Button, Modal, Form, Input, Tag, Space, message, Popconfirm } from "antd"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faEdit, faTrash, faEye } from "@fortawesome/free-solid-svg-icons"

import { getCompany, saveCompnay, deleteCompany } from "../../../libs/ApiClient/CompanyApi"

import Company from "../../../libs/types/Company"

export default function Page() {
    const [items, setItems] = useState<Company[]>([])
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isViewModalVisible, setIsViewModalVisible] = useState(false)
    const [editingItem, setEditingItem] = useState<Company | null>(null)
    const [viewingItem, setViewingItem] = useState<Company | null>(null)
    const [form] = Form.useForm()
    // Cấu hình columns cho table
    const columns = [
        {
            title: "STT",
            key: "index",
            width: 60,
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: "Tên",
            dataIndex: "name",
            key: "name",
            render: (text: string) => <span className="font-medium">{text}</span>,
        },
        {
            title: "FB Token",
            dataIndex: "fbToken",
            key: "fbToken",
            render: (text: string) => <span className="font-mono text-sm">{text.substring(0, 20)}...</span>,
        },
        {
            title: "ID Pages",
            dataIndex: "idPage",
            key: "idPage",
            render: (idPages: string[]) => (
                <div className="flex flex-wrap gap-1 max-w-[300px] overflow-hidden">
                    {idPages.slice(0, 2).map((id, index) => (
                        <Tag key={index} color="blue" className="text-xs">
                            {id}
                        </Tag>
                    ))}
                    {idPages.length > 2 && (
                        <Tag color="default" className="text-xs">
                            +{idPages.length - 2} more
                        </Tag>
                    )}
                </div>
            ),
        },
        {
            title: "Thao tác",
            key: "actions",
            width: 150,
            render: (_: any, record: Company) => (
                <Space size="small">
                    <Button
                        type="text"
                        size="small"
                        icon={<FontAwesomeIcon icon={faEye} className="text-blue-600 hover:text-blue-800" />}
                        onClick={() => showViewModal(record)}
                    />
                    <Button
                        type="text"
                        size="small"
                        icon={<FontAwesomeIcon icon={faEdit} className="text-green-600 hover:text-green-800" />}
                        onClick={() => showEditModal(record)}
                    />
                    <Popconfirm
                        title="Xác nhận xóa"
                        description="Bạn có chắc chắn muốn xóa item này?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            type="text"
                            size="small"
                            icon={<FontAwesomeIcon icon={faTrash} className="text-red-600 hover:text-red-800" />}
                        />
                    </Popconfirm>
                </Space>
            )
        },
    ]

    // Hiển thị modal thêm mới
    const showAddModal = () => {
        setEditingItem(null)
        form.resetFields()
        setIsModalVisible(true)
    }

    // Hiển thị modal chỉnh sửa
    const showEditModal = (item: Company) => {
        setEditingItem(item)
        form.setFieldsValue({
            _id: item._id,
            name: item.name,
            fbToken: item.fbToken,
            idPage: item.idPage.join(", "),
        })
        setIsModalVisible(true)
    }

    // Hiển thị modal xem chi tiết
    const showViewModal = (item: Company) => {
        setViewingItem(item)
        setIsViewModalVisible(true)
    }

    // Xử lý submit form
    const handleSubmit = async (values: any) => {
        try {
            const idPageArray = values.idPage
                .split(",")
                .map((_id: string) => _id.trim())
                .filter((_id: string) => _id)

            if (editingItem) {
                await saveCompnay({
                    _id:editingItem._id,
                    name:values.name,
                    fbToken:values.fbToken,
                    idPage:idPageArray,
                })
                message.success("Cập nhật thành công!")
            } else {
                const newItem: Company = {
                    _id: '',
                    name: values.name,
                    fbToken: values.fbToken,
                    idPage: idPageArray,
                }
                await saveCompnay(newItem)
                message.success("Thêm mới thành công!")
            }
            setIsModalVisible(false)
            form.resetFields()
        } catch (error) {
            message.error("Có lỗi xảy ra!")
        } finally {
            initData()
        }
    }

    const handleDelete = async (id: string) => {
        setItems(items.filter((item) => item._id !== id))
        await deleteCompany(id)
        message.success("Xóa thành công!")
    }

    const initData = async () => {
        let json_data = await getCompany()
        if (json_data.status) {
            setItems(json_data.data || [])
        } else {
            message.error("Lấy dữ liệu thất bại")
        }
    }

    useEffect(() => {
        initData()
    }, [])


    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Quản lý Items</h1>
                            <p className="text-gray-600 mt-1">Quản lý danh sách Facebook tokens và pages</p>
                        </div>
                        <Button
                            type="primary"
                            icon={<FontAwesomeIcon icon={faPlus} />}
                            onClick={showAddModal}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Thêm mới
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm">
                    <Table
                        columns={columns}
                        dataSource={items}
                        loading={items.length == 0}
                        rowKey="_id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} items`,
                        }}
                        className="p-6"
                    />
                </div>

                {/* Modal thêm/sửa */}
                <Modal
                    title={editingItem ? "Chỉnh sửa Item" : "Thêm Item mới"}
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                    width={600}
                >
                    <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
                        <Form.Item label="Tên" name="name" rules={[{ required: true, message: "Vui lòng nhập tên!" }]}>
                            <Input placeholder="Nhập tên item" />
                        </Form.Item>

                        <Form.Item
                            label="Facebook Token"
                            name="fbToken"
                            rules={[{ required: true, message: "Vui lòng nhập FB Token!" }]}
                        >
                            <Input.TextArea placeholder="Nhập Facebook Token" rows={3} />
                        </Form.Item>

                        <Form.Item
                            label="ID Pages"
                            name="idPage"
                            rules={[{ required: true, message: "Vui lòng nhập ID Pages!" }]}
                            extra="Nhập các ID cách nhau bằng dấu phẩy (,)"
                        >
                            <Input.TextArea placeholder="page1, page2, page3" rows={3} />
                        </Form.Item>

                        <div className="flex justify-end space-x-2 mt-6">
                            <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
                            <Button type="primary" htmlType="submit" className="bg-blue-600">
                                {editingItem ? "Cập nhật" : "Thêm mới"}
                            </Button>
                        </div>
                    </Form>
                </Modal>

                {/* Modal xem chi tiết */}
                <Modal
                    title="Chi tiết Item"
                    open={isViewModalVisible}
                    onCancel={() => setIsViewModalVisible(false)}
                    footer={[
                        <Button key="close" onClick={() => setIsViewModalVisible(false)}>
                            Đóng
                        </Button>,
                    ]}
                    width={600}
                >
                    {viewingItem && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên:</label>
                                <p className="text-gray-900 font-medium">{viewingItem.name}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Token:</label>
                                <p className="text-gray-900 font-mono text-sm bg-gray-100 p-2 rounded break-all">
                                    {viewingItem.fbToken}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">ID Pages:</label>
                                <div className="flex flex-wrap gap-2">
                                    {viewingItem.idPage.map((id, index) => (
                                        <Tag key={index} color="blue">
                                            {id}
                                        </Tag>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    )
}
