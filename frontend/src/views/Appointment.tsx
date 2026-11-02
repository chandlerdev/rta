'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { service, crypto, DYNAMIC_BASE } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { DataTable, type Column } from '@/components/DataTable';
import { todayISO, fmtMMDDYYYY, nowTimeInZone } from '@/lib/datetime';
import { toastSuccess, toastWarning, confirmDialog } from '@/lib/alerts';

const DYN = DYNAMIC_BASE;

interface ApptRow {
  sno: number;
  name: string;
  phone: string;
  ftime: string;
  to: string;
  reschedule: string;
  date: string;
  id: string;
}

export function Appointment() {
  const params = useParams<{ enc: string }>();
  const spinner = useSpinner();
  const enc = params?.enc as string;

  const [rows, setRows] = useState<ApptRow[]>([]);
  // Defaults to the current date; clear the picker to show all.
  const [selectedDate, setSelectedDate] = useState(todayISO());

  // doctor meta
  const [docId, setDocId] = useState('');
  const [timeZone, setTimeZone] = useState('');
  const [noSms, setNoSms] = useState('');
  const [intervel, setIntervel] = useState('');
  const [smsIntervel, setSmsIntervel] = useState('');
  const [fromBreak, setFromBreak] = useState('');
  const [toBreak, setToBreak] = useState('');
  const [isLunch, setIsLunch] = useState('');
  // Patients list is date-independent — loaded once in init() and reused, so a
  // date change only re-fetches appointments, not the whole patient list.
  const patientsRef = useRef<any[]>([]);

  // Build table rows from an appointments array + patients list (join by id).
  // AccountsAppointment has no patient name/phone (only patientIdId).
  const buildRows = useCallback((data: any[], patients: any[]): ApptRow[] => {
    const patientMap = new Map<string, any>();
    (patients || []).forEach((p: any) => patientMap.set(String(p.id), p));
    const tst: ApptRow[] = [];
    let count = 0;
    (data || []).forEach((ke: any) => {
      // isCompleted / isShow are numeric (0/1)
      if (Number(ke.isCompleted) === 0 && Number(ke.isShow) === 0) {
        count++;
        const p = patientMap.get(String(ke.patientIdId));
        tst.push({
          sno: count,
          name: p ? `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim() : '',
          phone: p?.phone || '',
          ftime: ke.fromTime,
          to: ke.toTime || ke.todTime,
          reschedule: ke.reschduleTime,
          date: ke.date,
          id: ke.id,
        });
      }
    });
    return tst;
  }, []);

  // No date selected -> all of the doctor's appointments.
  const loadAll = useCallback(
    (id: string) => {
      spinner.show();
      service
        .getMethod(`${DYN}admin/appointments/by-doctor/${id}`)
        .then((res2: any) => {
          spinner.hide();
          setRows(buildRows(res2.data, patientsRef.current));
        })
        .catch(() => spinner.hide());
    },
    [buildRows, spinner],
  );

  // Date selected -> server-side filter: by-doctor/{id}/date/{date}.
  const loadForDate = useCallback(
    (id: string, date: string) => {
      spinner.show();
      service
        .getMethod(`${DYN}admin/appointments/by-doctor/${id}/date/${date}`)
        .then((res2: any) => {
          spinner.hide();
          setRows(buildRows(res2.data, patientsRef.current));
        })
        .catch(() => spinner.hide());
    },
    [buildRows, spinner],
  );

  const init = useCallback(() => {
    const userId = crypto.decodeEnc(enc);
    if (!userId) return;
    spinner.show();
    // New API: read accounts_doctor -> GET admin/doctors (no by-userId endpoint;
    // fetch list and match on userId). Patients are date-independent, so load
    // them once here and reuse; date changes only re-fetch appointments.
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
        setTimeZone(d.timeZone);
        setNoSms(d.smsCount);
        setIntervel(d.intervel);
        setSmsIntervel(d.smsIntervel);
        setFromBreak(d.fromTimeBreak);
        setToBreak(d.toTimeBreak);
        setIsLunch(d.isLunch);
        loadForDate(d.id, todayISO());
      })
      .catch(() => spinner.hide());
  }, [enc, loadForDate, spinner]);

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enc]);

  function onDateChange(value: string) {
    setSelectedDate(value);
    if (!docId) return;
    // Selected date -> server filter; cleared -> load all.
    if (value) loadForDate(docId, value);
    else loadAll(docId);
  }

  async function completeAppt(row: ApptRow) {
    const time = nowTimeInZone(timeZone);
    // New API: POST admin/appointments/{id}/complete (AppointmentCompleteRequest)
    const body = {
      appointmentId: row.id,
      doctorId: docId,
      isCompleted: 1,
      fromTime: row.ftime,
      toTime: time,
      feedback: '',
      intervel: intervel,
      smsIntervel: smsIntervel,
      noSms: noSms,
      fromTimeBreak: fromBreak,
      toTimeBreak: toBreak,
      isLunch: isLunch,
    };
    try {
      await service.post(`admin/appointments/${row.id}/complete`, body);
    } catch {
      /* original treats error as success too */
    }
    toastSuccess('Appointment Completed Successfully', 3000);
    init();
  }

  async function noShow(row: ApptRow) {
    try {
      // New API: dedicated POST admin/appointments/{id}/no-show (empty body)
      await service.post(`admin/appointments/${row.id}/no-show`, {});
      toastWarning('No show');
      init();
    } catch {
      /* ignore */
    }
  }

  async function remove(row: ApptRow) {
    const r = await confirmDialog('Are you sure?');
    if (!r.isConfirmed) return;
    await service.DeleteMethod(`${DYN}admin/appointments/${row.id}`);
    setTimeout(init, 1000);
  }

  async function sendSms() {
    // POST admin/appointments/today-advance-sms/by-doctor/{doctorId}
    spinner.show();
    try {
      await service.post(
        `admin/appointments/today-advance-sms/by-doctor/${docId}`,
        {},
      );
      toastSuccess('SMS Send Successfully');
    } catch {
      /* ignore */
    } finally {
      spinner.hide();
    }
  }

  function soapLookup(id: string) {
    window.open(
      `https://trackappt.desss-portfolio.com/soapmodule/lookup/soapnotes_index/${id}?type=appointment`,
      '_blank',
    );
  }

  const columns: Column<ApptRow>[] = [
    { key: 'sno', header: 'S.No', render: (_r, i) => i + 1 },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'phone', header: 'Phone Number', sortable: true },
    { key: 'ftime', header: 'Appointment Time', sortable: true },
    { key: 'to', header: 'Appointment To Time' },
    { key: 'reschedule', header: 'Reschedule Time' },
    {
      key: 'date',
      header: 'Date',
      render: (row) => fmtMMDDYYYY(row.date),
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <div className="flex gap-1">
          <button onClick={() => remove(row)} className="px-2 text-red-600" title="Delete">
            <i className="fa fa-trash" />
          </button>
          <button onClick={() => completeAppt(row)} className="px-2 text-green-600" title="Complete">
            <i className="fa fa-check" />
          </button>
          <button onClick={() => noShow(row)} className="px-2 text-gray-600" title="No show">
            <i className="fa fa-eye-slash" />
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
      <h4 className="mb-4 text-xl font-semibold text-gray-800">
        Appointment Details
      </h4>
      <DataTable
        columns={columns}
        data={rows}
        pageSize={100}
        toolbar={
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="form-input-base w-full sm:w-44"
              style={{ color: '#2670bd' }}
            />
            <button onClick={sendSms} className="btn-primary-brand w-full bg-green-600 hover:bg-green-700 sm:w-auto">
              Send SMS
            </button>
          </div>
        }
      />
    </div>
  );
}
