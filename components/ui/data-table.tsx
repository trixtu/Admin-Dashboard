"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Input } from "./input";
import { Button } from "./button";
import React, { useState, useEffect } from "react";
import { ToggleLeft } from "lucide-react";
import { cn } from "../../lib/utils";
import { Alert } from "../custom/Alert";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  onDeleteMany?: (selectedRows: TData[]) => void;
  onActivateMany?: (selectedRows: TData[]) => void;
  onDeactivateMany?: (selectedRows: TData[]) => void;
}

export type originalRows<TData> = {
  data: TData[];
};

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  onDeleteMany,
  onActivateMany,
  onDeactivateMany,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [open, setOpen] = useState<boolean>(false);

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

  useEffect(() => {
    // Set initial page size to 5
    table.setPageSize(7);
  }, [table]); // Run once when table instance changes

  const selectedRowModel = table.getSelectedRowModel().rows || [];
  const selectedOriginal = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);

  const deleteMany = async () => {
    if (onDeleteMany) {
      await onDeleteMany(selectedOriginal);
      setOpen(false);
    }
  };

  const activateMany = async () => {
    if (onActivateMany) {
      await onActivateMany(selectedOriginal);
    }
  };

  const deactivateMany = async () => {
    if (onDeactivateMany) {
      await onDeactivateMany(selectedOriginal);
    }
  };

  return (
    <div>
      {/* header */}
      <div className="md:flex p-6 items-center py-4 justify-between border-b">
        <Input
          placeholder="Filter here..."
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="card-toolbar lg:ml-20 items-center">
          <ul className="flex gap-2">
            {onActivateMany && (
              <Button
                variant={"outline"}
                className={cn(
                  "btn btn-icon ",
                  selectedRowModel.length > 0
                    ? "btn-outline-brand"
                    : "btn-outline-gray"
                )}
                disabled={selectedRowModel.length > 0 ? false : true}
                onClick={activateMany}
              >
                <ToggleLeft className="hidden md:block" />
                Activate
              </Button>
            )}

            {onDeactivateMany && (
              <Button
                variant={"outline"}
                className={cn(
                  "btn btn-icon ",
                  selectedRowModel.length > 0
                    ? "btn-outline-brand"
                    : "btn-outline-gray"
                )}
                disabled={selectedRowModel.length > 0 ? false : true}
                onClick={deactivateMany}
              >
                <ToggleLeft className="hidden md:block" />
                Deactivate
              </Button>
            )}

            {onDeleteMany && (
              <Button
                variant={"outline"}
                className={cn(
                  "btn btn-icon ",
                  selectedRowModel.length > 0
                    ? "btn-outline-brand"
                    : "btn-outline-gray"
                )}
                disabled={selectedRowModel.length > 0 ? false : true}
                onClick={() => {
                  setOpen(true);
                }}
              >
                <ToggleLeft className="hidden md:block" />
                Delete
              </Button>
            )}

            <Alert
              setOpenAlert={setOpen}
              openAlert={open}
              onConfirm={deleteMany}
            />
          </ul>
        </div>
      </div>

      <div className="rounded-[1px] items-center">
        <Table>
          <TableHeader className="text-base">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
          <TableBody className="text-base font-light">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
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
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* pagination controle */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground px-4">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2 px-4">
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
