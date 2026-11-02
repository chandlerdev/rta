'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { service, session, crypto, local, DYNAMIC_BASE } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { Field } from '@/components/Field';
import { toastSuccess, toastError } from '@/lib/alerts';

const DYN = DYNAMIC_BASE;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface F {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  gender: string;
  purpose: string;
  date: string;
  from_time: string;
  to_time: string;
}

interface Props {
  onSaved: () => void;
}

export function AddMultiAppointment({ onSaved }: Props) {
  const spinner = useSpinner();
  const [doctorId, setDoctorId] = useState('');
  const [doctorName, setDoctorName] = useState('');

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<F>({
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      gender: '',
      purpose: '',
      date: '',
      from_time: '',
      to_time: '',
    },
  });

  useEffect(() => {
    const v1 = typeof window !== 'undefined' ? session.get('_V1_') : null;
    const userId = v1 ? crypto.decodeEnc(v1) : null;
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
        setDoctorId(d.id);
        setDoctorName(d.firstName);
      })
      .catch(() => spinner.hide());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function patientLookup() {
    const phone = getValues('phone');
    if (!phone) return;
    // New API only filters rosters by hospitalId; match the phone client-side.
    const hospitalId = local.get('TrackkerApptHosId') || '';
    service
      .getMethod(`${DYN}admin/patient-rosters/${hospitalId}`)
      .then((res: any) => {
        const list = Array.isArray(res.data) ? res.data : [];
        const d = list.find((p: any) =>
          String(p.phone || '').includes(phone),
        );
        if (!d) return;
        setValue('firstName', d.firstName || '');
        setValue('lastName', d.lastName || '');
        setValue('email', d.email || '');
      })
      .catch(() => {});
  }

  async function onSubmit(v: F) {
    // The native date input already yields ISO yyyy-mm-dd; the API uses ISO
    // dates, matching the by-doctor/.../date/{date} reads.
    const dob = v.date;

    spinner.show();
    try {
      // "Multiple" is a dynamic multi-appointment -> dynamic endpoint.
      const res: any = await service.post(
        'admin/patients/with-dynamic-appointment',
        {
          firstName: v.firstName || '',
          lastName: v.lastName || '',
          phone: v.phone || '',
          email: v.email || '',
          age: '',
          gender: v.gender || '',
          purpose: v.purpose || '',
          date: dob,
          fromTime: v.from_time + ':00',
          todTime: v.to_time + ':00',
          doctorId,
          appointmentType: 'Multiple',
        },
      );
      spinner.hide();
      const errMsg = res?.data?.[0]?.errmsg;
      if (errMsg) {
        toastError(errMsg);
        return;
      }
      toastSuccess('Appointment Added Successfully');
      onSaved();
    } catch {
      spinner.hide();
      toastError('Something went wrong!');
    }
  }

  const numberOnly = (e: React.KeyboardEvent) => {
    if (!/[0-9]/.test(e.key)) e.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card-base mx-auto w-full max-w-3xl p-4 sm:p-6"
    >
      {doctorName && (
        <div className="mb-4 rounded bg-blue-50 p-3 text-sm text-blue-800">
          <strong>Doctor:</strong> {doctorName}
        </div>
      )}

      <Field label="Phone" required error={isSubmitted && errors.phone ? 'Required' : null}>
        <input {...register('phone', { required: true })} onBlur={patientLookup} onKeyPress={numberOnly} className="form-input-base" />
      </Field>
      <Field label="First Name" required error={isSubmitted && errors.firstName ? 'Required' : null}>
        <input {...register('firstName', { required: true })} className="form-input-base" />
      </Field>
      <Field label="Last Name" required error={isSubmitted && errors.lastName ? 'Required' : null}>
        <input {...register('lastName', { required: true })} className="form-input-base" />
      </Field>
      <Field label="Email" required error={isSubmitted && errors.email ? (errors.email.type === 'pattern' ? 'Email is invalid' : 'Required') : null}>
        <input {...register('email', { required: true, pattern: EMAIL })} className="form-input-base" />
      </Field>
      <Field label="Gender" required error={isSubmitted && errors.gender ? 'Required' : null}>
        <select {...register('gender', { required: true })} className="form-input-base">
          <option value="">Select</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
      </Field>
      <Field label="Purpose" required error={isSubmitted && errors.purpose ? 'Required' : null}>
        <input {...register('purpose', { required: true })} className="form-input-base" />
      </Field>
      <Field label="Date" required error={isSubmitted && errors.date ? 'Required' : null}>
        <input type="date" {...register('date', { required: true })} className="form-input-base" />
      </Field>
      <Field label="From Time" required error={isSubmitted && errors.from_time ? 'Required' : null}>
        <input type="time" {...register('from_time', { required: true })} className="form-input-base" />
      </Field>
      <Field label="To Time" required error={isSubmitted && errors.to_time ? 'Required' : null}>
        <input type="time" {...register('to_time', { required: true })} className="form-input-base" />
      </Field>

      <div className="mt-6">
        <button type="submit" className="btn-primary-brand w-full sm:w-auto">
          Save <i className="fa fa-save ml-1" />
        </button>
      </div>
    </form>
  );
}
