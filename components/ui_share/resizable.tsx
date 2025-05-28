import { useState } from "react";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";

const ResizableTitle = (props:any) => {
    const { onResize, SaveResize, handelChangAllowSortColumn, width, ...restProps } = props;
    const [isResizing, setIsResizing] = useState(false);

    if (!width) {
        return <th {...restProps} />;
    }

    return (
        <Resizable
            width={width}
            height={10}
            handle={
                <span
                    className="react-resizable-handle"
                    style={{
                        position: "absolute",
                        right: 0,
                        bottom: 0,
                        cursor: "col-resize",
                        padding: 2,
                        height: 16,
                        minWidth: 5,
                        backgroundColor: "white",
                        borderTopLeftRadius: 5,
                    }}
                />
            }
            onResize={onResize}
            onResizeStart={() => {
                document.body.style.cursor = "col-resize";
                document.body.style.userSelect = "none";
                setIsResizing(true);
                handelChangAllowSortColumn();
            }}
            onResizeStop={(e, data) => {
                document.body.style.cursor = "default";
                document.body.style.userSelect = "auto";
                setIsResizing(false);
                handelChangAllowSortColumn();
                SaveResize();
            }}
            draggableOpts={{ enableUserSelectHack: false }}
        >
            <th
                {...restProps}
                className={isResizing ? "is-resizing" : ""}
                style={{
                    cursor: "col-resize",
                    transition: "background-color 0.2s ease",
                }}
            />
        </Resizable>
    );
};

export default ResizableTitle;