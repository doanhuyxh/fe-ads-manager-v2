export function formatNumber(number:any) {
    if (number){
        const temp = Number(number)
        return temp.toLocaleString(undefined, { maximumFractionDigits: 0 });
    }else{
        return ""
    }
    
}

export function formatNumber2(number:any) {
    if (number){
        const temp = Number(number)
        return temp.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }else{
        return ""
    }
    
}

export const safeStringify = (obj:any) => {
    const seen = new WeakSet();
    return JSON.stringify(obj, (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) return "[Circular]";
            seen.add(value);
        }
        return value;
    });
};