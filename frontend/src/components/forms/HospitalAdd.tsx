'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { service, DYNAMIC_BASE } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { Field } from '@/components/Field';
import { toastSuccess, toastWarning } from '@/lib/alerts';

const DYN = DYNAMIC_BASE;
const PWD_PATTERN =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface HospitalForm {
  name: string;
  username: string;
  password: string;
  repassword: string;
  email: string;
  phonenumber: string;
}

interface Props {
  onSaved: () => void; // refresh + go back to list
}

export function HospitalAdd({ onSaved }: Props) {
  const spinner = useSpinner();
  const [existingNames, setExistingNames] = useState<string[]>([]);
  const [nameExists, setNameExists] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showRePwd, setShowRePwd] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<HospitalForm>({
    defaultValues: {
      name: '',
      username: '',
      password: '',
      repassword: '',
      email: '',
      phonenumber: '',
    },
  });

  const password = watch('password');

  useEffect(() => {
    service
      .getMethod(`${DYN}admin/hospitals`)
      .then((res: any) => {
        const names = (res.data || [])
          .map((k: any) => k.name)
          .filter((n: any) => n != null);
        setExistingNames(names);
      })
      .catch(() => {});
  }, []);

  async function save(values: HospitalForm, eve: 'no' | 'con') {
    if (values.password !== values.repassword) return;

    // check username uniqueness
    try {
      const chk: any = await service.getMethod(
        `${DYN}auth/check-is-user?userName=${values.username}`,
      );
      const exists = chk?.data?.[0]?.exists;
      if (exists) {
        toastWarning('User name Exist, Try with another User name!', 3000);
        return;
      }
    } catch {
      toastWarning('User name Exist, Try with another User name!', 3000);
      return;
    }

    const body = {
      name: values.name,
      phone: '1' + values.phonenumber,
      regNo: '1234',
      img: 'test',
      email: values.email,
      userName: values.username,
      specility: 'heart',
      street: 'nehru nagar',
      landmark: 'test',
      city: 'houston',
      state: 'texas',
      password: values.password,
      isActive: 1,
    };

    spinner.show();
    try {
      await service.post('admin/hospitals', body);
      spinner.hide();
      toastSuccess('Hospital is Registered..!');
      if (eve === 'no') {
        onSaved();
      } else {
        reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch {
      spinner.hide();
      toastWarning('Could not register hospital');
    }
  }

  return (
    <form
      onSubmit={handleSubmit((v) => save(v, 'no'))}
      className="card-base mx-auto w-full max-w-3xl p-4 sm:p-6"
    >
      <Field
        label="Office Name"
        required
        error={
          nameExists
            ? "Office name already exists"
            : isSubmitted && errors.name
              ? "Office name is required"
              : null
        }
      >
        <input
          {...register('name', {
            required: true,
            onChange: (e) =>
              setNameExists(existingNames.includes(e.target.value)),
          })}
          className="form-input-base"
        />
      </Field>

      <Field
        label="UserName"
        required
        error={isSubmitted && errors.username ? 'Username is required' : null}
      >
        <input
          {...register('username', {
            required: true,
            onChange: (e) =>
              setValue('username', e.target.value.toUpperCase()),
          })}
          className="form-input-base"
        />
      </Field>

      <Field
        label="Password"
        required
        error={
          isSubmitted && errors.password
            ? errors.password.type === 'pattern'
              ? 'Password must contain uppercase, lowercase, number & special character'
              : errors.password.type === 'minLength'
                ? 'Minimum 8 characters'
                : 'Password is required'
            : null
        }
      >
        <div className="relative">
          <input
            type={showPwd ? 'text' : 'password'}
            {...register('password', {
              required: true,
              minLength: 8,
              pattern: PWD_PATTERN,
            })}
            className="form-input-base pr-10"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPwd((s) => !s)}
            className="absolute inset-y-0 right-3 flex items-center text-[#0060f0]"
            aria-label={showPwd ? 'Hide password' : 'Show password'}
          >
            <i className={`fa ${showPwd ? 'fa-eye-slash' : 'fa-eye'}`} />
          </button>
        </div>
      </Field>

      <Field
        label="Re-Enter password"
        required
        error={
          isSubmitted && errors.repassword
            ? 'Re-enter password is required'
            : watch('repassword') && watch('repassword') !== password
              ? "Re-enter password doesn't match"
              : null
        }
      >
        <div className="relative">
          <input
            type={showRePwd ? 'text' : 'password'}
            {...register('repassword', { required: true })}
            className="form-input-base pr-10"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowRePwd((s) => !s)}
            className="absolute inset-y-0 right-3 flex items-center text-[#0060f0]"
            aria-label={showRePwd ? 'Hide password' : 'Show password'}
          >
            <i className={`fa ${showRePwd ? 'fa-eye-slash' : 'fa-eye'}`} />
          </button>
        </div>
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
        <input
          {...register('email', { required: true, pattern: EMAIL_PATTERN })}
          className="form-input-base"
        />
      </Field>

      <Field
        label="Phone Number"
        required
        error={
          isSubmitted && errors.phonenumber
            ? errors.phonenumber.type === 'minLength'
              ? 'Phone Number must be at least 10 characters'
              : 'Phone number is required'
            : null
        }
      >
        <input
          {...register('phonenumber', { required: true, minLength: 10 })}
          onKeyPress={(e) => {
            if (!/[0-9]/.test(e.key)) e.preventDefault();
          }}
          className="form-input-base"
        />
      </Field>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button type="submit" className="btn-primary-brand w-full sm:w-auto">
          Save <i className="fa fa-save ml-1" />
        </button>
        <button
          type="button"
          onClick={handleSubmit((v) => save(v, 'con'))}
          className="btn-outline-brand w-full sm:w-auto"
        >
          Save &amp; Continue <i className="fa fa-arrow-right ml-1" />
        </button>
      </div>
    </form>
  );
}
