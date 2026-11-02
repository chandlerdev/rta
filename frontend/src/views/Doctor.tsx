'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { service, local, session, crypto, DYNAMIC_BASE } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { DataTable, type Column } from '@/components/DataTable';
import { Toggle } from '@/components/Toggle';
import { toastSuccess, toastWarning, confirmDialog } from '@/lib/alerts';
import { DoctorAdd } from '@/components/forms/DoctorAdd';
import { DoctorEdit } from '@/components/forms/DoctorEdit';
import { AppointmentAdd } from '@/components/forms/AppointmentAdd';
import { CalAppointment } from '@/views/CalAppointment';
import { CalMultiAppt } from '@/views/CalMultiAppt';
import { AddMultiAppointment } from '@/components/forms/AddMultiAppointment';

const DYN = DYNAMIC_BASE;

interface DoctorRow {
  sno: number;
  name: string;
  phone: string;
  specility: string;
  date: string;
  gender: string;
  is_active: boolean;
  id: string;
  UserId: string;
  time_type: string;
}

function fmtDate(d: string) {
  if (!d) return '';
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${mm}-${dd}-${dt.getFullYear()}`;
}

export function Doctor() {
  const router = useRouter();
  const params = useParams<{ id: string; enc: string }>();
  const searchParams = useSearchParams();
  const spinner = useSpinner();

  const cmpId = (params?.id as string) || '0';
  const enc = (params?.enc as string) || '';
  const ck = searchParams.get('ck') || 'doctor';

  const [data, setData] = useState<DoctorRow[]>([]);
  const [doctorLimit, setDoctorLimit] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importRowRef = useRef<DoctorRow | null>(null);

  const load = useCallback(() => {
    const planID = local.get('plan_id');
    const userId = local.get('TrackkerApptHosID');

    spinner.show();
    if (planID) {
      service
        .getMethod(`${DYN}admin/subscriptions/plans/${planID}`)
        .then((res: any) => {
          if (res?.data?.[0]?.description2Number)
            setDoctorLimit(Number(res.data[0].description2Number));
        })
        .catch(() => {});
    }

    if (!userId) {
      spinner.hide();
      return;
    }

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
        if (!res || res.data === 'Invalid' || !Array.isArray(res.data)) {
          setData([]);
          return;
        }
        const reversed = [...res.data].reverse();
        const rows: DoctorRow[] = [];
        let count = 0;
        reversed.forEach((ke: any) => {
          // New API: isActive numeric 1=active; isDeleted 0=not deleted.
          if (Number(ke.isActive) === 1 && Number(ke.isDeleted) === 0) {
            count++;
            rows.push({
              sno: count,
              name: ke.firstName,
              phone: ke.phone,
              specility: ke.specility,
              date: ke.joinedDate,
              gender: ke.gender === 'M' ? 'Male' : 'Female',
              is_active: false,
              id: ke.id,
              UserId: ke.userId,
              time_type: ke.timeType,
            });
          }
        });
        setData(rows);
      })
      .catch(() => {
        spinner.hide();
        setData([]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ck === 'doctor' || ck === '') load();
  }, [ck, load]);

  function navCk(eve: string, id?: string, idx2?: string) {
    if (eve === 'add') {
      if (data.length >= doctorLimit && doctorLimit > 0) {
        toastWarning('Doctor Limit Exceeded', 3000);
        return;
      }
    }
    if (id) local.set('DoctorID', id);
    if (idx2) local.set('doctorUserId', idx2);
    if (
      (eve === 'appt' ||
        eve === 'cal_app_doctor' ||
        eve === 'cal_multi_appt') &&
      id
    ) {
      const idx = crypto.encryptJSON(id);
      session.set('_V1_', crypto.b64encode(idx));
    }
    router.push(`/homes/${cmpId}/${enc}?ck=${eve}`);
  }

  function blockDoctor(row: DoctorRow) {
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

  async function deleteDoctor(row: DoctorRow) {
    const result = await confirmDialog('Are you sure?');
    if (!result.isConfirmed) return;
    await service.DeleteMethod(`${DYN}admin/doctors/${row.id}`);
    setTimeout(load, 1000);
  }

  const columns: Column<DoctorRow>[] = [
    { key: 'sno', header: 'S.No', render: (_r, i) => i + 1 },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'specility', header: 'Specility' },
    { key: 'id', header: 'ID', sortable: true },
    {
      key: 'active',
      header: 'Block',
      render: (row) => (
        <Toggle checked={row.is_active} onChange={() => blockDoctor(row)} />
      ),
    },
    {
      key: 'appointment_Type',
      header: 'Appointment Type',
      render: (row) => {
        const isMulti =
          row.time_type === 'Static Multi Appointment' ||
          row.time_type === 'Dynamic Multi Appointment';
        const isSingle =
          row.time_type === 'Static Appointment' ||
          row.time_type === 'Dynamic Appointment';
        if (!isMulti && !isSingle) return null;
        return (
          <button
            onClick={() =>
              navCk(
                isMulti ? 'cal_multi_appt' : 'cal_app_doctor',
                row.UserId,
                row.UserId,
              )
            }
            className="text-blue-600 underline"
          >
            {row.time_type}
          </button>
        );
      },
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => navCk('edit', row.id, '')}
            className="px-2 py-1 text-blue-600"
            title="Edit"
          >
            <i className="fa fa-edit" />
          </button>
          <button
            onClick={() => deleteDoctor(row)}
            className="px-2 py-1 text-red-600"
            title="Delete"
          >
            <i className="fa fa-trash" />
          </button>
          <button
            onClick={() => sendSms(row.id)}
            className="whitespace-nowrap rounded bg-green-600 px-2 py-1 text-xs text-white"
          >
            Send SMS
          </button>
          <button
            onClick={downloadSampleFile}
            className="whitespace-nowrap rounded bg-blue-600 px-2 py-1 text-xs text-white"
          >
            <i className="fa fa-download mr-1" /> Sample File
          </button>
          <button
            onClick={() => triggerImport(row)}
            className="whitespace-nowrap rounded bg-blue-600 px-2 py-1 text-xs text-white"
          >
            <i className="fa fa-upload mr-1" /> Import File
          </button>
          <button
            onClick={() => exportAppointments(row)}
            className="whitespace-nowrap rounded bg-blue-600 px-2 py-1 text-xs text-white"
          >
            <i className="fa fa-download mr-1" /> Export Appointments
          </button>
        </div>
      ),
    },
  ];

  function sendSms(id: string) {
    // POST admin/appointments/today-advance-sms/by-doctor/{doctorId}
    spinner.show();
    service
      .post(`admin/appointments/today-advance-sms/by-doctor/${id}`, {})
      .then(() => {
        spinner.hide();
        toastSuccess('SMS sent');
      })
      .catch(() => {
        spinner.hide();
        toastWarning('Could not send SMS');
      });
  }

  // ---- Sample / Import / Export (Excel) ----
  // NOTE: the Import parser's expected columns are backend-defined; this sample
  // mirrors PatientRequest fields. Adjust headers if the backend expects others.
  function downloadSampleFile() {
    const ws = XLSX.utils.json_to_sheet([
      {
        FirstName: '',
        LastName: '',
        Phone: '',
        Email: '',
        Age: '',
        Gender: '',
        Purpose: '',
        Date: '',
        FromTime: '',
        ToTime: '',
      },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sample');
    XLSX.writeFile(wb, 'sample_patient_import.xlsx');
  }

  function triggerImport(row: DoctorRow) {
    importRowRef.current = row;
    fileInputRef.current?.click();
  }

  async function onImportFileSelected(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file
    const row = importRowRef.current;
    if (!file) return;
    // Dynamic appointment types import via the dynamic endpoint.
    const dynamic = (row?.time_type || '').toLowerCase().includes('dynamic');
    const endpoint = dynamic
      ? 'admin/import/patient-dynamic'
      : 'admin/import/patient';
    const form = new FormData();
    form.append('file', file);
    spinner.show();
    try {
      await service.Imgpost(`${DYN}${endpoint}`, form);
      spinner.hide();
      toastSuccess('Imported successfully');
      load();
    } catch {
      spinner.hide();
      toastWarning('Import failed');
    }
  }

  async function exportAppointments(row: DoctorRow) {
    spinner.show();
    try {
      const [appts, pts]: any[] = await Promise.all([
        service.getMethod(`${DYN}admin/appointments/by-doctor/${row.id}`),
        service.getMethod(`${DYN}admin/patients`),
      ]);
      const pmap = new Map<string, any>(
        (pts?.data || []).map((p: any) => [String(p.id), p]),
      );
      const out = (appts?.data || []).map((a: any) => {
        const p = pmap.get(String(a.patientIdId));
        return {
          Name: p ? `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim() : '',
          Phone: p?.phone || '',
          Date: a.date,
          'From Time': a.fromTime,
          'To Time': a.toTime || a.todTime || '',
          Status:
            Number(a.isCompleted) === 1
              ? 'Completed'
              : Number(a.isShow) === 1
                ? 'No Show'
                : 'Pending',
        };
      });
      const ws = XLSX.utils.json_to_sheet(
        out.length
          ? out
          : [{ Name: '', Phone: '', Date: '', 'From Time': '', 'To Time': '', Status: '' }],
      );
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Appointments');
      XLSX.writeFile(wb, `appointments_${row.name || row.id}.xlsx`);
      spinner.hide();
    } catch {
      spinner.hide();
      toastWarning('Export failed');
    }
  }

  const BackBtn = () => (
    <div className="mb-3 flex flex-wrap justify-end gap-2">
      <button onClick={() => navCk('doctor')} className="btn-outline-brand">
        <i className="fa fa-reply-all mr-1" /> Back
      </button>
    </div>
  );

  if (ck === 'add')
    return (
      <div>
        <BackBtn />
        <DoctorAdd onSaved={() => navCk('doctor')} />
      </div>
    );
  if (ck === 'edit') {
    const did =
      typeof window !== 'undefined' ? local.get('DoctorID') || '' : '';
    return (
      <div>
        <BackBtn />
        <DoctorEdit doctorId={did} onSaved={() => navCk('doctor')} />
      </div>
    );
  }
  if (ck === 'cal_app_doctor')
    return (
      <div>
        <BackBtn />
        <CalAppointment />
      </div>
    );
  if (ck === 'cal_multi_appt')
    return (
      <div>
        <BackBtn />
        <CalMultiAppt />
      </div>
    );
  if (ck === 'appt')
    return (
      <div>
        <BackBtn />
        <AppointmentAdd onSaved={() => navCk('doctor')} />
      </div>
    );
  if (ck === 'multi_appt')
    return (
      <div>
        <BackBtn />
        <AddMultiAppointment onSaved={() => navCk('doctor')} />
      </div>
    );

  return (
    <div>
      <h4 className="mb-4 text-lg font-semibold text-gray-800 sm:text-xl">
        Doctor Details
      </h4>
      {/* hidden input used by every row's "Import File" button */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={onImportFileSelected}
      />
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
