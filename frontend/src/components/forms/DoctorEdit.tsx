'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { service, local, DYNAMIC_BASE } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { Field } from '@/components/Field';
import { toastSuccess, toastWarning } from '@/lib/alerts';

const DYN = DYNAMIC_BASE;
const DEFAULT_TEMPLATE =
  'HI %%NAME%%, Your appointment for today %%DATE%% is at %%TIME%%. Please come 15 minutes before. We look forward to seeing you.';

const TIME_TYPES = [
  'Static Appointment',
  'Dynamic Appointment',
  'Static Multi Appointment',
  'Dynamic Multi Appointment',
];
const TIME_ZONES = [
  'America/Chicago',
  'America/New_York',
  'America/Denver',
  'America/Los_Angeles',
  'America/Phoenix',
];

interface EditForm {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zincode: string;
  spicial: string;
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
  email: string;
  time_type: string;
  temp1: string;
  temp2: string;
  google_link: string;
  fb_link: string;
}

interface Props {
  doctorId: string; // accounts_doctor id
  onSaved: () => void;
}

export function DoctorEdit({ doctorId, onSaved }: Props) {
  const spinner = useSpinner();
  const [isLunch, setIsLunch] = useState('0');
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [hosId, setHosId] = useState('');
  // Keep the loaded doctor record to preserve fields not present in the form
  // when sending the full DoctorRequest on PUT.
  const [loadedDoctor, setLoadedDoctor] = useState<any>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<EditForm>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zincode: '',
      spicial: '',
      gender: '',
      sms: '',
      interval: '',
      consult_time: '',
      lunchfrom: '',
      lunchto: '',
      check_in_time: '',
      check_out_time: '',
      time_zone: 'America/Chicago',
      sms_count: '',
      username: '',
      email: '',
      time_type: '',
      temp1: DEFAULT_TEMPLATE,
      temp2: DEFAULT_TEMPLATE,
      google_link: '',
      fb_link: '',
    },
  });

  const timeType = watch('time_type');
  const isDynamic =
    timeType === 'Dynamic Appointment' ||
    timeType === 'Dynamic Multi Appointment';

  useEffect(() => {
    if (!doctorId) return;
    setHosId(local.get('TrackkerApptHosId') || '');
    spinner.show();

    // template -> GET admin/doctor-templates/by-doctor/{doctorId}
    service
      .getMethod(`${DYN}admin/doctor-templates/by-doctor/${doctorId}`)
      .then((res: any) => {
        if (res?.data?.[0]) {
          setTemplateId(res.data[0].id);
          setValue('temp1', res.data[0].advanceSmsTemplate || DEFAULT_TEMPLATE);
          setValue(
            'temp2',
            res.data[0].rescheduleSmsTemplate || DEFAULT_TEMPLATE,
          );
        }
      })
      .catch(() => {});

    // doctor record -> GET admin/doctors/{id} (AccountsDoctor)
    service
      .getMethod(`${DYN}admin/doctors/${doctorId}`)
      .then((res: any) => {
        spinner.hide();
        const d = res.data?.[0];
        if (!d) return;
        setLoadedDoctor(d);
        setIsLunch(d.isLunch != null ? String(d.isLunch) : '0');
        reset({
          name: d.firstName || '',
          phone: d.phone || '',
          spicial: d.specility || '',
          gender: d.gender || '',
          interval: d.intervel || '',
          sms: d.smsIntervel || '',
          sms_count: d.smsCount || '',
          lunchfrom: d.fromTimeBreak || '',
          lunchto: d.toTimeBreak || '',
          check_in_time: d.checkInTime || '',
          check_out_time: d.checkOutTime || '',
          address: d.address || '',
          city: d.city || '',
          state: d.state || '',
          zincode: d.zipcode || '',
          time_type: d.timeType || 'Static Appointment',
          google_link: d.googleLink || '',
          fb_link: d.facebookLink || '',
          consult_time: d.consultTime || '',
          time_zone: d.timeZone || 'America/Chicago',
          username: d.userName || '',
          email: d.email || '',
          temp1: watch('temp1'),
          temp2: watch('temp2'),
        });
      })
      .catch(() => spinner.hide());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId]);

  async function onSubmit(values: EditForm) {
    const consult_time1 = isDynamic ? '' : values.consult_time;
    const interval1 = isDynamic ? '' : values.interval;

    const lunchFrom = isLunch === '1' ? values.lunchfrom : '';
    const lunchTo = isLunch === '1' ? values.lunchto : '';

    const d = loadedDoctor || {};
    // PUT replaces the whole resource; map editable fields and preserve the
    // rest from the loaded doctor record.
    const body: any = {
      firstName: values.name,
      lastName: d.lastName || 'test',
      phone: values.phone || d.phone || '',
      gender: values.gender,
      img: d.img || 'test',
      specility: values.spicial,
      address: values.address,
      city: values.city,
      state: values.state,
      zipcode: values.zincode,
      timeZone: values.time_zone,
      fromTime: d.fromTime || '',
      toTime: d.toTime || '',
      consultTime: consult_time1,
      intervel: interval1,
      smsIntervel: values.sms,
      smsCount: values.sms_count,
      fromTimeBreak: lunchFrom,
      toTimeBreak: lunchTo,
      checkInTime: values.check_in_time,
      checkOutTime: values.check_out_time,
      experience: d.experience || '',
      licence: d.licence || '',
      joinedDate: d.joinedDate || new Date().toISOString().slice(0, 10),
      hospitalIdId: d.hospitalIdId || hosId,
      userId: d.userId || '',
      isActive: d.isActive != null ? Number(d.isActive) : 1,
      isLunch: Number(isLunch),
      timeType: values.time_type,
      googleLink: values.google_link || '',
      facebookLink: values.fb_link || '',
    };
    // Only send credentials/email when a real value exists — AccountsDoctor's
    // GET doesn't return userName/password/email, so sending '' would wipe them.
    if (values.username) body.userName = values.username;
    if (values.email) body.email = values.email;
    // password is never loaded from the API and this form has no password input,
    // so it is omitted entirely to preserve the stored password.

    spinner.show();
    try {
      // save template (add via POST, or edit via PUT)
      const tmplBody = {
        doctorId,
        advanceSmsTemplate: values.temp1,
        rescheduleSmsTemplate: values.temp2,
        status: 1,
      };
      if (templateId) {
        await service
          .PutMethod(`admin/doctor-templates/${templateId}`, tmplBody)
          .catch(() => {});
      } else {
        await service
          .post('admin/doctor-templates', tmplBody)
          .catch(() => {});
      }

      await service.PutMethod(`admin/doctors/${doctorId}`, body);
      spinner.hide();
      toastSuccess('Doctor Edited Successfully');
      onSaved();
    } catch {
      spinner.hide();
      toastWarning('Could not update doctor');
    }
  }

  const numberOnly = (e: React.KeyboardEvent) => {
    if (!/[0-9]/.test(e.key)) e.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card-base mx-auto w-full max-w-4xl p-4 sm:p-6"
    >
      <Field label="Appointment Type" required>
        <select {...register('time_type', { required: true })} className="form-input-base">
          {TIME_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Name" required error={isSubmitted && errors.name ? 'Name is required' : null}>
        <input {...register('name', { required: true })} className="form-input-base" />
      </Field>

      <Field label="Email" required error={isSubmitted && errors.email ? 'Email is required' : null}>
        <input {...register('email', { required: true })} className="form-input-base" />
      </Field>

      <Field label="Phone" required error={isSubmitted && errors.phone ? 'Phone is required (min 8)' : null}>
        <input {...register('phone', { required: true, minLength: 8 })} onKeyPress={numberOnly} className="form-input-base" />
      </Field>

      <Field label="Specility" required error={isSubmitted && errors.spicial ? 'Required' : null}>
        <input {...register('spicial', { required: true })} className="form-input-base" />
      </Field>

      <Field label="Gender" required error={isSubmitted && errors.gender ? 'Required' : null}>
        <select {...register('gender', { required: true })} className="form-input-base">
          <option value="">Select</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
      </Field>

      <Field label="Address" required error={isSubmitted && errors.address ? 'Required' : null}>
        <input {...register('address', { required: true })} className="form-input-base" />
      </Field>
      <Field label="City" required error={isSubmitted && errors.city ? 'Required' : null}>
        <input {...register('city', { required: true })} className="form-input-base" />
      </Field>
      <Field label="State" required error={isSubmitted && errors.state ? 'Required' : null}>
        <input {...register('state', { required: true })} className="form-input-base" />
      </Field>
      <Field label="Zip Code" required error={isSubmitted && errors.zincode ? 'Required' : null}>
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

      <Field label="SMS Interval" required error={isSubmitted && errors.sms ? 'Required' : null}>
        <input {...register('sms', { required: true })} onKeyPress={numberOnly} className="form-input-base" />
      </Field>
      <Field label="SMS Count" required error={isSubmitted && errors.sms_count ? 'Required' : null}>
        <input {...register('sms_count', { required: true })} onKeyPress={numberOnly} className="form-input-base" />
      </Field>

      {!isDynamic && (
        <>
          <Field label="Patient Interval" required error={isSubmitted && errors.interval ? 'Required' : null}>
            <input {...register('interval', { required: !isDynamic })} onKeyPress={numberOnly} className="form-input-base" />
          </Field>
          <Field label="Consult Time" required error={isSubmitted && errors.consult_time ? 'Required' : null}>
            <input {...register('consult_time', { required: !isDynamic })} onKeyPress={numberOnly} className="form-input-base" />
          </Field>
        </>
      )}

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

      <Field label="UserName" required error={isSubmitted && errors.username ? 'Required' : null}>
        <input {...register('username', { required: true })} className="form-input-base" readOnly />
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

      <div className="mt-6">
        <button type="submit" className="btn-primary-brand w-full sm:w-auto">
          Update <i className="fa fa-save ml-1" />
        </button>
      </div>
    </form>
  );
}
