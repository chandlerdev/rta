'use client';

import { useEffect, useMemo, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { service, session, local, crypto, DYNAMIC_BASE } from '@/lib/service';
import { MENU, ROLE_BASE, type LoginType } from '@/lib/menu';

interface SideBarShellProps {
  loginType: LoginType;
  sideId: string; // current sideData id
  enc: string; // the :id2 encrypted segment from the URL
  children: ReactNode; // the inner view chosen by the page
}

export function SideBarShell({
  loginType,
  sideId,
  enc,
  children,
}: SideBarShellProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false); // mobile sidebar open
  const [collapsed, setCollapsed] = useState(false); // desktop collapse
  const [hospitalName, setHospitalName] = useState('');
  const [title, setTitle] = useState('');
  const [datashow, setDatashow] = useState('0');
  const [planActive, setPlanActive] = useState('0');
  const [authorized, setAuthorized] = useState(false);

  // Guard: sessionStorage 'ck' must decode to '_doctor_' (matches Angular)
  useEffect(() => {
    const ck = session.get('ck');
    try {
      if (!ck || crypto.b64decode(ck) !== '_doctor_') {
        router.replace('/admin');
        return;
      }
    } catch {
      router.replace('/admin');
      return;
    }
    setAuthorized(true);
    setTitle(local.get('Title') || '');
    setDatashow(local.get('datashow') || '0');
    setPlanActive(local.get('plan_active') || '0');
  }, [router]);

  // Load the header name — only the lookup relevant to the role:
  //   normal admin -> hospital name; doctor -> doctor name; super -> neither.
  // (A normal admin is not a doctor, and a doctor has no hospital record, so
  // fetching the other list would always miss and is a wasted call.)
  useEffect(() => {
    if (!authorized) return;
    const loginUserId = local.get('UserID');
    if (!loginUserId) return;

    if (loginType === 'normal') {
      // No by-user endpoint for hospitals: fetch all and filter by userId client-side.
      service
        .getMethod(`${DYNAMIC_BASE}admin/hospitals`)
        .then((res2: any) => {
          const hospital = (res2?.data || []).find(
            (h: any) => String(h.userId) === String(loginUserId),
          );
          if (hospital?.name) {
            setHospitalName(hospital.name);
            local.set('HospitalName', hospital.name);
          }
        })
        .catch(() => {});
    } else if (loginType === 'doctor') {
      // No by-user endpoint for doctors: fetch all and filter by userId client-side.
      service
        .getMethod(`${DYNAMIC_BASE}admin/doctors`)
        .then((res3: any) => {
          const doctor = (res3?.data || []).find(
            (d: any) => String(d.userId) === String(loginUserId),
          );
          if (doctor?.firstName) {
            setHospitalName(doctor.firstName);
          }
        })
        .catch(() => {});
    }
  }, [authorized, loginType]);

  const visibleMenu = useMemo(() => {
    return MENU.filter((m) => {
      if (!m.roles.includes(loginType)) return false;
      if (m.requirePlanActive && !(datashow === '1' && planActive === '1'))
        return false;
      if (m.requirePlanInactive && !(datashow === '0' && planActive === '0'))
        return false;
      return true;
    });
  }, [loginType, datashow, planActive]);

  function navTo(id: string, ck: string, item?: (typeof MENU)[number]) {
    if (item?.external && item.externalUrl) {
      window.open(item.externalUrl, '_blank');
      return;
    }
    const base = ROLE_BASE[loginType];
    if (loginType === 'super') local.set('Title', '');
    else if (loginType === 'normal') local.set('Title', 'Administrator');
    else local.set('Title', 'Professional');
    const qs = ck ? `?ck=${ck}` : '';
    router.push(`/${base}/${id}/${enc}${qs}`);
    setOpen(false);
  }

  function logout() {
    session.clear();
    router.push('/admin');
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-[#f1f1f1]">
      {/* ===== Sidebar ===== */}
      <aside
        className={`fixed left-0 top-0 z-40 h-full overflow-y-auto bg-gradient-to-b from-[#22b14c] to-[#1c9a42] text-white transition-all duration-300
          ${collapsed ? 'w-16' : 'w-64'}
          ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="flex items-center justify-center border-b border-white/10 py-4">
          <img
            src="/images/RTA_whitelogo.png"
            alt="logo"
            className={collapsed ? 'h-8' : 'h-12'}
          />
        </div>
        <ul className="py-2">
          {visibleMenu.map((m) => {
            const active = m.id === sideId;
            return (
              <li key={`${m.id}-${m.ck}-${m.label}`}>
                <button
                  onClick={() => navTo(m.id, m.ck, m)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition hover:bg-white/10 ${
                    active ? 'bg-black/20 font-semibold' : ''
                  }`}
                  title={m.label}
                >
                  <i className={`fa ${m.icon} w-5 text-center`} />
                  {!collapsed && <span>{m.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ===== Right content ===== */}
      <div
        className={`transition-all duration-300 ${
          collapsed ? 'md:ml-16' : 'md:ml-64'
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 bg-[#0060f0] px-3 py-3 text-white shadow sm:px-4">
          <button
            className="flex h-10 w-10 shrink-0 items-center justify-center text-2xl"
            onClick={() => {
              if (window.innerWidth < 768) setOpen((o) => !o);
              else setCollapsed((c) => !c);
            }}
            aria-label="Toggle menu"
          >
            <i className="fa fa-bars" />
          </button>

          <div className="min-w-0 flex-1 truncate text-center text-sm font-semibold sm:text-base">
            {title}
            {hospitalName ? ` : ${hospitalName}` : ''}
          </div>

          <button
            className="flex h-10 w-10 shrink-0 items-center justify-center text-2xl"
            onClick={logout}
            aria-label="Logout"
            title="Logout"
          >
            <i className="fa fa-sign-out" />
          </button>
        </header>

        {/* Inner view */}
        <main className="mx-auto w-full max-w-7xl p-3 sm:p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
