'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { service, DYNAMIC_BASE } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { RichTextEditor } from '@/components/RichTextEditor';
import { toastSuccess, toastError, toastWarning } from '@/lib/alerts';

const DYN = DYNAMIC_BASE;

interface PlanForm {
  title1: string;
  title2: string;
  price: string;
  price_title: string;
  button1: string;
  description1: string; // Benefits Bulletpoints (HTML)
  button2: string;
  description2: string; // Intro Paragraph
  description2_number: string;
  description3: string; // Full Description
}

interface Props {
  planId?: string | null;
  onSaved: () => void;
}

const isHtmlEmpty = (html: string) =>
  !html || html.replace(/<[^>]*>/g, '').replace(/\s|&nbsp;/g, '') === '';

export function AdminPlanForm({ planId, onSaved }: Props) {
  const spinner = useSpinner();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<PlanForm>({
    defaultValues: {
      title1: '',
      title2: '',
      price: '',
      price_title: '',
      button1: '',
      description1: '',
      button2: '',
      description2: '',
      description2_number: '',
      description3: '',
    },
  });

  const description1 = watch('description1');

  useEffect(() => {
    if (!planId) return;
    spinner.show();
    service
      .getMethod(`${DYN}admin/subscriptions/plans/${planId}`)
      .then((res: any) => {
        spinner.hide();
        const d = res.data?.[0] ?? res.data;
        if (!d) return;
        reset({
          title1: d.title1 || '',
          title2: d.title2 || '',
          price: d.price || '',
          price_title: d.priceTitle || '',
          button1: d.button1 || '',
          description1: d.description1 || '',
          button2: d.button2 || '',
          description2: d.description2 || '',
          description2_number: d.description2Number || '',
          description3: d.description3 || '',
        });
      })
      .catch(() => spinner.hide());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId]);

  async function onSubmit(v: PlanForm) {
    if (isHtmlEmpty(v.description1)) {
      toastWarning('Benefits Bulletpoints Required', 3000);
      return;
    }
    // SubscriptionSetupRequest body (exact spec field names).
    // title1/title2/description2 (Intro Paragraph)/button2 are hidden in the UI
    // and intentionally sent as empty strings. Full Description (description3)
    // is shown and its value is sent.
    const body = {
      title1: '',
      title2: '',
      price: v.price,
      priceTitle: v.price_title,
      button1: v.button1,
      description1: v.description1,
      button2: '',
      description2: '',
      description2Number: v.description2_number,
      description3: v.description3,
      iosIdentifier: '',
      status: 1,
    };
    spinner.show();
    try {
      if (planId) {
        await service.PutMethod(`admin/subscriptions/plans/${planId}`, body);
      } else {
        await service.post('admin/subscriptions/plans', body);
      }
      spinner.hide();
      toastSuccess(planId ? 'Updated Successfully' : 'Create Successfully');
      onSaved();
    } catch {
      spinner.hide();
      toastError('Something went wrong!');
    }
  }

  const labelCls = 'mb-1 block text-sm font-semibold text-white';
  const boxCls =
    'w-full rounded-md bg-white px-3 py-2 text-sm text-gray-800 shadow-sm outline-none focus:ring-2 focus:ring-[#22b14c]/40';
  const errCls = 'mt-1 text-sm text-red-600';
  const Req = () => <span className="text-red-500">*</span>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-full max-w-6xl">
      {/* Green panel — matches the side-menu green */}
      <div className="rounded-2xl bg-gradient-to-b from-[#22b14c] to-[#1c9a42] p-5 shadow sm:p-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
          {/* Button Name */}
          <div>
            <label className={labelCls}>
              Button Name <Req />
            </label>
            <select
              {...register('button1', { required: true })}
              className={boxCls}
            >
              <option value="">Select…</option>
              <option value="Bronze">Bronze</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
            </select>
            {isSubmitted && errors.button1 && (
              <p className={errCls}>Button Name Required</p>
            )}
          </div>

          {/* Price / Price Title */}
          <div>
            <label className={labelCls}>
              Price <Req />
            </label>
            <input
              type="number"
              {...register('price', { required: true })}
              className={boxCls}
            />
            {isSubmitted && errors.price && (
              <p className={errCls}>Price Required</p>
            )}
          </div>
          <div>
            <label className={labelCls}>
              Price Title <Req />
            </label>
            <select
              {...register('price_title', { required: true })}
              className={boxCls}
            >
              <option value="">Select…</option>
              <option value="per month">per month</option>
              <option value="per year">per year</option>
            </select>
            {isSubmitted && errors.price_title && (
              <p className={errCls}>Price Title Required</p>
            )}
          </div>

          {/* Providers / Limit */}
          <div>
            <label className={labelCls}>
              Providers / Limit (Description 2 Number) <Req />
            </label>
            <input
              type="number"
              {...register('description2_number', { required: true })}
              className={boxCls}
            />
            {isSubmitted && errors.description2_number && (
              <p className={errCls}>Providers / Limit Required</p>
            )}
          </div>

          {/* Benefits Bulletpoints (full width, rich text) */}
          <div className="md:col-span-2">
            <label className={labelCls}>
              Benefits Bulletpoints <Req />
            </label>
            <RichTextEditor
              value={description1}
              onChange={(html) => setValue('description1', html)}
              placeholder="Add benefit bullet points…"
            />
            {isSubmitted && isHtmlEmpty(description1) && (
              <p className={errCls}>Benefits Bulletpoints Required</p>
            )}
          </div>

          {/* Full Description (full width) */}
          <div className="md:col-span-2">
            <label className={labelCls}>
              Full Description <Req />
            </label>
            <textarea
              rows={3}
              {...register('description3', { required: true })}
              className={boxCls}
            />
            {isSubmitted && errors.description3 && (
              <p className={errCls}>Full Description Required</p>
            )}
          </div>

        </div>
      </div>

      <div className="mt-5 flex justify-center">
        <button
          type="submit"
          className="rounded-md bg-[#0060f0] px-8 py-2 font-semibold text-white hover:bg-[#0050d0]"
        >
          {planId ? 'Update' : 'Save'} <i className="fa fa-save ml-1" />
        </button>
      </div>
    </form>
  );
}
