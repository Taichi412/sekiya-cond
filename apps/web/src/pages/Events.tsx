import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listEvents, postRsvp } from '../lib/api';

export default function Events() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['events'], queryFn: listEvents });
  const rsvp = useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'join' | 'cancel' }) => postRsvp(id, action),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }),
  });

  if (isLoading) return <div className="animate-pulse h-40 bg-neutral-200 dark:bg-neutral-700 rounded" />;
  const items = data || [];
  return (
    <div className="space-y-3">
      {items.map((e: any) => (
        <div key={e.id} className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{e.title}</div>
              <div className="text-xs text-neutral-500">{new Date(e.starts_at).toLocaleString()} @ {e.location}</div>
            </div>
            <span className="badge">{e.my_status ?? 'none'}</span>
          </div>
          <div className="mt-3 flex gap-2">
            <button className="btn" onClick={() => rsvp.mutate({ id: e.id, action: 'join' })}>参加</button>
            <button className="btn secondary" onClick={() => rsvp.mutate({ id: e.id, action: 'cancel' })}>キャンセル</button>
          </div>
        </div>
      ))}
    </div>
  );
}

