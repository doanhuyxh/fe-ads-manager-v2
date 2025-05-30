'use client';
import '../../../styles/few.css'
import dynamic from "next/dynamic";
import { DatePicker, Space, Button, Spin, Tooltip } from "antd";
import { useEffect, useState } from 'react';
import dayjs from "dayjs";
const { RangePicker } = DatePicker;

import { get_pos_cake_analytics_sale_server, get_all_fb_fetch_campaign_data_v20 } from '../../../libs/ApiClient/ExternalDataApi';
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function Page() {
    const [adsDataTA, setAdsDataTA] = useState({
        doanhThu: 0,
        chiphi: 0
    });
    const [adsDataDat, setAdsDataDat] = useState({
        doanhThu: 0,
        chiphi: 0
    });

    const [loading, setLoading] = useState(true);
    const [loadingData, setLoadingData] = useState(true);
    const [height, setHeight] = useState(600);

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

    const [chartOptions, setChartOptions] = useState({
        series: [
            { name: "Doanh thu", data: [0, 0] },
            { name: "Chi phí", data: [0, 0] }
        ],
        options: {
            chart: { type: "bar" as const, height: 350 },
            plotOptions: { bar: { horizontal: false, columnWidth: "50%" } },
            dataLabels: {
                enabled: true,
                position: "top",
                formatter: (val: any) => {
                    return val.toLocaleString("vi-VN") + " VNĐ";
                },
                style: {
                    fontSize: "12px",
                    position: "top",
                }
            },
            stroke: { show: true, width: 2, colors: ["transparent"] },
            xaxis: {
                categories: [
                    `Thế Anh 0`,
                    `Đạt 0`
                ]
            },
            yaxis: { title: { text: "VNĐ" }, plotOptions: { bar: { horizontal: false } } },
            fill: { opacity: 1 },
            tooltip: {
                y: {
                    formatter: (val: any) => val.toLocaleString("vi-VN") + " VNĐ",
                    style: {
                        color: "#000000",
                        fontSize: "12px",
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: 400,
                        cssClass: "apexcharts-tooltip-text",
                    },
                }
            }
        }
    });

    const handleChange = (values: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
        if (values && values[0] && values[1] && dayjs(values[0]).isValid() && dayjs(values[1]).isValid()) {
            setDates([
                dayjs(values[0]),
                dayjs(values[1]),
            ]);
        }
    };


    async function initData() {
        setLoadingData(true);
        let tempStart;
        let dateStart;
        if (dates[0] === null) {
            tempStart = dayjs().startOf("day").add(-1, "day").hour(17).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
            dateStart = dayjs().startOf("day").format("YYYY-MM-DD");
        } else {
            tempStart = dates[0]!.add(-1, "day").hour(17).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
            dateStart = dates[0]!.startOf("day").format("YYYY-MM-DD");
        }

        let tempEnd;
        let dateEnd;
        if (dates[1] === null) {
            tempEnd = dayjs().endOf("day").hour(16).minute(59).second(59).millisecond(999).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
            dateEnd = dayjs().endOf("day").format("YYYY-MM-DD");
        }
        else {
            tempEnd = dates[1]!.endOf("day").hour(16).minute(59).second(59).millisecond(999).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
            dateEnd = dates[1]!.endOf("day").format("YYYY-MM-DD");
        }

        let filterTAnh = {
            "Order.source": [
                {
                    "page_id": null,
                    "order_sources": "-1",
                    "account": "122099327822003726"
                },
                {
                    "page_id": null,
                    "order_sources": "-1",
                    "account": "108620315133080"
                },
                {
                    "page_id": null,
                    "order_sources": "-1",
                    "account": "112001448526566"
                },
                {
                    "page_id": null,
                    "order_sources": "-1",
                    "account": "107542692371932"
                },
                {
                    "page_id": null,
                    "order_sources": "-1",
                    "account": "112568995123264"
                },
                {
                    "page_id": null,
                    "order_sources": "-1",
                    "account": "107199075691032"
                },
            ]
        }

        let filterDat = {
            "Order.source": [
                {
                    "page_id": null,
                    "order_sources": "-1",
                    "account": "107289375730029"
                },
                {
                    "page_id": null,
                    "order_sources": "-1",
                    "account": "163844190156596"
                },
                {
                    "page_id": null,
                    "order_sources": "-1",
                    "account": "105451299248248"
                },
                {
                    "page_id": null,
                    "order_sources": "-1",
                    "account": "144075242126994"
                },
                {
                    "page_id": null,
                    "order_sources": "-1",
                    "account": "100793083008333"
                },
                {
                    "page_id": null,
                    "order_sources": "-1",
                    "account": "110550278672634"
                }
            ]
        }

        Promise.all([get_all_fb_fetch_campaign_data_v20(dateStart, dateEnd), get_pos_cake_analytics_sale_server(tempStart, tempEnd, filterTAnh), get_pos_cake_analytics_sale_server(tempStart, tempEnd, filterDat)]).then((res) => {
            const data_fb_campaigns = res[0];
            const data_analytics_sale_TAnh = res[1];
            const data_analytics_sale_DAT = res[2];

            // sử lý dữ liệu chi phí ads
            let tempTA = 0;
            let tempDat = 0;

            data_fb_campaigns.forEach(ad => {

                if (ad.name.includes('TAnh')) {
                    tempTA += Number(ad.spend);
                }

                if (ad.name.includes('DAT')) {
                    tempDat += Number(ad.spend);
                }
            });


            // sử lý dữ liệu doanh thu
            let tempDoanhThuTA = 0;
            let tempDoanhThuDat = 0;

            // data_analytics_sale.data.map((item: any, index: number) => {

            //   if (pageTheAnh.includes(item.account)) {
            //     tempDoanhThuTA += Number(item.result.cod);
            //   }
            //   if (pageDat.includes(item.account)) {
            //     tempDoanhThuDat += Number(item.result.cod);
            //   }
            // });

            if (data_analytics_sale_TAnh) {
                tempDoanhThuTA = data_analytics_sale_TAnh.summary?.cod + data_analytics_sale_TAnh.summary?.prepaid;
            }

            if (data_analytics_sale_DAT) {
                tempDoanhThuDat = data_analytics_sale_DAT.summary?.cod + data_analytics_sale_DAT.summary?.prepaid;
            }


            setAdsDataTA({
                chiphi: tempTA,
                doanhThu: tempDoanhThuTA
            });

            setAdsDataDat({
                chiphi: tempDat,
                doanhThu: tempDoanhThuDat
            });

            setLoadingData(false);
        });
    }

    useEffect(() => {

        if (loading) return;
        initData();

    }, [dates]);

    useEffect(() => {

        let total_chi_phi = adsDataDat.chiphi + adsDataTA.chiphi
        let total_danh_thu = adsDataDat.doanhThu + adsDataTA.doanhThu

        const newOptions = {
            ...chartOptions,
            options: {
                ...chartOptions.options,
                xaxis: {
                    categories: [
                        `Thế Anh (chi phí ${adsDataTA.doanhThu ? ((adsDataTA.chiphi / adsDataTA.doanhThu) * 100).toFixed(2) : 0}%)`,
                        `Đạt (chi phí ${adsDataDat.doanhThu ? ((adsDataDat.chiphi / adsDataDat.doanhThu) * 100).toFixed(2) : 0}%)`,
                        `Tổng cộng (${total_danh_thu ? ((total_chi_phi / total_danh_thu) * 100).toFixed(2) : 0}%)`
                    ]
                },
            },
            series: [
                { name: "Doanh thu", data: [adsDataTA.doanhThu, adsDataDat.doanhThu, total_danh_thu] },
                { name: "Chi phí", data: [adsDataTA.chiphi, adsDataDat.chiphi, total_chi_phi] },
            ],
        }
        setChartOptions(newOptions);

    }, [adsDataTA, adsDataDat]);


    useEffect(() => {
        setDates([
            dayjs().startOf("day"),
            dayjs().endOf("day")
        ])

        const width = window.innerWidth;

        if (width < 768) {
            setHeight(400);
        } else {
            setHeight(600);
        }

        setLoading(false)
    }, [])

    if (loading) null

    return (
        <div>
            <h1 className='text-center font-bold mb-3 text-black'>Báo cáo</h1>
            <div className="bg-white shadow-lg rounded p-5 flex flex-wrap gap-2 justify-between mb-4">
                <div className="flex gap-2 flex-wrap">
                    <label className="m-auto text-black">Chọn thời gian</label>
                    <RangePicker presets={presets}
                        open={open}
                        disabled={loadingData}
                        onOpenChange={setOpen}
                        value={dates}
                        allowEmpty={[true, true]}
                        onChange={handleChange} />
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
            <div className='bg-white p-4 rounded-md shadow-lg'>
                {loadingData || !chartOptions ? (
                    <div className="w-full min-h-[600px] flex justify-center items-center">
                        <Spin size="large" />
                    </div>
                ) : (
                    <Chart options={chartOptions.options} series={chartOptions.series} type="bar" height={height} />
                )}



            </div>
        </div>
    );
}