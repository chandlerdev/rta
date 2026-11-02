'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { service, local } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { Field } from '@/components/Field';
import { toastSuccess, toastError } from '@/lib/alerts';

interface F {
  crdnum: string;
  namecard: string;
  city: string;
  add1: string;
  add2: string;
  expiryDate: string; // MM/YY
  state: string;
  zip: string;
}

function expiryValid(value: string): boolean {
  if (!value) return false;
  const [month, year] = value.split('/').map((p) => parseInt(p, 10));
  if (isNaN(month) || isNaN(year) || month < 1 || month > 12) return false;
  const now = new Date();
  const fullYear = year < 100 ? 2000 + year : year;
  const expiry = new Date(fullYear, month - 1);
  return expiry >= new Date(now.getFullYear(), now.getMonth());
}

export default function DoctorOfficeSignupPage() {
  const router = useRouter();
  const spinner = useSpinner();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<F>({
    defaultValues: {
      crdnum: '', namecard: '', city: '', add1: '', add2: '',
      expiryDate: '', state: '', zip: '',
    },
  });

  async function onSubmit(v: F) {
    const id = local.get('UserID');
    const [expmont, expdate] = v.expiryDate.split('/');
    const body = {
      userId: id,
      cardName: v.namecard,
      cardNumber: v.crdnum,
      cardMonth: expmont,
      cardYear: expdate,
      address1: v.add1,
      address2: v.add2,
      city: v.city,
      state: v.state,
      zip: v.zip,
      country: 'US',
    };
    spinner.show();
    try {
      await service.post('admin/subscriptions', body);
      spinner.hide();
      toastSuccess('Card Added Successfully');
      router.push('/plandetails');
    } catch {
      spinner.hide();
      toastError('Something went wrong!');
    }
  }

  const numberOnly = (e: React.KeyboardEvent) => {
    if (!/[0-9]/.test(e.key)) e.preventDefault();
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#f1f1f1] p-4 py-8 sm:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="card-base w-full max-w-2xl p-4 sm:p-8">
        <h4 className="mb-6 text-center text-2xl font-bold text-[#0060f0]">Add Card</h4>

        <Field label="Card Number" required error={isSubmitted && errors.crdnum ? '16-digit card number required' : null}>
          <input maxLength={16} {...register('crdnum', { required: true, minLength: 16, maxLength: 16 })} onKeyPress={numberOnly} className="form-input-base" />
        </Field>
        <Field label="Name on Card" required error={isSubmitted && errors.namecard ? 'Required (letters only)' : null}>
          <input {...register('namecard', { required: true, pattern: /^[a-zA-Z ]+$/ })} className="form-input-base" />
        </Field>
        <Field label="Expiry (MM/YY)" required error={isSubmitted && errors.expiryDate ? 'Valid future expiry required' : null}>
          <input placeholder="MM/YY" {...register('expiryDate', { required: true, validate: expiryValid })} className="form-input-base" />
        </Field>
        <Field label="Address Line 1" required error={isSubmitted && errors.add1 ? 'Required' : null}>
          <input {...register('add1', { required: true })} className="form-input-base" />
        </Field>
        <Field label="Address Line 2" required error={isSubmitted && errors.add2 ? 'Required' : null}>
          <input {...register('add2', { required: true })} className="form-input-base" />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="City" required error={isSubmitted && errors.city ? 'Required' : null}>
            <input {...register('city', { required: true })} className="form-input-base" />
          </Field>
          <Field label="State" required error={isSubmitted && errors.state ? 'Required' : null}>
            <input {...register('state', { required: true })} className="form-input-base" />
          </Field>
        </div>
        <Field label="Zip" required error={isSubmitted && errors.zip ? 'Required' : null}>
          <input {...register('zip', { required: true })} onKeyPress={numberOnly} className="form-input-base" />
        </Field>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button type="submit" className="btn-primary-brand w-full sm:flex-1">Save Card</button>
          <button type="button" onClick={() => router.push('/admin')} className="btn-outline-brand w-full sm:w-auto">Cancel</button>
        </div>
      </form>
    </section>
  );
}
