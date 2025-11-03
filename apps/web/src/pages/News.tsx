import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listNews, markNewsRead } from '../lib/api';

export default function News() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['news'], queryFn: listNews });
  const m = useMutation({
    mutationFn: (id: string) => markNewsRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['news'] }),
  });

  if (isLoading) return <div className="animate-pulse h-32 bg-neutral-200 dark:bg-neutral-700 rounded" />;
  const items = data?.items || [];
  return (
    <div className="space-y-3">
      {items.map((n: any) => (
        <div key={n.id} className="card p-4 flex items-center justify-between">
          <div>
            <div className="font-medium">{n.title}</div>
            <div className="text-xs text-neutral-500">{new Date(n.publish_at).toLocaleDateString()}</div>
          </div>
          <button className="btn secondary" onClick={() => m.mutate(n.id)}>{n.is_read ? '既読' : '既読にする'}</button>
        </div>
      ))}
    </div>
  );
}

