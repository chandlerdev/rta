'use client';

import { useEffect, useState } from 'react';
import { service, DYNAMIC_BASE } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';

const DYN = DYNAMIC_BASE;

export default function PrivacyPolicyPage() {
  const spinner = useSpinner();
  const [html, setHtml] = useState('');

  useEffect(() => {
    spinner.show();
    // TODO: no matching endpoint in new API
    service
      .getMethod(`${DYN}read&table=privacy_policy&id=1`)
      .then((res: any) => {
        spinner.hide();
        setHtml(res.data?.[0]?.details || '');
      })
      .catch(() => spinner.hide());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#0b1f3a ] py-8 sm:py-10">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-6 text-center">
          <img src="/images/logo33.png" alt="logo" className="mx-auto h-12 sm:h-16" onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
        </div>
        <h4 className="mb-6 text-center text-xl font-bold text-white sm:text-2xl">
          Privacy and Policy
        </h4>
        <div
          className="max-h-[70vh] overflow-y-auto rounded-lg bg-white/5 p-4 text-white sm:p-6"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
