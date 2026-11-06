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
import { Badge } from "@/components/ui/badge";
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
import { RefreshCw, Activity, ExternalLink, ShieldAlert } from "lucide-react";
import { getBackendApiUrl } from "@/lib/api-config";
import { OrderData } from "./columns";

export const columns: ColumnDef<OrderData>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0 font-bold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        #ID
        <CaretSortIcon className="ml-1 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-mono text-xs font-semibold text-muted-foreground">
        #{row.getValue("id")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0 font-bold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <CaretSortIcon className="ml-1 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = String(row.getValue("status") || "Open");
      const isOpen = status.toLowerCase() === "open";
      return (
        <Badge
          variant="outline"
          className={
            isOpen
              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30 font-medium text-xs flex items-center gap-1 w-fit"
              : "bg-muted text-muted-foreground border-border font-normal text-xs w-fit"
          }
        >
          {isOpen && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0 font-bold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Side
        <CaretSortIcon className="ml-1 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const side = String(row.getValue("type") || "Buy").toUpperCase();
      const isBuy = side === "BUY";
      return (
        <Badge
          className={
            isBuy
              ? "bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[11px] px-2"
              : "bg-rose-600 hover:bg-rose-700 text-white font-mono text-[11px] px-2"
          }
        >
          {side}
        </Badge>
      );
    },
  },
  {
    accessorKey: "symbol",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0 font-bold text-left"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Ticker
        <CaretSortIcon className="ml-1 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-mono font-bold text-sm tracking-wide text-foreground">
        {row.getValue("symbol")}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Strategy / Asset",
    cell: ({ row }) => {
      const name = String(row.getValue("name") || "");
      const isLive = name.includes("Live");
      return (
        <div className="flex flex-col">
          <span className="font-medium text-xs text-foreground">
            {name.replace(" Live", "")}
          </span>
          {isLive && (
            <span className="text-[10px] text-emerald-500 font-mono flex items-center gap-1">
              <Activity className="h-2.5 w-2.5" /> Alpaca Live Execution
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "orderAmount",
    header: () => <div className="text-right font-bold">Shares</div>,
    cell: ({ row }) => {
      const amt = parseFloat(row.getValue("orderAmount") || 0);
      return (
        <div className="text-right font-mono text-xs font-medium">
          {amt.toLocaleString()}
        </div>
      );
    },
  },
  {
    accessorKey: "buyPrice",
    header: () => <div className="text-right font-bold">Entry Price</div>,
    cell: ({ row }) => {
      const side = String(row.original.type || "").toUpperCase();
      const bp = parseFloat(String(row.original.buyPrice));
      const sp = parseFloat(String(row.original.sellPrice));
      const entryVal = side === "BUY" ? bp : sp;

      if (isNaN(entryVal) || entryVal <= 0) {
        return <div className="text-right font-mono text-xs text-muted-foreground">-</div>;
      }
      return (
        <div className="text-right font-mono text-xs font-semibold text-foreground">
          ${entryVal.toFixed(2)}
        </div>
      );
    },
  },
  {
    accessorKey: "sellPrice",
    header: () => <div className="text-right font-bold">Exit Price</div>,
    cell: ({ row }) => {
      const side = String(row.original.type || "").toUpperCase();
      const bp = parseFloat(String(row.original.buyPrice));
      const sp = parseFloat(String(row.original.sellPrice));
      const status = String(row.original.status || "");
      const exitVal = side === "BUY" ? sp : bp;

      if (status.toLowerCase() === "open" || isNaN(exitVal) || exitVal <= 0) {
        return (
          <div className="text-right font-mono text-xs text-muted-foreground italic">
            Pending
          </div>
        );
      }
      return (
        <div className="text-right font-mono text-xs font-semibold text-foreground">
          ${exitVal.toFixed(2)}
        </div>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: () => <div className="text-right font-bold">Total Capital</div>,
    cell: ({ row }) => {
      const tot = parseFloat(row.getValue("totalAmount") || 0);
      return (
        <div className="text-right font-mono text-xs font-bold text-foreground">
          ${tot.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      );
    },
  },
  {
    accessorKey: "profit",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0 font-bold ml-auto flex"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Realized P&L
        <CaretSortIcon className="ml-1 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = String(row.original.status || "");
      const rawProfit = parseFloat(String(row.getValue("profit")));

      if (status.toLowerCase() === "open" || isNaN(rawProfit)) {
        return (
          <div className="text-right font-mono text-xs text-muted-foreground">
            -
          </div>
        );
      }

      const isPos = rawProfit > 0;
      const isZero = Math.abs(rawProfit) < 0.01;

      return (
        <div
          className={`text-right font-mono text-xs font-bold ${
            isZero
              ? "text-muted-foreground"
              : isPos
              ? "text-emerald-500"
              : "text-rose-500"
          }`}
        >
          {isPos ? `+$${rawProfit.toFixed(2)}` : `$${rawProfit.toFixed(2)}`}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0 font-bold ml-auto flex"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date
        <CaretSortIcon className="ml-1 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-right font-mono text-xs text-muted-foreground">
        {row.getValue("date")}
      </div>
    ),
  },
];

export default function Orders() {
  const [data, setData] = React.useState<OrderData[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "id", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const fetchOrders = React.useCallback(async (showIndicator = false) => {
    if (showIndicator) setIsRefreshing(true);
    try {
      const baseUrl = getBackendApiUrl();
      const res = await fetch(`${baseUrl}/orders?limit=100`, { cache: "no-store" });
      if (res.ok) {
        const orders = await res.json();
        setData(orders);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Error fetching live orders from backend:", err);
    } finally {
      setLoading(false);
      if (showIndicator) setIsRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    fetchOrders(false);
    const interval = setInterval(() => {
      fetchOrders(false);
    }, 4000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

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
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
  });

  const openCount = data.filter((d) => String(d.status).toLowerCase() === "open").length;
  const closedCount = data.filter((d) => String(d.status).toLowerCase() === "closed").length;

  return (
    <div className="w-full space-y-4">
      {/* Top Status & Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Live Trades & Execution Orders
            </h1>
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 flex items-center gap-1.5 font-mono text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Alpaca Level 3 Connected
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
            <span>
              Real-time synchronization with Diamond Hands ETF (Paper Account)
            </span>
            {lastUpdated && (
              <>
                <span>•</span>
                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs px-2.5 py-1 bg-card">
            🟢 Open: <strong className="ml-1 text-emerald-500">{openCount}</strong>
          </Badge>
          <Badge variant="outline" className="font-mono text-xs px-2.5 py-1 bg-card">
            ⚪ Closed: <strong className="ml-1 text-foreground">{closedCount}</strong>
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchOrders(true)}
            disabled={isRefreshing}
            className="h-8 gap-1.5 text-xs ml-1"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters & Column Controls */}
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder="Filter by symbol (e.g. ARM, GILD)..."
          value={(table.getColumn("symbol")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("symbol")?.setFilterValue(event.target.value)
          }
          className="max-w-xs h-9 text-xs"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto h-9 text-xs">
              Columns <ChevronDownIcon className="ml-1 h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize text-xs"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Table */}
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-xs font-bold text-foreground py-3">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground text-xs">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                    <span>Connecting to backend & fetching live Alpaca orders...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/40 transition-colors"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2.5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground text-xs">
                  No orders recorded yet. Live trade daemon is scanning market.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between text-xs text-muted-foreground py-1">
        <div>
          Showing {table.getRowModel().rows.length} of {data.length} total orders
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 text-xs"
          >
            Previous
          </Button>
          <span className="font-mono text-xs">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {Math.max(1, table.getPageCount())}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 text-xs"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
