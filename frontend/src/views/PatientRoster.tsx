'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { service, local, DYNAMIC_BASE } from '@/lib/service';

const DYN = DYNAMIC_BASE;
import { useSpinner } from '@/components/Spinner';
import { DataTable, type Column } from '@/components/DataTable';
import { PatientRosterForm } from '@/components/forms/PatientRosterForm';
import { toastSuccess, confirmDialog } from '@/lib/alerts';

interface Row {
  sno: number;
  patient_name: string;
  hospital: string;
  phone: string;
  email: string;
  attender_name: string;
  attender_phone: string;
  status: string;
  id: string;
}

export function PatientRoster() {
  const router = useRouter();
  const params = useParams<{ id: string; enc: string }>();
  const searchParams = useSearchParams();
  const spinner = useSpinner();

  const cmpId = (params?.id as string) || '0';
  const enc = (params?.enc as string) || '';
  const ck = searchParams.get('ck') || 'patient_roster';

  const [data, setData] = useState<Row[]>([]);

  const hospitalName =
    typeof window !== 'undefined' ? local.get('HospitalName') || '' : '';

  const load = useCallback(() => {
    spinner.show();
    // New API: GET admin/patient-rosters/{hospitalId}
    const hospitalId = local.get('TrackkerApptHosId') || '';
    service
      .getMethod(`${DYN}admin/patient-rosters/${hospitalId}`)
      .then((res: any) => {
        spinner.hide();
        if (res.data === 'Invalid' || !Array.isArray(res.data)) {
          setData([]);
          return;
        }
        const tst: Row[] = [];
        let count = 0;
        res.data
          .filter((ke: any) => Number(ke.isDeleted) !== 1)
          .forEach((ke: any) => {
            count++;
            tst.push({
              sno: count,
              patient_name: `${ke.firstName || ''} ${ke.lastName || ''}`,
              hospital: ke.hospitalId,
              phone: ke.phone,
              email: ke.email,
              attender_name: ke.attenderName || '',
              attender_phone: ke.attenderPhone || '',
              status: String(ke.status),
              id: ke.id,
            });
          });
        setData(tst);
      })
      .catch(() => spinner.hide());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hospitalName]);

  useEffect(() => {
    if (ck === 'patient_roster') load();
  }, [ck, load]);

  function navCk(eve: string, id?: string) {
    if (id) local.set('patienRostertId', id);
    router.push(`/homes/${cmpId}/${enc}?ck=${eve}`);
  }

  async function remove(row: Row) {
    const r = await confirmDialog('Are you sure Delete Appointment?');
    if (!r.isConfirmed) return;
    await service.DeleteMethod(`${DYN}admin/patient-rosters/${row.id}`);
    toastSuccess('Deleted Successfully');
    load();
  }

  const columns: Column<Row>[] = [
    { key: 'sno', header: 'S.No', render: (_r, i) => i + 1 },
    { key: 'patient_name', header: 'Patient Name', sortable: true },
    { key: 'hospital', header: 'Hospital' },
    { key: 'phone', header: 'Phone', sortable: true },
    { key: 'email', header: 'Email' },
    { key: 'attender_name', header: 'Attender Name' },
    { key: 'attender_phone', header: 'Attender Phone' },
    {
      key: 'status',
      header: 'Active',
      render: (row) => (
        <span
          className={`rounded px-2 py-0.5 text-xs ${
            row.status === '1'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {row.status === '1' ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <div className="flex gap-1">
          <button
            onClick={() => navCk('patient_roster_edit', row.id)}
            className="px-2 text-blue-600"
            title="Edit"
          >
            <i className="fa fa-pencil-square-o" />
          </button>
          <button
            onClick={() => remove(row)}
            className="px-2 text-red-600"
            title="Delete"
          >
            <i className="fa fa-trash" />
          </button>
        </div>
      ),
    },
  ];

  const BackBtn = () => (
    <div className="mb-3 flex justify-end">
      <button onClick={() => navCk('patient_roster')} className="btn-outline-brand">
        <i className="fa fa-reply-all mr-1" /> Back
      </button>
    </div>
  );

  if (ck === 'patient_roster_add') {
    return (
      <div>
        <BackBtn />
        <PatientRosterForm onSaved={() => navCk('patient_roster')} />
      </div>
    );
  }
  if (ck === 'patient_roster_edit') {
    const id =
      typeof window !== 'undefined' ? local.get('patienRostertId') : null;
    return (
      <div>
        <BackBtn />
        <PatientRosterForm rosterId={id} onSaved={() => navCk('patient_roster')} />
      </div>
    );
  }

  return (
    <div>
      <h4 className="mb-4 text-xl font-semibold text-gray-800">
        Patient Roster
      </h4>
      <DataTable
        columns={columns}
        data={data}
        toolbar={
          <button
            onClick={() => navCk('patient_roster_add')}
            className="btn-primary-brand"
          >
            <i className="fa fa-plus mr-1" /> Add New
          </button>
        }
      />
    </div>
  );
}
