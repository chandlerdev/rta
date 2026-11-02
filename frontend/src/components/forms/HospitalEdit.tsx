'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { service, local, DYNAMIC_BASE } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { Field } from '@/components/Field';
import { toastSuccess } from '@/lib/alerts';

const DYN = DYNAMIC_BASE;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface EditForm {
  doctorname: string;
  username: string;
  email: string;
  phonenumber: string;
}

interface Props {
  hospitalId: string; // accounts_hospital id
  onSaved: () => void;
}

export function HospitalEdit({ hospitalId, onSaved }: Props) {
  const spinner = useSpinner();
  const [planName, setPlanName] = useState('');
  const [price, setPrice] = useState('');
  // immutable fields kept from the loaded record
  const [meta, setMeta] = useState({
    id: '',
    regNo: '',
    img: '',
    specility: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    zip: '',
    userId: '',
    userName: '',
    isActive: 1,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<EditForm>({
    defaultValues: {
      doctorname: '',
      username: '',
      email: '',
      phonenumber: '',
    },
  });

  useEffect(() => {
    if (!hospitalId) return;
    spinner.show();
    service
      .getMethod(`${DYN}admin/hospitals/${hospitalId}`)
      .then((res: any) => {
        const e = res.data?.[0];
        if (!e) {
          spinner.hide();
          return;
        }
        setMeta({
          id: e.id,
          regNo: e.regNo,
          img: e.img,
          specility: e.specility,
          street: e.street,
          landmark: e.landmark,
          city: e.city,
          state: e.state,
          zip: e.zip,
          userId: e.userId,
          userName: e.userName ?? '',
          isActive: Number(e.isActive),
        });
        reset({
          doctorname: e.name || '',
          email: e.email || '',
          phonenumber: e.phone || '',
          // AccountsHospital does not expose userName; fall back if present
          username: e.userName || '',
        });
        // TODO: no matching endpoint in new API for the old `accounts_user`
        // record (username + plan_id). MobileAppUser/AccountsProfile lack
        // userName and plan_id. Plan title/price below cannot be resolved
        // without a plan id source. Username shown from hospital record above.
        spinner.hide();
      })
      .catch(() => spinner.hide());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hospitalId]);

  async function onSubmit(values: EditForm) {
    const body = {
      name: values.doctorname,
      phone: values.phonenumber,
      regNo: meta.regNo,
      img: meta.img,
      email: values.email,
      specility: meta.specility,
      street: meta.street,
      landmark: meta.landmark,
      city: meta.city,
      state: meta.state,
      zip: meta.zip,
      userId: meta.userId ? Number(meta.userId) : undefined,
      userName: meta.userName,
      isActive: meta.isActive,
    };
    spinner.show();
    try {
      await service.PutMethod(`admin/hospitals/${meta.id}`, body);
      spinner.hide();
      toastSuccess('Hospital Edited Successfully..!');
      onSaved();
    } catch {
      spinner.hide();
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card-base mx-auto w-full max-w-3xl p-4 sm:p-6"
    >
      {(planName || price) && (
        <div className="mb-4 rounded bg-blue-50 p-3 text-sm text-blue-800">
          <strong>Plan:</strong> {planName} {price && <>— ${price}</>}
        </div>
      )}

      <Field
        label="Office Name"
        required
        error={isSubmitted && errors.doctorname ? 'Name is required' : null}
      >
        <input {...register('doctorname', { required: true })} className="form-input-base" />
      </Field>

      <Field
        label="UserName"
        required
        error={isSubmitted && errors.username ? 'Username is required' : null}
      >
        <input {...register('username', { required: true })} className="form-input-base" readOnly />
      </Field>

      <Field
        label="Email Id"
        required
        error={
          isSubmitted && errors.email
            ? errors.email.type === 'pattern'
              ? 'Email is invalid'
              : 'Email is required'
            : null
        }
      >
        <input {...register('email', { required: true, pattern: EMAIL_PATTERN })} className="form-input-base" />
      </Field>

      <Field
        label="Phone Number"
        required
        error={isSubmitted && errors.phonenumber ? 'Phone number is required (min 10)' : null}
      >
        <input
          {...register('phonenumber', { required: true, minLength: 10 })}
          onKeyPress={(e) => {
            if (!/[0-9]/.test(e.key)) e.preventDefault();
          }}
          className="form-input-base"
        />
      </Field>

      <div className="mt-6">
        <button type="submit" className="btn-primary-brand w-full sm:w-auto">
          Update <i className="fa fa-save ml-1" />
        </button>
      </div>
    </form>
  );
}
