"use client"
//(protected)/member/page


import { useEffect, useState } from "react"
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm, Tag } from "antd"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faEdit, faTrash, faEye, faUser, faLock, faKey } from "@fortawesome/free-solid-svg-icons"

import Company from "../../../libs/types/Company"
import UserData from "../../../libs/types/UserData"
import { getCompany } from "../../../libs/ApiClient/CompanyApi"
import { saveMember, getMember, deleteMember } from "../../../libs/ApiClient/MemberApi"



export default function MemberPage() {
    const [members, setMembers] = useState<UserData[]>([])
    const [availablePages, setAvailablePages] = useState<Company[]>([])
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isViewModalVisible, setIsViewModalVisible] = useState(false)
    const [editingMember, setEditingMember] = useState<UserData | null>(null)
    const [viewingMember, setViewingMember] = useState<UserData | null>(null)
    const [form] = Form.useForm()

    // Hiển thị modal thêm mới
    const showAddModal = () => {
        setEditingMember(null)
        form.resetFields()
        setIsModalVisible(true)
    }

    // Hiển thị modal chỉnh sửa
    const showEditModal = (member: UserData) => {
        setEditingMember(member)
        form.setFieldsValue({
            _id: member._id,
            name: member.name,
            username: member.email,
            password: member.passwordHash,
            companyIds: member.companyIds,
        })
        setIsModalVisible(true)
    }

    // Hiển thị modal xem chi tiết
    const showViewModal = (member: UserData) => {
        setViewingMember(member)
        setIsViewModalVisible(true)
    }

    // Xử lý submit form
    const handleSubmit = async (values: any) => {
        try {
            // Kiểm tra username đã tồn tại
            const existingMember = members.find(
                (member) => member.email === values.username && member._id !== editingMember?._id,
            )
            if (existingMember) {
                message.error("Tài khoản đăng nhập đã tồn tại!")
                return
            }
            if (editingMember) {
                setMembers(members.map((member) => (member._id === editingMember._id ? { ...member, ...values } : member)))
                await saveMember({...values})
                message.success("Cập nhật thành công!")
            } else {
                // Thêm member mới
                const newMember: UserData = {
                    _id: "",
                    ...values,
                }
                await saveMember(newMember)
                await initMember()
                message.success("Thêm mới thành công!")
            }
            setIsModalVisible(false)
            form.resetFields()
        } catch (error) {
            message.error("Có lỗi xảy ra!")
        }
    }

    const handleDelete = async (id: string) => {
        setMembers(members.filter((member) => member._id !== id))
        await deleteMember(id)
        message.success("Xóa thành công!")
    }

    const getPageName = (pageId: string) => {
        const page = availablePages.find((p) => p._id === pageId)
        return page?.name || pageId
    }

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
            render: (text: string) => (
                <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                    <span className="font-medium">{text}</span>
                </div>
            ),
        },
        {
            title: "Tài khoản",
            dataIndex: "email",
            key: "email",
            render: (text: string) => <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{text}</span>,
        },
        {
            title: "Quyền truy cập Pages",
            dataIndex: "companyIds",
            key: "companyIds",
            render: (companyIds: string[]) => (
                <div className="flex flex-wrap gap-1">
                    {companyIds.slice(0, 2).map((pageId, index) => (
                        <Tag key={index} color="blue" className="text-xs">
                            {getPageName(pageId)}
                        </Tag>
                    ))}
                    {companyIds.length > 2 && (
                        <Tag color="default" className="text-xs">
                            +{companyIds.length - 2} more
                        </Tag>
                    )}
                    {companyIds.length === 0 && <span className="text-gray-400 text-sm">Không có quyền</span>}
                </div>
            ),
        },
        {
            title: "Thao tác",
            key: "actions",
            width: 150,
            render: (_: any, record: UserData) => (
                <Space size="small">
                    <Button
                        type="text"
                        size="small"
                        icon={<FontAwesomeIcon icon={faEye} />}
                        onClick={() => showViewModal(record)}
                        className="text-blue-600 hover:text-blue-800"
                    />
                    <Button
                        type="text"
                        size="small"
                        icon={<FontAwesomeIcon icon={faEdit} />}
                        onClick={() => showEditModal(record)}
                        className="text-green-600 hover:text-green-800"
                    />
                    <Popconfirm
                        title="Xác nhận xóa"
                        description="Bạn có chắc chắn muốn xóa người dùng này?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            type="text"
                            size="small"
                            icon={<FontAwesomeIcon icon={faTrash} />}
                            className="text-red-600 hover:text-red-800"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    const initCompany = async ()=>{
        let json_data = await getCompany();
        if(json_data.status){
            setAvailablePages(json_data.data||[])
        }else{
            message.error("Lấy danh sách trang thất bại")
        }
    }

    const initMember = async ()=>{
         let json_data = await getMember();
        if(json_data.status){
            setMembers(json_data.data||[])
        }else{
            message.error("Lấy danh sách người dùng thất bại")
        }
    }

    useEffect(()=>{
        initCompany();
        initMember();
    },[])

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Quản lý Người dùng</h1>
                            <p className="text-gray-600 mt-1">Quản lý tài khoản người dùng và quyền truy cập các pages</p>
                        </div>
                        <Button
                            type="primary"
                            icon={<FontAwesomeIcon icon={faPlus} />}
                            onClick={showAddModal}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Thêm người dùng
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Tổng người dùng</p>
                                <p className="text-2xl font-bold text-gray-900">{members.length}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <FontAwesomeIcon icon={faUser} className="text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Tổng Pages</p>
                                <p className="text-2xl font-bold text-gray-900">{availablePages.length}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <FontAwesomeIcon icon={faKey} className="text-green-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Có quyền truy cập</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {members.filter((member) => member.companyIds.length > 0).length}
                                </p>
                            </div>
                            <div className="bg-orange-100 p-3 rounded-full">
                                <FontAwesomeIcon icon={faLock} className="text-orange-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm">
                    <Table
                        columns={columns}
                        dataSource={members}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} người dùng`,
                        }}
                        className="p-6"
                    />
                </div>

                {/* Modal thêm/sửa */}
                <Modal
                    title={editingMember ? "Chỉnh sửa Người dùng" : "Thêm Người dùng mới"}
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                    width={600}
                >
                    <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
                        <Form.Item
                            label="Tên đầy đủ"
                            name="name"
                            rules={[
                                { required: true, message: "Vui lòng nhập tên!" },
                                { min: 2, message: "Tên phải có ít nhất 2 ký tự!" },
                            ]}
                        >
                            <Input placeholder="Nhập tên đầy đủ" prefix={<FontAwesomeIcon icon={faUser} />} />
                        </Form.Item>

                        <Form.Item
                            label="Tài khoản đăng nhập / email"
                            name="email"
                            rules={[
                                { required: true, message: "Vui lòng nhập tài khoản!" },
                                { min: 3, message: "Tài khoản phải có ít nhất 3 ký tự!" },
                            ]}
                        >
                            <Input placeholder="Nhập tài khoản đăng nhập" />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu"
                            name="passwordHash"
                            rules={[
                                { required: editingMember?._id !="", message: "Vui lòng nhập mật khẩu!" },
                                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                            ]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu" prefix={<FontAwesomeIcon icon={faLock} />} />
                        </Form.Item>

                        <Form.Item
                            label="Quyền truy cập Pages"
                            name="companyIds"
                            rules={[
                                {required:true, message:"Vui lòng chọn 1 tài khoản"}
                            ]}
                            extra="Chọn các pages mà người dùng này có thể truy cập"
                        >
                            <Select
                                mode="multiple"
                                placeholder="Chọn pages"
                                allowClear
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {availablePages.map((page) => (
                                    <Select.Option key={page._id} value={page._id}>
                                        {page.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <div className="flex justify-end space-x-2 mt-6">
                            <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
                            <Button type="primary" htmlType="submit" className="bg-blue-600">
                                {editingMember ? "Cập nhật" : "Thêm mới"}
                            </Button>
                        </div>
                    </Form>
                </Modal>

                {/* Modal xem chi tiết */}
                <Modal
                    title="Chi tiết Người dùng"
                    open={isViewModalVisible}
                    onCancel={() => setIsViewModalVisible(false)}
                    footer={[
                        <Button key="close" onClick={() => setIsViewModalVisible(false)}>
                            Đóng
                        </Button>,
                    ]}
                    width={600}
                >
                    {viewingMember && (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <FontAwesomeIcon icon={faUser} className="text-blue-600 text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{viewingMember.name}</h3>
                                    <p className="text-gray-600">@{viewingMember.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên đầy đủ:</label>
                                    <p className="text-gray-900 font-medium">{viewingMember.name}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tài khoản:</label>
                                    <p className="text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                                        {viewingMember.email}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số pages có quyền:</label>
                                    <p className="text-gray-900 font-medium">{viewingMember.companyIds.length} pages</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quyền truy cập Pages:</label>
                                <div className="flex flex-wrap gap-2">
                                    {viewingMember.companyIds.length > 0 ? (
                                        viewingMember.companyIds.map((pageId, index) => (
                                            <Tag key={index} color="blue">
                                                {getPageName(pageId)}
                                            </Tag>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 italic">Không có quyền truy cập page nào</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    )
}
