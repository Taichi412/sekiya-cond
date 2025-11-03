import { useQuery } from '@tanstack/react-query';
import { getProfile, listUnits, listFamily } from '../lib/api';

export default function Me() {
  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: getProfile });
  const { data: units } = useQuery({ queryKey: ['units'], queryFn: listUnits });
  const { data: family } = useQuery({ queryKey: ['family'], queryFn: listFamily });

  return (
    <div className="space-y-4">
      <section className="card p-4">
        <div className="font-medium">{profile?.name}</div>
        <div className="text-sm text-neutral-500">{profile?.email}</div>
      </section>
      <section className="card p-4">
        <div className="font-medium mb-2">所有部屋</div>
        <ul className="text-sm space-y-1">
          {(units || []).map((u: any) => (
            <li key={u.unit_id} className="flex justify-between"><span>{u.unit_code}</span><span>¥{u.latest_return_amount?.toLocaleString?.('ja-JP') ?? u.latest_return_amount}</span></li>
          ))}
        </ul>
      </section>
      <section className="card p-4">
        <div className="font-medium mb-2">家族</div>
        <ul className="text-sm space-y-1">
          {(family || []).map((f: any) => (
            <li key={f.id}>{f.name} ({f.relation})</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

