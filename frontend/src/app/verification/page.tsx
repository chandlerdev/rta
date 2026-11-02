'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { service, local } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { toastSuccess, toastError } from '@/lib/alerts';

interface F {
  otp: string;
}

export default function VerificationPage() {
  const router = useRouter();
  const spinner = useSpinner();
  const [err, setErr] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<F>({ defaultValues: { otp: '' } });

  async function onSubmit(v: F) {
    const otp = typeof window !== 'undefined' ? local.get('otp') : null;
    if (v.otp !== otp) {
      setErr('Invalid OTP');
      return;
    }
    setErr('');
    // TODO: userId owner not available in this flow — confirm backend assigns owner
    const body = {
      name: local.get('doctorname') || '',
      phone: '1' + (local.get('phonenumber') || ''),
      regNo: '1234',
      img: 'test',
      email: local.get('email') || '',
      userName: local.get('username') || '',
      specility: 'heart',
      street: 'nehru nagar',
      landmark: 'test',
      city: 'houston',
      state: 'texas',
      zip: '',
      password: local.get('password') || '',
      isActive: 1,
      // From /signup/{id}; empty string for a normal /signup.
      planId: local.get('signupPlanId') || '',
    };

    spinner.show();
    try {
      await service.post('admin/hospitals', body);
      spinner.hide();
      toastSuccess('Thanks for signing up, you can now login..');
      router.push('/admin');
    } catch {
      spinner.hide();
      toastError('Something went wrong!');
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#f1f1f1] p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[350px] rounded-2xl bg-white p-6 shadow sm:p-8">
        <h4 className="mb-5 text-center text-2xl font-bold text-[#0060f0]">OTP Verification</h4>
        <input
          placeholder="Enter OTP"
          {...register('otp', { required: true })}
          className="w-full rounded-md border-2 border-[#22b14c] px-4 py-2 outline-none"
        />
        {isSubmitted && errors.otp && <p className="mt-1 text-sm text-red-500">OTP is required</p>}
        {err && <p className="mt-1 text-sm text-red-500">{err}</p>}
        <button type="submit" className="mt-5 w-full rounded-[30px] bg-[#22b14c] p-2.5 font-semibold text-white hover:bg-[#0060f0]">
          Verify
        </button>
      </form>
    </section>
  );
}
