'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { service, crypto, DYNAMIC_BASE } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { DataTable, type Column } from '@/components/DataTable';
import { todayISO, fmtMMDDYYYY } from '@/lib/datetime';
import { confirmDialog } from '@/lib/alerts';

const DYN = DYNAMIC_BASE;

interface Row {
  sno: number;
  name: string;
  phone: string;
  ftime: string;
  reschedule: string;
  totime: string;
  date: string;
  id: string;
}

interface Props {
  // 'complete' filters isCompleted===1; 'noshow' filters isShow===1
  mode: 'complete' | 'noshow';
  title: string;
}

export function ApptListFiltered({ mode, title }: Props) {
  const params = useParams<{ enc: string }>();
  const spinner = useSpinner();
  const enc = params?.enc as string;
  const [rows, setRows] = useState<Row[]>([]);
  const [docId, setDocId] = useState('');
  const [selectedDate, setSelectedDate] = useState(todayISO());
  // Patients list is date-independent — loaded once in init() and reused here,
  // so changing the date only re-fetches appointments, not the whole patient list.
  const patientsRef = useRef<any[]>([]);

  // Load the doctor's appointments for a date, filtered by mode.
  // AccountsAppointment has no patient name/phone (only patientIdId) — join patients.
  const loadForDate = useCallback(
    (id: string, date: string) => {
      spinner.show();
      service
        .getMethod(`${DYN}admin/appointments/by-doctor/${id}/date/${date}`)
        .then((res2: any) => {
          spinner.hide();
          const data = res2.data || [];
          const patientMap = new Map<string, any>();
          patientsRef.current.forEach((p: any) =>
            patientMap.set(String(p.id), p),
          );
          const tst: Row[] = [];
          let count = 0;
          data.forEach((ke: any) => {
            const match =
              mode === 'complete'
                ? Number(ke.isCompleted) === 1
                : Number(ke.isShow) === 1;
            if (match) {
              count++;
              const p = patientMap.get(String(ke.patientIdId));
              tst.push({
                sno: count,
                name: p ? `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim() : '',
                phone: p?.phone || '',
                ftime: ke.fromTime,
                reschedule: ke.reschduleTime,
                totime: ke.toTime || ke.todTime,
                date: ke.date,
                id: ke.id,
              });
            }
          });
          setRows(tst);
        })
        .catch(() => spinner.hide());
    },
    [mode, spinner],
  );

  const init = useCallback(() => {
    const userId = crypto.decodeEnc(enc);
    if (!userId) return;
    spinner.show();
    // Resolve the doctor and load the patient list ONCE; date changes after
    // this only re-fetch appointments (see loadForDate).
    Promise.all([
      service.getMethod(`${DYN}admin/doctors`),
      service.getMethod(`${DYN}admin/patients`),
    ])
      .then(([res, resP]: any[]) => {
        spinner.hide();
        patientsRef.current = resP?.data || [];
        const d = (res.data || []).find(
          (x: any) => String(x.userId) === String(userId),
        );
        if (!d) return;
        setDocId(d.id);
        loadForDate(d.id, todayISO());
      })
      .catch(() => spinner.hide());
  }, [enc, loadForDate, spinner]);

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enc, mode]);

  function onDateChange(value: string) {
    setSelectedDate(value);
    if (docId) loadForDate(docId, value);
  }

  async function remove(row: Row) {
    const r = await confirmDialog('Are you sure?');
    if (!r.isConfirmed) return;
    await service.DeleteMethod(`${DYN}admin/appointments/${row.id}`);
    setTimeout(init, 1000);
  }

  function soapLookup(id: string) {
    window.open(
      `https://trackappt.desss-portfolio.com/soapmodule/lookup/soapnotes_index/${id}?type=appointment`,
      '_blank',
    );
  }

  const columns: Column<Row>[] = [
    { key: 'sno', header: 'S.No', render: (_r, i) => i + 1 },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'phone', header: 'Phone Number', sortable: true },
    { key: 'ftime', header: 'Appointment Time', sortable: true },
    { key: 'reschedule', header: 'Reschedule Time' },
    { key: 'totime', header: 'Appointment To Time' },
    { key: 'date', header: 'Date', render: (row) => fmtMMDDYYYY(row.date) },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <div className="flex gap-1">
          <button onClick={() => remove(row)} className="px-2 text-red-600" title="Delete">
            <i className="fa fa-trash" />
          </button>
          <button onClick={() => soapLookup(row.id)} className="px-2 text-blue-600" title="SOAP Notes">
            <i className="fa fa-sticky-note" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h4 className="mb-4 text-xl font-semibold text-gray-800">{title}</h4>
      <DataTable
        columns={columns}
        data={rows}
        pageSize={100}
        toolbar={
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="form-input-base w-44"
            style={{ color: '#2670bd' }}
          />
        }
      />
    </div>
  );
}

export function ApptComplete() {
  return <ApptListFiltered mode="complete" title="Appointment Completed" />;
}

export function NoShowDoctor() {
  return <ApptListFiltered mode="noshow" title="No Show Appointments" />;
}
