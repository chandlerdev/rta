'use client';

import { useCallback, useEffect, useState } from 'react';
import { service, DYNAMIC_BASE } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { DataTable, type Column } from '@/components/DataTable';
import { Toggle } from '@/components/Toggle';
import { toastSuccess, confirmDialog } from '@/lib/alerts';

const DYN = DYNAMIC_BASE;

interface Row {
  name: string;
  email: string;
  city: string;
  is_active: boolean;
  id: string;
  UserId: string;
}

export function BlockedHospital() {
  const spinner = useSpinner();
  const [data, setData] = useState<Row[]>([]);

  const load = useCallback(() => {
    spinner.show();
    service
      .getMethod(`${DYN}admin/hospitals`)
      .then((res2: any) => {
        spinner.hide();
        const rows: Row[] = [];
        (res2.data || []).forEach((ke: any) => {
          // isActive numeric: 0 = blocked office.
          if (Number(ke.isActive) === 0) {
            rows.push({
              name: ke.name,
              email: ke.email,
              city: ke.city,
              is_active: true,
              id: ke.id,
              UserId: ke.userId,
            });
          }
        });
        setData(rows);
      })
      .catch(() => spinner.hide());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function unblock(row: Row) {
    spinner.show();
    // Unblock = isActive 1. Dedicated status endpoint, PATCH.
    service
      .PatchMethod(`admin/hospitals/${row.id}/active?isActive=1`, undefined)
      .then(() => {
        spinner.hide();
        load();
        toastSuccess('Unblocked Successfully');
      })
      .catch(() => spinner.hide());
  }

  async function remove(row: Row) {
    const r = await confirmDialog('Are you sure?');
    if (!r.isConfirmed) return;
    await service.DeleteMethod(`${DYN}admin/hospitals/${row.id}`);
    setTimeout(load, 1000);
  }

  const columns: Column<Row>[] = [
    { key: 'sno', header: 'S.No', render: (_r, i) => i + 1 },
    { key: 'name', header: "Office Name", sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    {
      key: 'active',
      header: 'Unblock',
      render: (row) => (
        <Toggle checked={row.is_active} onChange={() => unblock(row)} />
      ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <button
          onClick={() => remove(row)}
          className="px-2 text-red-600"
          title="Delete"
        >
          <i className="fa fa-trash" />
        </button>
      ),
    },
  ];

  return (
    <div>
      <h4 className="mb-4 text-lg font-semibold text-gray-800 sm:text-xl">
        Blocked Office
      </h4>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
