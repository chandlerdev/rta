'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { service, local, DYNAMIC_BASE } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { DataTable, type Column } from '@/components/DataTable';
import { PharmacyForm } from '@/components/forms/PharmacyForm';
import { toastSuccess, confirmDialog } from '@/lib/alerts';

const DYN = DYNAMIC_BASE;

interface Row {
  sno: number;
  name: string;
  pharmacy_id: string;
  address: string;
  phone: string;
  email: string;
}

export function PharmacyList() {
  const router = useRouter();
  const params = useParams<{ id: string; enc: string }>();
  const searchParams = useSearchParams();
  const spinner = useSpinner();

  const cmpId = (params?.id as string) || '0';
  const enc = (params?.enc as string) || '';
  const ck = searchParams.get('ck') || 'pharmacy_list';

  const [data, setData] = useState<Row[]>([]);

  const load = useCallback(() => {
    spinner.show();
    service
      .getMethod(`${DYN}admin/pharmacies`)
      .then((res: any) => {
        spinner.hide();
        if (res.data === 'Invalid' || !Array.isArray(res.data)) {
          setData([]);
          return;
        }
        const tst: Row[] = [];
        let count = 0;
        res.data.forEach((ke: any) => {
          count++;
          tst.push({
            sno: count,
            name: ke.pharmacyName,
            pharmacy_id: ke.id,
            address: ke.address,
            phone: ke.phone,
            email: ke.email,
          });
        });
        setData(tst);
      })
      .catch(() => spinner.hide());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ck === 'pharmacy_list') load();
  }, [ck, load]);

  function navCk(eve: string, id?: string) {
    if (id) local.set('PharmacyID', id);
    router.push(`/homes/${cmpId}/${enc}?ck=${eve}`);
  }

  async function remove(row: Row) {
    const r = await confirmDialog('Are you sure?');
    if (!r.isConfirmed) return;
    await service.DeleteMethod(
      `${DYN}admin/pharmacies/${row.pharmacy_id}`,
    );
    toastSuccess('Deleted Successfully');
    setTimeout(load, 800);
  }

  const columns: Column<Row>[] = [
    { key: 'sno', header: 'S.No', render: (_r, i) => i + 1 },
    { key: 'name', header: 'Pharmacy Name', sortable: true },
    { key: 'address', header: 'Address' },
    { key: 'phone', header: 'Phone', sortable: true },
    { key: 'email', header: 'Email' },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <div className="flex gap-1">
          <button onClick={() => navCk('pharmacy_edit', row.pharmacy_id)} className="px-2 text-blue-600" title="Edit">
            <i className="fa fa-pencil-square-o" />
          </button>
          <button onClick={() => remove(row)} className="px-2 text-red-600" title="Delete">
            <i className="fa fa-trash" />
          </button>
        </div>
      ),
    },
  ];

  const BackBtn = () => (
    <div className="mb-3 flex justify-end">
      <button onClick={() => navCk('pharmacy_list')} className="btn-outline-brand">
        <i className="fa fa-reply-all mr-1" /> Back
      </button>
    </div>
  );

  if (ck === 'pharmacy_add') {
    return (
      <div>
        <BackBtn />
        <PharmacyForm onSaved={() => navCk('pharmacy_list')} />
      </div>
    );
  }
  if (ck === 'pharmacy_edit') {
    const id = typeof window !== 'undefined' ? local.get('PharmacyID') : null;
    return (
      <div>
        <BackBtn />
        <PharmacyForm pharmacyId={id} onSaved={() => navCk('pharmacy_list')} />
      </div>
    );
  }

  return (
    <div>
      <h4 className="mb-4 text-xl font-semibold text-gray-800">Pharmacy List</h4>
      <DataTable
        columns={columns}
        data={data}
        toolbar={
          <button onClick={() => navCk('pharmacy_add')} className="btn-primary-brand">
            <i className="fa fa-plus mr-1" /> Add New
          </button>
        }
      />
    </div>
  );
}
