'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { service, local, DYNAMIC_BASE } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { DataTable, type Column } from '@/components/DataTable';
import { fmtMMDDYYYY } from '@/lib/datetime';
import { toastSuccess, confirmDialog } from '@/lib/alerts';
import { SurgeryApptForm } from '@/components/forms/SurgeryApptForm';

const DYN = DYNAMIC_BASE;

interface Row {
  sno: number;
  patient_name: string;
  surgery_name: string;
  id: string;
  date: string;
  surgery_start_time: string;
  pharmacy: string;
}

export function SurgeryAppt() {
  const router = useRouter();
  const params = useParams<{ id: string; enc: string }>();
  const searchParams = useSearchParams();
  const spinner = useSpinner();

  const cmpId = (params?.id as string) || '0';
  const enc = (params?.enc as string) || '';
  const ck = searchParams.get('ck') || 'surgery_appt';

  const [data, setData] = useState<Row[]>([]);

  const load = useCallback(() => {
    const hospitalId = local.get('TrackkerApptHosId');
    spinner.show();
    // pharmacy list first (to resolve names)
    service
      .getMethod(`${DYN}admin/pharmacies`)
      .then((resP: any) => {
        const pharmacyList = (Array.isArray(resP.data) ? resP.data : []).map(
          (k: any) => ({ pharmacy_id: k.id, name: k.pharmacyName }),
        );
        return service
          .getMethod(`${DYN}admin/operation-appointments?hospitalId=${hospitalId}`)
          .then((res: any) => ({ res, pharmacyList }));
      })
      .then(({ res, pharmacyList }: any) => {
        spinner.hide();
        if (res.data === 'Invalid' || !Array.isArray(res.data)) {
          setData([]);
          return;
        }
        const tst: Row[] = [];
        let count = 0;
        res.data
          // No is_completed query param in new API; filter pending client-side.
          .filter((ke: any) => Number(ke.isCompleted) === 0)
          .forEach((ke: any) => {
            const ph = pharmacyList.find(
              (i: any) => String(i.pharmacy_id) === String(ke.pharmacy),
            );
            count++;
            tst.push({
              sno: count,
              patient_name: ke.patientName,
              surgery_name: ke.surgeryName,
              id: ke.id,
              date: fmtMMDDYYYY(ke.date),
              surgery_start_time: ke.surgeryStartTime,
              pharmacy: ph?.name || '',
            });
          });
        setData(tst);
      })
      .catch(() => spinner.hide());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ck === 'surgery_appt') load();
  }, [ck, load]);

  function navCk(eve: string, id?: string) {
    if (id) local.set('SurgeryApptID', id);
    router.push(`/homes/${cmpId}/${enc}?ck=${eve}`);
  }

  async function remove(row: Row) {
    const r = await confirmDialog('Are you sure?');
    if (!r.isConfirmed) return;
    await service.DeleteMethod(`${DYN}admin/operation-appointments/${row.id}`);
    toastSuccess('Deleted Successfully');
    setTimeout(load, 800);
  }

  const columns: Column<Row>[] = [
    { key: 'sno', header: 'S.No', render: (_r, i) => i + 1 },
    { key: 'patient_name', header: 'Patient Name', sortable: true },
    { key: 'surgery_name', header: 'Surgery Name', sortable: true },
    { key: 'pharmacy', header: 'Pharmacy' },
    { key: 'date', header: 'Date' },
    { key: 'surgery_start_time', header: 'Start Time' },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <div className="flex gap-1">
          <button onClick={() => navCk('surgery_appt_edit', row.id)} className="px-2 text-blue-600" title="Edit">
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
      <button onClick={() => navCk('surgery_appt')} className="btn-outline-brand">
        <i className="fa fa-reply-all mr-1" /> Back
      </button>
    </div>
  );

  if (ck === 'surgery_appt_add') {
    return (
      <div>
        <BackBtn />
        <SurgeryApptForm onSaved={() => navCk('surgery_appt')} />
      </div>
    );
  }
  if (ck === 'surgery_appt_edit') {
    const id = typeof window !== 'undefined' ? local.get('SurgeryApptID') : null;
    return (
      <div>
        <BackBtn />
        <SurgeryApptForm apptId={id} onSaved={() => navCk('surgery_appt')} />
      </div>
    );
  }

  return (
    <div>
      <h4 className="mb-4 text-xl font-semibold text-gray-800">
        Surgery Appointments
      </h4>
      <DataTable
        columns={columns}
        data={data}
        toolbar={
          <button onClick={() => navCk('surgery_appt_add')} className="btn-primary-brand">
            <i className="fa fa-plus mr-1" /> Add New
          </button>
        }
      />
    </div>
  );
}
