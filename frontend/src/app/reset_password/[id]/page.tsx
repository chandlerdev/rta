'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { service, crypto } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { toastSuccess, toastError } from '@/lib/alerts';

const PWD = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

interface F {
  password: string;
  repassword: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const spinner = useSpinner();
  const [showPwd, setShowPwd] = useState(false);

  // The :id route segment is base64-encoded user id
  const ID =
    typeof window !== 'undefined' && params?.id
      ? (() => {
          try {
            return crypto.b64decode(params.id as string);
          } catch {
            return params.id as string;
          }
        })()
      : '';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitted },
  } = useForm<F>({ defaultValues: { password: '', repassword: '' } });
  const password = watch('password');

  async function onSubmit(v: F) {
    if (v.password !== v.repassword) return;
    spinner.show();
    try {
      // POST auth/set-password (SetPasswordRequest: { id, password, email })
      await service.post('auth/set-password', {
        id: Number(ID) || ID,
        password: v.password,
      });
      spinner.hide();
      toastSuccess('Password changed successfully');
      router.push('/admin');
    } catch {
      spinner.hide();
      toastError('Something went wrong!');
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#f1f1f1] p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[350px] rounded-2xl bg-white p-6 shadow sm:p-8">
        <h4 className="mb-5 text-center text-2xl font-bold text-[#0060f0]">Reset Password</h4>
        <div className="relative mb-4">
          <input
            type={showPwd ? 'text' : 'password'}
            placeholder="New Password"
            {...register('password', { required: true, minLength: 8, pattern: PWD })}
            className="w-full rounded-md border-2 border-[#22b14c] px-4 py-2 outline-none"
          />
          <span className="absolute right-4 top-2.5 cursor-pointer text-[#0060f0]" onClick={() => setShowPwd((s) => !s)}>
            <i className={`fa ${showPwd ? 'fa-eye-slash' : 'fa-eye'}`} />
          </span>
          {isSubmitted && errors.password && (
            <p className="mt-1 text-sm text-red-500">8+ chars incl. uppercase, lowercase, number &amp; special</p>
          )}
        </div>
        <input
          type="password"
          placeholder="Re-enter Password"
          {...register('repassword', { required: true })}
          className="w-full rounded-md border-2 border-[#22b14c] px-4 py-2 outline-none"
        />
        {watch('repassword') && watch('repassword') !== password && (
          <p className="mt-1 text-sm text-red-500">Passwords don&apos;t match</p>
        )}
        <button type="submit" className="mt-5 w-full rounded-[30px] bg-[#22b14c] p-2.5 font-semibold text-white hover:bg-[#0060f0]">
          Reset Password
        </button>
      </form>
    </section>
  );
}
