'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { service, crypto, DYNAMIC_BASE } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { DataTable, type Column } from '@/components/DataTable';
import { todayMMDDYYYY, fmtMMDDYYYY, nowTimeInZone } from '@/lib/datetime';
import { toastSuccess, confirmDialog } from '@/lib/alerts';

const DYN = DYNAMIC_BASE;

interface Row {
  sno: number;
  patient_name: string;
  surgery_name: string;
  date: string;
  id: string;
  surgery_start_time: string;
  surgery_duration_time: string;
  is_attender: string;
  attender_phone_number: string;
}

export function SurgeryApptDoctor() {
  const params = useParams<{ enc: string }>();
  const spinner = useSpinner();
  const enc = params?.enc as string;

  const [rows, setRows] = useState<Row[]>([]);
  const [doctorId, setDoctorId] = useState('');

  const loadForDate = useCallback((id: string, dob: string) => {
    spinner.show();
    // New API: GET by doctor; no date / is_completed query params -> filter client-side.
    service
      .getMethod(`${DYN}admin/operation-appointments?doctor=${id}`)
      .then((res2: any) => {
        spinner.hide();
        if (res2.data === 'Invalid' || !Array.isArray(res2.data)) {
          setRows([]);
          return;
        }
        const tst: Row[] = [];
        let count = 0;
        res2.data
          .filter(
            (ke: any) =>
              Number(ke.isCompleted) === 0 &&
              fmtMMDDYYYY(ke.date) === dob,
          )
          .forEach((ke: any) => {
            count++;
            tst.push({
              sno: count,
              patient_name: ke.patientName,
              surgery_name: ke.surgeryName,
              date: ke.date,
              id: ke.id,
              surgery_start_time: ke.surgeryStartTime,
              surgery_duration_time: ke.surgeryDurationTime,
              is_attender: String(ke.isAttender),
              attender_phone_number: ke.attenderPhoneNumber,
            });
          });
        setRows(tst);
      })
      .catch(() => spinner.hide());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const init = useCallback(() => {
    const userId = crypto.decodeEnc(enc);
    if (!userId) return;
    spinner.show();
    // New API doctors list has no user_id filter; fetch and match userId client-side.
    service
      .getMethod(`${DYN}admin/doctors`)
      .then((res: any) => {
        spinner.hide();
        const arr = Array.isArray(res.data) ? res.data : [];
        const d = arr.find((x: any) => String(x.userId) === String(userId));
        if (!d) return;
        setDoctorId(d.id);
        loadForDate(d.id, todayMMDDYYYY());
      })
      .catch(() => spinner.hide());
  }, [enc, loadForDate, spinner]);

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enc]);

  async function complete(row: Row) {
    const r = await confirmDialog('Complete this surgery appointment?');
    if (!r.isConfirmed) return;
    const currentTime = nowTimeInZone();
    const body: any = {
      id: row.id,
      completedTime: currentTime,
    };
    if (row.is_attender === '1') {
      body.attenderContent =
        'Surgery has been Completed. Please Visit Your Attender and Take care of them';
      body.phone = row.attender_phone_number;
    }
    spinner.show();
    try {
      await service.post(`admin/operation-appointments/${row.id}/complete`, body);
      spinner.hide();
      toastSuccess('Surgery Appointment Completed Successfully', 3000);
      init();
    } catch {
      spinner.hide();
    }
  }

  const columns: Column<Row>[] = [
    { key: 'sno', header: 'S.No', render: (_r, i) => i + 1 },
    { key: 'patient_name', header: 'Patient Name', sortable: true },
    { key: 'surgery_name', header: 'Surgery Name', sortable: true },
    { key: 'date', header: 'Date', render: (row) => fmtMMDDYYYY(row.date) },
    { key: 'surgery_start_time', header: 'Start Time' },
    { key: 'surgery_duration_time', header: 'Duration' },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <button onClick={() => complete(row)} className="px-2 text-green-600" title="Complete">
          <i className="fa fa-check" /> Complete
        </button>
      ),
    },
  ];

  return (
    <div>
      <h4 className="mb-4 text-xl font-semibold text-gray-800">
        Surgery Appointments
      </h4>
      <DataTable columns={columns} data={rows} pageSize={100} />
    </div>
  );
}
