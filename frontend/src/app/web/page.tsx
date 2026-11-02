'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { service } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { toastSuccess, toastError } from '@/lib/alerts';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface F {
  name: string;
  email: string;
}

export default function WebPage() {
  const spinner = useSpinner();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<F>({ defaultValues: { name: '', email: '' } });

  async function onSubmit(v: F) {
    const body = {
      name: v.name,
      phone: '9876543210',
      regNo: '1234',
      img: 'test',
      email: v.email,
      specility: 'heart',
      street: 'nehru nagar',
      landmark: 'test',
      city: 'houston',
      state: 'texas',
      zip: '',
      password: 'test',
      isActive: 1,
    };
    spinner.show();
    try {
      await service.post('admin/hospitals', body);
      spinner.hide();
      reset();
      toastSuccess('Hospital is Registered..! You can Check your Application in Mail..!');
    } catch {
      spinner.hide();
      toastError('Something went wrong!');
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#f1f1f1] px-4 py-8">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[400px] rounded-2xl bg-white p-6 shadow sm:p-8">
        <div className="mb-6 flex justify-center">
          <img src="/images/realtimeapp_logo.png" alt="logo" className="h-14" onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
        </div>
        <h4 className="mb-5 text-center text-xl font-bold text-[#0060f0] sm:text-2xl">Register Your Office</h4>

        <div className="mb-4">
          <input
            placeholder="Office Name"
            {...register('name', { required: true })}
            className="w-full rounded-md border-2 border-[#22b14c] px-4 py-2 outline-none"
          />
          {isSubmitted && errors.name && <p className="mt-1 text-sm text-red-500">Required</p>}
        </div>
        <div className="mb-4">
          <input
            placeholder="Email"
            {...register('email', { required: true, pattern: EMAIL })}
            className="w-full rounded-md border-2 border-[#22b14c] px-4 py-2 outline-none"
          />
          {isSubmitted && errors.email && <p className="mt-1 text-sm text-red-500">Valid email required</p>}
        </div>

        <button type="submit" className="w-full rounded-[30px] bg-[#22b14c] p-2.5 font-semibold text-white hover:bg-[#0060f0]">
          Register
        </button>
      </form>
    </section>
  );
}
