'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { service, local, crypto, DYNAMIC_BASE } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { AdminPlanForm } from '@/components/forms/AdminPlanForm';
import { toastSuccess, confirmDialog } from '@/lib/alerts';

const DYN = DYNAMIC_BASE;

export function AdminPlan() {
  const router = useRouter();
  const params = useParams<{ id: string; enc: string }>();
  const searchParams = useSearchParams();
  const spinner = useSpinner();

  const cmpId = (params?.id as string) || '0';
  const enc = (params?.enc as string) || '';
  const ck = searchParams.get('ck') || 'adminplan';

  const [fields, setFields] = useState<any[]>([]);

  const load = useCallback(() => {
    spinner.show();
    service
      .getMethod(`${DYN}admin/subscriptions/plans`)
      .then((res: any) => {
        spinner.hide();
        const rows = Array.isArray(res.data) ? res.data : [];
        // Only active, non-deleted plans (old query: status=1&is_deleted=0).
        setFields(
          rows.filter(
            (r: any) => Number(r.status) === 1 && Number(r.isDeleted) === 0,
          ),
        );
      })
      .catch(() => spinner.hide());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ck === 'adminplan') load();
  }, [ck, load]);

  function navCk(eve: string, id?: string) {
    if (id) local.set('admineditt', id);
    router.push(`/home/${cmpId}/${enc}?ck=${eve}`);
  }

  function copySignupLink(planId: string) {
    // base64-encode the plan id into the signup URL: /signup/{base64PlanId}
    // e.g. planId 5 -> "NQ==" -> /signup/NQ==
    const enc = crypto.b64encode(String(planId));
    const origin =
      typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${origin}/signup/${enc}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard
        .writeText(url)
        .then(() => toastSuccess('Signup link copied'))
        .catch(() => toastSuccess(url));
    } else {
      toastSuccess(url);
    }
  }

  async function remove(id: string) {
    const r = await confirmDialog('Are you sure?');
    if (!r.isConfirmed) return;
    await service.DeleteMethod(`${DYN}admin/subscriptions/plans/${id}`);
    toastSuccess('Deleted Successfully');
    setTimeout(load, 800);
  }

  const BackBtn = () => (
    <div className="mb-3 flex justify-end">
      <button onClick={() => navCk('adminplan')} className="btn-outline-brand">
        <i className="fa fa-reply-all mr-1" /> Back
      </button>
    </div>
  );

  if (ck === 'admincreate') {
    return (
      <div>
        <BackBtn />
        <AdminPlanForm onSaved={() => navCk('adminplan')} />
      </div>
    );
  }
  if (ck === 'adminedit') {
    const id = typeof window !== 'undefined' ? local.get('admineditt') : null;
    return (
      <div>
        <BackBtn />
        <AdminPlanForm planId={id} onSaved={() => navCk('adminplan')} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h4 className="text-xl font-semibold text-gray-800">Plan Details</h4>
        <button onClick={() => navCk('admincreate')} className="btn-primary-brand">
          <i className="fa fa-plus mr-1" /> Add Plan
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {fields.length === 0 && (
          <p className="text-gray-500">No plans found.</p>
        )}
        {fields.map((field) => (
          <div key={field.id} className="card-base group relative flex flex-col p-4">
            {/* Admin controls — revealed on card hover, pinned top-right */}
            <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-md bg-white/95 p-1 opacity-0 shadow-sm ring-1 ring-gray-200 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100">
              <button
                onClick={() => copySignupLink(field.id)}
                className="px-1 text-gray-600 hover:text-gray-800"
                title="Copy signup link"
              >
                <i className="fa fa-link" />
              </button>
              <button
                onClick={() => navCk('adminedit', field.id)}
                className="px-1 text-blue-600 hover:text-blue-800"
                title="Edit"
              >
                <i className="fa fa-pencil" />
              </button>
              <button
                onClick={() => remove(field.id)}
                className="px-1 text-red-600 hover:text-red-800"
                title="Delete"
              >
                <i className="fa fa-trash" />
              </button>
            </div>

            {/* Plan name header */}
            <div className="mb-4 rounded-md bg-[#0060f0] px-4 py-2 text-center text-base font-semibold text-white">
              {field.button1 || field.title1}
            </div>

            {/* Price */}
            <div className="mb-4 text-center">
              <span className="text-2xl font-bold text-[#22b14c]">
                ${field.price}
              </span>{' '}
              <span className="text-sm text-[#22b14c]">{field.priceTitle}</span>
            </div>

            {/* Benefits (description1 is HTML list) */}
            <ul
              className="list-disc space-y-1 pl-5 text-sm text-gray-600 marker:text-gray-400"
              dangerouslySetInnerHTML={{ __html: field.description1 || '' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
