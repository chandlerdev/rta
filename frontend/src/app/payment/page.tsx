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
  expyer: string;
  expmon: string;
  ccv: string;
  acceptTerms: boolean;
}

const MONTHS = ['01','02','03','04','05','06','07','08','09','10','11','12'];

export default function PaymentMethodPage() {
  const router = useRouter();
  const spinner = useSpinner();
  const years: number[] = [];
  const cy = new Date().getFullYear();
  for (let i = 0; i < 15; i++) years.push(cy + i);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<F>({
    defaultValues: { crdnum: '', namecard: '', expyer: '', expmon: '', ccv: '', acceptTerms: false },
  });

  async function onSubmit(v: F) {
    spinner.show();
    try {
      const dob = new Date().toISOString().slice(0, 10);
      const price = local.get('PlanPrice') || '0';
      const res: any = await service.payment.pay(
        { crdnum: v.crdnum, namecard: v.namecard, expyer: v.expyer, expmon: v.expmon },
        dob,
        price,
      );
      spinner.hide();
      if (res?.messages?.resultCode === 'Ok') {
        toastSuccess('Payment Successful');
        router.push('/sucess');
      } else {
        toastError(res?.messages?.message?.[0]?.text || 'Payment failed');
      }
    } catch {
      spinner.hide();
      toastError('Payment failed. Please try again.');
    }
  }

  const numberOnly = (e: React.KeyboardEvent) => {
    if (!/[0-9]/.test(e.key)) e.preventDefault();
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#f1f1f1] px-4 py-8">
      <form onSubmit={handleSubmit(onSubmit)} className="card-base w-full max-w-xl p-6 sm:p-8">
        <h4 className="mb-6 text-center text-xl font-bold text-[#0060f0] sm:text-2xl">Payment</h4>

        <Field label="Card Number" required error={isSubmitted && errors.crdnum ? '16-digit card number required' : null}>
          <input maxLength={16} {...register('crdnum', { required: true, minLength: 16, maxLength: 16, pattern: /^[0-9]*$/ })} onKeyPress={numberOnly} className="form-input-base" />
        </Field>
        <Field label="Name on Card" required error={isSubmitted && errors.namecard ? 'Required' : null}>
          <input {...register('namecard', { required: true })} className="form-input-base" />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Month" required error={isSubmitted && errors.expmon ? 'Required' : null}>
            <select {...register('expmon', { required: true })} className="form-input-base">
              <option value="">MM</option>
              {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="Year" required error={isSubmitted && errors.expyer ? 'Required' : null}>
            <select {...register('expyer', { required: true })} className="form-input-base">
              <option value="">YYYY</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </Field>
          <Field label="CCV" required error={isSubmitted && errors.ccv ? 'Required' : null}>
            <input maxLength={3} {...register('ccv', { required: true, minLength: 3, maxLength: 3 })} onKeyPress={numberOnly} className="form-input-base" />
          </Field>
        </div>

        <label className="mb-4 mt-2 flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('acceptTerms', { required: true })} />
          I accept the terms and conditions
        </label>
        {isSubmitted && errors.acceptTerms && <p className="mb-3 text-sm text-red-500">You must accept the terms</p>}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="submit" className="btn-primary-brand w-full sm:flex-1">Pay Now</button>
          <button type="button" onClick={() => router.push('/admin')} className="btn-outline-brand w-full sm:w-auto">Cancel</button>
        </div>
      </form>
    </section>
  );
}
