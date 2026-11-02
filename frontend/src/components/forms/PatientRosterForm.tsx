'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { service, local, DYNAMIC_BASE } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { toastSuccess, toastError } from '@/lib/alerts';

const DYN = DYNAMIC_BASE;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
];

interface RForm {
  hospital: string;
  phone: string;
  firstname: string;
  lastname: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  attenderSame: boolean;
  attenderName: string;
  attenderPhone: string;
  status: boolean;
}

interface Props {
  rosterId?: string | null; // present => edit
  onSaved: () => void;
}

export function PatientRosterForm({ rosterId, onSaved }: Props) {
  const spinner = useSpinner();
  const hospitalName =
    typeof window !== 'undefined' ? local.get('HospitalName') || '' : '';

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<RForm>({
    defaultValues: {
      hospital: hospitalName,
      phone: '',
      firstname: '',
      lastname: '',
      email: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      attenderSame: false,
      attenderName: '',
      attenderPhone: '',
      status: true,
    },
  });

  // "Attender same as patient" — keep attender fields in sync while checked.
  const same = watch('attenderSame');
  const fn = watch('firstname');
  const ln = watch('lastname');
  const ph = watch('phone');
  useEffect(() => {
    if (same) {
      setValue('attenderName', `${fn || ''} ${ln || ''}`.trim());
      setValue('attenderPhone', ph || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [same, fn, ln, ph]);

  // prefill on edit
  useEffect(() => {
    if (!rosterId) return;
    spinner.show();
    service
      .getMethod(`${DYN}admin/patient-rosters/by-id/${rosterId}`)
      .then((res: any) => {
        spinner.hide();
        const d = Array.isArray(res.data) ? res.data[0] : res.data;
        if (!d) return;
        reset({
          hospital: d.hospital || hospitalName,
          phone: d.phone || '',
          firstname: d.firstName || '',
          lastname: d.lastName || '',
          email: d.email || '',
          address1: d.address1 || '',
          address2: d.address2 || '',
          city: d.city || '',
          state: d.state || '',
          zip: d.zip || '',
          attenderSame: false,
          attenderName: d.attenderName || '',
          attenderPhone: d.attenderPhone || '',
          status: Number(d.status) === 1,
        });
      })
      .catch(() => spinner.hide());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rosterId]);

  async function onSubmit(v: RForm) {
    // ZcmsPatientRoster body.
    const body: any = {
      hospital: v.hospital || '',
      phone: v.phone || '',
      firstName: v.firstname || '',
      lastName: v.lastname || '',
      email: v.email || '',
      address1: v.address1 || '',
      address2: v.address2 || '',
      city: v.city || '',
      state: v.state || '',
      zip: v.zip || '',
      attenderName: v.attenderSame
        ? `${v.firstname || ''} ${v.lastname || ''}`.trim()
        : v.attenderName || '',
      attenderPhone: v.attenderSame ? v.phone || '' : v.attenderPhone || '',
      patientType: '',
      address: v.address1 || '',
      hospitalId: local.get('TrackkerApptHosId') || '',
      status: v.status ? 1 : 0,
    };
    if (rosterId) body.id = Number(rosterId);

    spinner.show();
    try {
      if (rosterId) {
        await service.PutMethod(`admin/patient-rosters/${rosterId}`, body);
      } else {
        await service.post('admin/patient-rosters', body);
      }
      spinner.hide();
      toastSuccess(
        rosterId
          ? 'Patient Roster Updated Successfully'
          : 'Patient Roster Added Successfully',
      );
      onSaved();
    } catch {
      spinner.hide();
      toastError('Something went wrong!');
    }
  }

  const labelCls = 'mb-1 block text-xs font-medium text-gray-800';
  const inputCls =
    'w-full rounded border px-3 py-2 text-sm outline-none focus:border-[#0060f0]';
  const errCls = 'mt-1 text-xs text-red-500';
  const Req = () => <span className="text-red-500">*</span>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card-base mx-auto w-full max-w-3xl space-y-4 p-4 sm:p-6"
    >
      <div>
        <label className={labelCls}>
          Hospital <Req />
        </label>
        <input
          {...register('hospital', { required: true })}
          className={inputCls}
          readOnly
        />
        {isSubmitted && errors.hospital && <p className={errCls}>Required</p>}
      </div>

      <div>
        <label className={labelCls}>
          Phone Number <Req />
        </label>
        <input
          {...register('phone', { required: true, minLength: 10 })}
          onKeyPress={(e) => {
            if (!/[0-9]/.test(e.key)) e.preventDefault();
          }}
          className={inputCls}
        />
        {isSubmitted && errors.phone && <p className={errCls}>Required</p>}
      </div>

      <div>
        <label className={labelCls}>
          First Name <Req />
        </label>
        <input {...register('firstname', { required: true })} className={inputCls} />
        {isSubmitted && errors.firstname && <p className={errCls}>Required</p>}
      </div>

      <div>
        <label className={labelCls}>Last Name</label>
        <input {...register('lastname')} className={inputCls} />
      </div>

      <div>
        <label className={labelCls}>
          Email <Req />
        </label>
        <input
          {...register('email', { required: true, pattern: EMAIL })}
          className={inputCls}
        />
        {isSubmitted && errors.email && (
          <p className={errCls}>
            {errors.email.type === 'pattern' ? 'Email is invalid' : 'Required'}
          </p>
        )}
      </div>

      <div>
        <label className={labelCls}>
          Address1 <Req />
        </label>
        <input {...register('address1', { required: true })} className={inputCls} />
        {isSubmitted && errors.address1 && <p className={errCls}>Required</p>}
      </div>

      <div>
        <label className={labelCls}>Address2</label>
        <input {...register('address2')} className={inputCls} />
      </div>

      <div>
        <label className={labelCls}>
          City <Req />
        </label>
        <input {...register('city', { required: true })} className={inputCls} />
        {isSubmitted && errors.city && <p className={errCls}>Required</p>}
      </div>

      <div>
        <label className={labelCls}>
          State <Req />
        </label>
        <select {...register('state', { required: true })} className={inputCls}>
          <option value="">Select</option>
          {US_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {isSubmitted && errors.state && <p className={errCls}>Required</p>}
      </div>

      <div>
        <label className={labelCls}>
          Zip <Req />
        </label>
        <input {...register('zip', { required: true })} className={inputCls} />
        {isSubmitted && errors.zip && <p className={errCls}>Required</p>}
      </div>

      <div>
        <label className="flex items-center gap-2 text-xs font-medium text-gray-800">
          <span>Attender Details Same as Patient Details</span>
          <input type="checkbox" {...register('attenderSame')} />
        </label>
      </div>

      <div>
        <label className={labelCls}>
          Attender Name <Req />
        </label>
        <input
          {...register('attenderName', { required: true })}
          className={inputCls}
          readOnly={same}
        />
        {isSubmitted && errors.attenderName && <p className={errCls}>Required</p>}
      </div>

      <div>
        <label className={labelCls}>
          Attender Phone Number <Req />
        </label>
        <input
          {...register('attenderPhone', { required: true })}
          onKeyPress={(e) => {
            if (!/[0-9]/.test(e.key)) e.preventDefault();
          }}
          className={inputCls}
          readOnly={same}
        />
        {isSubmitted && errors.attenderPhone && <p className={errCls}>Required</p>}
      </div>

      <div>
        <label className={labelCls}>Status</label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('status')} />
          <span className="text-sm text-gray-600">Active</span>
        </label>
      </div>

      <div className="flex justify-center pt-2">
        <button
          type="submit"
          className="rounded bg-[#0060f0] px-8 py-2 font-semibold text-white hover:bg-[#0050d0]"
        >
          {rosterId ? 'Update' : 'Save'} <i className="fa fa-save ml-1" />
        </button>
      </div>
    </form>
  );
}
