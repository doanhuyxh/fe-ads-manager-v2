'use client'
import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { useRouter } from "next/navigation"
import { Table, Input, DatePicker, Form, Checkbox, Modal, Row, Col, Divider, Popconfirm, Tooltip, Button, Badge, Select, message, Card, Skeleton, Spin } from 'antd';
import { PoweroffOutlined, LoadingOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
    DndContext,
    useSensor,
    useSensors,
    PointerSensor,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import dayjs from "dayjs";

import { get_report_fb, save_report_fb, delete_report_fb } from "../../../libs/ApiClient/ReportFbApi";
import { saveLog } from '../../../libs/ApiClient/LogApi';
import { get_all_fb_fetch_campaign_data_v20, changeStatusCampFacebook, get_fb_campaigns_id_and_name } from '../../../libs/ApiClient/ExternalDataApi';
//get_ads_notify_facebook, save_notification_ads_fb,

import ReportUserFb from '../../../libs/types/ReportUserFb';
import { formatNumber, formatNumber2 } from '../../../libs/utils/format';
import useStyle from '../../../components/ui_share/style';
import DraggableColumnHeader from '../../../components/ui_share/dndkit';
import ResizableTitle from '../../../components/ui_share/resizable';

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function Page() {
    const router = useRouter()
    const { styles } = useStyle();

    const [form] = Form.useForm()
    const [formAdsNotify] = Form.useForm()
    const [isSortColumn, setIsSortColumn] = useState(true)
    const [isMobile, setIsMobile] = useState(true);

    const [loadingStatusCamp, setLoadingStatusCamp] = useState({
        status: false,
        id: ""
    })

    const presets = [
        {
            label: "Hôm nay",
            value: [dayjs().startOf("day"), dayjs().endOf("day")] as [dayjs.Dayjs, dayjs.Dayjs],
        },
        {
            label: "Hôm qua",
            value: [
                dayjs().subtract(1, "day").startOf("day"),
                dayjs().subtract(1, "day").endOf("day"),
            ] as [dayjs.Dayjs, dayjs.Dayjs],
        },
        {
            label: "7 ngày qua",
            value: [dayjs().subtract(7, "day").startOf("day"), dayjs().endOf("day")] as [dayjs.Dayjs, dayjs.Dayjs],
        },
        {
            label: "30 ngày qua",
            value: [dayjs().subtract(30, "day").startOf("day"), dayjs().endOf("day")] as [dayjs.Dayjs, dayjs.Dayjs],
        },
        {
            label: "90 ngày qua",
            value: [dayjs().subtract(90, "day").startOf("day"), dayjs().endOf("day")] as [dayjs.Dayjs, dayjs.Dayjs],
        },
        {
            label: "Tháng trước",
            value: [
                dayjs().subtract(1, "month").startOf("month"),
                dayjs().subtract(1, "month").endOf("month"),
            ] as [dayjs.Dayjs, dayjs.Dayjs],
        },
    ];

    const initColumns: ColumnsType<any & { title: React.ReactNode }> = [
        {
            title: 'Tên tài khoản', dataIndex: 'account_name', key: 'account_name', sorter: true, onCell: (record) => ({
                onClick: () => {
                    localStorage.setItem("campaign_name", record.name)
                    router.push(`/ads-facebook/content?campaign_id=${record.campaign_id}`)
                },
                style: { cursor: 'pointer', color: '#1677ff' }, // style gợi ý có thể click
            }),
        },
        //{ title: 'ID tài khoản', dataIndex: 'account_id', key: 'account_id' },
        {
            title: 'Chiến dịch', dataIndex: 'name', key: 'name',  sorter: true, onCell: (record) => ({ //fixed: 'left',
                onClick: () => {
                    localStorage.setItem("campaign_name", record.name)
                    router.push(`/ads-facebook/content?campaign_id=${record.campaign_id}`)
                },
                style: { cursor: 'pointer', color: '#1677ff' }, // style gợi ý có thể click
            }),
        },
        {
            title: 'Trạng thái', dataIndex: 'status', key: 'status', align: "center", render: (_, { status, campaign_id }) => {
                return (
                    <Button
                        type="default"
                        style={{
                            backgroundColor: status === "PAUSED" ? "#ef4444" : "#22c55e", // Tailwind: red-500 / green-500
                            color: "#fff",
                            fontWeight: "bold"
                        }}
                        icon={<PoweroffOutlined />}
                        loading={loadingStatusCamp.status && loadingStatusCamp.id == campaign_id}
                        disabled={loadingStatusCamp.id == campaign_id}
                        onClick={() => {
                            setLoadingStatusCamp(prev => ({
                                ...prev,
                                status: true,
                                id: campaign_id
                            }));
                            ChangeStatusCamp(campaign_id, status === "PAUSED" ? "ACTIVE" : "PAUSED")
                        }
                        }
                    >
                        <span className="hidden lg:block">{status === "PAUSED" ? "Tắt" : "Đang chạy"}</span>
                    </Button>
                );
            },
            sorter: true,
        },
        // { title: 'ID chiến dịch', dataIndex: 'campaign_id', key: 'campaign_id' },
        // { title: 'Ngân sách hàng ngày', dataIndex: 'daily_budget', key: 'daily_budget', align: "center", sorter: true, },
        //{ title: 'Ngân sách trọn đời', dataIndex: 'lifetime_budget', key: 'lifetime_budget' },
        //{ title: 'Loại chiến dịch', dataIndex: 'objective', key: 'objective' },
        { title: 'Chi phí', dataIndex: 'spend', key: 'spend', align: "center", sorter: true, },
        { title: 'Số người tiếp cận', dataIndex: 'reach', key: 'reach', align: "center", sorter: true, },
        { title: 'Số lần hiển thị', dataIndex: 'impressions', key: 'impressions', align: "center", sorter: true, },
        { title: 'Tần suất hiển thị', dataIndex: 'frequency', key: 'frequency', align: "center", sorter: true, },
        { title: 'Số lượt click', dataIndex: 'clicks', key: 'clicks', align: "center", sorter: true, },
        { title: 'Lượt đăng ký toàn tất trên web', dataIndex: 'complete_registration', key: 'complete_registration', align: "center", sorter: true, },
        {
            title: 'Chi phí mỗi lượt đăng ký toàn tất',
            dataIndex: 'cost_per_complete_registration',
            key: 'cost_per_complete_registration',
            align: "center", sorter: true
        },
        { title: 'Tỷ lệ nhấp (CTR) (tất cả)', dataIndex: 'ctr', key: 'ctr', align: "center", sorter: true, },
        { title: 'Chi phí mỗi click (CPC) (tất cả)', dataIndex: 'cpc', key: 'cpc', align: "center", sorter: true, },
        { title: 'Chi phí mỗi 1000 hiển thị (CPM)', dataIndex: 'cpm', key: 'cpm', align: "center", sorter: true, },
        { title: 'Chi phí mỗi lượt tiếp cận (CPP)', dataIndex: 'cpp', key: 'cpp', align: "center", sorter: true, },
        //{ title: 'Số lượt tương tác', dataIndex: 'engagements', key: 'engagements' },
        //{ title: 'Số lượt thích trang', dataIndex: 'page_likes', key: 'page_likes' },
        //{ title: 'Số lượt chia sẻ', dataIndex: 'shares', key: 'shares' },
        //{ title: 'Số lượt bình luận', dataIndex: 'comments', key: 'comments' },
        //{ title: 'Số lượt xem video (3s)', dataIndex: 'video_views', key: 'video_views' },
        //{ title: 'Số lượt xem video (10s)', dataIndex: 'video_views_10s', key: 'video_views_10s' },
        //{ title: 'Số lượt xem video (ThruPlay)', dataIndex: 'video_thruplay', key: 'video_thruplay' },
        { title: 'Số lượt gửi tin nhắn', dataIndex: 'messaging_conversations_started', key: 'messaging_conversations_started', align: "center", sorter: true, },
        //{ title: 'Số lượt thêm vào giỏ hàng', dataIndex: 'add_to_cart', key: 'add_to_cart' },
        {
            title: (
                <Tooltip title="Số lượt mua trên web" placement="right" arrow={true}>
                    <span>Lượt mua</span>
                </Tooltip>
            ), dataIndex: 'onsite_web_purchase', key: 'onsite_web_purchase', align: "center", sorter: true,
        },
        {
            title: (
                <Tooltip title="Chỉ số kết quả của chiến dịch" placement="right" arrow={true}>
                    <span>Kết quả</span>
                </Tooltip>
            ), dataIndex: 'result_value', key: 'result_value', align: "center", sorter: true,
            render: (_, { result_value, result_label }) => {
                return (
                    <Tooltip title={result_label} placement="right" arrow={true}>
                        <span>{result_value}</span>
                    </Tooltip>
                )
            },

        },
        { title: 'Chi phí trên mỗi lượt mua', dataIndex: 'cost_per_purchase', key: 'cost_per_purchase', align: "center", sorter: true, },
        { title: 'Giá trị chuyển đổi từ lượt mua', dataIndex: 'purchase_conversion_value', key: 'purchase_conversion_value', align: "center", sorter: true, },
        { title: 'Chi phí trên mỗi lượt bắt đầu cuộc trò chuyện qua tin nhắn', dataIndex: 'cost_per_messaging_conversation_started', key: 'cost_per_messaging_conversation_started', align: "center", sorter: true, },
        //{ title: 'Giá trị đơn hàng trung bình (AOV)', dataIndex: 'average_order_value', key: 'average_order_value' },
        { title: 'Tổng doanh thu', dataIndex: 'revenue', key: 'revenue', align: "center", sorter: true, },
        { title: 'Tỷ lệ chuyển đổi (Conversion Rate)', dataIndex: 'conversion_rate', key: 'conversion_rate', align: "center", sorter: true, },
        { title: 'ROAS (Lợi tức chi tiêu quảng cáo)', dataIndex: 'roas', key: 'roas', align: "center", sorter: true, },
        //{ title: 'Điểm phù hợp của quảng cáo', dataIndex: 'quality_ranking', key: 'quality_ranking' },
        { title: 'Ngày tạo', dataIndex: 'created_time', key: 'created_time', align: "center", sorter: true, },
        { title: 'Ngày bắt đầu', dataIndex: 'date_start', key: 'date_start', align: "center", sorter: true, },
        { title: 'Ngày kết thúc', dataIndex: 'date_stop', key: 'date_stop', align: "center", sorter: true, },
    ];

    const initNotifyColum: ColumnsType<any & { title: React.ReactNode }> = [
        {
            "title": "Chiến dịch",
            dataIndex: "camp_id",
            key: "camp_id",
            align: "center",
            render: (_, { camp_id }) => {
                const camp = adsIdAndName.find(i => i.id == camp_id);
                const name = typeof camp?.name === 'function' ? camp.name({}) : camp?.name;
                return <span>{name || ""}</span>
            },
        },
        {
            title: "Điều kiện",
            dataIndex: "conditions",
            key: "conditions",
            width: 400,
            render: (_, { conditions }) => {
                return (
                    <div className="flex flex-col gap-2">
                        {conditions.map((item: any, index: number) => (
                            <div key={index} className="border p-2 rounded-md bg-gray-50">
                                <div>
                                    <strong>Loại cảnh báo:</strong>{" "}
                                    {typeof initColumns.find(col => col.key === item.key)?.title === "function"
                                        ? initColumns.find(col => col.key === item.key)?.title({})
                                        : initColumns.find(col => col.key === item.key)?.title || "Không xác định"}
                                </div>
                                <div>
                                    <strong>Điều kiện:</strong>{" "}
                                    {item.condition === "greater_than" ? "Lớn hơn" :
                                        item.condition === "less_than" ? "Nhỏ hơn" :
                                            item.condition === "equal" ? "Bằng" : "Không xác định"}
                                </div>
                                <div>
                                    <strong>Hạn mức:</strong> {item.value}
                                </div>
                                {index < conditions.length - 1 && (
                                    <div>
                                        <strong>Loại:</strong> {item.operator === "AND" ? "VÀ" : "HOẶC"}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                );
            }
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            align: "center",
            render: (_, { status, id }) => {
                return <Button
                    type="default"
                    onClick={() => handleChangeStatusNotify(id, status == "stop" ? "run" : "stop")}
                    className={`${status == "run" ? "bg-green-500" : "bg-red-500"} text-white px-2 py-1`}>
                    {status == "run" ? "Bật" : "Tắt"}
                </Button>
            },
            filters: [
                { text: "Bật", value: "run" },
                { text: "Tắt", value: "stop" },
            ]
        },
        {
            title: "Hành động",
            dataIndex: "action",
            key: "action",
            align: "center",
            render: (_, { action, id }) => {
                return (
                    <button
                        className={`px-2 py-1 ${action === "ACTIVE" ? "text-green-500" :
                            action === "PAUSED" ? "text-red-500" :
                                action === "NOTIFY" ? "text-blue-500" : ""
                            }`}
                    >
                        {action === "PAUSED" ? "Tắt camp" :
                            action === "ACTIVE" ? "Bật camp" :
                                action === "NOTIFY" ? "Chỉ thông báo" : ""}
                    </button>
                );
            },
            filters: [
                { text: "Bật camp", value: "ACTIVE" },
                { text: "Tắt camp", value: "PAUSED" },
                { text: "Chỉ thông báo", value: "NOTIFY" },
            ]
        },

        {
            title: "Thao tác",
            dataIndex: "",
            key: "",
            align: "center",
            render: (record) => {
                console.log(record)
                return (
                    <><Button type="primary" className='mx-1' onClick={() => {
                        formAdsNotify.setFieldsValue(record)
                    }}>Cập nhật</Button>
                        <Popconfirm
                            title="Bạn có chắc chắn muốn xóa cảnh báo này không?"
                            onConfirm={() => {
                                const new_notify = notifyAdsData.filter(i => i.key !== record.key)
                                setNotifyAdsData(new_notify)
                            }}
                            okText="Có"
                            cancelText="Không"
                        >
                            <Button type="primary" danger>Xóa</Button>
                        </Popconfirm>
                    </>
                )
            }
        }
    ]

    const initSortColumns = initColumns.map((item) => {
        return {
            title: item.title,
            key: item.key,
        }
    });

    const [adsData, setAdsData] = useState([]);
    const [adsDataBackup, setAdsDataBackup] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingData, setLoadingData] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [dates, setDates] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

    const [openModal, setOpenModal] = useState(false)
    const [openModalReport, setOpenModalReport] = useState(false)
    const [openModalSortColumn, setOpenModalSortColumn] = useState(false)
    const [openModalNotifyAds, setOpenModalNotifyAds] = useState(false)
    const [modalLoadingCorfirm, setModalLoadingCorfirm] = useState(false)

    const pageSize = 100;

    const [columns, setColumns] = useState(initColumns);
    const [sortColumns, setSortColumns] = useState(initSortColumns);
    const defaultCheckedList = columns.map((item) => item.key);
    const [checkedList, setCheckedList] = useState(defaultCheckedList);
    const [checkedListReport, setCheckedListReport] = useState<any>([]);
    const [dataReportFb, setDataReportFb] = useState<ReportUserFb[]>([]);
    const [activeReport, setActiveReport] = useState("0")

    const [notifyAdsData, setNotifyAdsData] = useState<any[]>([]);
    const [conditions, setConditions] = useState([{ key: "", condition: "", value: "" }]);

    const [adsIdAndName, setAdsIdAndName] = useState<any[]>([]);

    const [messageApi, contextHolder] = message.useMessage();


    const addCondition = () => {
        setConditions([...conditions, { key: "", condition: "", value: "" }]);
    };

    const removeCondition = (index: any) => {
        setConditions(conditions.filter((_, i) => i !== index));
    };

    const handleConditionChange = (index: any, field: any, value: any) => {
        const newConditions = [...conditions];
        newConditions[index][field] = value;
        setConditions(newConditions);
    };

    // thiết lập cảm biến kéo thả dnd-kit
    const sensors = useSensors(useSensor(PointerSensor));
    // Xử lý kéo thả
    const onDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over) return; // Kiểm tra nếu over bị null

        const oldIndex = sortColumns.findIndex((col) => col.key === active.id);
        const newIndex = sortColumns.findIndex((col) => col.key === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            setSortColumns(arrayMove(sortColumns, oldIndex, newIndex));
        }
    };

    // Hàm xử lý kéo thả độ rộng cột
    const handleResize = (index: any) => (e, { size }) => {
        setColumns((prevColumns) => {
            const newColumns = [...prevColumns];
            newColumns[index] = { ...newColumns[index], width: size.width };
            return newColumns;
        });
    };

    const SaveResize = () => {
        const columnsWidth = newColumns.map((item) => ({ key: item.key, width: item.width }));
        localStorage.setItem("columns-ads-width", JSON.stringify(columnsWidth));
        messageApi.open({
            type: 'success',
            content: 'Lưu kích thước cột thành công',
        });
    }

    const handelChangAllowSortColumn = useCallback(() => {
        setIsSortColumn((pre) => !pre);
    }, []);

    const filteredData = useMemo(() =>
        adsDataBackup.filter((item) =>
            Object.values(item).some((value) =>
                String(value).toLowerCase().includes(searchText.toLowerCase())
            )
        ),
        [adsDataBackup, searchText]
    );

    const options = columns.map(({ key, title }) => ({
        label: title,
        value: key,
    }));

    const newColumns = useMemo(() =>
        columns.map((item, index) => ({
            ...item,
            width: item.width || 300,
            hidden: !checkedList?.includes(item.key as string),
            sorter: isSortColumn,
            onHeaderCell: (column) => ({
                width: column.width || 100,
                onResize: (e, data) => handleResize(index)(e, data),
                SaveResize: SaveResize,
                handelChangAllowSortColumn: handelChangAllowSortColumn,
            }),
        })),
        [columns, checkedList, isSortColumn, handleResize, SaveResize, handelChangAllowSortColumn]
    );

    const SaveSortColumn = () => {
        setOpenModalSortColumn(false)

        const filteredColumns = sortColumns.map(({ key }) => ({ key }));
        localStorage.setItem("columns-ads", JSON.stringify(filteredColumns))
        const newColumns = [...columns].sort((a, b) => {
            const indexA = sortColumns.findIndex((item) => item.key === a.key);
            const indexB = sortColumns.findIndex((item) => item.key === b.key);
            return indexA - indexB;
        });

        setColumns(newColumns)
    }

    const handleTableChange = (pagination, filters, sorter) => {
        if (sorter.order) {
            setLoadingData(true);
            const sortedData = [...adsDataBackup].sort((a, b) => {
                let aValue = a[sorter.columnKey] as string;
                let bValue = b[sorter.columnKey] as string;

                aValue = String(aValue).replace(/,/g, "");
                bValue = String(bValue).replace(/,/g, "");

                return sorter.order === "ascend"
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            });

            setLoadingData(false);
            setAdsDataBackup(sortedData);
        }
    };

    const handleChange = (values: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
        if (values && values[0] && values[1] && dayjs(values[0]).isValid() && dayjs(values[1]).isValid()) {
            setDates([
                dayjs(values[0]),
                dayjs(values[1]),
            ]);
        }
    };

    const ChangeStatusCamp = async (id, status) => {
        setLoadingStatusCamp(prev => ({
            ...prev,
            status: true,
            id: id
        }));

        try {
            const res = await changeStatusCampFacebook(id, status)
            if (res.success) {
                setAdsData((prev: any) =>
                    prev.map(item =>
                        item.campaign_id === id ? { ...item, status: status } : item
                    )
                );

                setAdsDataBackup(prev =>
                    prev.map(item =>
                        item.campaign_id === id ? { ...item, status: status } : item
                    )
                );
                messageApi.open({
                    type: 'success',
                    content: 'Cập nhật trạng thái thành công',
                });
            }
        } catch (error) {
            messageApi.open({
                type: 'error',
                content: 'Cập nhật trạng thái thất bại',
            });
        }
        setLoadingStatusCamp(prev => ({
            ...prev,
            status: false,
            id: ""
        }));

    }

    const CallData = async () => {
        setLoadingData(true);
        try {
            let dateStart;
            if (dates[0] === null) {
                dateStart = dayjs().startOf("day").format("YYYY-MM-DD");
            } else {
                dateStart = dates[0]!.startOf("day").format("YYYY-MM-DD");
            }

            let dateEnd;
            if (dates[1] === null) {
                dateEnd = dayjs().endOf("day").format("YYYY-MM-DD");
            }
            else {
                dateEnd = dates[1]!.endOf("day").format("YYYY-MM-DD");
            }

            const res = await get_all_fb_fetch_campaign_data_v20(dateStart, dateEnd);
            const formattedData = res.filter(item => Number(item.spend) != 0).map((item, index) => ({ ...item, key: index }));
            formattedData.forEach((item) => {
                //item.created_time = new Date(item.created_time).toLocaleDateString();
                item.daily_budget = formatNumber(item.daily_budget);
                item.spend = formatNumber(item.spend);
                item.revenue = formatNumber(item.revenue);
                item.clicks = formatNumber(item.clicks);
                item.impressions = formatNumber(item.impressions);
                item.ctr = formatNumber2(item.ctr);
                item.cpc = formatNumber(item.cpc);
                item.cpm = formatNumber(item.cpm);
                item.cpp = formatNumber(item.cpp);
                item.page_likes = formatNumber(item.page_likes);
                item.shares = formatNumber(item.shares);
                item.comments = formatNumber(item.comments);
                item.video_views = formatNumber(item.video_views);
                item.video_views_10s = formatNumber(item.video_views_10s);
                item.video_thruplay = formatNumber(item.video_thruplay);
                item.messaging_conversations_started = formatNumber(item.messaging_conversations_started);
                item.cost_per_messaging_conversation_started = formatNumber(item.cost_per_messaging_conversation_started);
                item.add_to_cart = formatNumber(item.add_to_cart);
                item.onsite_web_purchase = formatNumber(item.onsite_web_purchase);
                item.onsite_conversion_purchase = formatNumber(item.onsite_conversion_purchase);
                item.cost_per_purchase = formatNumber(item.cost_per_purchase);
                item.average_order_value = formatNumber(item.average_order_value);
                item.purchase_conversion_value = formatNumber(item.purchase_conversion_value);
                item.conversion_rate = formatNumber2(item.conversion_rate);
                item.roas = formatNumber2(item.roas);
                item.quality_ranking = formatNumber(item.quality_ranking);
                item.frequency = formatNumber2(item.frequency);
                item.reach = formatNumber(item.reach);
                item.cost_per_complete_registration = formatNumber(item.cost_per_complete_registration);
                item.result_value = formatNumber(item.result_value);

            });
            setAdsData(formattedData);
            setAdsDataBackup(formattedData);
            setLoadingData(false);
        } catch (error) {
            console.log(error);
        }
    }

    const asyncData = async () => {
        await CallData();
        RunReport(undefined)
        setLoadingData(false);
    }

    const SaveShowColum = () => {
        localStorage.setItem("checkedList", JSON.stringify(checkedList))
        setOpenModal(false)
    }

    const ShowAllTable = () => {
        setCheckedList(defaultCheckedList)
    }

    const getReportData = async () => {
        try {
            const res = await get_report_fb()
            setDataReportFb(res.data || [])
        } catch (error) {
            console.log(error)
        }
    }

    const SaveReport = async () => {
        setModalLoadingCorfirm(true)
        try {
            const values = await form.validateFields()
            const data = {
                name: values.name,
                keyword: values.keyword,
                column: checkedListReport,
                "_id": values._id
            }
            const res = await save_report_fb(data)
            setModalLoadingCorfirm(false)
            setOpenModalReport(false)

            if (res.status) {
                await getReportData()
                form.resetFields()
                setCheckedListReport([])
                messageApi.open({
                    type: 'success',
                    content: 'Lưu báo cáo thành công',
                });
            } else {
                messageApi.open({
                    type: 'error',
                    content: 'Lưu báo cáo thất bại',
                });
            }

        }
        catch {
            setModalLoadingCorfirm(false)
            messageApi.open({
                type: 'error',
                content: 'Lưu báo cáo thất bại',
            });
            return
        }
    }

    const RemoveReport = async (id) => {
        try {
            const res = await delete_report_fb(id)
            if (res.status) {
                await getReportData()
                messageApi.open({
                    type: 'success',
                    content: 'Xoá thành công',
                });
            }
        }
        catch {
            return
        }
    }

    const EditReport = async (id) => {
        const edit_data = dataReportFb.find(i => i._id == id)
        form.setFieldValue("_id", id)
        form.setFieldValue("name", edit_data?.name)
        form.setFieldValue("keyword", edit_data?.keyword)
        if (edit_data?.column) {
            setCheckedListReport(edit_data?.column)
        } else {
            setCheckedListReport([])
        }


        setOpenModalReport(true)
    }

    const RunReport = (id: string | undefined) => {
        setLoadingData(true)
        if (activeReport == id) {
            setActiveReport("0")
            const temp_checkedList = localStorage.getItem("checkedList")
            if (temp_checkedList) {
                setCheckedList(JSON.parse(temp_checkedList))
            } else {
                setCheckedList(defaultCheckedList)
            }
            setAdsDataBackup(adsData)
            setLoadingData(false)
            return
        }

        if (id == undefined || id == null) {
            id = activeReport
        }

        if (id == "0") {
            return
        }

        const run_data = dataReportFb.find(i => i._id == id)
        setActiveReport(id)
        if (run_data?.column) {
            setCheckedList(run_data.column)
        }
        const new_ads: any[] = []
        adsData.forEach((item: any) => {
            // xử lý nhiều từ khoá
            const keywords = run_data?.keyword?.split(/\s*,\s*/);
            if (keywords?.every(k => item.name.includes(k))) {
                new_ads.push(item);
            }
        })

        setAdsDataBackup(new_ads);
        setLoadingData(false)

    }

    const AddNotifyAds = async () => {
        try {
            const values = await formAdsNotify.validateFields()
            const id = values.id
            const camp_id = values.camp_id
            if (!id && notifyAdsData.find(i => i.camp_id == camp_id)) {
                messageApi.open({
                    type: 'error',
                    content: 'Chiến dịch đã tồn tại trong danh sách cảnh báo',
                });
                return
            }
            const data = {
                id: "",
                key: values.camp_id,
                camp_id: values.camp_id,
                conditions: values.conditions,
                action: values.action,
                status: values.status,
            }
            if (values.id) {
                const new_notify = notifyAdsData.map(i => i.id == values.id ? data : i)
                setNotifyAdsData(new_notify)
            } else {
                data.status = "stop"
                data.key = data.camp_id
                data.id = Math.random().toString(36).substring(7).toString()
                setNotifyAdsData([...notifyAdsData, data])
            }

            formAdsNotify.resetFields()

        } catch (error) {
            console.log(error)
        }
    }

    const handleChangeStatusNotify = (id, status) => {
        const new_notify = notifyAdsData.map(i => i.id == id ? { ...i, status: status } : i)
        setNotifyAdsData(new_notify)
    }

    const SaveNotifyAds = async () => {
        setModalLoadingCorfirm(true)
        setOpenModalNotifyAds(false)
        // await save_notification_ads_fb(notifyAdsData)
        setModalLoadingCorfirm(false)
        messageApi.open({
            type: 'success',
            content: 'Lưu thông báo thành công',
        });
    }

    const getDataNotifyAds = async () => {
        try {
            // const res = await get_ads_notify_facebook()
            // setNotifyAdsData(res)
        } catch (error) {
            console.log(error)
        }
    }

    const getIdAndNameAds = async () => {
        try {
            const res = await get_fb_campaigns_id_and_name()
            setAdsIdAndName(res.data || [])
        } catch (error) {
            console.log(error)
        }
    }

    const renderMobileView = (data) => {
        return data.map((record, index) => (
            <Card key={index} style={{ marginBottom: 16 }} className='border-2'>
                {newColumns.map((col) => {
                    let campaign_id = record.campaign_id;
                    let title_col = col!.title?.toString() || "";
                    if (col!.key === "onsite_web_purchase") {
                        title_col = "Lượt mua";
                    }
                    if (col!.key === "result_value") {
                        title_col = "Kết quả";
                    }

                    const handleViewCampain = () => {
                        if (col.key != "account_name" && col.key != "name") {
                            return
                        }
                        router.push("/ads-facebook/content?campaign_id=" + campaign_id)
                    }

                    if (!col.hidden) {
                        return (
                            <div key={col.key} style={{ display: "flex", justifyContent: "space-between", padding: "8px", borderBottom: "1px solid #f0f0f0" }} onClick={handleViewCampain}>
                                <strong className='text-wrap min-w-[30%] text-blue-600 font-medium'>{title_col}:</strong>
                                {
                                    col.key === "status" ? (<Button
                                        type="default"
                                        onClick={() => ChangeStatusCamp(campaign_id, record[col!.key!.toString()] === "PAUSED" ? "ACTIVE" : "PAUSED")}
                                        style={{
                                            backgroundColor: record[col!.key!.toString()] === "PAUSED" ? "#ef4444" : "#22c55e", // đỏ hoặc xanh
                                            color: "#ffffff", // trắng
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {record[col!.key!.toString()] === "PAUSED" ? "Tắt" : "Đang chạy"}
                                    </Button>) : <span className='block text-right text-black font-bold'>{record[col!.key!.toString()]}</span>
                                }
                            </div>
                        );
                    }
                    return null;
                })}
            </Card>
        ));
    };

    const renderSummaryMobile = (pageData) => {
        const pageLength = pageData.length;
        let totalValues = {};
        [
            "daily_budget",
            "spend",
            "revenue",
            "clicks",
            "impressions",
            "ctr",
            "cpc",
            "cpm",
            "cpp",
            "page_likes",
            "shares",
            "comments",
            "video_views",
            "messaging_conversations_started",
            "cost_per_messaging_conversation_started",
            "onsite_web_purchase",
            "cost_per_purchase",
            "average_order_value",
            "conversion_rate",
            "roas",
            "quality_ranking",
            "frequency",
            "reach",
            "purchase_conversion_value",
            "onsite_conversion_purchase",
        ].forEach((key) => {
            totalValues[key] = 0;
        });

        newColumns.forEach((col) => {
            let key = col!.key!.toString() || "";
            if (totalValues.hasOwnProperty(key)) {
                totalValues[key] = pageData.reduce((sum, row) => {
                    let value = row[key];
                    if (typeof value === "string") {
                        value = value.replace(/,/g, "");
                    }
                    return sum + (Number(value) || 0);
                }, 0);

                if (["ctr", "cpc", "cpm", "cpp", "conversion_rate", "roas", "frequency"].includes(key)) {
                    totalValues[key] = key === "cpc" || key === "cpm" || key === "cpp"
                        ? Math.round(totalValues[key] / pageLength)
                        : totalValues[key] / pageLength;
                }
            } else {
                totalValues[key] = "";
            }
        });

        return (
            <Card title={<span className='text-white'>Tổng cộng chi phí ADS</span>} style={{ marginTop: 16, width: "100%" }}>
                {newColumns.map((col) => {
                    let title_col = col!.title?.toString() || "";
                    if (col!.key === "onsite_web_purchase") {
                        title_col = "Lượt mua";
                    }
                    if (col!.key === "result_value") {
                        title_col = "Kết quả";
                    }
                    if (!col.hidden && totalValues[col!.key!.toString()] !== "") {
                        return (
                            <div key={col.key} style={{ display: "flex", justifyContent: "space-between", padding: "8px", borderBottom: "1px solid #f0f0f0" }}>
                                <strong className='text-blue-600'>{title_col}:</strong>
                                <span className='text-black font-bold'>{formatNumber2(totalValues[col!.key!.toString()])}</span>
                            </div>
                        );
                    }
                    return null;
                })}
            </Card>
        );
    };

    useEffect(() => {
        if (loading) {
            return;
        }
        CallData();

    }, [dates]);

    useEffect(() => {
        //setIsMobile(window.innerWidth < 900);
        setIsMobile(false)
    }, []);

    useEffect(() => {

        const temp_checkedList = localStorage.getItem("checkedList")
        if (temp_checkedList) {
            setCheckedList(JSON.parse(temp_checkedList))
        }

        const temp_columns_ads = localStorage.getItem("columns-ads")
        if (temp_columns_ads) {
            let temp_columns = JSON.parse(temp_columns_ads)
            const newSortColumns = [...sortColumns].sort((a, b) => {
                const indexA = temp_columns.findIndex((item) => item.key === a.key);
                const indexB = temp_columns.findIndex((item) => item.key === b.key);
                return indexA - indexB;
            });
            setSortColumns(newSortColumns)

            const newColumns = [...columns].sort((a, b) => {
                const indexA = newSortColumns.findIndex((item) => item.key === a.key);
                const indexB = newSortColumns.findIndex((item) => item.key === b.key);
                return indexA - indexB;
            });
            setColumns(newColumns)
        }

        const tempResize = localStorage.getItem("columns-ads-width")
        if (tempResize) {
            const columnsWidth = JSON.parse(tempResize)
            newColumns.forEach((item: any) => {
                const width = columnsWidth.find((i) => i.key === item.key)?.width;
                if (width) {
                    item.width = width;
                }
            });
            setColumns(newColumns)
        }

        setDates([
            dayjs().subtract(0, "day").startOf("day"),
            dayjs().endOf("day")
        ])


        getReportData()
        getIdAndNameAds()
        getDataNotifyAds()
        setLoading(false)

    }, [])


    if (loading) {
        return null
    }

    return (
        <div>
            {contextHolder}
            <h1 className="font-bold text-xl text-black text-center mb-3">Facebook Ads</h1>
            <div className='flex items-center flex-wrap gap-5 px-5 py-2 mb-3 shadow-lg bg-white rounded-lg'>
                <div className='flex gap-2'>
                    <Input.Search
                        placeholder="Tìm kiếm..."
                        onSearch={(value) => setSearchText(value)}
                        allowClear
                        disabled={loadingData}
                        style={{ width: 300 }}
                    />
                </div>

                <div className='flex flex-row gap-2 overflow-auto max-h-[100px] lg:max-h-[unset] lg:max-w-[1400px]'>
                    <div className='m-auto'>
                        <button className='text-nowrap px-2 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-white cursor-pointer' onClick={() => setOpenModalReport(true)}>
                            <i className="fa-solid fa-plus mx-1"></i>
                            Tạo báo cáo
                        </button>
                    </div>
                    {dataReportFb && dataReportFb.map((item, index) => {
                        return (
                            <Button disabled={loadingData} key={index} className={`px-2 py-1 rounded-lg border border-dashed border-red-900 flex gap-2 ${activeReport == item._id ? "!bg-green-500" : ""}`}>
                                <span className='text-blue-600 m-auto text-nowrap' onClick={() => RunReport(item._id)}>{item.name}</span>
                                <span className='flex flex-row gap-1 my-1'>

                                    <span className='text-green-600 m-auto' onClick={() => RunReport(item._id)}>
                                        <i className="fa-solid fa-play mx-1"></i>
                                    </span>

                                    <span className='text-yellow-500 m-auto' onClick={() => EditReport(item._id)}>
                                        <i className="fa-solid fa-pen-to-square mx-1"></i>
                                    </span>

                                    <Popconfirm title="Bạn có chắc chắn muốn xóa báo cáo này?"
                                        className='m-auto'
                                        onConfirm={() => RemoveReport(item._id)}
                                        okText="Có"
                                        cancelText="Không">
                                        <i className="fa-solid fa-trash mx-1" style={{ color: "red" }}></i>
                                    </Popconfirm>
                                </span>
                            </Button>
                        )
                    })}
                </div>

                <div className='flex gap-2 flex-wrap'>

                    <div className='flex gap-2 shadow-lg rounded p-2 m-1'>
                        <Tooltip placement="top" title={"Làm mới dữ liệu"} arrow={false} className='m-auto'>
                            <Button
                                disabled={loadingData}
                                onClick={asyncData}
                                className='px-2 py-1 border-1 rounded-md text-black border-red-300 hover:bg-blue-600 hover:text-white'>
                                <i className="fa-solid fa-sync-alt"></i>
                            </Button>
                        </Tooltip>
                        <div className="w-full max-w-full sm:max-w-md">
                            <RangePicker
                                onChange={handleChange}
                                value={dates}
                                presets={presets}
                                className="w-full"
                                disabled={loadingData}
                                format="DD/MM/YYYY"
                                classNames={{
                                    popup: {
                                        root: "custom-range-picker-dropdown",
                                    },
                                }}
                            />
                        </div>
                    </div>

                    <div className='flex gap-2 shadow-lg rounded p-2 m-1'>
                        <Tooltip placement="top" title={"Sẵp xếp cột"} arrow={false}>
                            <Button onClick={() => setOpenModalSortColumn(true)} className='px-2 py-1 border-1 rounded-md text-black border-red-300 hover:bg-blue-600 hover:text-white'>
                                <i className="fa-solid fa-filter"></i>
                            </Button>
                        </Tooltip>

                        <button
                            className='mx-2 px-2 py-1 border-1 rounded-md text-black border-red-300 hover:bg-blue-600 hover:text-white cursor-pointer'
                            onClick={() => setOpenModal(true)}>
                            <Badge
                                offset={[4, -8]}
                                count={Math.round(checkedList?.length)}
                                showZero style={{ backgroundColor: 'red' }}>
                                <span className="font-bold text-black hover:text-white">
                                    Ẩn/hiện
                                </span>
                            </Badge>
                        </button>

                        <Tooltip placement="top" title={"Show All"} arrow={false}>
                            <Button onClick={ShowAllTable} className='px-2 py-1 border-1 rounded-md text-black !border-red-500 !hover:bg-blue-600 !hover:text-white'>
                                <i className="fa-solid fa-table"></i>
                            </Button>
                        </Tooltip>

                        <Tooltip placement="top" title={"Lưu độ rộng cột"} arrow={false}>
                            <Button onClick={SaveResize} className='px-2 py-1 border-1 rounded-md text-black !bg-yellow-500 !hover:bg-blue-600 !hover:text-white'>
                                <i className="fa-regular fa-floppy-disk"></i>
                            </Button>
                        </Tooltip>
                    </div>

                    {/* <div className='flex p-2 m-1'>
                        <Button onClick={() => setOpenModalNotifyAds(true)} className='px-2 py-1 border-1 rounded-md text-black border-red-500 hover:bg-blue-600 m-auto'>
                            <Badge
                                offset={[4, -8]}
                                count={notifyAdsData.length}
                                showZero style={{ backgroundColor: 'red' }}>
                                <span className="font-bold text-black hover:text-red-500">
                                    Thông báo
                                </span>
                            </Badge>
                        </Button>
                    </div> */}
                </div>
            </div>

            <div className="px-5 py-2 shadow-lg bg-white rounded-lg mb-20">
                {isMobile ? (
                    <div className='flex flex-col'>
                        <div className='flex justify-center'>
                            {loadingData ? (<Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />) : <div>{renderMobileView(filteredData)}
                                {renderSummaryMobile(filteredData)}</div>}
                        </div>
                        <div className='w-full h-10 mb-10'></div>
                    </div>
                ) : (
                    <Table
                        bordered
                        components={{
                            header: {
                                cell: ResizableTitle,
                            },
                        }}
                        className={`${styles.customTable}`}
                        dataSource={filteredData}
                        columns={newColumns}
                        loading={loadingData}
                        onChange={handleTableChange}
                        scroll={{ x: "max-content" }}
                        pagination={{
                            defaultPageSize: pageSize,
                            showSizeChanger: true,
                            pageSizeOptions: ["5", "10", '15', "25", "50", "100"],
                            total: filteredData.length,
                        }}
                        tableLayout='auto'
                        summary={(pageData) => {
                            const pageLength = pageData.length;
                            let totalValues = {};
                            [
                                "daily_budget",
                                "spend",
                                "revenue",
                                "clicks",
                                "impressions",
                                "ctr",
                                "cpc",
                                "cpm",
                                "cpp",
                                "page_likes",
                                "shares",
                                "comments",
                                "video_views",
                                "messaging_conversations_started",
                                "cost_per_messaging_conversation_started",
                                "onsite_web_purchase",
                                "cost_per_purchase",
                                "average_order_value",
                                "conversion_rate",
                                "roas",
                                "quality_ranking",
                                "frequency",
                                "reach",
                                "purchase_conversion_value",
                                "onsite_conversion_purchase"
                            ].forEach((key) => {
                                totalValues[key] = 0;
                            });

                            newColumns.forEach((col) => {
                                let key = col.key!.toString();
                                if (totalValues.hasOwnProperty(key)) {
                                    totalValues[key] = pageData.reduce((sum, row) => {
                                        let value = row[key];

                                        if (typeof value === "string") {
                                            value = value.replace(/,/g, "");
                                        }

                                        return sum + (Number(value) || 0);
                                    }, 0);

                                    if (key == "ctr") {
                                        totalValues[key] = ((totalValues[key] / pageLength))
                                    }
                                    if (key == "cpc") {
                                        totalValues[key] = Math.round((totalValues[key] / pageLength))
                                    }
                                    if (key == "cpm") {
                                        totalValues[key] = Math.round((totalValues[key] / pageLength))
                                    }
                                    if (key == "cpp") {
                                        totalValues[key] = Math.round((totalValues[key] / pageLength))
                                    }
                                    if (key == "conversion_rate") {
                                        totalValues[key] = ((totalValues[key] / pageLength))
                                    }
                                    if (key == "roas") {
                                        totalValues[key] = ((totalValues[key] / pageLength))
                                    }
                                    if (key == "frequency") {
                                        totalValues[key] = ((totalValues[key] / pageLength))
                                    }

                                } else {
                                    totalValues[key] = "";
                                }

                            });


                            return (
                                <Table.Summary.Row>
                                    {newColumns.slice(0).map((col, index) => {
                                        if (!col.hidden) {
                                            return <Table.Summary.Cell key={col.key} index={index} align="center">
                                                {totalValues[col!.key!.toString()] !== undefined ? (
                                                    <strong>{formatNumber2(totalValues[col!.key!.toString()])}</strong>
                                                ) : null}
                                            </Table.Summary.Cell>
                                        }
                                    })}
                                </Table.Summary.Row>
                            );
                        }}
                    />)}
            </div>

            <Modal
                open={openModal}
                width={900}
                onCancel={() => setOpenModal(false)}
                onOk={SaveShowColum}
                title="Tuỳ chỉnh cột">
                <Row gutter={16}>
                    {options.map((option: any, index) => (

                        <Col xs={24} sm={12} md={8} key={index}>
                            <Checkbox
                                value={option.value}
                                checked={checkedList?.includes(option.value)}
                                onChange={(e) => {
                                    const newCheckedList = e.target.checked
                                        ? [...checkedList, option.value]
                                        : checkedList.filter(value => value !== option.value);
                                    setCheckedList(newCheckedList);
                                }}
                            >
                                <span className="overflow-clip">{option?.label}</span>
                            </Checkbox>
                        </Col>
                    ))}
                </Row>
            </Modal>

            <Modal
                open={openModalReport}
                width={900}
                onCancel={() => setOpenModalReport(false)}
                confirmLoading={modalLoadingCorfirm}
                onOk={SaveReport}
                title={
                    <p className='text-center font-bold'>Thông tin báo cáo</p>
                }>

                <Form layout="vertical" form={form}>

                    <Form.Item name="_id" hidden>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Tên báo cáo"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên báo cáo"
                            }
                        ]}>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Từ khoá chiến dịch"
                        name="keyword"
                        extra='Các từ khoá xuất hiện trong tên chiến dịch, các từ cách nhau bằng ","'
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập từ khoá có chứa trong tên chiến dịch"
                            }
                        ]}>
                        <Input />
                    </Form.Item>

                </Form>

                <p className='mb-3 text-center'>Nội dung hiển thị</p>
                <Divider></Divider>
                <Row gutter={16}>
                    {options.map((option, index) => (
                        <Col span={8} key={index}>
                            <Checkbox
                                value={option.value}
                                checked={checkedListReport?.includes(option.value)}
                                onChange={(e) => {
                                    const newCheckedList = e.target.checked
                                        ? [...checkedListReport, option.value].filter((value): value is string => value !== undefined)
                                        : checkedListReport.filter(value => value !== option.value);
                                    setCheckedListReport(newCheckedList);
                                }}
                            >
                                {option?.label?.toString()}
                            </Checkbox>
                        </Col>
                    ))}
                </Row>
            </Modal>

            <Modal
                open={openModalSortColumn}
                width={600}
                className='overflow-auto'
                onOk={() => SaveSortColumn()}
                onCancel={() => setOpenModalSortColumn(false)}
                title={<p className='text-center mb-5 text-blue-500'>Sắp xếp cột</p>}>
                <div className="grid gap-5 justify-start items-start max-h-[600px] overflow-auto">
                    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
                        <SortableContext items={columns.map((col) => col.key)} strategy={horizontalListSortingStrategy}>
                            {sortColumns.map((col, index) => (
                                <DraggableColumnHeader index={index + 1} key={col.key} title={col.title as string} columnKey={col.key as string} />
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>
            </Modal>

            <Modal
                width={1600}
                open={openModalNotifyAds}
                onCancel={() => setOpenModalNotifyAds(false)}
                onOk={SaveNotifyAds}
                confirmLoading={modalLoadingCorfirm}
                cancelButtonProps={{ hidden: true }}
                title={<p className='text-center mb-5 text-blue-500'>Thông báo chiến dịch</p>}>
                <div className='w-full bg-gray-50 rounded-lg flex flex-col gap-2'>
                    <div className='w-full min-h-96 rounded-t-lg'>
                        <Table
                            columns={initNotifyColum}
                            dataSource={notifyAdsData}
                            virtual
                            pagination={false}
                            className={`${styles.customTable} text-nowrap`}
                            scroll={{ y: 55 * 5 }} />
                    </div>
                    <div className='w-full bg-gray-300 rounded-b-lg'>
                        <Form form={formAdsNotify} layout="vertical" className="flex flex-row gap-4 px-4 py-2 w-full">

                            <div className='flex-1 flex flex-col gap-4'>
                                <Form.Item name="id" hidden>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="status" initialValue="stop" hidden>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="camp_id" label="Chiến dịch"
                                    rules={[{ required: true, message: "Vui lòng chọn chiến dịch!" }]}>
                                    <Select style={{ minWidth: 350 }}
                                        showSearch
                                        optionFilterProp="children">
                                        <Option key={0} value={"all"}>
                                            <strong>Tất cả</strong>
                                        </Option>
                                        {adsIdAndName && adsIdAndName.map((item, index) => {
                                            return <Option key={index + 1} value={item.id}>
                                                {item.name}
                                            </Option>
                                        })}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="action"
                                    label="Hành động"
                                    rules={[{ required: true, message: "Vui lòng chọn hành động!" }]}
                                    initialValue="NOTIFY">
                                    <Select style={{ minWidth: 200 }}>
                                        <Option value="PAUSED">Tắt camp</Option>
                                        <Option value="ACTIVE">Bật camp</Option>
                                        <Option value="NOTIFY">Chỉ thông báo telegram</Option>
                                    </Select>
                                </Form.Item>
                                <div className="flex gap-2 justify-center items-center">
                                    <Button type="default" className="bg-green-500 text-white" onClick={AddNotifyAds}>
                                        <i className="fa-solid fa-arrow-up"></i>
                                    </Button>
                                    <Button
                                        type="default"
                                        className="bg-red-500 text-white"
                                        onClick={() => formAdsNotify.resetFields()}
                                    >
                                        Huỷ
                                    </Button>
                                </div>
                            </div>

                            <div className="flex-[3] flex flex-col gap-4 border-l-2 px-4">
                                <p className='text-red-500'>Lưu ý: hiện các hệ điều mới chỉ hỗ trợ chỉ <strong>AND hoặc chỉ OR</strong> nếu chọn nhiều sẽ chỉ lấy cái đầu tiên</p>
                                {conditions.map((item, index) => (
                                    <div key={index} className="flex flex-wrap gap-2 items-center">

                                        <Form.Item
                                            name={["conditions", index, "key"]}
                                            label="Loại cảnh báo"
                                            rules={[{ required: true, message: "Vui lòng chọn giá trị cảnh báo!" }]}
                                        >
                                            <Select
                                                showSearch
                                                optionFilterProp="children"
                                                style={{ minWidth: 410 }}
                                                onChange={(value) => handleConditionChange(index, "key", value)}>
                                                {initColumns
                                                    .filter((item) => !["account_name", "name", "status", "created_time", "date_start", "date_stop"].includes(item!.key!.toString()))
                                                    .map((item, i) => (
                                                        <Option key={i} value={item.key}>
                                                            {typeof item.title === "function" ? item.title({}) : item.title}
                                                        </Option>
                                                    ))}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            name={["conditions", index, "condition"]}
                                            label="Điều kiện"
                                            rules={[{ required: true, message: "Vui lòng chọn điều kiện!" }]}>
                                            <Select style={{ minWidth: 120 }} onChange={(value) => handleConditionChange(index, "condition", value)}>
                                                <Option value="greater_than">Lớn hơn</Option>
                                                <Option value="less_than">Nhỏ hơn</Option>
                                                <Option value="equal">Bằng</Option>
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            name={["conditions", index, "value"]}
                                            label="Hạn mức"
                                            rules={[{ required: true, message: "Vui lòng nhập hạn mức!" }]}>
                                            <Input
                                                type="number"
                                                style={{ minWidth: 120 }}
                                                onChange={(e) => handleConditionChange(index, "value", e.target.value)}
                                            />
                                        </Form.Item>

                                        {index < conditions.length - 1 && (
                                            <Form.Item
                                                name={["conditions", index, "operator"]}
                                                label="Loại"
                                                initialValue="AND"
                                            >
                                                <Select style={{ minWidth: 80 }} onChange={(value) => handleConditionChange(index, "operator", value)}>
                                                    <Option value="AND">VÀ</Option>
                                                    <Option value="OR">HOẶC</Option>
                                                </Select>
                                            </Form.Item>
                                        )}

                                        <Button className='text-white bg-red-600' onClick={() => removeCondition(index)}>Xóa</Button>
                                    </div>
                                ))}
                                <div className='flex flex-col aligin-center items-center justify-center gap-2'>
                                    <Button type="default" className='bg-yellow-500' onClick={addCondition}>
                                        <i className="fa-solid fa-plus"></i>
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </Modal>

        </div >
    );
}