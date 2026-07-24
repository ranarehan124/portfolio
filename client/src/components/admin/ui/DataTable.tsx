import { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
  FiChevronDown,
} from 'react-icons/fi';
import { cn } from '@/utils/helpers';

export interface DataColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  className?: string;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
}

interface PaginationInfo {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface DataTableProps<T> {
  columns: DataColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  onRowClick?: (row: T) => void;
  selectedRows?: Set<string>;
  onSelectRow?: (id: string) => void;
  onSelectAll?: () => void;
  /** @deprecated use rowActions instead */
  actions?: (row: T) => React.ReactNode;
  rowActions?: (row: T) => React.ReactNode;
  /** Keys the parent already filters by; accepted for API compatibility, no-op here. */
  searchKeys?: string[];
  pagination?: PaginationInfo;
  keyExtractor?: (row: T) => string;
  className?: string;
}

type SortDirection = 'asc' | 'desc' | null;

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr className="border-b border-white/[0.04]">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="skeleton h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

function SortIndicator({
  columnKey,
  sortKey,
  sortDirection,
}: {
  columnKey: string;
  sortKey: string;
  sortDirection: SortDirection;
}) {
  if (sortKey !== columnKey || !sortDirection) {
    return <FiChevronUp className="h-3 w-3 text-white/20" />;
  }
  return sortDirection === 'asc' ? (
    <FiChevronUp className="h-3 w-3 text-[#8B5CF6]" />
  ) : (
    <FiChevronDown className="h-3 w-3 text-[#8B5CF6]" />
  );
}

export default function DataTable<T extends object>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data found',
  onSort,
  onRowClick,
  selectedRows,
  onSelectRow,
  onSelectAll,
  actions,
  rowActions,
  pagination,
  keyExtractor,
  className,
}: DataTableProps<T>) {
  const resolvedActions = rowActions ?? actions;
  const [internalSort, setInternalSort] = useState<{
    key: string;
    direction: SortDirection;
  }>({ key: '', direction: null });

  const sortState = onSort ? internalSort : internalSort;

  const handleSort = useCallback(
    (key: string) => {
      if (!onSort) {
        setInternalSort((prev) => {
          if (prev.key === key) {
            const next: SortDirection =
              prev.direction === 'asc'
                ? 'desc'
                : prev.direction === 'desc'
                  ? null
                  : 'asc';
            return { key: next ? key : '', direction: next };
          }
          return { key, direction: 'asc' };
        });
        return;
      }
      const nextDir: 'asc' | 'desc' =
        sortState.key === key && sortState.direction === 'asc' ? 'desc' : 'asc';
      onSort(key, nextDir);
    },
    [onSort, sortState.key, sortState.direction],
  );

  const sortedData = useMemo(() => {
    if (!onSort && sortState.key && sortState.direction) {
      const result = [...data];
      result.sort((a, b) => {
        const aVal = (a as Record<string, unknown>)[sortState.key];
        const bVal = (b as Record<string, unknown>)[sortState.key];
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        const cmp = String(aVal).localeCompare(String(bVal), undefined, {
          numeric: true,
        });
        return sortState.direction === 'asc' ? cmp : -cmp;
      });
      return result;
    }
    return data;
  }, [data, onSort, sortState.key, sortState.direction]);

  const getRowId = useCallback(
    (row: T, index: number): string => {
      if (keyExtractor) return keyExtractor(row);
      const r = row as Record<string, unknown>;
      if (r._id) return String(r._id);
      if (r.id) return String(r.id);
      return `row-${index}`;
    },
    [keyExtractor],
  );

  const allSelected =
    selectedRows && sortedData.length > 0
      ? sortedData.every((row, i) => selectedRows.has(getRowId(row, i)))
      : false;

  const someSelected =
    selectedRows && sortedData.length > 0
      ? sortedData.some((row, i) => selectedRows.has(getRowId(row, i))) &&
        !allSelected
      : false;

  const displayData = pagination
    ? sortedData
    : sortedData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'overflow-hidden rounded-xl border border-white/[0.08]',
        'bg-[#0a0a0a]/80 backdrop-blur-xl',
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              {(onSelectRow || onSelectAll) && (
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={onSelectAll}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 accent-[#8B5CF6]"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  className={cn(
                    col.sortable && 'sortable',
                    col.className,
                  )}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <SortIndicator
                        columnKey={col.key}
                        sortKey={sortState.key}
                        sortDirection={sortState.direction}
                      />
                    )}
                  </div>
                </th>
              ))}
              {resolvedActions && (
                <th className="w-16 px-4 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow
                  key={i}
                  cols={
                    columns.length +
                    ((onSelectRow || onSelectAll) ? 1 : 0) +
                    (resolvedActions ? 1 : 0)
                  }
                />
              ))
            ) : displayData.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    ((onSelectRow || onSelectAll) ? 1 : 0) +
                    (resolvedActions ? 1 : 0)
                  }
                  className="px-4 py-16 text-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04]">
                      <FiSearch className="h-5 w-5 text-white/20" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/60">
                        {emptyMessage}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              displayData.map((row, idx) => {
                const rowId = getRowId(row, idx);
                const isSelected = selectedRows?.has(rowId) ?? false;
                return (
                  <motion.tr
                    key={rowId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className={cn(
                      onRowClick && 'cursor-pointer',
                      isSelected && 'selected',
                    )}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                  >
                    {(onSelectRow || onSelectAll) && (
                      <td
                        className="px-4 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onSelectRow?.(rowId)}
                          className="h-4 w-4 rounded border-white/20 bg-white/5 accent-[#8B5CF6]"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className={col.className}>
                        {col.render
                          ? col.render((row as Record<string, unknown>)[col.key], row, idx)
                          : ((row as Record<string, unknown>)[col.key] as React.ReactNode) ?? '—'}
                      </td>
                    ))}
                    {resolvedActions && (
                      <td
                        className="px-4 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {resolvedActions && resolvedActions(row)}
                      </td>
                    )}
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && !loading && (
        <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-3">
          <p className="text-xs text-white/30">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg',
                'text-white/40 transition-colors',
                'hover:bg-white/[0.06] hover:text-white/70',
                'disabled:cursor-not-allowed disabled:opacity-30',
              )}
            >
              <FiChevronLeft className="h-4 w-4" />
            </button>
            {Array.from(
              { length: pagination.totalPages },
              (_, i) => i + 1,
            )
              .filter((p) => {
                if (pagination.totalPages <= 5) return true;
                if (p === 1 || p === pagination.totalPages) return true;
                if (Math.abs(p - pagination.page) <= 1) return true;
                return false;
              })
              .reduce<(number | 'ellipsis')[]>((acc, p, i, arr) => {
                if (i > 0 && p - ((arr[i - 1] as number) ?? 0) > 1) {
                  acc.push('ellipsis');
                }
                acc.push(p);
                return acc;
              }, [])
              .map((item, i) =>
                item === 'ellipsis' ? (
                  <span
                    key={`e${i}`}
                    className="flex h-8 w-8 items-center justify-center text-xs text-white/30"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => pagination.onPageChange(item)}
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg text-xs transition-colors',
                      item === pagination.page
                        ? 'bg-[#8B5CF6] text-white font-medium'
                        : 'text-white/40 hover:bg-white/[0.06] hover:text-white/70',
                    )}
                  >
                    {item}
                  </button>
                ),
              )}
            <button
              onClick={() =>
                pagination.onPageChange(pagination.page + 1)
              }
              disabled={pagination.page >= pagination.totalPages}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg',
                'text-white/40 transition-colors',
                'hover:bg-white/[0.06] hover:text-white/70',
                'disabled:cursor-not-allowed disabled:opacity-30',
              )}
            >
              <FiChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}