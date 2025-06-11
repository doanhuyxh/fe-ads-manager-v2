'use client'
import React, { useEffect, useState } from "react";
import { DatePicker, Button, Space, Table, Tooltip } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
const { RangePicker } = DatePicker;

import { get_pos_cake_analytics_sale_server, } from '../../../libs/ApiClient/ExternalDataApi';
import { nguon } from "../../../libs/config";
import { formatNumber } from '../../../libs/utils/format';


export default function Page() {


    const [loading, setLoading] = useState(true);
    const [loadingData, setLoadingData] = useState(true);

    const [dataShow, setDataShow] = useState<any[]>([]);
    const [dataTotal, setDataTotal] = useState<any>({});

    const [dates, setDates] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
    const [open, setOpen] = useState(false);
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


    const handleChange = (values: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
        if (values && values[0] && values[1] && dayjs(values[0]).isValid() && dayjs(values[1]).isValid()) {
            setDates([
                dayjs(values[0]),
                dayjs(values[1]),
            ]);
        }
    };

    const columns = [
        {
            title: "Nguồn đơn hàng",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Đơn chốt",
            dataIndex: "order_count",
            key: "order_count",
        },
        {
            title: "Tiền hàng",
            dataIndex: "price_data",
            key: "price_data",
        },
        {
            title: "Chiết khấu",
            dataIndex: "discount",
            key: "discount",
        },
        {
            title: "Doanh số",
            dataIndex: "sales",
            key: "sales",
        },
        {
            title: "Doanh thu",
            dataIndex: "cod",
            key: "cod",
        },
        {
            title: "Lợi nhuận",
            dataIndex: "profit",
            key: "profit",
        },
        {
            title: "Hàng bán ra",
            dataIndex: "success_order_count",
            key: "success_order_count",
        },

    ]

    const initData = async () => {

        let tempStart;
        if (dates[0] === null) {
            tempStart = dayjs().startOf("day").add(-1, "day").hour(17).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
        } else {
            tempStart = dates[0]!.add(-1, "day").hour(17).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
        }

        let tempEnd;
        if (dates[1] === null) {
            tempEnd = dayjs().endOf("day").hour(16).minute(59).second(59).millisecond(999).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
        }
        else {
            tempEnd = dates[1]!.endOf("day").hour(16).minute(59).second(59).millisecond(999).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
        }
        setLoadingData(true);
        const res: any = await get_pos_cake_analytics_sale_server(tempStart, tempEnd, null);
        setLoadingData(false);
        let temp: any = res.data.map((item: any, index: number) => {
            const itemData = nguon.find((element) => element.account_id === item.account);

            return {
                "key": index,
                "name": `${itemData?.platform || ""} / ${itemData?.name || ""}`,
                "ads_amount": formatNumber(item.success.ads_amount),
                "affiliate_price": formatNumber(item.success.affiliate_price),
                "capital": item.success.capital,
                "cod": formatNumber(item.success.cod),
                "diff_shipping_fee": 0,
                "discount": formatNumber(item.success.discount),
                "exchange_order_count": formatNumber(item.success.exchange_order_count),
                "exchange_payment": formatNumber(item.success.exchange_payment),
                "fee_marketplace": formatNumber(item.success.fee_marketplace),
                "marketplace_voucher": formatNumber(item.success.marketplace_voucher),
                "order_count": formatNumber(item.success.order_count),
                "order_count_pagination": formatNumber(item.success.order_count_pagination),
                "partner_fee": formatNumber(item.success.partner_fee),
                "prepaid": formatNumber(item.success.prepaid),
                "prepaid_by_point": formatNumber(item.success.prepaid_by_point),
                "price": formatNumber(item.success.price),
                "price_data": formatNumber(item.success.price_data),
                "product_count": formatNumber(item.success.product_count),
                "profit": formatNumber(item.success.profit),
                "range": formatNumber(item.success.range),
                "revenue": formatNumber(item.success.revenue),
                "sales": formatNumber(item.success.sales),
                "shipping_fee": formatNumber(item.success.shipping_fee),
                "surcharge": formatNumber(item.success.surcharge),
                "success_order_count": formatNumber(item.result.success_order_count),
            }
        });
        setLoadingData(false);
        setDataShow(temp);

    }


    useEffect(() => {
        if (loading) {
            return
        }
        initData();
    }, [dates]);


    useEffect(() => {
        const startOfDay = dayjs().add(1, "days").startOf("day").utc();
        const endOfDay = dayjs().endOf("day").utc();
        setDates([startOfDay, endOfDay]);
        setLoading(false);
    }, []);


    return (

        <div className="w-full mx-auto">
            <div className="p-5">
                <h1 className="font-bold text-black mb-5 text-center">Doanh thu</h1>
                <div className="bg-white rounded shadow-lg p-5 flex justify-between flex-wrap gap-2 mb-4">
                    <div className="flex gap-2 flex-wrap">
                        <label className="text-nowrap text-center text-black m-auto">Khoảng thời gian</label>
                        <RangePicker presets={presets}
                            disabled={loadingData}
                            open={open}
                            onOpenChange={setOpen}
                            value={dates}
                            onChange={handleChange}
                            allowEmpty />
                    </div>
                    <Tooltip placement="top" title={"Làm mới dữ liệu"} arrow={false}>
                        <Button
                            disabled={loadingData}
                            onClick={initData}
                            className='px-2 py-1 border-1 rounded-md text-black border-red-300 hover:bg-blue-600 hover:text-white'>
                            <i className="fa-solid fa-sync-alt"></i>
                        </Button>
                    </Tooltip>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-5 mb-4 overflow-x-auto">
                    <Table columns={columns}
                        bordered
                        className="text-nowrap table-bordered"
                        loading={loadingData}
                        dataSource={dataShow} />
                </div>
            </div>
        </div>

    )
}