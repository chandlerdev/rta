'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { service, local, DYNAMIC_BASE } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { DataTable, type Column } from '@/components/DataTable';
import { Toggle } from '@/components/Toggle';
import { toastSuccess, confirmDialog } from '@/lib/alerts';
import { HospitalAdd } from '@/components/forms/HospitalAdd';
import { HospitalEdit } from '@/components/forms/HospitalEdit';
import { MoreDetailsHospital } from '@/components/MoreDetailsHospital';

const DYN = DYNAMIC_BASE;

interface HospitalRow {
  sno: number;
  name: string;
  phone: string;
  city: string;
  is_active: boolean;
  email: string;
  id: string;
  UserId: string;
}

export function Hospital() {
  const router = useRouter();
  const params = useParams<{ id: string; enc: string }>();
  const searchParams = useSearchParams();
  const spinner = useSpinner();

  const cmpId = (params?.id as string) || '0';
  const enc = (params?.enc as string) || '';
  const ck = searchParams.get('ck') || 'hospital';

  const [data, setData] = useState<HospitalRow[]>([]);

  const load = useCallback(() => {
    spinner.show();
    service
      .getMethod(`${DYN}admin/hospitals`)
      .then((res2: any) => {
        spinner.hide();
        const rows: HospitalRow[] = [];
        let count = 0;
        (res2.data || []).forEach((ke: any) => {
          // New API: isActive is numeric; 1 = active (not blocked) office.
          if (Number(ke.isActive) === 1) {
            count++;
            rows.push({
              sno: count,
              name: ke.name,
              phone: ke.phone,
              city: ke.city,
              is_active: false, // Toggle = "blocked" state; listed offices are not blocked
              email: ke.email,
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
    if (ck === 'hospital' || ck === '') load();
  }, [ck, load]);

  function navCk(eve: string, id?: string) {
    if (id) local.set('TrackkerApptHosID', id);
    router.push(`/home/${cmpId}/${enc}?ck=${eve}`);
  }

  function blockHospital(row: HospitalRow) {
    spinner.show();
    // Block = isActive 0 (1 = active). Dedicated status endpoint, PATCH.
    service
      .PatchMethod(`admin/hospitals/${row.id}/active?isActive=0`, undefined)
      .then(() => {
        spinner.hide();
        load();
        toastSuccess('Blocked Successfully');
      })
      .catch(() => spinner.hide());
  }

  async function deleteHospital(row: HospitalRow) {
    const result = await confirmDialog('Are you sure?');
    if (!result.isConfirmed) return;
    await service.DeleteMethod(`${DYN}admin/hospitals/${row.id}`);
    setTimeout(load, 1000);
  }

  const columns: Column<HospitalRow>[] = [
    { key: 'sno', header: 'S.No', render: (_r, i) => i + 1 },
    { key: 'name', header: "Office Name", sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    {
      key: 'active',
      header: 'Block',
      render: (row) => (
        <Toggle checked={row.is_active} onChange={() => blockHospital(row)} />
      ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => navCk('hospitaledit', row.id)}
            className="px-2 text-blue-600"
            title="Edit"
          >
            <i className="fa fa-pencil-square-o" />
          </button>
          <button
            onClick={() => navCk('more', row.id)}
            className="px-2 text-blue-600"
            title="More details"
          >
            <i className="fa fa-user-md" />
          </button>
          <button
            onClick={() => navCk('doctorlist', row.id)}
            className="px-2 text-blue-600"
            title="Doctor list"
          >
            <i className="fa fa-lock" />
          </button>
          <button
            onClick={() => deleteHospital(row)}
            className="px-2 text-red-600"
            title="Delete"
          >
            <i className="fa fa-trash" />
          </button>
        </div>
      ),
    },
  ];

  // Sub-view back button
  const BackBtn = () => (
    <div className="mb-3 flex flex-wrap justify-end gap-2">
      <button onClick={() => navCk('hospital')} className="btn-outline-brand">
        <i className="fa fa-reply-all mr-1" /> Back
      </button>
    </div>
  );

  if (ck === 'add') {
    return (
      <div>
        <BackBtn />
        <HospitalAdd onSaved={() => navCk('hospital')} />
      </div>
    );
  }
  if (ck === 'hospitaledit') {
    const hid =
      typeof window !== 'undefined' ? local.get('TrackkerApptHosID') || '' : '';
    return (
      <div>
        <BackBtn />
        <HospitalEdit hospitalId={hid} onSaved={() => navCk('hospital')} />
      </div>
    );
  }
  if (ck === 'more') {
    const hid =
      typeof window !== 'undefined' ? local.get('TrackkerApptHosID') || '' : '';
    return (
      <div>
        <BackBtn />
        <MoreDetailsHospital hospitalId={hid} />
      </div>
    );
  }
  if (ck === 'doctorlist') {
    const hid =
      typeof window !== 'undefined' ? local.get('TrackkerApptHosID') || '' : '';
    return (
      <div>
        <BackBtn />
        <MoreDetailsHospital hospitalId={hid} />
      </div>
    );
  }

  // Default: list
  return (
    <div>
      <h4 className="mb-4 text-lg font-semibold text-gray-800 sm:text-xl">
        Office Details
      </h4>
      <DataTable
        columns={columns}
        data={data}
        toolbar={
          <button onClick={() => navCk('add')} className="btn-primary-brand">
            <i className="fa fa-plus mr-1" /> Add New
          </button>
        }
      />
    </div>
  );
}

function SubPlaceholder({ name }: { name: string }) {
  return (
    <div className="card-base p-8 text-center text-gray-500">
      <p className="text-lg font-semibold">“{name}” form</p>
      <p className="mt-2 text-sm">This sub-module is being converted.</p>
    </div>
  );
}
