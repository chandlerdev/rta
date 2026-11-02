'use client';

import { useParams } from 'next/navigation';
import { crypto } from '@/lib/service';
import { SignupForm } from '@/components/SignupForm';

// Sign up with a preselected plan: /signup/{base64PlanId}
// The :id segment is base64 of the plan id (e.g. "NQ==" -> "5") — decode it here.
export default function SignupWithPlanPage() {
  const params = useParams<{ id: string }>();
  const raw = (params?.id as string) || '';
  let planId = '';
  if (raw) {
    try {
      planId = crypto.b64decode(decodeURIComponent(raw));
    } catch {
      planId = raw; // not base64 — use as-is
    }
  }
  return <SignupForm planId={planId} />;
}
