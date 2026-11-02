'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { service, crypto, session, DYNAMIC_BASE } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { Calendar, type CalEvent, type CalView } from '@/components/Calendar';
import { nowTimeInZone, parseApptDateTime, calendarHourRange } from '@/lib/datetime';
import { toastSuccess, toastWarning, confirmDialog } from '@/lib/alerts';

const DYN = DYNAMIC_BASE;

export function CalAppointment() {
  const params = useParams<{ enc: string }>();
  const spinner = useSpinner();
  const enc = params?.enc as string;

  const [view, setView] = useState<CalView>('day');
  const [viewDate, setViewDate] = useState(new Date());
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [selected, setSelected] = useState<CalEvent | null>(null);

  // doctor meta
  const [docId, setDocId] = useState('');
  const [timeZone, setTimeZone] = useState('');
  const [noSms, setNoSms] = useState('');
  const [intervel, setIntervel] = useState('');
  const [smsIntervel, setSmsIntervel] = useState('');
  const [fromBreak, setFromBreak] = useState('');
  const [toBreak, setToBreak] = useState('');
  const [isLunch, setIsLunch] = useState('');
  // Visible calendar window, derived from the doctor's check-in / check-out time.
  const [dayStartHour, setDayStartHour] = useState(7);
  const [dayEndHour, setDayEndHour] = useState(20);

  const loadEvents = useCallback(
    (id: string) => {
      spinner.show();
      // Load ALL of the doctor's appointments; the Calendar places each event
      // on its own date across day/week/month. AccountsAppointment has no
      // patient name/phone (only patientIdId), so join the patient list.
      Promise.all([
        service.getMethod(`${DYN}admin/appointments/by-doctor/${id}`),
        service.getMethod(`${DYN}admin/patients`),
      ])
        .then(([res2, resP]: any[]) => {
          spinner.hide();
          const data = res2.data || [];
          const patientMap = new Map<string, any>();
          (resP?.data || []).forEach((p: any) => {
            patientMap.set(String(p.id), p);
          });
          const formatted: CalEvent[] = [];
          data.forEach((ke: any) => {
            if (Number(ke.isCompleted) === 0 && Number(ke.isShow) === 0) {
              const dateStr = ke.date;
              const ftime = ke.fromTime;
              const toTime = ke.toTime || ke.todTime || ftime;
              // Tolerant of both stored formats (yyyy-mm-dd AND MM-DD-YYYY).
              const start = parseApptDateTime(dateStr, ftime);
              const end = parseApptDateTime(dateStr, toTime);
              const p = patientMap.get(String(ke.patientIdId));
              const patientName = p
                ? `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim()
                : '';
              formatted.push({
                id: ke.id,
                title: patientName,
                start,
                end,
                meta: {
                  id: ke.id,
                  name: patientName,
                  phone: p?.phone || '',
                  ftime,
                  reschedule: ke.reschduleTime,
                  ftime_format: isNaN(start.getTime())
                    ? ftime
                    : start.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      }),
                  to_format: isNaN(end.getTime())
                    ? ''
                    : end.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      }),
                },
              });
            }
          });
          setEvents(formatted);
          // Calendar opens on the current date (viewDate defaults to today).
        })
        .catch(() => spinner.hide());
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const init = useCallback(() => {
    // Admin opens a specific doctor's calendar via session _V1_; the doctor
    // role uses their own user_id encoded in the URL enc segment.
    const v1 = typeof window !== 'undefined' ? session.get('_V1_') : null;
    const userId = v1 ? crypto.decodeEnc(v1) : crypto.decodeEnc(enc);
    if (!userId) return;
    spinner.show();
    // No by-user endpoint for doctors: fetch all and filter by userId client-side.
    service
      .getMethod(`${DYN}admin/doctors`)
      .then((res: any) => {
        spinner.hide();
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
        const { startHour, endHour } = calendarHourRange(
          d.checkInTime,
          d.checkOutTime,
        );
        setDayStartHour(startHour);
        setDayEndHour(endHour);
        loadEvents(d.id);
      })
      .catch(() => spinner.hide());
  }, [enc, loadEvents, spinner]);

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enc]);

  function changeDate(delta: number) {
    const d = new Date(viewDate);
    if (view === 'day') d.setDate(d.getDate() + delta);
    else if (view === 'week') d.setDate(d.getDate() + delta * 7);
    else d.setMonth(d.getMonth() + delta);
    setViewDate(d);
    // All appointments are already loaded; navigation just moves the window.
  }

  function goToday() {
    setViewDate(new Date());
  }

  async function completeAppt() {
    if (!selected) return;
    const time = nowTimeInZone(timeZone);
    const m = selected.meta;
    try {
      await service.post(`admin/appointments/${m.id}/complete`, {
        appointmentId: m.id,
        doctorId: docId,
        isCompleted: 1,
        fromTime: m.ftime,
        toTime: time,
        intervel,
        smsIntervel,
        noSms,
        fromTimeBreak: fromBreak,
        toTimeBreak: toBreak,
        isLunch,
      });
    } catch {
      /* original treats error as success */
    }
    setSelected(null);
    toastSuccess('Appointment Completed Successfully', 3000);
    init();
  }

  async function noShow() {
    if (!selected) return;
    try {
      // Old `is_show&is_show=1` maps to the show-flag toggle.
      await service.PatchMethod(
        `admin/appointments/${selected.meta.id}/show?isShow=1`,
        undefined,
      );
    } catch {
      /* ignore */
    }
    setSelected(null);
    toastWarning('No show');
    init();
  }

  async function remove() {
    if (!selected) return;
    const r = await confirmDialog('Are you sure?');
    if (!r.isConfirmed) return;
    await service.DeleteMethod(`${DYN}admin/appointments/${selected.meta.id}`);
    setSelected(null);
    setTimeout(init, 1000);
  }

  function title() {
    if (view === 'month')
      return viewDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    if (view === 'week') {
      return `Week of ${viewDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })}`;
    }
    return viewDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-4 flex flex-col flex-wrap items-center gap-3 sm:flex-row sm:justify-between">
        <div className="flex flex-wrap justify-center gap-2">
          <button onClick={() => changeDate(-1)} className="btn-outline-brand px-3">
            <i className="fa fa-chevron-left" />
          </button>
          <button onClick={goToday} className="btn-outline-brand">
            Today
          </button>
          <button onClick={() => changeDate(1)} className="btn-outline-brand px-3">
            <i className="fa fa-chevron-right" />
          </button>
        </div>
        <h3 className="text-center text-lg font-semibold text-gray-800">{title()}</h3>
        <div className="flex flex-wrap justify-center gap-1">
          {(['month', 'week', 'day'] as CalView[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded px-3 py-2 text-sm font-semibold capitalize ${
                view === v
                  ? 'bg-blue-600 text-white'
                  : 'border-2 border-blue-600 text-blue-600'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <Calendar
        view={view}
        viewDate={viewDate}
        events={events}
        dayStartHour={dayStartHour}
        dayEndHour={dayEndHour}
        onEventClick={(e) => setSelected(e)}
        onSlotClick={(d) => {
          // Clicking a day (month/week) drills into that day's time slots.
          if (view !== 'day') {
            setViewDate(d);
            setView('day');
          }
        }}
      />

      {/* Event manage modal */}
      {selected && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h5 className="text-lg font-semibold">{selected.title}</h5>
              <button onClick={() => setSelected(null)}>×</button>
            </div>
            <div className="mb-4 text-sm text-gray-600">
              <p>Phone: {selected.meta?.phone}</p>
              <p>
                Time: {selected.meta?.ftime_format}
                {selected.meta?.to_format ? ` - ${selected.meta.to_format}` : ''}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={completeAppt}
                className="rounded border-2 border-green-600 px-3 py-2 text-sm font-semibold text-green-600 hover:bg-green-600 hover:text-white"
              >
                Complete
              </button>
              <button
                onClick={noShow}
                className="rounded border-2 border-blue-600 px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-600 hover:text-white"
              >
                No Show
              </button>
              <button
                onClick={remove}
                className="rounded border-2 border-red-600 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-600 hover:text-white"
              >
                Delete
              </button>
              <button
                onClick={() => setSelected(null)}
                className="ml-auto rounded bg-red-500 px-3 py-2 text-sm font-semibold text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
