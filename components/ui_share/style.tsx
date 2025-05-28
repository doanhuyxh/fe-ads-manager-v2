import { createStyles } from 'antd-style';
const useStyle = createStyles(({ css, token }: { css: any; token: Record<string, any> }) => {
    const { antCls } = token;
    return {
        customTable: css`
        ${antCls}-table {
          ${antCls}-table-container {
            ${antCls}-table-body,
            ${antCls}-table-content {
              scrollbar-width: thin;
              scrollbar-color: #eaeaea transparent;
              scrollbar-gutter: stable;
              text-alight:center
            }
          }
        }
      `,
    };
});

export default useStyle;