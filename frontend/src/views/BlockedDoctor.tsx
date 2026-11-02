'use client';

import { useCallback, useEffect, useState } from 'react';
import { service, local, DYNAMIC_BASE } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { DataTable, type Column } from '@/components/DataTable';
import { Toggle } from '@/components/Toggle';
import { toastSuccess, confirmDialog } from '@/lib/alerts';

const DYN = DYNAMIC_BASE;

interface Row {
  name: string;
  specility: string;
  date: string;
  is_active: boolean;
  id: string;
  UserId: string;
}

export function BlockedDoctor() {
  const spinner = useSpinner();
  const [data, setData] = useState<Row[]>([]);

  const load = useCallback(() => {
    const userId = local.get('TrackkerApptHosID');
    if (!userId) return;
    spinner.show();
    service
      .getMethod(`${DYN}admin/hospitals`)
      .then((res2: any) => {
        // Resolve the logged-in hospital user's record by userId.
        const hosp = (res2?.data || []).find(
          (h: any) => String(h.userId) === String(userId),
        );
        if (!hosp?.id) {
          spinner.hide();
          return;
        }
        local.set('TrackkerApptHosId', hosp.id);
        return service.getMethod(
          `${DYN}admin/doctors?hospitalId=${hosp.id}`,
        );
      })
      .then((res: any) => {
        spinner.hide();
        if (!res || !Array.isArray(res.data)) {
          setData([]);
          return;
        }
        const rows: Row[] = [];
        res.data.forEach((ke: any) => {
          // Blocked doctors: isActive 0 (numeric); isDeleted 0 = not deleted.
          if (Number(ke.isActive) === 0 && Number(ke.isDeleted) === 0) {
            rows.push({
              name: ke.firstName,
              specility: ke.specility,
              date: ke.joinedDate,
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
      .PatchMethod(`admin/doctors/${row.id}/active?isActive=1`, undefined)
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
    await service.DeleteMethod(`${DYN}admin/doctors/${row.id}`);
    setTimeout(load, 1000);
  }

  const columns: Column<Row>[] = [
    { key: 'sno', header: 'S.No', render: (_r, i) => i + 1 },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'specility', header: 'Specility' },
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
        Blocked Doctor
      </h4>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
