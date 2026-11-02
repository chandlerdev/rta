'use client';

import dynamic from 'next/dynamic';
import { ID_TO_CK } from '@/lib/menu';

// Lazy-load inner views. As each Angular component is converted, add it here.
// Until a view is built, a friendly placeholder renders so the shell still works.

const Placeholder = ({ name }: { name: string }) => (
  <div className="card-base p-8 text-center text-gray-500">
    <p className="text-lg font-semibold">“{name}” view</p>
    <p className="mt-2 text-sm">
      This module is being converted. The dashboard shell, routing, role menus,
      and API service are fully wired — this inner view is pending build-out.
    </p>
  </div>
);

// Map of ck/view-key -> dynamically imported component.
// (Built views get a real import; pending ones fall through to placeholder.)
const VIEWS: Record<string, any> = {
  dashboard: dynamic(() => import('@/views/Dashboard').then((m) => m.Dashboard), {
    ssr: false,
  }),
  hospital: dynamic(() => import('@/views/Hospital').then((m) => m.Hospital), {
    ssr: false,
  }),
  doctor: dynamic(() => import('@/views/Doctor').then((m) => m.Doctor), {
    ssr: false,
  }),
  blockedhospital: dynamic(
    () => import('@/views/BlockedHospital').then((m) => m.BlockedHospital),
    { ssr: false },
  ),
  blockeddoctor: dynamic(
    () => import('@/views/BlockedDoctor').then((m) => m.BlockedDoctor),
    { ssr: false },
  ),
  appointment: dynamic(
    () => import('@/views/Appointment').then((m) => m.Appointment),
    { ssr: false },
  ),
  apptcomplete: dynamic(
    () => import('@/views/ApptListFiltered').then((m) => m.ApptComplete),
    { ssr: false },
  ),
  noshowdoctor: dynamic(
    () => import('@/views/ApptListFiltered').then((m) => m.NoShowDoctor),
    { ssr: false },
  ),
  hosappt: dynamic(
    () => import('@/views/HospitalApptList').then((m) => m.HosAppt),
    { ssr: false },
  ),
  hosapptcomplete: dynamic(
    () => import('@/views/HospitalApptList').then((m) => m.HosApptComplete),
    { ssr: false },
  ),
  noshow: dynamic(
    () => import('@/views/HospitalApptList').then((m) => m.NoShow),
    { ssr: false },
  ),
  cal_appointment: dynamic(
    () => import('@/views/CalAppointment').then((m) => m.CalAppointment),
    { ssr: false },
  ),
  patient_roster: dynamic(
    () => import('@/views/PatientRoster').then((m) => m.PatientRoster),
    { ssr: false },
  ),
  surgery_list: dynamic(
    () => import('@/views/SurgeryList').then((m) => m.SurgeryList),
    { ssr: false },
  ),
  surgery_appt: dynamic(
    () => import('@/views/SurgeryAppt').then((m) => m.SurgeryAppt),
    { ssr: false },
  ),
  surgery_appointment: dynamic(
    () => import('@/views/SurgeryApptDoctor').then((m) => m.SurgeryApptDoctor),
    { ssr: false },
  ),
  pharmacy_list: dynamic(
    () => import('@/views/PharmacyList').then((m) => m.PharmacyList),
    { ssr: false },
  ),
  adminplan: dynamic(
    () => import('@/views/AdminPlan').then((m) => m.AdminPlan),
    { ssr: false },
  ),
  plan: dynamic(
    () => import('@/views/PaymentPlan').then((m) => m.PaymentPlan),
    { ssr: false },
  ),
  template: dynamic(
    () => import('@/views/Template').then((m) => m.Template),
    { ssr: false },
  ),
};

export function resolveView(id: string, ck: string): ReactElementFactory {
  // Resolve by route id first: a view owns all its ck sub-states internally
  // (e.g. id '1' = Hospital handles ck add/edit/more/doctorlist itself).
  const key = ID_TO_CK[id] || ck || 'dashboard';
  const Comp = VIEWS[key];
  if (Comp) return () => <Comp />;
  const label = (key || 'dashboard').replace(/_/g, ' ');
  return () => <Placeholder name={label} />;
}

type ReactElementFactory = () => JSX.Element;
