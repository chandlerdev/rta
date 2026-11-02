'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { service, DYNAMIC_BASE } from '@/lib/service';
import { todayMMDDYYYY } from '@/lib/datetime';

const DYN = DYNAMIC_BASE;

interface Row {
  sno: number;
  name: string;
  doctor_name: string;
  phone: string;
  ftime: string;
  reschedule: string;
  date: string;
  id: string;
}

export default function WebsiteViewPage() {
  const params = useParams<{ id: string }>();
  const userId = params?.id as string;
  const [rows, setRows] = useState<Row[]>([]);
  const hosIdRef = useRef<string>('');

  const loadAppointments = useCallback(() => {
    const hosId = hosIdRef.current;
    if (!hosId) return;
    const dob = todayMMDDYYYY();
    service
      .getMethod(`${DYN}admin/appointments/by-hospital/${hosId}`)
      .then((res: any) => {
        const data = Array.isArray(res.data) ? res.data : [];
        const tst: Row[] = [];
        let count = 0;
        data.forEach((k2: any) => {
          count++;
          if (
            String(k2.isCompleted) === '0' &&
            k2.date === dob &&
            String(k2.isShow) === '0'
          ) {
            tst.push({
              sno: count,
              name: k2.patientName,
              doctor_name: k2.doctorName,
              phone: k2.patientPhone,
              ftime: k2.fromTime,
              reschedule: k2.reschduleTime,
              date: k2.date,
              id: k2.appointmentId,
            });
          }
        });
        setRows(tst);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!userId) return;
    service
      .getMethod(`${DYN}admin/hospitals/${userId}`)
      .then((res2: any) => {
        const h = Array.isArray(res2.data) ? res2.data[0] : res2.data;
        hosIdRef.current = h?.id || '';
        loadAppointments();
      })
      .catch(() => {});

    const interval = setInterval(loadAppointments, 15000);
    return () => clearInterval(interval);
  }, [userId, loadAppointments]);

  return (
    <div className="min-h-screen bg-[#0b1f3a ] p-4 text-white sm:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-center">
          <img
            src="/images/RTA_whitelogo.png"
            alt="logo"
            className="h-12 sm:h-16"
            onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
          />
        </div>
        <h2 className="mb-6 text-center text-2xl font-bold sm:text-3xl">
          Today&rsquo;s Appointments
        </h2>

        <div className="overflow-x-auto rounded-lg bg-white/10">
          <table className="w-full min-w-[640px] text-left">
            <thead className="bg-white/10 text-sm uppercase">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Doctor</th>
                <th className="px-4 py-3">From Time</th>
                <th className="px-4 py-3">Reschedule</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-white/60">
                    No appointments to display
                  </td>
                </tr>
              ) : (
                rows.map((r, i) => (
                  <tr key={r.id} className="border-t border-white/10 text-lg">
                    <td className="px-4 py-3">{i + 1}</td>
                    <td className="px-4 py-3 font-semibold">{r.name}</td>
                    <td className="px-4 py-3">{r.doctor_name}</td>
                    <td className="px-4 py-3">{r.ftime}</td>
                    <td className="px-4 py-3">{r.reschedule}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-center text-sm text-white/50">
          Auto-refreshing every 15 seconds
        </p>
      </div>
    </div>
  );
}
