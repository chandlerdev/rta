'use client';

import { useCallback, useEffect, useState } from 'react';
import { service, DYNAMIC_BASE } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { DataTable, type Column } from '@/components/DataTable';
import { Toggle } from '@/components/Toggle';
import { toastSuccess } from '@/lib/alerts';

const DYN = DYNAMIC_BASE;

interface DocRow {
  sno: number;
  name: string;
  specility: string;
  gender: string;
  id: string;
  UserId: string;
  is_active: boolean;
}

interface Props {
  hospitalId: string;
}

export function MoreDetailsHospital({ hospitalId }: Props) {
  const spinner = useSpinner();
  const [info, setInfo] = useState<any>(null);
  const [rows, setRows] = useState<DocRow[]>([]);

  const load = useCallback(() => {
    if (!hospitalId) return;
    spinner.show();
    service
      .getMethod(`${DYN}admin/hospitals/${hospitalId}`)
      .then((res2: any) => {
        const data = res2.data?.[0];
        setInfo(data);
        if (!data?.id) {
          spinner.hide();
          return;
        }
        // New API has no per-hospital doctor filter; fetch all and filter
        // client-side on hospitalIdId.
        return service
          .getMethod(`${DYN}admin/doctors`)
          .then((res: any) => ({ res, hid: data.id }));
      })
      .then((payload: any) => {
        spinner.hide();
        if (!payload || !Array.isArray(payload.res?.data)) {
          setRows([]);
          return;
        }
        const list = payload.res.data.filter(
          (d: any) => Number(d.hospitalIdId) === Number(payload.hid),
        );
        const reversed = [...list].reverse();
        const tst: DocRow[] = [];
        let count = 0;
        reversed.forEach((ke: any) => {
          // isActive numeric: 1 = active (not blocked)
          if (Number(ke.isActive) === 1) {
            count++;
            tst.push({
              sno: count,
              name: ke.firstName,
              specility: ke.specility,
              gender: ke.gender === 'M' ? 'Male' : 'Female',
              id: ke.id,
              UserId: ke.userId,
              is_active: false,
            });
          }
        });
        setRows(tst);
      })
      .catch(() => spinner.hide());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hospitalId]);

  useEffect(() => {
    load();
  }, [load]);

  function blockDoctor(row: DocRow) {
    spinner.show();
    // Block = isActive 0 (1 = active). Dedicated status endpoint, PATCH.
    service
      .PatchMethod(`admin/doctors/${row.id}/active?isActive=0`, undefined)
      .then(() => {
        spinner.hide();
        load();
        toastSuccess('Blocked Successfully');
      })
      .catch(() => spinner.hide());
  }

  const columns: Column<DocRow>[] = [
    { key: 'sno', header: 'S.No', render: (_r, i) => i + 1 },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'specility', header: 'Specility' },
    { key: 'gender', header: 'Gender' },
    { key: 'id', header: 'ID' },
    {
      key: 'active',
      header: 'Block',
      render: (row) => (
        <Toggle checked={row.is_active} onChange={() => blockDoctor(row)} />
      ),
    },
  ];

  return (
    <div>
      {info && (
        <div className="card-base mb-5 p-4 sm:p-6">
          <h4 className="mb-3 text-base font-bold text-gray-800 sm:text-lg">
            {info.name}
          </h4>
          <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-2">
            <p><strong>Email:</strong> {info.email}</p>
            <p><strong>Phone:</strong> {info.phone}</p>
          </div>
        </div>
      )}

      <h5 className="mb-3 font-semibold text-gray-700">Doctors</h5>
      <DataTable columns={columns} data={rows} />
    </div>
  );
}
