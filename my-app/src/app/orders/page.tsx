"use client";

import * as React from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
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
import { RefreshCw, Activity, Layers, ShieldCheck, Zap, Scale } from "lucide-react";
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
    accessorKey: "etfLevel",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0 font-bold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        ETF Tier
        <CaretSortIcon className="ml-1 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const lvl = Number(row.original.etfLevel || 3);
      if (lvl === 1) {
        return (
          <Badge
            variant="outline"
            className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-mono text-[11px] font-semibold flex items-center gap-1 w-fit"
          >
            <ShieldCheck className="h-3 w-3" /> L1 Boomer
          </Badge>
        );
      } else if (lvl === 2) {
        return (
          <Badge
            variant="outline"
            className="bg-sky-500/15 text-sky-400 border-sky-500/30 font-mono text-[11px] font-semibold flex items-center gap-1 w-fit"
          >
            <Scale className="h-3 w-3" /> L2 Steady
          </Badge>
        );
      }
      return (
        <Badge
          variant="outline"
          className="bg-purple-500/15 text-purple-400 border-purple-500/30 font-mono text-[11px] font-semibold flex items-center gap-1 w-fit"
        >
          <Zap className="h-3 w-3" /> L3 Diamond
        </Badge>
      );
    },
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
      const rawName = String(row.getValue("name") || "");
      const cleanName = rawName.replace(/^\[L[1-3]\]\s*/, "").replace(" Live", "");
      const isLive = rawName.includes("Live");
      return (
        <div className="flex flex-col">
          <span className="font-medium text-xs text-foreground">
            {cleanName}
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
      const amt = parseFloat(String(row.getValue("orderAmount") || 0));
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
      const tot = parseFloat(String(row.getValue("totalAmount") || 0));
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
  const [selectedEtf, setSelectedEtf] = React.useState<"all" | "1" | "2" | "3">("all");
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
      const res = await fetch(`${baseUrl}/orders?limit=150`, { cache: "no-store" });
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

  const l1Count = React.useMemo(() => data.filter((d) => Number(d.etfLevel) === 1).length, [data]);
  const l2Count = React.useMemo(() => data.filter((d) => Number(d.etfLevel) === 2).length, [data]);
  const l3Count = React.useMemo(() => data.filter((d) => Number(d.etfLevel || 3) === 3).length, [data]);

  const filteredData = React.useMemo(() => {
    if (selectedEtf === "all") return data;
    return data.filter((d) => Number(d.etfLevel || 3) === Number(selectedEtf));
  }, [data, selectedEtf]);

  const table = useReactTable({
    data: filteredData,
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

  const openCount = filteredData.filter((d) => String(d.status).toLowerCase() === "open").length;
  const closedCount = filteredData.filter((d) => String(d.status).toLowerCase() === "closed").length;

  return (
    <div className="w-full space-y-4">
      {/* Top Status & Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Live Trades & Execution Orders
            </h1>
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 flex items-center gap-1.5 font-mono text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Alpaca Multi-Account Live
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
            <span>
              Real-time segregated execution across Boomer Haven (L1), Steady Grind (L2), and Diamond Hands (L3) ETFs
            </span>
            {lastUpdated && (
              <>
                <span>•</span>
                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
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

      {/* ETF Tier Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Button
          variant={selectedEtf === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedEtf("all")}
          className="h-8 text-xs font-semibold gap-1.5"
        >
          <Layers className="h-3.5 w-3.5" />
          All Portfolios ({data.length})
        </Button>
        <Button
          variant={selectedEtf === "3" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedEtf("3")}
          className={`h-8 text-xs font-semibold gap-1.5 ${
            selectedEtf === "3" ? "bg-purple-600 hover:bg-purple-700 text-white" : "text-purple-400 hover:bg-purple-950/20"
          }`}
        >
          <Zap className="h-3.5 w-3.5" />
          🚀 Level 3: Diamond Hands ({l3Count})
        </Button>
        <Button
          variant={selectedEtf === "2" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedEtf("2")}
          className={`h-8 text-xs font-semibold gap-1.5 ${
            selectedEtf === "2" ? "bg-sky-600 hover:bg-sky-700 text-white" : "text-sky-400 hover:bg-sky-950/20"
          }`}
        >
          <Scale className="h-3.5 w-3.5" />
          ⚖️ Level 2: Steady Grind ({l2Count})
        </Button>
        <Button
          variant={selectedEtf === "1" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedEtf("1")}
          className={`h-8 text-xs font-semibold gap-1.5 ${
            selectedEtf === "1" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "text-emerald-400 hover:bg-emerald-950/20"
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          🛡️ Level 1: Boomer Haven ({l1Count})
        </Button>
      </div>

      {/* Filters & Column Controls */}
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder="Filter by symbol (e.g. QQQ, SPY, ARM, GILD)..."
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
                  No orders recorded for this tier yet. Live execution engine is active.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between text-xs text-muted-foreground py-1">
        <div>
          Showing {table.getRowModel().rows.length} of {filteredData.length} total orders in this view
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
