'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { service, local, DYNAMIC_BASE } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { toastWarning, toastSuccess } from '@/lib/alerts';

const DYN = DYNAMIC_BASE;
const PWD = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface F {
  doctorname: string;
  username: string;
  password: string;
  repassword: string;
  email: string;
  phonenumber: string;
  smsConsent: boolean;
}

interface Props {
  // From /signup/{id} — the chosen plan id; empty/undefined for a normal /signup.
  planId?: string;
}

export function SignupForm({ planId }: Props) {
  const router = useRouter();
  const spinner = useSpinner();
  const [showPwd, setShowPwd] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<F>({
    defaultValues: {
      doctorname: '',
      username: '',
      password: '',
      repassword: '',
      email: '',
      phonenumber: '',
      smsConsent: false,
    },
  });
  const password = watch('password');

  async function onSubmit(v: F) {
    if (v.password !== v.repassword) return;
    spinner.show();
    try {
      // username uniqueness
      const check: any = await service.getMethod(
        `${DYN}auth/check-is-user?userName=${encodeURIComponent(v.username)}`,
      );
      if (check?.data?.[0]?.exists === true) {
        spinner.hide();
        toastWarning('Username already exists', 3000);
        return;
      }
      // store details for verification step
      local.set('doctorname', v.doctorname);
      local.set('phonenumber', v.phonenumber);
      local.set('email', v.email);
      local.set('username', v.username);
      local.set('password', v.password);
      // carry the plan id (from /signup/{id}); empty for a normal signup
      local.set('signupPlanId', planId || '');
      // request OTP
      const res: any = await service.post('admin/sms/otp', {
        phone: v.phonenumber,
        region: '1',
        content: 'Your RealtimeWare OTP verification code',
      });
      spinner.hide();
      if (res?.data?.[0]?.otp) {
        local.set('otp', res.data[0].otp);
        toastSuccess('Please enter your OTP number!');
        router.push('/verification');
      } else {
        toastWarning('Could not send OTP');
      }
    } catch {
      spinner.hide();
      toastWarning('Username already exists', 3000);
    }
  }

  return (
    <section className="m-0 p-0">
      <div className="flex min-h-screen flex-col md:flex-row">
        <div className="relative min-h-[40vh] flex-1 overflow-hidden bg-[#0060f0] md:sticky md:top-0 md:h-screen md:min-h-0">
          <img
            src="/images/new_rta_loginscreen_image.png"
            alt="logo"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-[2] items-center justify-center bg-white p-4 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-full max-w-md py-6">
            <h4 className="py-2.5 text-center text-[26px] font-bold text-[#0060f0]">
              Office Sign Up
            </h4>
            <ul className="m-0 list-none p-0">
              <li className="mb-5">
                <input
                  placeholder="Office Name"
                  {...register('doctorname', { required: true })}
                  className="w-full rounded-md border-2 border-[#22b14c] px-4 py-2 outline-none"
                />
                {isSubmitted && errors.doctorname && <p className="text-sm text-red-500">Required</p>}
              </li>
              <li className="mb-5">
                <input
                  placeholder="Username"
                  {...register('username', {
                    required: true,
                    onChange: (e) => setValue('username', e.target.value.toUpperCase()),
                  })}
                  className="w-full rounded-md border-2 border-[#22b14c] px-4 py-2 outline-none"
                />
                {isSubmitted && errors.username && <p className="text-sm text-red-500">Required</p>}
              </li>
              <li className="relative mb-5">
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Password"
                  {...register('password', { required: true, minLength: 8, pattern: PWD })}
                  className="w-full rounded-md border-2 border-[#22b14c] px-4 py-2 outline-none"
                />
                <span className="absolute right-4 top-2.5 cursor-pointer text-[#0060f0]" onClick={() => setShowPwd((s) => !s)}>
                  <i className={`fa ${showPwd ? 'fa-eye-slash' : 'fa-eye'}`} />
                </span>
                {isSubmitted && errors.password && (
                  <p className="text-sm text-red-500">
                    8+ chars incl. uppercase, lowercase, number &amp; special character
                  </p>
                )}
              </li>
              <li className="mb-5">
                <input
                  type="password"
                  placeholder="Re-enter Password"
                  {...register('repassword', { required: true })}
                  className="w-full rounded-md border-2 border-[#22b14c] px-4 py-2 outline-none"
                />
                {watch('repassword') && watch('repassword') !== password && (
                  <p className="text-sm text-red-500">Passwords don&apos;t match</p>
                )}
              </li>
              <li className="mb-5">
                <input
                  placeholder="Email"
                  {...register('email', { required: true, pattern: EMAIL })}
                  className="w-full rounded-md border-2 border-[#22b14c] px-4 py-2 outline-none"
                />
                {isSubmitted && errors.email && <p className="text-sm text-red-500">Valid email required</p>}
              </li>
              <li className="mb-5">
                <input
                  placeholder="Phone Number"
                  {...register('phonenumber', { required: true, minLength: 10, maxLength: 10 })}
                  onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }}
                  className="w-full rounded-md border-2 border-[#22b14c] px-4 py-2 outline-none"
                />
                {isSubmitted && errors.phonenumber && <p className="text-sm text-red-500">10-digit phone required</p>}
              </li>
              <li className="mb-5">
                <label className="flex cursor-pointer items-start gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    {...register('smsConsent', { required: true })}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#22b14c]"
                  />
                  <span>
                    I agree to receive one-time verification codes via SMS from RealtimeWare (Appointware,
                    operated by DESSS Inc) at the number provided. Message frequency varies. Msg &amp; data rates may apply. Reply HELP for help,
                    STOP to opt out. See our{' '}
                    <a href="https://realtimeware.appointware.com/privacy-policy.html" target="_blank" rel="noopener noreferrer" className="text-[#0060f0] underline">
                      Privacy Policy
                    </a>{' '}
                    and Terms.
                  </span>
                </label>
                {isSubmitted && errors.smsConsent && (
                  <p className="text-sm text-red-500">Please agree to receive SMS verification codes</p>
                )}
              </li>
              <li className="mb-5">
                <button type="submit" className="w-full rounded-[30px] bg-[#22b14c] p-2.5 text-[18px] font-semibold text-white hover:bg-[#0060f0]">
                  Submit
                </button>
              </li>
              <li>
                <a onClick={() => router.push('/admin')} className="block cursor-pointer text-center font-medium text-[#0060f0] underline">
                  Back to Login
                </a>
              </li>
            </ul>
          </form>
        </div>
      </div>
    </section>
  );
}
