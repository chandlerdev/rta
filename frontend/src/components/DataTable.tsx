'use client';

import { useMemo, useState, ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (row: T, index: number) => ReactNode;
  // value used for sorting/filtering when no custom accessor
  accessor?: (row: T) => string | number;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  searchPlaceholder?: string;
  emptyText?: string;
  // optional toolbar content (e.g. an Add New button) shown to the right of search
  toolbar?: ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  pageSize = 10,
  searchPlaceholder = 'Search',
  emptyText = 'No Data',
  toolbar,
}: DataTableProps<T>) {
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(pageSize);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = useMemo(() => {
    const f = filter.trim().toLowerCase();
    if (!f) return data;
    return data.filter((row) =>
      Object.values(row).some((v) =>
        String(v ?? '')
          .toLowerCase()
          .includes(f),
      ),
    );
  }, [data, filter]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find((c) => c.key === sortKey);
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = col?.accessor ? col.accessor(a) : a[sortKey];
      const bv = col?.accessor ? col.accessor(b) : b[sortKey];
      const as = String(av ?? '').toLowerCase();
      const bs = String(bv ?? '').toLowerCase();
      if (as < bs) return sortDir === 'asc' ? -1 : 1;
      if (as > bs) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / size));
  const current = Math.min(page, totalPages - 1);
  const pageRows = sorted.slice(current * size, current * size + size);

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-64">
          <input
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(0);
            }}
            placeholder={searchPlaceholder}
            className="form-input-base w-full pl-9"
          />
          <i className="fa fa-search absolute left-3 top-3 text-gray-400" />
        </div>
        {toolbar}
      </div>

      {/* Table */}
      <div className="-mx-3 overflow-x-auto rounded-lg bg-white shadow sm:mx-0">
        <table className="table-base min-w-[640px]">
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  onClick={() => c.sortable && toggleSort(c.key)}
                  className={c.sortable ? 'cursor-pointer select-none' : ''}
                >
                  <span className="inline-flex items-center gap-1">
                    {c.header}
                    {c.sortable && sortKey === c.key && (
                      <i
                        className={`fa fa-caret-${
                          sortDir === 'asc' ? 'up' : 'down'
                        }`}
                      />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-6 text-center text-gray-500"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              pageRows.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  {columns.map((c) => (
                    <td key={c.key} data-label={c.header}>
                      {c.render
                        ? c.render(row, current * size + i)
                        : row[c.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginator */}
      <div className="mt-3 flex flex-col items-center justify-end gap-3 text-sm text-gray-600 sm:flex-row sm:flex-wrap sm:gap-4">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value));
              setPage(0);
            }}
            className="rounded border border-gray-300 px-2 py-1"
          >
            {[5, 10, 25, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <span>
          {sorted.length === 0
            ? '0'
            : `${current * size + 1}–${Math.min(
                (current + 1) * size,
                sorted.length,
              )}`}{' '}
          of {sorted.length}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={current === 0}
            className="rounded border border-gray-300 px-2 py-1 disabled:opacity-40"
          >
            <i className="fa fa-chevron-left" />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={current >= totalPages - 1}
            className="rounded border border-gray-300 px-2 py-1 disabled:opacity-40"
          >
            <i className="fa fa-chevron-right" />
          </button>
        </div>
      </div>
    </div>
  );
}
