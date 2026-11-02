'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { service, local, DYNAMIC_BASE } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { DataTable, type Column } from '@/components/DataTable';
import { SurgeryForm } from '@/components/forms/SurgeryForm';
import { toastSuccess, confirmDialog } from '@/lib/alerts';

const DYN = DYNAMIC_BASE;

interface Row {
  sno: number;
  name: string;
  surgery_id: string;
  duration: string;
  dropOfTimeInAdvance: string;
}

export function SurgeryList() {
  const router = useRouter();
  const params = useParams<{ id: string; enc: string }>();
  const searchParams = useSearchParams();
  const spinner = useSpinner();

  const cmpId = (params?.id as string) || '0';
  const enc = (params?.enc as string) || '';
  const ck = searchParams.get('ck') || 'surgery_list';

  const [data, setData] = useState<Row[]>([]);

  const load = useCallback(() => {
    const hosId = local.get('TrackkerApptHosId');
    spinner.show();
    service
      .getMethod(`${DYN}admin/surgeries?hospitalId=${hosId}`)
      .then((res: any) => {
        spinner.hide();
        if (res.data === 'Invalid' || !Array.isArray(res.data)) {
          setData([]);
          return;
        }
        const tst: Row[] = [];
        let count = 0;
        res.data.forEach((ke: any) => {
          count++;
          tst.push({
            sno: count,
            name: ke.surgeryName,
            surgery_id: ke.id,
            duration: ke.duration,
            dropOfTimeInAdvance: ke.dropOfTimeInAdvance,
          });
        });
        setData(tst);
      })
      .catch(() => spinner.hide());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ck === 'surgery_list') load();
  }, [ck, load]);

  function navCk(eve: string, id?: string) {
    if (id) local.set('SurgeryID', id);
    router.push(`/homes/${cmpId}/${enc}?ck=${eve}`);
  }

  async function remove(row: Row) {
    const r = await confirmDialog('Are you sure?');
    if (!r.isConfirmed) return;
    await service.DeleteMethod(`${DYN}admin/surgeries/${row.surgery_id}`);
    toastSuccess('Deleted Successfully');
    setTimeout(load, 800);
  }

  const columns: Column<Row>[] = [
    { key: 'sno', header: 'S.No', render: (_r, i) => i + 1 },
    { key: 'name', header: 'Surgery Name', sortable: true },
    { key: 'duration', header: 'Duration' },
    { key: 'dropOfTimeInAdvance', header: 'Drop Off' },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <div className="flex gap-1">
          <button onClick={() => navCk('surgery_edit', row.surgery_id)} className="px-2 text-blue-600" title="Edit">
            <i className="fa fa-pencil-square-o" />
          </button>
          <button onClick={() => remove(row)} className="px-2 text-red-600" title="Delete">
            <i className="fa fa-trash" />
          </button>
        </div>
      ),
    },
  ];

  const BackBtn = () => (
    <div className="mb-3 flex justify-end">
      <button onClick={() => navCk('surgery_list')} className="btn-outline-brand">
        <i className="fa fa-reply-all mr-1" /> Back
      </button>
    </div>
  );

  if (ck === 'surgery_add') {
    return (
      <div>
        <BackBtn />
        <SurgeryForm onSaved={() => navCk('surgery_list')} />
      </div>
    );
  }
  if (ck === 'surgery_edit') {
    const id = typeof window !== 'undefined' ? local.get('SurgeryID') : null;
    return (
      <div>
        <BackBtn />
        <SurgeryForm surgeryId={id} onSaved={() => navCk('surgery_list')} />
      </div>
    );
  }

  return (
    <div>
      <h4 className="mb-4 text-xl font-semibold text-gray-800">Surgery List</h4>
      <DataTable
        columns={columns}
        data={data}
        toolbar={
          <button onClick={() => navCk('surgery_add')} className="btn-primary-brand">
            <i className="fa fa-plus mr-1" /> Add New
          </button>
        }
      />
    </div>
  );
}
