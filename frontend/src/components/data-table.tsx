"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  IconChevronLeft,
  IconChevronRight,
  IconDotsVertical,
  IconLayoutColumns,
  IconSearch,
  IconMailOpened
} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export const schema = z.object({
  uid: z.number(),
  subject: z.string(),
  from: z.string(),
  to: z.nullable(z.string()).optional(),
  date: z.string(),
  isRead: z.boolean().optional().default(false),
})

export function DataTable({
  data: initialData,
  folder: url,
}: {
  data: z.infer<typeof schema>[],
  folder: string,
}) {
  const router = useRouter();

  const [data, setData] = React.useState(() => initialData || [])
  const [activeTab, setActiveTab] = React.useState("all")

  React.useEffect(() => {
    if (initialData) setData(initialData)
  }, [initialData])

  const filteredData = React.useMemo(() => {
    if (activeTab === "unread") {
      return data.filter((item) => !item.isRead);
    }

    if (activeTab === "flagged") {
      return [];
    }

    return data;
  }, [data, activeTab]);

  const unreadCount = React.useMemo(() => {
    return data.filter((item) => !item.isRead).length;
  }, [data]);

  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const columns: ColumnDef<z.infer<typeof schema>>[] = [
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
          className="border-zinc-700 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="border-zinc-700 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
          />
          {!row.original.isRead && (
            <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
          )}
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      accessorKey: "header",
      header: "Subject",
      cell: ({ row }) => {
        const isUnread = !row.original.isRead;
        return (
          <div
            className={`
                cursor-pointer text-sm transition-colors truncate max-w-[300px] md:max-w-md
                ${isUnread ? "font-bold text-white" : "font-normal text-zinc-400"}
            `}
            onClick={() => router.push(`/email/${row.original.uid}?folder=${url}`)}
          >
            {row.original.subject || "(No Subject)"}
          </div>
        )
      },
      enableHiding: false,
    },
    {
      accessorKey: "sender",
      header: "Sender",
      cell: ({ row }) => {
        const from = row.original.from || "Unknown";
        const name = from.includes("<") ? from.split("<")[0].trim() : from;
        const isUnread = !row.original.isRead;

        const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500"];
        const color = colors[name.length % colors.length];

        return (
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${color} ${isUnread ? 'opacity-100' : 'opacity-50'}`} />
            <span className={`text-sm truncate max-w-[120px] ${isUnread ? "font-medium text-zinc-200" : "font-normal text-zinc-500"}`}>
              {name}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "time",
      header: "Date",
      cell: ({ row }) => {
        const dateStr = row.original.date;
        const isUnread = !row.original.isRead;

        const parseDateFlexible = (s: string): Date => {
          let d = new Date(s);
          if (!isNaN(d.getTime())) return d;
          const tzMap: Record<string, string> = { IST: "GMT+0530", GMT: "GMT+0000", UTC: "GMT+0000" };
          const cleanStr = s.replace(/\b([A-Z]{2,4})\b/g, (m) => (tzMap[m] ? tzMap[m] : m));
          d = new Date(cleanStr);
          return !isNaN(d.getTime()) ? d : new Date(NaN);
        };

        const dateObj = parseDateFlexible(dateStr);

        if (isNaN(dateObj.getTime())) {
          return <span className="text-xs text-zinc-500">{dateStr}</span>;
        }

        const today = new Date();
        const isToday =
          dateObj.getDate() === today.getDate() &&
          dateObj.getMonth() === today.getMonth() &&
          dateObj.getFullYear() === today.getFullYear();

        let displayValue = "";
        if (isToday) {
          displayValue = dateObj.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
        } else {
          displayValue = dateObj.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
          if (dateObj.getFullYear() !== today.getFullYear()) {
            displayValue += `, ${dateObj.getFullYear()}`;
          }
        }

        return (
          <span className={`text-xs tabular-nums whitespace-nowrap ${isUnread ? "font-bold text-blue-400" : "font-medium text-zinc-500"}`}>
            {displayValue}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800">
              <IconDotsVertical className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 border-zinc-800 bg-zinc-950 text-zinc-400">
            <DropdownMenuItem className="hover:bg-zinc-900 hover:text-zinc-100 cursor-pointer">Reply</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-zinc-900 hover:text-zinc-100 cursor-pointer">Mark as read</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem className="text-red-500 hover:bg-red-950/20 hover:text-red-400 cursor-pointer">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      size: 40,
    },
  ]

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.uid.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/50">
        <TabsList className="bg-zinc-900/50 border border-zinc-800 p-1 h-9">

          <TabsTrigger value="all" className="data-[state=active]:bg-zinc-700 data-[state=active]:text-zinc-100 text-zinc-400 text-xs px-3 h-7">
            All Mail
          </TabsTrigger>

          <TabsTrigger value="unread" className="data-[state=active]:bg-zinc-700 data-[state=active]:text-zinc-100 text-zinc-400 text-xs px-3 h-7">
            Unread
            {unreadCount > 0 && (
              <Badge className="ml-2 h-4 rounded-sm bg-indigo-500/20 text-[10px] text-indigo-300 hover:bg-indigo-500/30 border-0 px-1">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>

          <TabsTrigger value="flagged" className="data-[state=active]:bg-zinc-700 data-[state=active]:text-zinc-100 text-zinc-400 text-xs px-3 h-7">
            Flagged
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <IconSearch className="absolute left-2.5 top-2 size-3.5 text-zinc-500" />
            <Input
              placeholder="Filter messages..."
              className="h-8 w-[200px] pl-8 bg-zinc-900/50 border-zinc-800 text-xs text-zinc-300 focus-visible:ring-indigo-500/50"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
                <IconLayoutColumns className="size-3.5 mr-2" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-800">
              {table.getAllColumns().filter((c) => c.getCanHide()).map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize text-zinc-400 focus:text-zinc-100 focus:bg-zinc-900"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="relative overflow-hidden m-0 p-0">
        <Table className="w-full">
          <TableHeader className="bg-zinc-900/30 backdrop-blur-sm sticky top-0 z-20">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-zinc-800 hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan} style={{ width: header.getSize() }} className="text-zinc-500 h-10 text-xs uppercase tracking-wider font-medium">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`
                        group border-b border-zinc-800/50 transition-colors
                        ${!row.original.isRead ? "bg-zinc-900/30 hover:bg-zinc-900/80" : "hover:bg-zinc-900/40"}
                    `}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-zinc-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <IconMailOpened className="size-6 text-zinc-700" />
                    <p>
                      {activeTab === 'unread' ? "You're all caught up!" : "No emails found."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {table.getRowModel().rows?.length > 0 && (
        <div className="flex items-center justify-between border-t border-zinc-800/50 px-4 py-3 bg-zinc-900/10">
          <div className="text-xs text-zinc-500">
            {table.getFilteredSelectedRowModel().rows.length} selected
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                className="h-7 w-7 p-0 border-zinc-800 bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-white"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <IconChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="h-7 w-7 p-0 border-zinc-800 bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-white"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <IconChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Tabs>
  )
}
