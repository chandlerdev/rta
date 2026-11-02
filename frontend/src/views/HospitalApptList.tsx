'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { service, local, DYNAMIC_BASE } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { DataTable, type Column } from '@/components/DataTable';
import { todayISO, fmtMMDDYYYY } from '@/lib/datetime';
import { confirmDialog } from '@/lib/alerts';

const DYN = DYNAMIC_BASE;

interface Row {
  sno: number;
  name: string;
  DoctName: string;
  phone: string;
  ftime: string;
  totime: string;
  reschedule: string;
  date: string;
  id: string;
}

interface Props {
  // 'active' = isCompleted===0 && isShow===0
  // 'complete' = isCompleted===1
  // 'noshow' = isShow===1
  mode: 'active' | 'complete' | 'noshow';
  title: string;
}

export function HospitalApptList({ mode, title }: Props) {
  const spinner = useSpinner();
  const [rows, setRows] = useState<Row[]>([]);
  const [doctors, setDoctors] = useState<{ id: string; DoctName: string }[]>([]);
  const [doctorFilter, setDoctorFilter] = useState('');
  const [selectedDate, setSelectedDate] = useState(todayISO());

  const load = useCallback(
    (dateISO: string) => {
      const hospitalId = local.get('TrackkerApptHosId');
      if (!hospitalId) return;

      spinner.show();
      // New API: GET admin/appointments/by-hospital/{hospitalId}?date=
      // (response = HospitalAppointmentsResponse)
      service
        .getMethod(
          `${DYN}admin/appointments/by-hospital/${hospitalId}?date=${dateISO}`,
        )
        .then((res: any) => {
          spinner.hide();
          const data = res.data || [];
          const tst: Row[] = [];
          let count = 0;
          data.forEach((k2: any) => {
            // isCompleted / isShow are now numeric (0/1)
            const match =
              mode === 'active'
                ? Number(k2.isCompleted) === 0 && Number(k2.isShow) === 0
                : mode === 'complete'
                  ? Number(k2.isCompleted) === 1
                  : Number(k2.isShow) === 1;
            if (match) {
              count++;
              tst.push({
                sno: count,
                name: k2.patientName,
                DoctName: k2.doctorName,
                phone: k2.patientPhone,
                ftime: k2.fromTime,
                totime: k2.toTime,
                reschedule: k2.reschduleTime,
                date: k2.date,
                id: k2.appointmentId,
              });
            }
          });
          setRows(tst);
        })
        .catch(() => {
          spinner.hide();
          setRows([]);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode],
  );

  useEffect(() => {
    load(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Doctor dropdown — load ONCE on mount. The list doesn't depend on the
  // selected date, so it must not be re-fetched on every date change.
  useEffect(() => {
    const hospitalId = local.get('TrackkerApptHosId');
    if (!hospitalId) return;
    // New API: read accounts_doctor by hospital -> GET admin/doctors?hospitalId=
    service
      .getMethod(`${DYN}admin/doctors?hospitalId=${hospitalId}`)
      .then((res1: any) => {
        const list = (res1.data || []).map((k2: any) => ({
          id: k2.id,
          DoctName: k2.firstName,
        }));
        setDoctors(list);
      })
      .catch(() => {});
  }, []);

  const visibleRows = useMemo(() => {
    if (!doctorFilter) return rows;
    return rows.filter((r) => r.DoctName === doctorFilter);
  }, [rows, doctorFilter]);

  async function remove(row: Row) {
    const r = await confirmDialog('Are you sure?');
    if (!r.isConfirmed) return;
    await service.DeleteMethod(`${DYN}admin/appointments/${row.id}`);
    setTimeout(() => load(selectedDate), 1000);
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
    { key: 'DoctName', header: 'Doctor Name', sortable: true },
    { key: 'ftime', header: 'Appointment Time', sortable: true },
    ...(mode === 'active'
      ? [
          { key: 'totime', header: 'Appointment To Time' } as Column<Row>,
          { key: 'reschedule', header: 'Reschedule Time' } as Column<Row>,
        ]
      : mode === 'complete'
        ? [{ key: 'totime', header: 'Completed Time' } as Column<Row>]
        : []),
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
        data={visibleRows}
        pageSize={100}
        toolbar={
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                load(e.target.value);
              }}
              className="form-input-base w-full sm:w-44"
              style={{ color: '#2670bd' }}
            />
            <select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="form-input-base w-full sm:w-52"
            >
              <option value="">All Doctors</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.DoctName}>
                  {d.DoctName}
                </option>
              ))}
            </select>
          </div>
        }
      />
    </div>
  );
}

export function HosAppt() {
  return <HospitalApptList mode="active" title="Appointment Details" />;
}
export function HosApptComplete() {
  return <HospitalApptList mode="complete" title="Appointment Completed" />;
}
export function NoShow() {
  return <HospitalApptList mode="noshow" title="No Show Appointments" />;
}
