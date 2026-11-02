'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { service, local, DYNAMIC_BASE } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { Field } from '@/components/Field';
import { fmtMMDDYYYY } from '@/lib/datetime';
import { toastSuccess, toastError } from '@/lib/alerts';

const DYN = DYNAMIC_BASE;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NOTI_OPTIONS = ['In the morning', 'Day before', 'Week before'];

interface SAForm {
  procedure_cat: string;
  surgery_name: string;
  surgery_duration: string;
  pro_short_des: string;
  pro_detailed_des: string;
  pro_medications_ins: string;
  dosage_guidelines: string;
  notes_warnings: string;
  doctor: string;
  patient_name: string;
  phone: string;
  email: string;
  date: string;
  start_time: string;
  surgery_details: string;
  attender_name: string;
  attender_phone: string;
  drop_time: string;
  pharmacy: string;
  medicine_names: string;
}

interface Props {
  apptId?: string | null;
  onSaved: () => void;
}

function normalizeUSPhone(input: string): string {
  let digits = (input || '').replace(/[^\d+]/g, '');
  if (digits.startsWith('+1') && digits.length === 12) return digits;
  if (digits.startsWith('+') && !digits.startsWith('+1')) return digits;
  if (digits.length === 10) return '+1' + digits;
  if (digits.length === 11 && digits.startsWith('1')) return '+1' + digits.slice(1);
  return digits;
}
function getDaysBefore(dateInput: string, days: number): string {
  const d = new Date(dateInput);
  d.setDate(d.getDate() - days);
  return fmtMMDDYYYY(d);
}

export function SurgeryApptForm({ apptId, onSaved }: Props) {
  const spinner = useSpinner();
  const hosId = typeof window !== 'undefined' ? local.get('TrackkerApptHosId') || '' : '';
  const hosUserId = typeof window !== 'undefined' ? local.get('TrackkerApptHosID') || '' : '';

  const [procedureCats, setProcedureCats] = useState<any[]>([]);
  const [medications, setMedications] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [surgeryList, setSurgeryList] = useState<any[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [attNoti, setAttNoti] = useState(false);
  const [timeError, setTimeError] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<SAForm>({
    defaultValues: {
      procedure_cat: '',
      surgery_name: '',
      surgery_duration: '',
      pro_short_des: '',
      pro_detailed_des: '',
      pro_medications_ins: '',
      dosage_guidelines: '',
      notes_warnings: '',
      doctor: '',
      patient_name: '',
      phone: '',
      email: '',
      date: '',
      start_time: '',
      surgery_details: '',
      attender_name: '',
      attender_phone: '',
      drop_time: '',
      pharmacy: '',
      medicine_names: '',
    },
  });

  // load dropdowns
  useEffect(() => {
    service.getMethod(`${DYN}admin/lookups/procedure-categories`)
      .then((r: any) =>
        setProcedureCats(
          (Array.isArray(r.data) ? r.data : []).filter(
            (c: any) => Number(c.status) === 1 && Number(c.isDeleted) === 0,
          ),
        ),
      ).catch(() => {});

    service.getMethod(`${DYN}admin/medications`)
      .then((r: any) =>
        setMedications(
          (Array.isArray(r.data) ? r.data : []).filter(
            (m: any) => Number(m.status) === 1 && Number(m.isDeleted) === 0,
          ),
        ),
      ).catch(() => {});

    service.getMethod(`${DYN}admin/doctors?hospitalId=${hosId}`)
      .then((r: any) => setDoctors(Array.isArray(r.data) ? r.data : []))
      .catch(() => {});

    service.getMethod(`${DYN}admin/pharmacies`)
      .then((r: any) => setPharmacies(Array.isArray(r.data) ? r.data : []))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // prefill on edit
  useEffect(() => {
    if (!apptId) return;
    spinner.show();
    service.getMethod(`${DYN}admin/operation-appointments/${apptId}`).then((res: any) => {
      spinner.hide();
      const d = Array.isArray(res.data) ? res.data[0] : res.data;
      if (!d) return;
      reset({
        procedure_cat: d.procedureCategory || '',
        surgery_name: d.surgeryName || '',
        surgery_duration: d.surgeryDurationTime || '',
        pro_short_des: d.procedureShortDescription || '',
        pro_detailed_des: d.procedureDetailedDescription || '',
        pro_medications_ins: d.procedureMedicationsInstructions || '',
        dosage_guidelines: d.dosageGuidelines || '',
        notes_warnings: d.notesWarnings || '',
        doctor: d.doctor || '',
        patient_name: d.patientName || '',
        phone: d.phone || '',
        email: d.email || '',
        date: d.date ? new Date(d.date).toISOString().slice(0, 10) : '',
        start_time: (d.surgeryStartTime || '').slice(0, 5),
        surgery_details: d.surgeryDetails || '',
        attender_name: d.attenderName || '',
        attender_phone: d.attenderPhoneNumber || '',
        drop_time: d.dropOffTime || '',
        pharmacy: d.pharmacy || '',
        medicine_names: d.medicineNames || '',
      });
      setAttNoti(Number(d.isAttender) === 1);
    }).catch(() => spinner.hide());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apptId]);

  // when procedure category changes -> load surgeries
  function onCategoryChange(proCat: string) {
    setValue('procedure_cat', proCat);
    setSurgeryList([]);
    // New API has no procedure_category filter; fetch by hospital then filter client-side.
    service.getMethod(`${DYN}admin/surgeries?hospitalId=${hosId}`).then((res: any) => {
      const arr = Array.isArray(res.data) ? res.data : [];
      setSurgeryList(
        arr.filter(
          (x: any) =>
            String(x.procedureCategory) === String(proCat) &&
            Number(x.status) === 1 &&
            Number(x.isDeleted) === 0,
        ),
      );
    }).catch(() => {});
  }

  // when surgery selected -> autofill
  function onSurgerySelect(id: string) {
    const s = surgeryList.find((x) => String(x.id) === String(id));
    if (!s) return;
    setValue('surgery_name', s.surgeryName);
    setValue('surgery_duration', s.duration);
    setValue('pro_short_des', s.procedureShortDescription || '');
    setValue('pro_detailed_des', s.procedureDetailedDescription || '');
    setValue('pro_medications_ins', s.procedureMedicationsInstructions || '');
    setValue('dosage_guidelines', s.dosageGuidelines || '');
    setValue('notes_warnings', s.notesWarnings || '');
    setValue('drop_time', s.dropOfTimeInAdvance || '');
  }

  // phone lookup -> autofill patient
  function patientLookup() {
    const phone = getValues('phone');
    if (!phone) return;
    // New API: GET patient-rosters by hospitalId (no phone filter param); match phone client-side.
    service.getMethod(`${DYN}admin/patient-rosters/${hosId}`).then((res: any) => {
      const arr = Array.isArray(res.data) ? res.data : [];
      const d = arr.find((p: any) => String(p.phone) === String(phone));
      if (!d) return;
      setValue('patient_name', `${d.firstName} ${d.lastName}`);
      setValue('email', d.email || '');
      // ZcmsPatientRoster has no attender fields in the new API; leave untouched.
    }).catch(() => {});
  }

  function toggleTime(opt: string) {
    setSelectedTimes((prev) =>
      prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt],
    );
  }

  async function onSubmit(values: SAForm) {
    if (selectedTimes.length === 0) {
      setTimeError(true);
      return;
    }
    setTimeError(false);

    const surgeryDate = fmtMMDDYYYY(values.date);
    const phone = normalizeUSPhone(values.phone);
    const attPhone = normalizeUSPhone(values.attender_phone);
    const notTime = selectedTimes.join(', ');
    // binary array: '0' if selected else '1' (matches original getBinaryArray)
    const selectedValues = NOTI_OPTIONS.map((o) =>
      selectedTimes.includes(o) ? '0' : '1',
    );

    const body: any = {
      procedureCategory: values.procedure_cat,
      surgeryName: values.surgery_name,
      surgeryDurationTime: values.surgery_duration,
      doctor: values.doctor,
      patientName: values.patient_name,
      phone: phone,
      email: values.email,
      date: surgeryDate,
      surgeryStartTime: values.start_time + ':00',
      surgeryDetails: values.surgery_details,
      attenderName: values.attender_name,
      attenderPhoneNumber: attPhone,
      dropOffTime: values.drop_time,
      pharmacy: values.pharmacy,
      medicineNames: values.medicine_names,
      notifications: 'Sms',
      notificationTime: notTime,
      isAttender: attNoti ? 1 : 0,
      hospital: hosId,
      procedureShortDescription: values.pro_short_des,
      procedureDetailedDescription: values.pro_detailed_des,
      procedureMedicationsInstructions: values.pro_medications_ins,
      dosageGuidelines: values.dosage_guidelines,
      notesWarnings: values.notes_warnings,
    };

    spinner.show();
    try {
      let res: any;
      if (apptId) {
        body.id = apptId;
        res = await service.PutMethod(`admin/operation-appointments/${apptId}`, body);
      } else {
        res = await service.post('admin/operation-appointments', body);
      }
      const saved = res?.data?.[0] || {};
      const opDate = saved.date || surgeryDate;
      const opId = saved.id || apptId || '';
      // per-type SMS records
      for (let i = 0; i < NOTI_OPTIONS.length; i++) {
        const ke = NOTI_OPTIONS[i];
        let type = '';
        let smsDate = '';
        if (ke === 'In the morning') {
          type = 'Morning';
          smsDate = opDate;
        } else if (ke === 'Day before') {
          type = 'Day';
          smsDate = getDaysBefore(opDate, 1);
        } else {
          type = 'Week';
          smsDate = getDaysBefore(opDate, 7);
        }
        const smsContent = `Reminder (${ke}) for surgery ${values.surgery_name} on ${opDate}`;
        const smsBody = {
          appId: String(opId),
          phone: phone,
          smsContent: smsContent,
          type: type,
          smsTime: smsDate,
          isDeleted: Number(selectedValues[i]),
        };
        await service.post('admin/operation-sms', smsBody).catch(() => {});
      }
      spinner.hide();
      toastSuccess(
        apptId
          ? 'Surgery Appointment Updated Successfully'
          : 'Surgery Appointment Added Successfully',
      );
      onSaved();
    } catch {
      spinner.hide();
      toastError('Something went wrong!');
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card-base mx-auto w-full max-w-4xl p-4 sm:p-6"
    >
      <Field label="Procedure Category" required error={isSubmitted && errors.procedure_cat ? 'Required' : null}>
        <select
          value={watch('procedure_cat')}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="form-input-base"
        >
          <option value="">Select Category</option>
          {procedureCats.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.categoryName}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Surgery" required error={isSubmitted && errors.surgery_name ? 'Required' : null}>
        <select onChange={(e) => onSurgerySelect(e.target.value)} className="form-input-base">
          <option value="">Select Surgery</option>
          {surgeryList.map((s: any) => (
            <option key={s.id} value={s.id}>
              {s.surgeryName}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Surgery Name" required error={isSubmitted && errors.surgery_name ? 'Required' : null}>
        <input {...register('surgery_name', { required: true })} className="form-input-base" />
      </Field>
      <Field label="Surgery Duration" required error={isSubmitted && errors.surgery_duration ? 'Required' : null}>
        <input {...register('surgery_duration', { required: true })} className="form-input-base" />
      </Field>

      <Field label="Doctor" required error={isSubmitted && errors.doctor ? 'Required' : null}>
        <select {...register('doctor', { required: true })} className="form-input-base">
          <option value="">Select Doctor</option>
          {doctors.map((d: any) => (
            <option key={d.id} value={d.id}>
              {d.firstName}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Phone" required error={isSubmitted && errors.phone ? 'Required' : null}>
        <input {...register('phone', { required: true })} onBlur={patientLookup} className="form-input-base" />
      </Field>
      <Field label="Patient Name" required error={isSubmitted && errors.patient_name ? 'Required' : null}>
        <input {...register('patient_name', { required: true })} className="form-input-base" />
      </Field>
      <Field label="Email" required error={isSubmitted && errors.email ? (errors.email.type === 'pattern' ? 'Email is invalid' : 'Required') : null}>
        <input {...register('email', { required: true, pattern: EMAIL })} className="form-input-base" />
      </Field>

      <Field label="Date" required error={isSubmitted && errors.date ? 'Required' : null}>
        <input type="date" {...register('date', { required: true })} className="form-input-base" />
      </Field>
      <Field label="Start Time" required error={isSubmitted && errors.start_time ? 'Required' : null}>
        <input type="time" {...register('start_time', { required: true })} className="form-input-base" />
      </Field>

      <Field label="Pharmacy" required error={isSubmitted && errors.pharmacy ? 'Required' : null}>
        <select {...register('pharmacy', { required: true })} className="form-input-base">
          <option value="">Select Pharmacy</option>
          {pharmacies.map((p: any) => (
            <option key={p.id} value={p.id}>
              {p.pharmacyName}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Medicine Names" required error={isSubmitted && errors.medicine_names ? 'Required' : null}>
        <select {...register('medicine_names', { required: true })} className="form-input-base">
          <option value="">Select Medicine</option>
          {medications.map((m: any) => (
            <option key={m.id} value={m.drugName}>
              {m.drugName}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Attender Name" required error={isSubmitted && errors.attender_name ? 'Required' : null}>
        <input {...register('attender_name', { required: true })} className="form-input-base" />
      </Field>
      <Field label="Attender Phone" required error={isSubmitted && errors.attender_phone ? 'Required' : null}>
        <input {...register('attender_phone', { required: true })} className="form-input-base" />
      </Field>
      <Field label="Drop-off Time" required error={isSubmitted && errors.drop_time ? 'Required' : null}>
        <input {...register('drop_time', { required: true })} className="form-input-base" />
      </Field>

      <Field label="Surgery Details" required error={isSubmitted && errors.surgery_details ? 'Required' : null}>
        <textarea rows={2} {...register('surgery_details', { required: true })} className="form-input-base" />
      </Field>
      <Field label="Procedure Short Description" required error={isSubmitted && errors.pro_short_des ? 'Required' : null}>
        <textarea rows={2} {...register('pro_short_des', { required: true })} className="form-input-base" />
      </Field>
      <Field label="Procedure Detailed Description" required error={isSubmitted && errors.pro_detailed_des ? 'Required' : null}>
        <textarea rows={2} {...register('pro_detailed_des', { required: true })} className="form-input-base" />
      </Field>
      <Field label="Medication Instructions" required error={isSubmitted && errors.pro_medications_ins ? 'Required' : null}>
        <textarea rows={2} {...register('pro_medications_ins', { required: true })} className="form-input-base" />
      </Field>
      <Field label="Dosage Guidelines" required error={isSubmitted && errors.dosage_guidelines ? 'Required' : null}>
        <textarea rows={2} {...register('dosage_guidelines', { required: true })} className="form-input-base" />
      </Field>
      <Field label="Notes / Warnings" required error={isSubmitted && errors.notes_warnings ? 'Required' : null}>
        <textarea rows={2} {...register('notes_warnings', { required: true })} className="form-input-base" />
      </Field>

      <Field label="Notification Times" required error={timeError ? 'Select at least one' : null}>
        <div className="flex flex-wrap gap-4">
          {NOTI_OPTIONS.map((opt) => (
            <label key={opt} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedTimes.includes(opt)}
                onChange={() => toggleTime(opt)}
              />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
      </Field>

      <Field label="Notify Attender?">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={attNoti} onChange={(e) => setAttNoti(e.target.checked)} />
          <span className="text-sm text-gray-600">Send attender notification</span>
        </label>
      </Field>

      <div className="mt-6">
        <button type="submit" className="btn-primary-brand w-full sm:w-auto">
          {apptId ? 'Update' : 'Save'} <i className="fa fa-save ml-1" />
        </button>
      </div>
    </form>
  );
}
