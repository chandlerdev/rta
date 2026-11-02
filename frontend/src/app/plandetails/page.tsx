'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { service, local, DYNAMIC_BASE } from '@/lib/service';
import { useSpinner } from '@/components/Spinner';
import { DataTable, type Column } from '@/components/DataTable';
import { toastSuccess, confirmDialog } from '@/lib/alerts';

const DYN = DYNAMIC_BASE;

interface Row {
  sno: number;
  name: string;
  cardnumber: string;
  cardtype: string;
  expiry: string;
  action: string;
}

export default function PlanDetailsPage() {
  const router = useRouter();
  const spinner = useSpinner();
  const [rows, setRows] = useState<Row[]>([]);

  const load = useCallback(() => {
    const id = local.get('UserID');
    if (!id) return;
    spinner.show();
    service
      .getMethod(`${DYN}admin/subscriptions`)
      .then((res: any) => {
        spinner.hide();
        if (res.data === 'Invalid' || !Array.isArray(res.data)) {
          setRows([]);
          return;
        }
        const tst: Row[] = [];
        let count = 0;
        res.data
          .filter((ke: any) => String(ke.userId) === String(id))
          .forEach((ke: any) => {
            count++;
            tst.push({
              sno: count,
              name: ke.cardName,
              cardnumber: ke.cardNumber,
              cardtype: 'Credit',
              expiry: ke.cardYear,
              action: ke.id,
            });
          });
        setRows(tst);
      })
      .catch(() => spinner.hide());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(id: string) {
    const r = await confirmDialog('Are you sure?');
    if (!r.isConfirmed) return;
    await service.DeleteMethod(`${DYN}admin/subscriptions/${id}`);
    toastSuccess('Deleted Successfully');
    setTimeout(load, 1000);
  }

  const columns: Column<Row>[] = [
    { key: 'sno', header: 'S.No', render: (_r, i) => i + 1 },
    { key: 'name', header: 'Card Name', sortable: true },
    { key: 'cardtype', header: 'Card Type' },
    {
      key: 'cardnumber',
      header: 'Card Number',
      render: (row) => `**** **** **** ${String(row.cardnumber).slice(-4)}`,
    },
    { key: 'expiry', header: 'Expiry' },
    {
      key: 'act',
      header: 'Action',
      render: (row) => (
        <button onClick={() => remove(row.action)} className="px-2 text-red-600" title="Delete">
          <i className="fa fa-trash" />
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f1f1f1] p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h4 className="text-lg font-semibold text-gray-800 sm:text-xl">
            Subscription Card Details
          </h4>
          <button onClick={() => router.push('/add')} className="btn-primary-brand w-full sm:w-auto">
            <i className="fa fa-plus mr-1" /> Add Card
          </button>
        </div>
        <div className="overflow-x-auto">
          <DataTable columns={columns} data={rows} />
        </div>
      </div>
    </div>
  );
}
