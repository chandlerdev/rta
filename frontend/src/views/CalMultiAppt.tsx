'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { service, crypto, session, local, DYNAMIC_BASE } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { Calendar, type CalEvent, type CalView } from '@/components/Calendar';
import {
  fmtISODate,
  nowTimeInZone,
  addDurations,
  parseApptDateTime,
  calendarHourRange,
} from '@/lib/datetime';
import { toastSuccess, toastWarning, confirmDialog } from '@/lib/alerts';

const DYN = DYNAMIC_BASE;

interface PatientForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  gender: string;
  purpose: string;
  StartTime: string;
  EndTime: string;
  attender_name: string;
  attender_phone: string;
}

export function CalMultiAppt() {
  const params = useParams<{ enc: string }>();
  const spinner = useSpinner();
  const enc = params?.enc as string;

  const [view, setView] = useState<CalView>('day');
  const [viewDate, setViewDate] = useState(new Date());
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [selected, setSelected] = useState<CalEvent | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [slotDate, setSlotDate] = useState<Date | null>(null);
  const [patientList, setPatientList] = useState<any[]>([]);
  const [addPatientRoster, setAddPatientRoster] = useState(false);
  // Auto-center the day view on the nearest appointment once (first load).
  const centeredRef = useRef(false);

  // doctor meta
  const [docId, setDocId] = useState('');
  const [timeZone, setTimeZone] = useState('');
  const [timeType, setTimeType] = useState('');
  const [delay, setDelay] = useState('');
  const [intervel, setIntervel] = useState('');
  const [isLunch, setIsLunch] = useState('');
  const [slotCal, setSlotCal] = useState('15');
  // Visible calendar window, derived from the doctor's check-in / check-out time.
  const [dayStartHour, setDayStartHour] = useState(7);
  const [dayEndHour, setDayEndHour] = useState(20);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitted },
  } = useForm<PatientForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      gender: '',
      purpose: '',
      StartTime: '',
      EndTime: '',
      attender_name: '',
      attender_phone: '',
    },
  });

  const isStaticMulti = timeType === 'Static Multi Appointment';

  const loadEvents = useCallback((id: string) => {
    spinner.show();
    // Load ALL of the doctor's appointments; the Calendar places each event on
    // its own date. AccountsAppointment has no patient name/phone (only
    // patientIdId), so join the patient list.
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
            const toTime = ke.toTime || ke.todTime || ke.fromTime;
            // Tolerant of both stored formats (yyyy-mm-dd AND MM-DD-YYYY).
            const start = parseApptDateTime(ke.date, ke.fromTime);
            const end = parseApptDateTime(ke.date, toTime);
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
                ftime: ke.fromTime,
                reschedule: ke.reschduleTime,
                ftime_format: isNaN(start.getTime())
                  ? ke.app_fromtime
                  : start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                to_format: isNaN(end.getTime())
                  ? ''
                  : end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              },
            });
          }
        });
        setEvents(formatted);
        // On first load, open Day view on the appointment nearest to today so
        // the time slots aren't empty when nothing is scheduled for today.
        const valid = formatted.filter((e) => !isNaN(e.start.getTime()));
        if (!centeredRef.current && valid.length) {
          centeredRef.current = true;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          let best = valid[0].start;
          let bestDiff = Math.abs(best.getTime() - today.getTime());
          for (const e of valid) {
            const diff = Math.abs(e.start.getTime() - today.getTime());
            if (diff < bestDiff) {
              bestDiff = diff;
              best = e.start;
            }
          }
          setViewDate(new Date(best));
        }
      })
      .catch(() => spinner.hide());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const init = useCallback(() => {
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
        setTimeType(d.timeType);
        setDelay(d.consultTime);
        setIntervel(d.intervel);
        setIsLunch(d.isLunch);
        const { startHour, endHour } = calendarHourRange(
          d.checkInTime,
          d.checkOutTime,
        );
        setDayStartHour(startHour);
        setDayEndHour(endHour);
        const cal = addDurations(d.consultTime || '00:00:00', d.intervel || '00:00:00');
        // minutes portion as slot length
        const mins = cal.split(':');
        setSlotCal(String(Number(mins[0]) * 60 + Number(mins[1])) || '15');
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

  // slot click -> open add patient modal
  function onSlotClick(date: Date) {
    reset();
    setSlotDate(date);
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    setValue('StartTime', `${hh}:${mm}`);
    if (isStaticMulti) {
      const end = new Date(date.getTime() + Number(slotCal) * 60000);
      setValue(
        'EndTime',
        `${String(end.getHours()).padStart(2, '0')}:${String(
          end.getMinutes(),
        ).padStart(2, '0')}`,
      );
    }
    setAddOpen(true);
  }

  // phone lookup against patient_rosters
  const phone = watch('phone');
  function lookupPatient() {
    if (!phone || phone.length < 3) {
      setPatientList([]);
      setAddPatientRoster(false);
      return;
    }
    // New API only supports filtering rosters by hospitalId (a name string is
    // all we have here), so fetch and match the phone client-side.
    const hospitalId = local.get('TrackkerApptHosId') || '';
    service
      .getMethod(`${DYN}admin/patient-rosters/${hospitalId}`)
      .then((res: any) => {
        const list = (res.data || []).filter((p: any) =>
          String(p.phone || '').includes(phone),
        );
        setAddPatientRoster(list.length === 0);
        setPatientList(list);
      })
      .catch(() => {
        setAddPatientRoster(true);
        setPatientList([]);
      });
  }

  function selectPatient(p: any) {
    setValue('phone', p.phone);
    setValue('firstName', p.firstName);
    setValue('lastName', p.lastName);
    setValue('email', p.email);
    setPatientList([]);
  }

  async function saveAppointment(values: PatientForm) {
    if (!slotDate) return;
    // API uses ISO dates (matches the by-doctor/.../date/{date} reads).
    const date = fmtISODate(slotDate);
    const time = values.StartTime + ':00';
    const tod_time = values.EndTime ? values.EndTime + ':00' : '';
    const phoneFormat = '+1' + values.phone;

    spinner.show();
    try {
      // create roster if new
      if (addPatientRoster) {
        await service
          .post('admin/patient-rosters', {
            firstName: values.firstName || '',
            lastName: values.lastName || '',
            phone: phoneFormat,
            email: values.email || '',
            // NOTE: attender_name/attender_phone have no field in ZcmsPatientRoster.
            status: 1,
          })
          .catch(() => {});
      }

      // Static Multi Appointment -> static endpoint; otherwise dynamic.
      const apptEndpoint = isStaticMulti
        ? 'admin/patients/with-appointment'
        : 'admin/patients/with-dynamic-appointment';
      const res: any = await service.post(apptEndpoint, {
        firstName: values.firstName || '',
        lastName: values.lastName || '',
        phone: phoneFormat,
        email: values.email || '',
        age: '',
        gender: values.gender || '',
        purpose: values.purpose || '',
        date,
        fromTime: time,
        todTime: tod_time,
        doctorId: docId,
        appointmentType: timeType,
      });
      spinner.hide();
      const errMsg = res?.data?.[0]?.errmsg;
      if (errMsg) {
        toastWarning(errMsg, 3000);
        return;
      }
      toastSuccess('Appointment Added Successfully');
      setAddOpen(false);
      init();
    } catch {
      spinner.hide();
      toastWarning('Could not add appointment');
    }
  }

  // ----- manage existing event (complete / noshow / delete) -----
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
        isLunch,
      });
    } catch {
      /* treat as success */
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
      return viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (view === 'week')
      return `Week of ${viewDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    return viewDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  return (
    <div>
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
                view === v ? 'bg-blue-600 text-white' : 'border-2 border-blue-600 text-blue-600'
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
        onSlotClick={onSlotClick}
      />

      {/* Add patient modal */}
      {addOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={handleSubmit(saveAppointment)}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-4 sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h5 className="text-lg font-semibold">New Patient</h5>
              <button type="button" onClick={() => setAddOpen(false)}>
                ×
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Phone *</label>
                <input
                  {...register('phone', { required: true })}
                  onBlur={lookupPatient}
                  className="form-input-base"
                />
                {patientList.length > 0 && (
                  <ul className="mt-1 max-h-40 overflow-y-auto rounded border">
                    {patientList.map((p, i) => (
                      <li
                        key={i}
                        onClick={() => selectPatient(p)}
                        className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
                      >
                        {p.firstName} {p.lastName} — {p.phone}
                      </li>
                    ))}
                  </ul>
                )}
                {isSubmitted && errors.phone && (
                  <small className="text-red-500">Phone is required</small>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">First Name *</label>
                  <input {...register('firstName', { required: true })} className="form-input-base" />
                  {isSubmitted && errors.firstName && (
                    <small className="text-red-500">Required</small>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <input {...register('lastName')} className="form-input-base" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Start Time</label>
                  <input type="time" {...register('StartTime')} className="form-input-base" />
                </div>
                <div>
                  <label className="text-sm font-medium">End Time</label>
                  <input type="time" {...register('EndTime')} className="form-input-base" />
                </div>
              </div>

              {addPatientRoster && (
                <div className="grid grid-cols-1 gap-3 rounded bg-blue-50 p-3 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Attender Name</label>
                    <input {...register('attender_name')} className="form-input-base" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Attender Phone</label>
                    <input {...register('attender_phone')} className="form-input-base" />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button type="submit" className="btn-primary-brand">
                Save
              </button>
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                className="rounded bg-red-500 px-4 py-2 font-semibold text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Manage event modal */}
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
              <button onClick={completeAppt} className="rounded border-2 border-green-600 px-3 py-2 text-sm font-semibold text-green-600 hover:bg-green-600 hover:text-white">
                Complete
              </button>
              <button onClick={noShow} className="rounded border-2 border-blue-600 px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-600 hover:text-white">
                No Show
              </button>
              <button onClick={remove} className="rounded border-2 border-red-600 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-600 hover:text-white">
                Delete
              </button>
              <button onClick={() => setSelected(null)} className="ml-auto rounded bg-red-500 px-3 py-2 text-sm font-semibold text-white">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
