import { Layout, Typography, Input, Space } from "antd"
import { SearchOutlined } from "@ant-design/icons"

const { Header: AntHeader } = Layout
const { Title } = Typography

export function Header({name}:{name:string}) {
  return (
    <AntHeader
      style={{
        backgroundColor: "white",
        borderBottom: "1px solid #f0f0f0",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <Space align="center">
          <Title level={3} style={{ margin: 0, color: "blue" }}>
            {name}
          </Title>
        </Space>
      </div>
    </AntHeader>
  )
}
