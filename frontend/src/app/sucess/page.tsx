'use client';

import { useRouter } from 'next/navigation';

export default function PaymentSuccessPage() {
  const router = useRouter();
  return (
    <section className="flex min-h-screen items-center justify-center bg-[#f1f1f1] px-4">
      <div className="card-base w-full max-w-md p-6 text-center sm:p-10">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <i className="fa fa-check text-3xl text-green-600" />
        </div>
        <h3 className="mb-2 text-2xl font-bold text-gray-800">Payment Successful</h3>
        <p className="mb-6 text-gray-500">
          Your subscription has been activated. You can now log in to your account.
        </p>
        <button onClick={() => router.push('/admin')} className="btn-primary-brand w-full">
          Go to Login
        </button>
      </div>
    </section>
  );
}
