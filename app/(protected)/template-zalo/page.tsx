"use client"

import { useEffect, useState } from "react"
import { Input, Card, List, Typography, Space, Tag, Button, Modal, Form, message, Popconfirm, Tooltip } from "antd"
import { SearchOutlined, MessageOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons"
const { TextArea } = Input
const { Title, Text, Paragraph } = Typography
import TemplateZaloData from '../../../libs/types/TemplateZalo'
import { getTemplateZalo, saveTemplateZalo, deleteTemplateZalo } from '../../../libs/ApiClient/TemplateZaloApi'

export default function Page() {
    const templateTags = [
        { label: "{{setDay}}", description: "Ngày set" },
        { label: "{{lastDay}}", description: "Ngày hôm qua" },
        { label: "{{toDay}}", description: "Ngày hôm nay" },
        { label: "{{title}}", description: "Tên tiêu đề" },
        { label: "{{totalSpendLastDay}}", description: "Tổng chi phí ngày hôm qua" },
        { label: "{{totalSpend}}", description: "Tổng chi phí" },
        { label: "{{content}}", description: "Nội dung tin nhắn" },
    ];
    const [searchText, setSearchText] = useState("")
    const [templates, setTemplates] = useState<TemplateZaloData[]>([])
    const [filteredTemplates, setFilteredTemplates] = useState<TemplateZaloData[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTemplate, setEditingTemplate] = useState<TemplateZaloData | null>(null)
    const [loading, setLoading]= useState(true)
    const [form] = Form.useForm()

    const handleSearch = (value: string) => {
        setSearchText(value)
        const filtered = templates.filter(
            (template) =>
                template.name.toLowerCase().includes(value.toLowerCase()) ||
                template.content.toLowerCase().includes(value.toLowerCase()),
        )
        setFilteredTemplates(filtered)
    }

    // Thêm template mới
    const handleAdd = () => {
        setEditingTemplate(null)
        form.resetFields()
        setIsModalOpen(true)
    }

    // Sửa template
    const handleEdit = (template: TemplateZaloData) => {
        setEditingTemplate(template)
        form.setFieldsValue({
            name: template.name,
            content: template.content,
        })
        setIsModalOpen(true)
    }

    // Xóa template
    const handleDelete = async (id: string) => {
        await deleteTemplateZalo(id);
        await initTemplate()
        message.success("Xóa template thành công!")
    }

    // Lưu template (thêm mới hoặc cập nhật)
    const handleSave = async () => {
        try {
            const values = await form.validateFields()
            if (editingTemplate) {
                await saveTemplateZalo({
                    _id: editingTemplate._id,
                    name: values.name,
                    content: values.content
                })
                message.success("Cập nhật template thành công!")
            } else {
                const newTemplate: TemplateZaloData = {
                    _id: '',
                    name: values.name,
                    content: values.content,
                }
                await saveTemplateZalo(newTemplate)
                message.success("Thêm template thành công!")
            }
            setIsModalOpen(false)
            form.resetFields()
        } catch (error) {
            console.error("Validation failed:", error)
        } finally {
            await initTemplate()
        }
    }

    const initTemplate = async () => {
        let json_data = await getTemplateZalo()
        if (json_data.status) {
            setTemplates(json_data.data || [])
            setFilteredTemplates(json_data.data || [])
        }
    }

    useEffect(() => {
        initTemplate()
        setLoading(false)
    }, [])

    return (
        <>
            <div className="mb-6">
                <Title level={2} className="text-center mb-2">
                    <MessageOutlined className="mr-2" />
                    Mẫu Template Tin Nhắn Zalo
                </Title>
                <Text type="secondary" className="block text-center">
                    Quản lý và tìm kiếm các mẫu tin nhắn cho Zalo Business
                </Text>
            </div>

            <div className="mb-6 flex gap-4">
                <Input
                    size="large"
                    placeholder="Tìm kiếm theo tên mẫu hoặc nội dung..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="shadow-sm flex-1"
                />
                <Button type="primary" size="large" icon={<PlusOutlined />} onClick={handleAdd} className="shadow-sm">
                    Thêm mẫu
                </Button>
            </div>

            <div className="mb-4">
                <Space>
                    <Tag color="blue">Tổng cộng: {templates.length} mẫu</Tag>
                    <Tag color="green">Hiển thị: {filteredTemplates.length} mẫu</Tag>
                </Space>
            </div>

            <List
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 1,
                    md: 2,
                    lg: 2,
                    xl: 2,
                    xxl: 3,
                }}
                loading={loading}
                dataSource={filteredTemplates}
                renderItem={(template) => (
                    <List.Item>
                        <Card
                            hoverable
                            className="h-full shadow-sm hover:shadow-md transition-shadow duration-200 !p-5"
                            actions={[
                                <Button
                                    key="edit"
                                    type="text"
                                    icon={<EditOutlined />}
                                    onClick={() => handleEdit(template)}
                                    className="!text-blue-500 !hover:text-blue-700"
                                >
                                    Sửa
                                </Button>,
                                <Popconfirm
                                    key="delete"
                                    title="Xóa template"
                                    description="Bạn có chắc chắn muốn xóa template này?"
                                    onConfirm={() => handleDelete(template._id)}
                                    okText="Xóa"
                                    cancelText="Hủy"
                                    okType="danger"
                                >
                                    <Button type="text" icon={<DeleteOutlined />} className="!text-red-500 !hover:text-red-700">
                                        Xóa
                                    </Button>
                                </Popconfirm>,
                            ]}
                        >
                            <div className="flex flex-col h-full">
                                <div className="mb-3">
                                    <Title level={4} className="mb-1 text-blue-600">
                                        {template.name}
                                    </Title>
                                    <div className="w-12 h-1 bg-blue-500 rounded"></div>
                                </div>

                                <div className="flex-1">
                                    <Paragraph
                                        ellipsis={{ rows: 4, expandable: true, symbol: "Xem thêm" }}
                                        className="text-gray-700 leading-relaxed"
                                    >
                                        {template.content.split("\n").map((line, idx) => (
                                            <span key={idx}>
                                                {line}
                                                <br />
                                            </span>
                                        ))}
                                    </Paragraph>
                                </div>

                                <div className="my-4 pt-3 border-t border-gray-100">
                                    <div className="flex justify-between items-center">
                                        <Text type="secondary" className="text-xs">
                                            ID: {template._id}
                                        </Text>
                                        <Space>
                                            <Tag color="orange" className="text-xs">
                                                Template
                                            </Tag>
                                        </Space>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </List.Item>
                )}
            />

            {!loading && filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                    <Title level={4} type="secondary">
                        Không tìm thấy mẫu template nào
                    </Title>
                    <Text type="secondary">Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc</Text>
                </div>
            )}

            <Modal
                title={editingTemplate ? "Cập nhật Template" : "Thêm Template Mới"}
                open={isModalOpen}
                onOk={handleSave}
                onCancel={() => {
                    setIsModalOpen(false)
                    form.resetFields()
                }}
                okText={editingTemplate ? "Cập nhật" : "Thêm"}
                cancelText="Hủy"
                width={600}
            >
                <Typography.Text type="secondary">
                    Hiện tại tin nhắn chỉ có thể gửi dạng <strong>plain text</strong> gồm: văn bản và emoji 😊.
                </Typography.Text>
                <Paragraph className="mt-2 mb-1"><strong>Tiện ích nhanh:</strong></Paragraph>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                    {templateTags.map((tag) => (
                        <Tooltip key={tag.label} title={tag.description}>
                            <Button
                                size="small"
                                onClick={() => {
                                    const currentContent = form.getFieldValue("content") || "";
                                    const newContent = currentContent + " " + tag.label;
                                    form.setFieldsValue({ content: newContent.trim() });
                                }}
                            >
                                {tag.label}
                            </Button>
                        </Tooltip>
                    ))}
                </div>
                <Form form={form} layout="vertical" className="mt-4">
                    <Form.Item
                        name="name"
                        label="Tên mẫu template"
                        rules={[
                            { required: true, message: "Vui lòng nhập tên mẫu template!" },
                            { min: 3, message: "Tên mẫu phải có ít nhất 3 ký tự!" },
                        ]}
                    >
                        <Input placeholder="Nhập tên mẫu template..." />
                    </Form.Item>

                    <Form.Item
                        name="content"
                        label="Nội dung tin nhắn"
                        rules={[
                            { required: true, message: "Vui lòng nhập nội dung tin nhắn!" },
                            { min: 10, message: "Nội dung phải có ít nhất 10 ký tự!" },
                        ]}
                    >
                        <TextArea rows={6} placeholder="Nhập nội dung tin nhắn..." showCount maxLength={1000} />
                    </Form.Item>
                </Form>
            </Modal>
        </>

    )
}
