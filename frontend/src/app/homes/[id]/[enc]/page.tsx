'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { SideBarShell } from '@/components/SideBarShell';
import { resolveView } from '@/components/ViewRegistry';

export default function NormalAdminPage() {
  const params = useParams<{ id: string; enc: string }>();
  const searchParams = useSearchParams();
  const id = (params?.id as string) || '0';
  const enc = (params?.enc as string) || '';
  const ck = searchParams.get('ck') || '';

  const View = resolveView(id, ck);

  return (
    <SideBarShell loginType="normal" sideId={id} enc={enc}>
      <View />
    </SideBarShell>
  );
}
