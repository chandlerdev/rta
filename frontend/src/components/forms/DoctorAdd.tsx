'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { service, local, DYNAMIC_BASE } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { Field } from '@/components/Field';
import { toastSuccess, toastWarning } from '@/lib/alerts';

const DYN = DYNAMIC_BASE;
const PWD_PATTERN =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const DEFAULT_TEMPLATE =
  'HI %%NAME%%, Your appointment for today %%DATE%% is at %%TIME%%. Please come 15 minutes before. We look forward to seeing you.';

const TIME_TYPES = [
  { value: 'Static Appointment', label: 'Static Appointment' },
  { value: 'Dynamic Appointment', label: 'Dynamic Appointment' },
  { value: 'Static Multi Appointment', label: 'Static Multi Appointment' },
  { value: 'Dynamic Multi Appointment', label: 'Dynamic Multi Appointment' },
];

const TIME_ZONES = [
  'America/Chicago',
  'America/New_York',
  'America/Denver',
  'America/Los_Angeles',
  'America/Phoenix',
];

interface DoctorForm {
  name: string;
  email: string;
  country_code: string;
  phone: string;
  spicial: string;
  address: string;
  city: string;
  state: string;
  zincode: string;
  gender: string;
  sms: string;
  interval: string;
  consult_time: string;
  lunchfrom: string;
  lunchto: string;
  check_in_time: string;
  check_out_time: string;
  time_zone: string;
  sms_count: string;
  username: string;
  password: string;
  repassword: string;
  temp1: string;
  temp2: string;
  google_link: string;
  fb_link: string;
}

interface Props {
  onSaved: () => void;
}

export function DoctorAdd({ onSaved }: Props) {
  const spinner = useSpinner();
  const [doctorType, setDoctorType] = useState('Static Appointment');
  const [isLunch, setIsLunch] = useState('0');
  const [showPwd, setShowPwd] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<DoctorForm>({
    defaultValues: {
      name: '',
      email: '',
      country_code: '1',
      phone: '',
      spicial: '',
      address: '',
      city: '',
      state: '',
      zincode: '',
      gender: '',
      sms: '',
      interval: '',
      consult_time: '',
      lunchfrom: '12:00:00',
      lunchto: '13:00:00',
      check_in_time: '',
      check_out_time: '',
      time_zone: 'America/Chicago',
      sms_count: '',
      username: '',
      password: '',
      repassword: '',
      temp1: DEFAULT_TEMPLATE,
      temp2: DEFAULT_TEMPLATE,
      google_link: '',
      fb_link: '',
    },
  });

  const isDynamic =
    doctorType === 'Dynamic Appointment' ||
    doctorType === 'Dynamic Multi Appointment';
  const password = watch('password');

  async function save(values: DoctorForm, eve: 'no' | 'con') {
    if (values.password !== values.repassword) return;

    const HosId = local.get('TrackkerApptHosId');
    const phone = values.country_code + values.phone;
    const consult_time1 = isDynamic ? '' : values.consult_time;
    const interval1 = isDynamic ? '' : values.interval;

    // username uniqueness — GET admin/doctors/exists?hospitalId&userName
    try {
      const chk: any = await service.getMethod(
        `${DYN}admin/doctors/exists?hospitalId=${HosId || ''}&userName=${values.username}`,
      );
      const exists = chk?.data?.[0]?.exists;
      if (exists) {
        toastWarning('Username already exist', 3000);
        return;
      }
    } catch {
      toastWarning('Username already exist', 3000);
      return;
    }

    // Map to DoctorRequest.
    const body: any = {
      firstName: values.name,
      lastName: 'test',
      phone,
      gender: values.gender,
      img: 'test',
      specility: values.spicial,
      address: values.address,
      city: values.city,
      state: values.state,
      zipcode: values.zincode,
      timeZone: values.time_zone,
      fromTime: '',
      toTime: '',
      consultTime: consult_time1,
      intervel: interval1,
      smsIntervel: values.sms,
      smsCount: values.sms_count,
      fromTimeBreak: isLunch === '1' ? values.lunchfrom : '',
      toTimeBreak: isLunch === '1' ? values.lunchto : '',
      checkInTime: values.check_in_time,
      checkOutTime: values.check_out_time,
      experience: '',
      licence: '',
      joinedDate: new Date().toISOString().slice(0, 10),
      hospitalIdId: HosId || '',
      userName: values.username,
      password: values.password,
      email: values.email,
      isActive: 1,
      isLunch: Number(isLunch),
      timeType: doctorType,
      googleLink: values.google_link || '',
      facebookLink: values.fb_link || '',
    };

    spinner.show();
    try {
      const res: any = await service.post('admin/doctors', body);
      // second call: SMS templates -> POST admin/doctor-templates
      if (res?.data?.[0]?.id) {
        const tmplBody = {
          doctorId: res.data[0].id,
          advanceSmsTemplate: values.temp1,
          rescheduleSmsTemplate: values.temp2,
          status: 1,
        };
        await service.post('admin/doctor-templates', tmplBody).catch(() => {});
      }
      spinner.hide();
      toastSuccess('Doctor Added Successfully');
      if (eve === 'no') {
        onSaved();
      } else {
        reset();
        setDoctorType('Static Appointment');
        setIsLunch('0');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch {
      spinner.hide();
      toastWarning('Could not add doctor');
    }
  }

  const numberOnly = (e: React.KeyboardEvent) => {
    if (!/[0-9]/.test(e.key)) e.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit((v) => save(v, 'no'))}
      className="card-base mx-auto w-full max-w-4xl p-4 sm:p-6"
    >
      {/* Appointment type selector */}
      <Field label="Appointment Type" required>
        <select
          value={doctorType}
          onChange={(e) => setDoctorType(e.target.value)}
          className="form-input-base"
        >
          {TIME_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Name"
        required
        error={isSubmitted && errors.name ? 'Name is required' : null}
      >
        <input {...register('name', { required: true })} className="form-input-base" />
      </Field>

      <Field
        label="Email"
        required
        error={
          isSubmitted && errors.email
            ? errors.email.type === 'pattern'
              ? 'Email is invalid'
              : 'Email is required'
            : null
        }
      >
        <input
          {...register('email', { required: true, pattern: EMAIL_PATTERN })}
          className="form-input-base"
        />
      </Field>

      <Field
        label="Phone"
        required
        error={isSubmitted && errors.phone ? 'Phone is required (min 8)' : null}
      >
        <div className="flex gap-2">
          <input
            {...register('country_code', { required: true })}
            className="form-input-base w-20"
          />
          <input
            {...register('phone', { required: true, minLength: 8 })}
            onKeyPress={numberOnly}
            className="form-input-base flex-1"
          />
        </div>
      </Field>

      <Field
        label="Specility"
        required
        error={isSubmitted && errors.spicial ? 'Specility is required' : null}
      >
        <input {...register('spicial', { required: true })} className="form-input-base" />
      </Field>

      <Field
        label="Gender"
        required
        error={isSubmitted && errors.gender ? 'Gender is required' : null}
      >
        <select {...register('gender', { required: true })} className="form-input-base">
          <option value="">Select</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
      </Field>

      <Field
        label="Address"
        required
        error={isSubmitted && errors.address ? 'Address is required' : null}
      >
        <input {...register('address', { required: true })} className="form-input-base" />
      </Field>

      <Field label="City" required error={isSubmitted && errors.city ? 'City is required' : null}>
        <input {...register('city', { required: true })} className="form-input-base" />
      </Field>

      <Field label="State" required error={isSubmitted && errors.state ? 'State is required' : null}>
        <input {...register('state', { required: true })} className="form-input-base" />
      </Field>

      <Field label="Zip Code" required error={isSubmitted && errors.zincode ? 'Zip is required' : null}>
        <input {...register('zincode', { required: true })} onKeyPress={numberOnly} className="form-input-base" />
      </Field>

      <Field label="Time Zone" required>
        <select {...register('time_zone', { required: true })} className="form-input-base">
          {TIME_ZONES.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Check In Time"
        required
        error={isSubmitted && errors.check_in_time ? 'Check In Time is required' : null}
      >
        <input
          type="time"
          step="1"
          {...register('check_in_time', { required: true })}
          className="form-input-base"
        />
      </Field>

      <Field
        label="Check Out Time"
        required
        error={isSubmitted && errors.check_out_time ? 'Check Out Time is required' : null}
      >
        <input
          type="time"
          step="1"
          {...register('check_out_time', { required: true })}
          className="form-input-base"
        />
      </Field>

      <Field label="SMS Interval (mins)" required error={isSubmitted && errors.sms ? 'Required' : null}>
        <input {...register('sms', { required: true })} onKeyPress={numberOnly} className="form-input-base" />
      </Field>

      <Field label="SMS Count" required error={isSubmitted && errors.sms_count ? 'Required' : null}>
        <input {...register('sms_count', { required: true })} onKeyPress={numberOnly} className="form-input-base" />
      </Field>

      {/* Static-only fields */}
      {!isDynamic && (
        <>
          <Field label="Patient Interval (mins)" required error={isSubmitted && errors.interval ? 'Required' : null}>
            <input {...register('interval', { required: !isDynamic })} onKeyPress={numberOnly} className="form-input-base" />
          </Field>
          <Field label="Consult Time (mins)" required error={isSubmitted && errors.consult_time ? 'Required' : null}>
            <input {...register('consult_time', { required: !isDynamic })} onKeyPress={numberOnly} className="form-input-base" />
          </Field>
        </>
      )}

      {/* Lunch */}
      <Field label="Has Lunch Break?">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isLunch === '1'}
            onChange={(e) => setIsLunch(e.target.checked ? '1' : '0')}
          />
          <span className="text-sm text-gray-600">Enable lunch break</span>
        </label>
      </Field>
      {isLunch === '1' && (
        <>
          <Field label="Lunch From" required>
            <input type="time" step="1" {...register('lunchfrom')} className="form-input-base" />
          </Field>
          <Field label="Lunch To" required>
            <input type="time" step="1" {...register('lunchto')} className="form-input-base" />
          </Field>
        </>
      )}

      <Field
        label="UserName"
        required
        error={isSubmitted && errors.username ? 'Username is required' : null}
      >
        <input
          {...register('username', {
            required: true,
            onChange: (e) => setValue('username', e.target.value.toUpperCase()),
          })}
          className="form-input-base"
        />
      </Field>

      <Field
        label="Password"
        required
        error={
          isSubmitted && errors.password
            ? errors.password.type === 'pattern'
              ? 'Password must contain uppercase, lowercase, number & special character'
              : errors.password.type === 'minLength'
                ? 'Minimum 8 characters'
                : 'Password is required'
            : null
        }
      >
        <div className="relative">
          <input
            type={showPwd ? 'text' : 'password'}
            {...register('password', { required: true, minLength: 8, pattern: PWD_PATTERN })}
            className="form-input-base pr-10"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPwd((s) => !s)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
            title={showPwd ? 'Hide password' : 'Show password'}
          >
            <i className={`fa ${showPwd ? 'fa-eye-slash' : 'fa-eye'}`} />
          </button>
        </div>
      </Field>

      <Field
        label="Re-Enter Password"
        required
        error={
          isSubmitted && errors.repassword
            ? 'Re-enter password is required'
            : watch('repassword') && watch('repassword') !== password
              ? "Passwords don't match"
              : null
        }
      >
        <input type="password" {...register('repassword', { required: true })} className="form-input-base" />
      </Field>

      <Field label="Advance SMS Template" required>
        <textarea rows={3} {...register('temp1', { required: true })} className="form-input-base" />
      </Field>

      <Field label="Reschedule SMS Template" required>
        <textarea rows={3} {...register('temp2', { required: true })} className="form-input-base" />
      </Field>

      <Field label="Google Link">
        <input {...register('google_link')} className="form-input-base" />
      </Field>

      <Field label="Facebook Link">
        <input {...register('fb_link')} className="form-input-base" />
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
