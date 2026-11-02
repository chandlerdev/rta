'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { service, session, local, crypto } from '@/lib/service';
import { toastError, toastWarning } from '@/lib/alerts';
import { useSpinner } from '@/components/Spinner';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const spinner = useSpinner();
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({ defaultValues: { email: '', password: '' } });

  // Clear session on mount (Angular did session.clear() in constructor)
  // and set the +8 month payment date.
  if (typeof window !== 'undefined' && !session.get('_login_init')) {
    session.clear();
    session.set('_login_init', '1');
    const d = new Date();
    d.setMonth(d.getMonth() + 8);
    local.set('paymentdate', d.toISOString().slice(0, 10));
  }

  async function onSubmit(values: LoginForm) {
    setSubmitted(true);
    spinner.show();

    // Raw JSON login -> https://webapp.realtimeappointment.com/api/auth/login
    const payload = {
      userName: values.email,
      password: values.password,
    };

    try {
      const res: any = await service.post('auth/login', payload);

      // New API wraps the user in { code, status, data: [ {...} ] }.
      // Stay tolerant of a plain object / `user` wrapper too.
      let u: any = Array.isArray(res?.data) ? res.data[0] : (res?.data ?? res?.user ?? res);

      if (!u || !u.id) {
        spinner.hide();
        toastError('Invalid Credential..!');
        return;
      }

      // Flag values come back as either strings ("1"/"0") or numbers (1/0),
      // so compare loosely via String().
      const is = (v: any, val: string) => String(v) === val;

      local.set('UserID', String(u.id));
      local.set('authexpdate', u.authExpDate ?? '');
      local.set('plan_id', u.planId ?? '');
      local.set('auth_start_date', u.authStartDate ?? '');

      const ciphertext = crypto.encrypt(u.token ?? res.token ?? '');

      // ---- Normal admin (hospital) ----
      if (
        is(u.isSuperUser, '0') &&
        is(u.isStaff, '0') &&
        is(u.isActive, '1') &&
        is(u.isDoctor, '0') &&
        is(u.isDeleted, '0')
      ) {
        local.set('plan_active', String(u.planActive));
        local.set('Title', 'Administrator');
        local.set('TrackkerApptHosID', String(u.id));

        const idEmail = crypto.b64encode(crypto.encryptJSON(u.email));
        const idx = crypto.b64encode(crypto.encryptJSON(String(u.id)));
        session.set('tok', crypto.b64encode(ciphertext));
        session.set('ck', crypto.b64encode('_doctor_'));
        session.set('val', crypto.b64encode(idx));

        spinner.hide();
        // Plan active -> dashboard. Otherwise -> Payment Method, where it lands
        // on "Select a way to pay" (with the plan loaded by planId) if a plan is
        // already chosen, else on "Choose Your Plan".
        if (Number(u.planActive) === 1) {
          local.set('dashbord', 'ok');
          local.set('datashow', '1');
          router.push(`/homes/0/${idEmail}`);
        } else {
          local.set('dashbord', 'in');
          local.set('datashow', '0');
          router.push(`/homes/13/${idEmail}?ck=plan`);
        }
        return;
      }

      // ---- Super admin ----
      if (
        is(u.isSuperUser, '1') &&
        is(u.isStaff, '1') &&
        is(u.isActive, '1') &&
        is(u.isDoctor, '0') &&
        is(u.isDeleted, '0')
      ) {
        local.set('Title', '');
        local.set('datashow', '0');
        local.set('dashbord', 'ok');
        const id = crypto.b64encode(crypto.encryptJSON(String(u.id)));
        session.set('tok', crypto.b64encode(ciphertext));
        session.set('ck', crypto.b64encode('_doctor_'));
        spinner.hide();
        router.push(`/home/0/${id}`);
        return;
      }

      // ---- Doctor ----
      if (
        is(u.isSuperUser, '0') &&
        is(u.isStaff, '0') &&
        is(u.isActive, '1') &&
        is(u.isDoctor, '1') &&
        is(u.isDeleted, '0')
      ) {
        local.set('dashbord', 'ok');
        local.set('Title', 'Professional');
        local.set('datashow', '0');
        const id = crypto.b64encode(crypto.encryptJSON(String(u.id)));
        session.set('tok', crypto.b64encode(ciphertext));
        session.set('ck', crypto.b64encode('_doctor_'));
        spinner.hide();
        router.push(`/doctor/15/${id}?ck=cal_appointment`);
        return;
      }

      // ---- Inactive ----
      spinner.hide();
      if (is(u.isActive, '0')) {
        toastWarning(
          'Your Account has not been activated yet. Please Contact Admin..!',
        );
        return;
      }
      if (is(u.isDeleted, '1')) {
        toastError('Invalid Credential..!');
      }
    } catch (err) {
      spinner.hide();
      toastError('Invalid Credential..!');
      console.error(err);
    }
  }

  return (
    <section className="m-0 p-0">
      <div className="flex min-h-screen flex-col md:flex-row">
        {/* LEFT HALF — blue panel with logo */}
        <div className="relative min-h-[40vh] flex-1 overflow-hidden bg-[#0060f0] md:sticky md:top-0 md:h-screen md:min-h-0">
          <img
            alt="logo"
            src="/images/new_rta_loginscreen_image.png"
            title="logo"
            className="h-full w-full object-cover"
          />
        </div>

        {/* RIGHT HALF — white form panel */}
        <div className="flex flex-[2] items-center justify-center bg-[#f1f1f1] p-4 sm:p-8 md:bg-white">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto w-full max-w-md"
          >
            <h4 className="py-2.5 text-center text-[26px] font-bold text-[#0060f0]">
              RealTime Appointment
            </h4>
            <ul className="m-0 p-0">
              {/* Username */}
              <li className="relative mb-7 list-none">
                <input
                  type="text"
                  placeholder="Username"
                  {...register('email', {
                    required: true,
                    onChange: (e) =>
                      setValue('email', e.target.value.toUpperCase()),
                  })}
                  className={`box-border w-full rounded-md border-2 py-2 pl-3 pr-10 text-[15px] outline-none ${
                    submitted && errors.email
                      ? 'border-red-500'
                      : 'border-[#22b14c]'
                  }`}
                />
                <span className="absolute right-4 top-2 text-[18px] font-semibold text-[#0060f0]">
                  <i className="fa fa-user" aria-hidden="true" />
                </span>
                {submitted && errors.email && (
                  <div className="m-0 p-0">
                    <p className="m-0 p-0 text-sm text-[#fb0202]">
                      Username is required
                    </p>
                  </div>
                )}
              </li>

              {/* Password */}
              <li className="relative mb-7 list-none">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  {...register('password', { required: true })}
                  className={`box-border w-full rounded-md border-2 py-2 pl-3 pr-10 text-[15px] outline-none ${
                    submitted && errors.password
                      ? 'border-red-500'
                      : 'border-[#22b14c]'
                  }`}
                />
                <span
                  className="absolute right-2.5 top-[8px] cursor-pointer text-[18px] text-[#0060f0]"
                  onClick={() => setShowPassword((s) => !s)}
                >
                  <i
                    className={`fa ${
                      showPassword ? 'fa-eye-slash' : 'fa-eye'
                    }`}
                    aria-hidden="true"
                  />
                </span>
                {submitted && errors.password && (
                  <div className="m-0 p-0">
                    <p className="m-0 p-0 text-sm text-[#fb0202]">
                      Password is required
                    </p>
                  </div>
                )}
              </li>

              {/* Forgot */}
              <li className="mb-7 list-none">
                <a
                  className="block cursor-pointer text-right text-base font-medium text-[#0060f0] underline hover:text-[#0060f0]"
                  onClick={() => router.push('/forgot_password')}
                >
                  Forgot Password
                </a>
              </li>

              {/* Submit */}
              <li className="mb-7 list-none">
                <button
                  type="submit"
                  className="w-full cursor-pointer rounded-[30px] bg-[#22b14c] p-2.5 text-[18px] font-semibold tracking-wide text-white outline-none transition hover:bg-[#0060f0]"
                >
                  Submit
                </button>
              </li>

              {/* Signup */}
              <li className="mb-7 list-none">
                <a
                  className="block cursor-pointer text-center text-base font-medium text-[#0060f0] underline hover:text-[#0060f0]"
                  onClick={() => router.push('/signup')}
                >
                  Office sign-up?
                </a>
              </li>
            </ul>
          </form>
        </div>
      </div>
    </section>
  );
}
