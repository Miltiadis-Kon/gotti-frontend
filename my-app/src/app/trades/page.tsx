"use client";

import * as React from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { OrderData } from "./columns";

const data: OrderData[] = [
  {
    id: 1,
    date: "01/08/24",
    symbol: "AAPL",
    name: "Apple Inc.",
    status: "Open",
    buyPrice: 148.97,
    sellPrice: "-",
    profit: "-",
    orderAmount: 100,
    totalAmount: 15029,
    type: "Buy",
  },
  {
    id: 2,
    date: "02/08/24",
    symbol: "MSFT",
    name: "Microsoft Corporation",
    status: "Closed",
    buyPrice: 301.15,
    sellPrice: 301.29,
    profit: -14,
    orderAmount: 100,
    totalAmount: 30129,
    type: "Sell",
  },
  {
    id: 3,
    date: "02/08/24",
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    status: "Closed",
    buyPrice: 2800.0,
    sellPrice: 2900.0,
    profit: 100.0,
    orderAmount: 10,
    totalAmount: 29000.0,
    type: "Buy",
  },
  {
    id: 4,
    date: "03/08/24",
    symbol: "AMZN",
    name: "Amazon.com, Inc.",
    status: "Closed",
    buyPrice: 3500.0,
    sellPrice: 3400.0,
    profit: -100.0,
    orderAmount: 5,
    totalAmount: 17000.0,
    type: "Sell",
  },
];

const columns: ColumnDef<OrderData>[] = [
    /*
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  */
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          style={{ margin: "0rem", padding: "0rem" }}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize" style={{ margin: "0rem", padding: "0rem" }}>
        {row.getValue("status")}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          style={{ margin: "0rem", padding: "0rem" }}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Buy/Sell
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize" style={{ margin: "0rem", padding: "0rem" }}>
        {row.getValue("type")}
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          style={{ margin: "0rem", padding: "0rem" }}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase" style={{ margin: "0rem", padding: "0rem" }}>
        {row.getValue("date")}
      </div>
    ),
  },
  {
    accessorKey: "symbol",
    header: ({ column }) => {
      return (
        <Button
          style={{ margin: "0rem", padding: "0rem" }}
          className="text-left"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ticker
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="uppercase" style={{ margin: "0rem", padding: "0rem" }}>
        {row.getValue("symbol")}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="capitalize" style={{ margin: "0rem", padding: "0rem" }}>
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "orderAmount",
    header: () => <div style={{ margin: "0rem", padding: "0rem" }}>Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("orderAmount"));
      return <div style={{ margin: "0rem", padding: "0rem" }}>{amount}</div>;
    },
  },
  {
    accessorKey: "buyPrice",
    header: () => (
      <div style={{ margin: "0rem", padding: "0rem" }}>Trade Open</div>
    ),
    cell: ({ row }) => {
      const amount = isNaN(parseFloat(row.getValue("buyPrice")))
        ? "-"
        : parseFloat(row.getValue("buyPrice"));
      return <div style={{ margin: "0rem", padding: "0rem" }}>{amount}</div>;
    },
  },
  {
    accessorKey: "sellPrice",
    header: () => (
      <div style={{ margin: "0rem", padding: "0rem" }}>Trade Closed</div>
    ),
    cell: ({ row }) => {
      const amount = isNaN(parseFloat(row.getValue("sellPrice")))
        ? "-"
        : parseFloat(row.getValue("sellPrice"));
      return <div style={{ margin: "0rem", padding: "0rem" }}>{amount}</div>;
    },
  },
  {
    accessorKey: "profit",
    header: ({ column }) => {
      return (
        <Button
          style={{ margin: "0rem", padding: "0rem" }}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Profit
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase" style={{ margin: "0rem", padding: "0rem" }}>
        {isNaN(parseFloat(row.getValue("profit")))
          ? "-"
          : parseFloat(row.getValue("profit")).toFixed(2)}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const OrderData = row.original;

      function ReportTrade(id: number): void {
        throw new Error("Function not implemented.");
      }

      function HideTrade(id: number): void {
        throw new Error("Function not implemented.");
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(OrderData.id.toString())
              }
            >
              Copy OrderData ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => ReportTrade(OrderData.id)}>
              Report Trade
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => HideTrade(OrderData.id)}>
              Hide Trade
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function Orders() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-2">
        <Input
          placeholder="Filter symbol..."
          value={(table.getColumn("symbol")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("symbol")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border p-0">
        <Table className="p-1">
          <TableHeader className="text-left">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="p-0 text-left">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="text-left" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="p-0 m-0 text-left"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
