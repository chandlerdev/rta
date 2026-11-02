'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { service, DYNAMIC_BASE } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { Field } from '@/components/Field';
import { toastSuccess, toastError } from '@/lib/alerts';

const DYN = DYNAMIC_BASE;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface PForm {
  name: string;
  address: string;
  phone: string;
  email: string;
}

interface Props {
  pharmacyId?: string | null;
  onSaved: () => void;
}

export function PharmacyForm({ pharmacyId, onSaved }: Props) {
  const spinner = useSpinner();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<PForm>({
    defaultValues: { name: '', address: '', phone: '', email: '' },
  });

  useEffect(() => {
    if (!pharmacyId) return;
    spinner.show();
    service
      .getMethod(`${DYN}admin/pharmacies/${pharmacyId}`)
      .then((res: any) => {
        spinner.hide();
        const d = Array.isArray(res.data) ? res.data[0] : res.data;
        if (!d) return;
        reset({
          name: d.pharmacyName || '',
          address: d.address || '',
          phone: d.phone || '',
          email: d.email || '',
        });
      })
      .catch(() => spinner.hide());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pharmacyId]);

  async function onSubmit(values: PForm) {
    // Body remapped to PharmacyRequest spec field names.
    const body = {
      pharmacyName: values.name,
      address: values.address,
      phone: values.phone,
      email: values.email,
      status: 1,
    };
    spinner.show();
    try {
      if (pharmacyId) {
        await service.PutMethod(`admin/pharmacies/${pharmacyId}`, body);
      } else {
        await service.post('admin/pharmacies', body);
      }
      spinner.hide();
      toastSuccess(
        pharmacyId ? 'Pharmacy Updated Successfully' : 'Pharmacy Added Successfully',
      );
      onSaved();
    } catch {
      spinner.hide();
      toastError('Something went wrong!');
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card-base mx-auto w-full max-w-2xl p-4 sm:p-6"
    >
      <Field label="Pharmacy Name" required error={isSubmitted && errors.name ? 'Required' : null}>
        <input {...register('name', { required: true })} className="form-input-base" />
      </Field>
      <Field label="Address" required error={isSubmitted && errors.address ? 'Required' : null}>
        <textarea rows={2} {...register('address', { required: true })} className="form-input-base" />
      </Field>
      <Field label="Phone" required error={isSubmitted && errors.phone ? 'Required' : null}>
        <input {...register('phone', { required: true })} className="form-input-base" />
      </Field>
      <Field label="Email" required error={isSubmitted && errors.email ? (errors.email.type === 'pattern' ? 'Email is invalid' : 'Required') : null}>
        <input {...register('email', { required: true, pattern: EMAIL })} className="form-input-base" />
      </Field>
      <div className="mt-6">
        <button type="submit" className="btn-primary-brand w-full sm:w-auto">
          {pharmacyId ? 'Update' : 'Save'} <i className="fa fa-save ml-1" />
        </button>
      </div>
    </form>
  );
}
