'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { service, crypto, DYNAMIC_BASE } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { Field } from '@/components/Field';
import { toastSuccess, toastError } from '@/lib/alerts';

const DYN = DYNAMIC_BASE;

interface F {
  temp1: string;
  temp2: string;
}

export function Template() {
  const params = useParams<{ enc: string }>();
  const spinner = useSpinner();
  const enc = params?.enc as string;

  const [doctorId, setDoctorId] = useState('');
  const [templateId, setTemplateId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<F>({ defaultValues: { temp1: '', temp2: '' } });

  useEffect(() => {
    const userId = crypto.decodeEnc(enc);
    if (!userId) return;
    spinner.show();
    service
      .getMethod(`${DYN}admin/doctors`)
      .then((res: any) => {
        // No userId filter on GET admin/doctors; match client-side (matches Hospital.tsx pattern).
        const list = Array.isArray(res.data) ? res.data : [];
        const d = list.find((x: any) => String(x.userId) === String(userId));
        if (!d) {
          spinner.hide();
          return;
        }
        setDoctorId(d.id);
        return service.getMethod(
          `${DYN}admin/doctor-templates/by-doctor/${d.id}`,
        );
      })
      .then((res2: any) => {
        spinner.hide();
        if (!res2) return;
        const t = res2.data?.[0] ?? res2.data;
        if (t && t.id) {
          setTemplateId(t.id);
          reset({
            temp1: t.advanceSmsTemplate || '',
            temp2: t.rescheduleSmsTemplate || '',
          });
        }
      })
      .catch(() => spinner.hide());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enc]);

  async function onSubmit(v: F) {
    // DoctorTemplateRequest body (exact spec field names).
    const body = {
      doctorId: doctorId,
      advanceSmsTemplate: v.temp1,
      rescheduleSmsTemplate: v.temp2,
      status: 1,
    };
    spinner.show();
    try {
      if (templateId) {
        await service.PutMethod(`admin/doctor-templates/${templateId}`, body);
      } else {
        await service.post('admin/doctor-templates', body);
      }
      spinner.hide();
      toastSuccess('Template Saved Successfully');
    } catch {
      spinner.hide();
      toastError('Something went wrong!');
    }
  }

  return (
    <div>
      <h4 className="mb-4 text-xl font-semibold text-gray-800">SMS Templates</h4>
      <form onSubmit={handleSubmit(onSubmit)} className="card-base p-6">
        <Field label="Advance SMS Template" required error={isSubmitted && errors.temp1 ? 'Required' : null}>
          <textarea rows={4} {...register('temp1', { required: true })} className="form-input-base" />
        </Field>
        <Field label="Reschedule SMS Template" required error={isSubmitted && errors.temp2 ? 'Required' : null}>
          <textarea rows={4} {...register('temp2', { required: true })} className="form-input-base" />
        </Field>
        <div className="mt-4">
          <button type="submit" className="btn-primary-brand">
            Save <i className="fa fa-save ml-1" />
          </button>
        </div>
      </form>
    </div>
  );
}
