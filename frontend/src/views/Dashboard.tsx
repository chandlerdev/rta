'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { service, local, session, crypto, DYNAMIC_BASE } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { CalAppointment } from '@/views/CalAppointment';
import { CalMultiAppt } from '@/views/CalMultiAppt';

const DYN = DYNAMIC_BASE;

interface DoctorRow {
  sno: number;
  name: string;
  phone: string;
  specility: string;
  date: string;
  active: string;
  gender: string;
  id: string;
  UserId: string;
  time_type: string;
}

export function Dashboard() {
  const router = useRouter();
  const params = useParams<{ enc: string }>();
  const searchParams = useSearchParams();
  const spinner = useSpinner();

  const enc = params?.enc as string;
  const ck = searchParams.get('ck') || '';

  const [title, setTitle] = useState('');
  const [data, setData] = useState<DoctorRow[]>([]);

  useEffect(() => {
    const t = local.get('Title') || '';
    setTitle(t);
    // Only the Administrator dashboard renders doctor data; super-admin and
    // doctor logins just show a logo, so skip the hospital/doctor lookups
    // entirely for them (a stale TrackkerApptHosID must not trigger them).
    if (t !== 'Administrator') return;

    const userId = local.get('TrackkerApptHosID');

    spinner.show();

    if (!userId) {
      spinner.hide();
      return;
    }

    // No by-user endpoint for hospitals: fetch all and filter by userId client-side.
    service
      .getMethod(`${DYN}admin/hospitals`)
      .then((res2: any) => {
        const hospital = (res2?.data || []).find(
          (h: any) => String(h.userId) === String(userId),
        );
        if (!hospital?.id) {
          spinner.hide();
          return;
        }
        local.set('TrackkerApptHosId', hospital.id);
        // No by-hospital endpoint for doctors: fetch all and filter client-side.
        return service.getMethod(`${DYN}admin/doctors`).then((res: any) => ({
          res,
          hospitalId: hospital.id,
        }));
      })
      .then((payload: any) => {
        spinner.hide();
        const res = payload?.res;
        if (!res || !Array.isArray(res.data)) {
          setData([]);
          return;
        }
        const filtered = res.data.filter(
          (d: any) => String(d.hospitalIdId) === String(payload.hospitalId),
        );
        const reversed = [...filtered].reverse();
        const rows: DoctorRow[] = [];
        let count = 0;
        reversed.forEach((ke: any) => {
          // isActive / isDeleted are numeric in the new API (1 = active).
          if (Number(ke.isActive) === 1 && Number(ke.isDeleted) === 0) {
            count++;
            rows.push({
              sno: count,
              name: ke.firstName,
              phone: ke.phone,
              specility: ke.specility,
              date: ke.joinedDate,
              active: '', // TODO: no matching endpoint in new API (no is_doctor field on AccountsDoctor)
              gender: ke.gender === 'M' ? 'Male' : 'Female',
              id: ke.id,
              UserId: ke.userId,
              time_type: ke.timeType,
            });
          }
        });
        setData(rows);
      })
      .catch(() => {
        spinner.hide();
        setData([]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function checkMethod(eve: string, id: string) {
    local.set('DoctorID', id);
    local.set('doctorUserId', id);
    if (eve === 'calendar_appt' || eve === 'calendar_multi_appt') {
      const idx = crypto.encryptJSON(id);
      session.set('_V1_', crypto.b64encode(idx));
    }
    router.push(`/homes/0/${enc}?ck=${eve}`);
  }

  // Doctor / super-admin: just the logo
  if (title !== 'Administrator') {
    return (
      <div className="flex justify-center px-4 py-8 sm:py-10">
        <img
          alt="logo"
          src="/images/rtalogo2.png"
          title="logo"
          className="h-auto w-full max-w-[16rem] sm:max-w-xs"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  // Administrator dashboard
  if (ck === '') {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
        {data.length === 0 && (
          <p className="col-span-full text-gray-500">No active doctors found.</p>
        )}
        {data.map((item) => (
          <div
            key={item.id}
            className="card-base flex w-full flex-col items-center p-4 sm:p-5"
          >
            <div className="mb-3 h-20 w-20 overflow-hidden rounded-full bg-gray-100">
              <img
                src="/images/profile.png"
                alt="profile"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.visibility = 'hidden';
                }}
              />
            </div>
            <button
              type="button"
              onClick={() =>
                checkMethod(
                  item.time_type === 'Static Multi Appointment' ||
                    item.time_type === 'Dynamic Multi Appointment'
                    ? 'calendar_multi_appt'
                    : 'calendar_appt',
                  item.UserId,
                )
              }
              className="btn-primary-brand w-full text-sm"
            >
              {item.name}
            </button>
          </div>
        ))}
      </div>
    );
  }

  // ck === 'calendar_appt' / 'calendar_multi_appt'
  if (ck === 'calendar_appt') {
    return <CalAppointment />;
  }
  if (ck === 'calendar_multi_appt') {
    return <CalMultiAppt />;
  }
  return (
    <div className="card-base p-8 text-center text-gray-500">
      <p className="text-lg font-semibold">Calendar view</p>
      <p className="mt-2 text-sm">This module is being converted.</p>
    </div>
  );
}
