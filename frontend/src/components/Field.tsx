'use client';

import { ReactNode } from 'react';

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string | null;
  children: ReactNode;
}

export function Field({ label, required, error, children }: FieldProps) {
  return (
    <div className="mb-4 grid grid-cols-1 gap-1.5 md:grid-cols-[220px_1fr] md:items-center md:gap-3">
      <label className="text-sm font-medium text-gray-700 md:text-base">
        {label}
        {required && <b className="ml-1 text-red-500">*</b>}
      </label>
      <div className="w-full">
        {children}
        {error && <div className="mt-1 text-sm text-red-500">{error}</div>}
      </div>
    </div>
  );
}
