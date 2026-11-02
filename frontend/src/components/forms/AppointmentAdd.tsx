'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { service, session, crypto, DYNAMIC_BASE } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { Field } from '@/components/Field';
import { addDurations } from '@/lib/datetime';
import { toastSuccess, toastWarning } from '@/lib/alerts';

const DYN = DYNAMIC_BASE;

interface ApptForm {
  name: string;
  Lname: string;
  country_code: string;
  phone: string;
  date: string;
  appointment: string; // from time HH:mm
  tod_time: string; // to time HH:mm:ss
}

interface Props {
  onSaved: () => void;
}

function convertTime(t: string): string {
  const [h, m] = (t || '').split(':');
  return `${h}:${m}`;
}

export function AppointmentAdd({ onSaved }: Props) {
  const spinner = useSpinner();
  const [doctorId, setDoctorId] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [timeType, setTimeType] = useState('Static');
  const [delay, setDelay] = useState('');
  const [intervel, setIntervel] = useState('');
  const [isLunch, setIsLunch] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<ApptForm>({
    defaultValues: {
      name: '',
      Lname: '',
      country_code: '1',
      phone: '',
      date: '',
      appointment: '',
      tod_time: '',
    },
  });

  const fromTime = watch('appointment');

  // Load doctor (User_ID decrypted from session _V1_, set by the Doctor list)
  useEffect(() => {
    const v1 = session.get('_V1_');
    const userId = v1 ? crypto.decodeEnc(v1) : null;
    if (!userId) return;
    spinner.show();
    // New API: read accounts_doctor -> GET admin/doctors (match on userId).
    service
      .getMethod(`${DYN}admin/doctors`)
      .then((res: any) => {
        spinner.hide();
        const d = (res.data || []).find(
          (x: any) => String(x.userId) === String(userId),
        );
        if (!d) return;
        setDoctorName(d.firstName);
        setDelay(d.consultTime);
        setIntervel(d.intervel);
        setDoctorId(d.id);
        setIsLunch(d.isLunch);
        setTimeType(d.timeType);
      })
      .catch(() => spinner.hide());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // auto-calc to-time for Static when from-time changes
  useEffect(() => {
    if (!fromTime) return;
    if (timeType === 'Static') {
      const cal = addDurations(delay || '00:00:00', intervel || '00:00:00');
      const toCal = addDurations(fromTime + ':00', cal);
      setValue('tod_time', toCal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromTime, timeType, delay, intervel]);

  async function save(values: ApptForm, eve: 'no' | 'con') {
    // The native date input already yields ISO yyyy-mm-dd; the API uses ISO
    // dates, matching the by-doctor/.../date/{date} reads.
    const dob = values.date;
    const apptFtime = values.appointment + ':00';
    const todTimeFull =
      values.tod_time + (values.tod_time.length === 5 ? ':00' : '');
    const phone = values.country_code + values.phone;

    // New API: PatientRequest body. Static -> admin/patients/with-appointment;
    // Dynamic -> admin/patients/with-dynamic-appointment.
    // NOTE: PatientRequest has no `delay` / `isLunch` fields, so those drop.
    const isStatic = timeType === 'Static';
    const body = {
      firstName: values.name,
      lastName: values.Lname,
      phone: phone,
      email: 'test@gmail.com',
      age: 23,
      gender: 'M',
      purpose: 'legache',
      date: dob,
      fromTime: apptFtime,
      todTime: isStatic ? convertTime(values.tod_time) : todTimeFull,
      doctorId: doctorId,
      appointmentType: timeType,
    };
    const endpoint = isStatic
      ? 'admin/patients/with-appointment'
      : 'admin/patients/with-dynamic-appointment';

    spinner.show();
    try {
      const res: any = await service.post(endpoint, body);
      spinner.hide();
      // backend returns an error payload inside data when slot invalid
      const errMsg = res?.data?.[0]?.errmsg;
      if (errMsg) {
        toastWarning(errMsg, 3000);
        return;
      }
      toastSuccess('Appointment Added Successfully');
      if (eve === 'no') onSaved();
      else reset({ ...values, name: '', Lname: '', phone: '', appointment: '', tod_time: '' });
    } catch {
      spinner.hide();
      toastWarning('Could not add appointment');
    }
  }

  const numberOnly = (e: React.KeyboardEvent) => {
    if (!/[0-9]/.test(e.key)) e.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit((v) => save(v, 'no'))}
      className="card-base mx-auto w-full max-w-3xl p-4 sm:p-6"
    >
      {doctorName && (
        <div className="mb-4 rounded bg-blue-50 p-3 text-sm text-blue-800">
          <strong>Doctor:</strong> {doctorName} &nbsp;|&nbsp;
          <strong>Type:</strong> {timeType}
        </div>
      )}

      <Field label="First Name" required error={isSubmitted && errors.name ? 'First name is required' : null}>
        <input {...register('name', { required: true })} className="form-input-base" />
      </Field>
      <Field label="Last Name" required error={isSubmitted && errors.Lname ? 'Last name is required' : null}>
        <input {...register('Lname', { required: true })} className="form-input-base" />
      </Field>

      <Field label="Phone" required error={isSubmitted && errors.phone ? 'Phone is required (min 8)' : null}>
        <div className="flex gap-2">
          <input {...register('country_code', { required: true })} className="form-input-base w-20" />
          <input {...register('phone', { required: true, minLength: 8 })} onKeyPress={numberOnly} className="form-input-base flex-1" />
        </div>
      </Field>

      <Field label="Date" required error={isSubmitted && errors.date ? 'Date is required' : null}>
        <input type="date" {...register('date', { required: true })} className="form-input-base" />
      </Field>

      <Field label="Appointment From Time" required error={isSubmitted && errors.appointment ? 'From time is required' : null}>
        <input type="time" {...register('appointment', { required: true })} className="form-input-base" />
      </Field>

      <Field label="Appointment To Time" required error={isSubmitted && errors.tod_time ? 'To time is required' : null}>
        <input
          type="time"
          step="1"
          {...register('tod_time', { required: true })}
          className="form-input-base"
          readOnly={timeType === 'Static'}
        />
      </Field>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button type="submit" className="btn-primary-brand w-full sm:w-auto">
          Save <i className="fa fa-save ml-1" />
        </button>
        <button type="button" onClick={handleSubmit((v) => save(v, 'con'))} className="btn-outline-brand w-full sm:w-auto">
          Save &amp; Continue <i className="fa fa-arrow-right ml-1" />
        </button>
      </div>
    </form>
  );
}
