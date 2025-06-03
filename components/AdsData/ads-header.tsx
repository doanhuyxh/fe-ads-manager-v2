import { Layout } from "antd"
const { Header: AntHeader } = Layout

export function Header({ name }: { name: string }) {
  return (
    <AntHeader className="!bg-white !h-auto min-h-fit border-b border-gray-200 sticky top-0 z-10 px-4 md:px-6">
      <div className="flex flex-wrap items-center justify-between py-2">
        <h1 className="text-lg md:text-2xl font-semibold text-blue-600">
          {name}
        </h1>
      </div>
    </AntHeader>
  )
}
