'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { service, local, DYNAMIC_BASE } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { Field } from '@/components/Field';
import { toastSuccess, toastError } from '@/lib/alerts';

const DYN = DYNAMIC_BASE;

interface SForm {
  name: string;
  medications: string;
  duration: string;
  drop_time: string;
  before_instruction: string;
  notification_after_surgery: string;
}

interface Props {
  surgeryId?: string | null;
  onSaved: () => void;
}

// "HH:MM:SS" -> decimal hours (e.g. 1:30:00 -> 1.5)
function timeToDecimal(t: string): string {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  return String(+(h + (m || 0) / 60).toFixed(2));
}
// decimal hours -> "HH:MM:SS"
function decimalToTime(dec: string): string {
  const n = Number(dec);
  if (!isFinite(n)) return '00:00:00';
  const h = Math.floor(n);
  const m = Math.round((n - h) * 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
}

export function SurgeryForm({ surgeryId, onSaved }: Props) {
  const spinner = useSpinner();
  const hosId = typeof window !== 'undefined' ? local.get('TrackkerApptHosId') || '' : '';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<SForm>({
    defaultValues: {
      name: '',
      medications: '',
      duration: '',
      drop_time: '',
      before_instruction: '',
      notification_after_surgery: '',
    },
  });

  useEffect(() => {
    if (!surgeryId) return;
    spinner.show();
    service
      .getMethod(`${DYN}admin/surgeries/${surgeryId}`)
      .then((res: any) => {
        spinner.hide();
        const d = res.data?.[0];
        if (!d) return;
        reset({
          name: d.surgeryName || '',
          medications: d.medications || '',
          duration: timeToDecimal(d.duration),
          drop_time: timeToDecimal(d.dropOfTimeInAdvance),
          before_instruction: d.procedureInstructionInBeforeDropOff || '',
          notification_after_surgery: timeToDecimal(
            d.notificationTimeToAttenderAfterSurgeryCompleting,
          ),
        });
      })
      .catch(() => spinner.hide());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surgeryId]);

  async function onSubmit(values: SForm) {
    spinner.show();
    try {
      if (surgeryId) {
        const body = {
          hospitalId: hosId,
          patientType: '',
          procedureCategory: '',
          surgeryName: values.name,
          procedureShortDescription: '',
          procedureDetailedDescription: '',
          procedureMedicationsInstructions: '',
          dosageGuidelines: '',
          notesWarnings: '',
          medications: values.medications,
          duration: decimalToTime(values.duration),
          dropOfTimeInAdvance: decimalToTime(values.drop_time),
          procedureInstructionInBeforeDropOff: values.before_instruction,
          notificationTimeToAttenderAfterSurgeryCompleting: decimalToTime(
            values.notification_after_surgery,
          ),
          status: 1,
        };
        await service.PutMethod(`admin/surgeries/${surgeryId}`, body);
      } else {
        const body = {
          hospitalId: hosId,
          patientType: '',
          procedureCategory: '',
          surgeryName: values.name,
          procedureShortDescription: '',
          procedureDetailedDescription: '',
          procedureMedicationsInstructions: '',
          dosageGuidelines: '',
          notesWarnings: '',
          medications: values.medications,
          duration: values.duration,
          dropOfTimeInAdvance: values.drop_time,
          procedureInstructionInBeforeDropOff: values.before_instruction,
          notificationTimeToAttenderAfterSurgeryCompleting:
            values.notification_after_surgery,
          status: 1,
        };
        await service.post('admin/surgeries', body);
      }
      spinner.hide();
      toastSuccess(surgeryId ? 'Surgery Updated Successfully' : 'Surgery Added Successfully');
      onSaved();
    } catch {
      spinner.hide();
      toastError('Something went wrong!');
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card-base mx-auto w-full max-w-3xl p-4 sm:p-6"
    >
      <Field label="Surgery Name" required error={isSubmitted && errors.name ? 'Required' : null}>
        <input {...register('name', { required: true })} className="form-input-base" />
      </Field>
      <Field label="Medications" required error={isSubmitted && errors.medications ? 'Required' : null}>
        <textarea rows={2} {...register('medications', { required: true })} className="form-input-base" />
      </Field>
      <Field label="Duration (hours)" required error={isSubmitted && errors.duration ? 'Required' : null}>
        <input type="number" step="0.01" {...register('duration', { required: true })} className="form-input-base" />
      </Field>
      <Field label="Drop-off Time in Advance (hours)" required error={isSubmitted && errors.drop_time ? 'Required' : null}>
        <input type="number" step="0.01" {...register('drop_time', { required: true })} className="form-input-base" />
      </Field>
      <Field label="Procedure Instruction (before drop-off)" required error={isSubmitted && errors.before_instruction ? 'Required' : null}>
        <textarea rows={2} {...register('before_instruction', { required: true })} className="form-input-base" />
      </Field>
      <Field label="Notify Attender After Completing (hours)" required error={isSubmitted && errors.notification_after_surgery ? 'Required' : null}>
        <input type="number" step="0.01" {...register('notification_after_surgery', { required: true })} className="form-input-base" />
      </Field>

      <div className="mt-6">
        <button type="submit" className="btn-primary-brand w-full sm:w-auto">
          {surgeryId ? 'Update' : 'Save'} <i className="fa fa-save ml-1" />
        </button>
      </div>
    </form>
  );
}
