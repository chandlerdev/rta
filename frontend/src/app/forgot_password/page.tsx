'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { service } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { toastSuccess, toastError } from '@/lib/alerts';

interface F {
  email: string;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const spinner = useSpinner();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<F>({ defaultValues: { email: '' } });

  async function onSubmit(v: F) {
    spinner.show();
    try {
      await service.post('auth/forgot-password', { username: v.email });
      spinner.hide();
      toastSuccess('Please check your mail to reset your password', 5000);
      router.push('/admin');
    } catch {
      spinner.hide();
      toastError('Invalid Username');
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#f1f1f1] p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[350px] rounded-2xl bg-white p-6 shadow sm:p-8">
        <h4 className="mb-5 text-center text-2xl font-bold text-[#0060f0]">Forgot Password</h4>
        <input
          placeholder="Enter Username"
          {...register('email', {
            required: true,
            onChange: (e) => setValue('email', e.target.value.toUpperCase()),
          })}
          className="w-full rounded-md border-2 border-[#22b14c] px-4 py-2 uppercase outline-none"
        />
        {isSubmitted && errors.email && <p className="mt-1 text-sm text-red-500">Required</p>}
        <button type="submit" className="mt-5 w-full rounded-[30px] bg-[#22b14c] p-2.5 font-semibold text-white hover:bg-[#0060f0]">
          Submit
        </button>
        <a onClick={() => router.push('/admin')} className="mt-4 block cursor-pointer text-center font-medium text-[#0060f0] underline">
          Back to Login
        </a>
      </form>
    </section>
  );
}
