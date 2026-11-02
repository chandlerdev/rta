'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { service, local, DYNAMIC_BASE } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { toastSuccess, toastError, confirmDialog } from '@/lib/alerts';

const DYN = DYNAMIC_BASE;

// MM/YYYY
const EXPIRY_RE = /^(0[1-9]|1[0-2])\/\d{4}$/;
const maskCard = (n: string) =>
  n ? `**** **** **** ${String(n).slice(-4)}` : '';

interface CardForm {
  cardName: string;
  cardNumber: string;
  expiry: string; // MM/YYYY
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
}

interface SavedCard {
  id: number;
  cardName: string;
  cardNumber: string;
  cardMonth: string;
  cardYear: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  userId: number;
}

export function PaymentPlan() {
  const router = useRouter();
  const spinner = useSpinner();

  const [step, setStep] = useState<'plan' | 'select' | 'confirm'>('plan');
  const [plans, setPlans] = useState<any[]>([]);
  const [plan, setPlan] = useState<any>(null);
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [selected, setSelected] = useState<SavedCard | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  // Plan whose Full Description is shown in the "View More" popup.
  const [descPlan, setDescPlan] = useState<any | null>(null);

  const [securityCode, setSecurityCode] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [payAttempted, setPayAttempted] = useState(false);

  const userId =
    typeof window !== 'undefined' ? local.get('UserID') || '' : '';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<CardForm>({
    defaultValues: {
      cardName: '',
      cardNumber: '',
      expiry: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
    },
  });

  const load = useCallback(() => {
    spinner.show();
    Promise.all([
      service.getMethod(`${DYN}admin/subscriptions/plans`),
      service.getMethod(`${DYN}admin/subscriptions`),
    ])
      .then(([planRes, subRes]: any[]) => {
        spinner.hide();
        const activePlans = (planRes?.data || []).filter(
          (p: any) => Number(p.status) === 1 && Number(p.isDeleted) === 0,
        );
        setPlans(activePlans);
        const mine = (subRes?.data || []).filter(
          (c: any) => String(c.userId) === String(userId),
        );
        setCards(mine);
      })
      .catch(() => spinner.hide());
  }, [spinner, userId]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If the user already has a plan chosen (plan_id) but it isn't active yet,
  // skip "Choose Your Plan" and go straight to "Select a way to pay" with that
  // plan loaded by id.
  useEffect(() => {
    const planActive = local.get('plan_active');
    const pid = local.get('plan_id');
    if (Number(planActive) === 1 || !pid || pid === 'null' || pid === '') return;
    spinner.show();
    service
      .getMethod(`${DYN}admin/subscriptions/plans/${pid}`)
      .then((res: any) => {
        spinner.hide();
        const p = Array.isArray(res?.data) ? res.data[0] : res?.data;
        if (p) {
          setPlan(p);
          setStep('select');
        }
      })
      .catch(() => spinner.hide());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openAdd() {
    setEditingId(null);
    reset({
      cardName: '',
      cardNumber: '',
      expiry: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
    });
    setModalOpen(true);
  }

  function openEdit(c: SavedCard) {
    setEditingId(c.id);
    reset({
      cardName: c.cardName || '',
      cardNumber: c.cardNumber || '',
      expiry: c.cardMonth && c.cardYear ? `${c.cardMonth}/${c.cardYear}` : '',
      address1: c.address1 || '',
      address2: c.address2 || '',
      city: c.city || '',
      state: c.state || '',
      zip: c.zip || '',
    });
    setModalOpen(true);
  }

  async function onSaveCard(v: CardForm) {
    const [mm, yyyy] = v.expiry.split('/');
    const body = {
      userId: String(userId),
      cardName: v.cardName,
      cardNumber: v.cardNumber,
      cardMonth: mm,
      cardYear: yyyy,
      address1: v.address1,
      address2: v.address2,
      city: v.city,
      state: v.state,
      zip: v.zip,
      country: 'US',
    };
    spinner.show();
    try {
      if (editingId)
        await service.PutMethod(`admin/subscriptions/${editingId}`, body);
      else await service.post('admin/subscriptions', body);
      spinner.hide();
      setModalOpen(false);
      toastSuccess(editingId ? 'Card updated' : 'Card added');
      load();
    } catch {
      spinner.hide();
      toastError('Could not save card');
    }
  }

  async function deleteCard(c: SavedCard) {
    const r = await confirmDialog('Remove this card?');
    if (!r.isConfirmed) return;
    spinner.show();
    try {
      await service.DeleteMethod(`${DYN}admin/subscriptions/${c.id}`);
      spinner.hide();
      load();
    } catch {
      spinner.hide();
    }
  }

  function choosePlan(p: any) {
    setPlan(p);
    setStep('select');
  }

  function goConfirm(c: SavedCard) {
    setSelected(c);
    setSecurityCode('');
    setAcceptTerms(false);
    setPayAttempted(false);
    setStep('confirm');
  }

  async function payNow() {
    setPayAttempted(true);
    if (!selected || !securityCode || !acceptTerms) return;
    spinner.show();
    try {
      const now = new Date();
      const dob = now.toISOString().slice(0, 10);
      local.set('price_title_lng', '9999');
      const res: any = await service.payment.pay(
        {
          crdnum: selected.cardNumber,
          namecard: selected.cardName,
          expyer: selected.cardYear,
          expmon: selected.cardMonth,
        },
        dob,
        plan?.price || '0',
      );
      const resultCode = res?.messages?.resultCode;
      const text =
        res?.messages?.message?.[0]?.text ||
        res?.messages?.message?.text ||
        '';
      if (resultCode !== 'Ok') {
        spinner.hide();
        toastError(text || 'Payment failed');
        return;
      }

      // ---- Payment success: update the user's auth/subscription record ----
      const pad = (n: number) => String(n).padStart(2, '0');
      const mmddyyyy = (d: Date) =>
        `${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${d.getFullYear()}`;
      const iso = (d: Date) =>
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      const currentTime = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

      // exp date: default now + 12 months (yyyy-mm-dd); if a 1-month plan, +1 month (mm-dd-yyyy)
      let formattedDate: string;
      if (local.get('price_title_lng') === '1') {
        const d1 = new Date(now);
        d1.setMonth(d1.getMonth() + 1);
        formattedDate = mmddyyyy(d1);
      } else {
        const d12 = new Date(now);
        d12.setMonth(d12.getMonth() + 12);
        formattedDate = iso(d12);
      }
      const startDate = mmddyyyy(now);
      const startFullDate = `${mmddyyyy(now)} ${currentTime}`;
      const planId = String(plan?.id ?? local.get('plan') ?? '');

      try {
        await service.PatchMethod(`auth/users/${userId}/auth`, {
          id: userId,
          auth_refid: res.refId,
          auth_subscriptionid: res.subscriptionId,
          auth_exp_date: formattedDate,
          auth_exp_full_date: `${formattedDate} ${currentTime}`,
          plan_id: planId,
          plan_active: 1,
          auth_start_date: startDate,
          auth_start_full_date: startFullDate,
        });
        // reflect activation locally
        local.set('plan_active', '1');
        local.set('plan_id', planId);
        local.set('authexpdate', formattedDate);
        local.set('auth_start_date', startDate);
      } catch {
        /* payment went through; auth update failure shouldn't block success UI */
      }

      spinner.hide();
      toastSuccess('Payment Successfully');
      router.push('/sucess');
    } catch {
      spinner.hide();
      toastError('Payment failed. Please try again.');
    }
  }

  const err = (name: keyof CardForm, label: string) =>
    isSubmitted && errors[name] ? (
      <p className="mt-1 text-sm text-red-500">{label}</p>
    ) : null;

  // ----- Stepper -----
  const steps = ['Select a way to pay', 'Confirm subscription', 'Get started'];
  const activeIdx = step === 'select' ? 0 : 1;
  const Stepper = () => (
    <div className="mb-6 flex items-center justify-start overflow-x-auto pb-2 sm:mb-8 sm:justify-center">
      <div className="flex min-w-max items-center px-1">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold sm:h-8 sm:w-8 sm:text-sm ${
                  i <= activeIdx
                    ? 'bg-[#22b14c] text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {i < activeIdx ? <i className="fa fa-check" /> : i + 1}
              </div>
              <span className="mt-1 max-w-[5rem] text-center text-[10px] font-medium leading-tight text-gray-700 sm:max-w-none sm:text-xs">
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`mx-1.5 h-0.5 w-10 sm:mx-2 sm:w-16 md:w-28 ${
                  i < activeIdx ? 'bg-[#22b14c]' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // ----- Plan card (matches the "Choose Your Plan" grid card style) -----
  const PlanCard = () =>
    plan ? (
      <div className="card-base flex flex-col p-4">
        {/* Plan name header */}
        <div className="mb-4 rounded-md bg-[#0060f0] px-4 py-2 text-center text-base font-semibold text-white">
          {plan.button1 || plan.title1}
        </div>
        {/* Price */}
        <div className="mb-4 text-center">
          <span className="text-2xl font-bold text-[#22b14c]">
            ${plan.price}
          </span>{' '}
          <span className="text-sm text-[#22b14c]">{plan.priceTitle}</span>
        </div>
        {/* Benefits (description1 is HTML) */}
        <ul
          className="list-disc space-y-1 pl-5 text-sm text-gray-600 marker:text-gray-400"
          dangerouslySetInnerHTML={{ __html: plan.description1 || '' }}
        />
      </div>
    ) : (
      <div className="rounded-xl bg-gray-100 p-6 text-center text-gray-500">
        No plan available
      </div>
    );

  return (
    <div>
      {step !== 'plan' && <Stepper />}

      {/* ===================== STEP 0: SELECT A PLAN ===================== */}
      {step === 'plan' && (
        <div>
          <h4 className="mb-2 text-center text-xl font-bold text-gray-800 sm:text-2xl">
            Choose Your Plan
          </h4>
          <p className="mb-6 text-center text-gray-500">
            Select a subscription plan to continue
          </p>
          <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-6">
            {plans.length === 0 && (
              <p className="text-gray-500">No plans available.</p>
            )}
            {plans.map((p) => (
              <div
                key={p.id}
                className="card-base flex w-full max-w-sm flex-col p-4 transition hover:shadow-lg"
              >
                {/* Plan name header */}
                <div className="mb-4 rounded-md bg-[#0060f0] px-4 py-2 text-center text-base font-semibold text-white">
                  {p.button1 || p.title1}
                </div>
                {/* Price */}
                <div className="mb-4 text-center">
                  <span className="text-2xl font-bold text-[#22b14c]">
                    ${p.price}
                  </span>{' '}
                  <span className="text-sm text-[#22b14c]">{p.priceTitle}</span>
                </div>
                {/* Benefits (description1 is HTML) */}
                <ul
                  className="mb-3 flex-1 list-disc space-y-1 pl-5 text-sm text-gray-600 marker:text-gray-400"
                  dangerouslySetInnerHTML={{ __html: p.description1 || '' }}
                />
                {/* View More -> Full Description popup */}
                {p.description3 && (
                  <button
                    type="button"
                    onClick={() => setDescPlan(p)}
                    className="mb-4 self-start pl-5 text-sm font-medium text-[#0060f0] hover:underline"
                  >
                    View More
                  </button>
                )}
                <button
                  onClick={() => choosePlan(p)}
                  className="btn-primary-brand self-center px-8"
                >
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== STEP 1: SELECT A WAY TO PAY ===================== */}
      {step === 'select' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <button
              onClick={() => setStep('plan')}
              className="mb-2 text-sm font-medium text-[#0060f0] hover:underline"
            >
              <i className="fa fa-chevron-left mr-1" /> Change plan
            </button>
            <h4 className="text-xl font-semibold text-gray-800">
              Payment Method
            </h4>
            <p className="mb-4 text-sm text-gray-500">
              These payment methods pay for your subscription.
            </p>

            <button
              onClick={openAdd}
              className="mb-4 inline-flex items-center gap-2 font-medium text-[#0060f0] hover:underline"
            >
              <i className="fa fa-plus-circle" /> Add Payment Method
            </button>

            <div className="overflow-x-auto rounded-lg border bg-white">
              <table className="w-full text-sm">
                <thead className="bg-[#0060f0] text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">S.No</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Card</th>
                    <th className="px-4 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cards.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        No payment methods yet. Add one to continue.
                      </td>
                    </tr>
                  )}
                  {cards.map((c, i) => (
                    <tr key={c.id} className="border-t">
                      <td className="px-4 py-3">{i + 1}</td>
                      <td className="px-4 py-3">{c.cardName}</td>
                      <td className="px-4 py-3">{maskCard(c.cardNumber)}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => goConfirm(c)}
                            className="rounded bg-[#22b14c] px-3 py-1 text-xs font-semibold text-white hover:bg-[#1c9a42]"
                          >
                            Buy Plan
                          </button>
                          <button
                            onClick={() => openEdit(c)}
                            className="px-2 text-blue-600"
                            title="Edit"
                          >
                            <i className="fa fa-pencil-square-o" />
                          </button>
                          <button
                            onClick={() => deleteCard(c)}
                            className="px-2 text-red-600"
                            title="Delete"
                          >
                            <i className="fa fa-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <PlanCard />
          </div>
        </div>
      )}

      {/* ===================== STEP 2: CONFIRM SUBSCRIPTION ===================== */}
      {step === 'confirm' && selected && (
        <div className="rounded-2xl bg-[#d6efdd] p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Plan blocks */}
            <div className="space-y-4">
              <div className="flex h-28 items-center justify-center rounded-xl bg-gradient-to-br from-[#3cc463] to-[#22b14c] text-2xl font-bold text-white sm:h-32 sm:text-3xl">
                {plan?.button1 || plan?.title1 || 'Plan'}
              </div>
              <div className="flex h-28 items-center justify-center rounded-xl bg-[#1c7a36] text-2xl font-bold text-white sm:h-32 sm:text-3xl">
                {plan?.price} $
              </div>
            </div>

            {/* Payment summary */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Name on Card:
              </label>
              <input
                value={selected.cardName}
                readOnly
                className="mb-3 w-full rounded bg-gray-200 px-3 py-2 text-gray-700"
              />
              <label className="text-sm font-medium text-gray-700">
                Card Number:
              </label>
              <input
                value={selected.cardNumber}
                readOnly
                className="mb-3 w-full rounded bg-gray-200 px-3 py-2 text-gray-700"
              />
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Exp Month:
                  </label>
                  <input
                    value={selected.cardMonth}
                    readOnly
                    className="w-full rounded bg-gray-200 px-3 py-2 text-gray-700"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Exp Year:
                  </label>
                  <input
                    value={selected.cardYear}
                    readOnly
                    className="w-full rounded bg-gray-200 px-3 py-2 text-gray-700"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Security code:
                  </label>
                  <input
                    value={securityCode}
                    onChange={(e) =>
                      setSecurityCode(e.target.value.replace(/\D/g, ''))
                    }
                    maxLength={4}
                    placeholder="Security code"
                    className="w-full rounded border bg-white px-3 py-2"
                  />
                </div>
              </div>
              {payAttempted && !securityCode && (
                <p className="mt-1 text-sm text-red-500">
                  Security code is required
                </p>
              )}

              <label className="mt-4 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
                Accept{' '}
                <a className="text-[#0060f0] underline" href="#">
                  Terms &amp; Conditions
                </a>
              </label>
              {payAttempted && !acceptTerms && (
                <p className="mt-1 text-sm text-red-500">
                  Please accept the terms
                </p>
              )}

              <div className="mt-4 flex flex-wrap justify-end gap-3">
                <button
                  onClick={() => setStep('select')}
                  className="rounded-full border-2 border-gray-400 px-6 py-2 font-semibold text-gray-600"
                >
                  Back
                </button>
                <button
                  onClick={payNow}
                  className="rounded-full bg-[#22b14c] px-8 py-2 font-semibold text-white hover:bg-[#1c9a42]"
                >
                  PAY
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== VIEW MORE (FULL DESCRIPTION) MODAL ===================== */}
      {descPlan && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setDescPlan(null)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Blue header bar */}
            <div className="flex items-center justify-between gap-3 bg-[#0060f0] px-5 py-3 text-white">
              <h3 className="text-lg font-semibold">
                {descPlan.button1 || descPlan.title1}
              </h3>
              <button
                onClick={() => setDescPlan(null)}
                className="text-2xl leading-none text-white/90 hover:text-white"
                title="Close"
              >
                ×
              </button>
            </div>
            {/* Body */}
            <p className="overflow-y-auto whitespace-pre-line break-words px-5 py-5 text-sm leading-relaxed text-gray-700">
              {descPlan.description3 || 'No description available.'}
            </p>
            {/* Footer */}
            <div className="flex justify-end border-t px-5 py-3">
              <button
                onClick={() => setDescPlan(null)}
                className="rounded-md bg-[#22b14c] px-6 py-2 font-semibold text-white hover:bg-[#1c9a42]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== ADD / EDIT CARD MODAL ===================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-4 sm:p-6">
            <h3 className="mb-1 text-center text-xl font-bold text-gray-800 sm:text-2xl">
              {editingId ? 'Edit Payment Method' : 'Add Payment Method'}
            </h3>
            <div className="mb-4 flex justify-center gap-2">
              <span className="rounded border px-2 py-1 text-xs font-bold text-blue-700">
                VISA
              </span>
              <span className="rounded border px-2 py-1 text-xs font-bold text-red-600">
                MasterCard
              </span>
            </div>

            <form onSubmit={handleSubmit(onSaveCard)}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Name on Card
                  </label>
                  <input
                    {...register('cardName', { required: true })}
                    className="w-full rounded border px-3 py-2 outline-none"
                  />
                  {err('cardName', 'Name on Card is required')}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Card Number
                  </label>
                  <input
                    maxLength={16}
                    {...register('cardNumber', {
                      required: true,
                      minLength: 15,
                      maxLength: 16,
                      pattern: /^[0-9]+$/,
                    })}
                    className="w-full rounded border px-3 py-2 outline-none"
                  />
                  {err('cardNumber', 'Valid card number is required')}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Expiry Date (MM/YYYY)
                  </label>
                  <input
                    placeholder="MM/YYYY"
                    {...register('expiry', {
                      required: true,
                      pattern: EXPIRY_RE,
                    })}
                    className="w-full rounded border px-3 py-2 outline-none"
                  />
                  {err('expiry', 'Valid expiry (MM/YYYY) is required')}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Address Line 1
                  </label>
                  <input
                    {...register('address1', { required: true })}
                    className="w-full rounded border px-3 py-2 outline-none"
                  />
                  {err('address1', 'Address Line 1 is required')}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Address Line 2
                  </label>
                  <input
                    {...register('address2')}
                    className="w-full rounded border px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    {...register('city', { required: true })}
                    className="w-full rounded border px-3 py-2 outline-none"
                  />
                  {err('city', 'City is required')}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    State
                  </label>
                  <input
                    {...register('state', { required: true })}
                    className="w-full rounded border px-3 py-2 outline-none"
                  />
                  {err('state', 'State is required')}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Zipcode
                  </label>
                  <input
                    {...register('zip', { required: true })}
                    className="w-full rounded border px-3 py-2 outline-none"
                  />
                  {err('zip', 'Zip is required')}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded bg-red-500 px-5 py-2 font-semibold text-white"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="rounded bg-[#22b14c] px-6 py-2 font-semibold text-white hover:bg-[#1c9a42]"
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
