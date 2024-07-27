import { ColumnDef } from "@tanstack/react-table"

export type OrderData = {
    id: number;
    date: string;
    symbol: string;
    name: string;
    type: "Buy" | "Sell";
    buyPrice: number| "-";
    sellPrice: number| "-";
    profit: number| "-";
    orderAmount: number;
    totalAmount: number;
    status: "Open" | "Closed";
}

export const columns: ColumnDef<OrderData>[] = [
    {
        accessorKey: "type",
        header: "Type",
    },
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "date",
        header: "Date",
    },
    {
        accessorKey: "symbol",
        header: "Symbol",
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "buyPrice",
        header: "Buy Price",
    },
    {
        accessorKey: "sellPrice",
        header: "Sell Price",
    },
    {
        accessorKey: "profit",
        header: "Profit",
    },
    {
        accessorKey: "orderAmount",
        header: "Order Amount",
    },
    {
        accessorKey: "totalAmount",
        header: "Total Amount",
    },
]