import { useQuery } from '@tanstack/react-query';
import { getReturnsSummary, getReturnsSeries } from '../lib/api';

export default function Returns() {
  const { data: summary, isLoading: loadingSummary } = useQuery({ queryKey: ['returns_summary'], queryFn: getReturnsSummary });
  const { data: series, isLoading: loadingSeries } = useQuery({ queryKey: ['returns_series'], queryFn: getReturnsSeries });

  if (loadingSummary || loadingSeries) {
    return <div className="animate-pulse space-y-3">
      <div className="h-8 w-1/3 bg-neutral-200 dark:bg-neutral-700 rounded" />
      <div className="h-24 bg-neutral-200 dark:bg-neutral-700 rounded" />
      <div className="h-40 bg-neutral-200 dark:bg-neutral-700 rounded" />
    </div>;
  }

  if (!summary) return <div>no data</div>;

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <div className="text-sm text-neutral-500">{summary.period}</div>
          <div className="text-2xl font-semibold">Occupancy: {(summary.occupancy_pct * 100).toFixed(0)}%</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-neutral-500">Your payout</div>
          <div className="text-2xl font-semibold">¥{summary.your_payout?.toLocaleString?.('ja-JP') ?? summary.your_payout}</div>
          <div className="mt-1"><span className="badge">{summary.finalized ? '確定' : '未確定'}</span></div>
        </div>
      </header>

      <section className="card p-4">
        <div className="text-sm text-neutral-500 mb-2">所有部屋</div>
        <div className="flex flex-wrap gap-2">
          {summary.rooms?.map((r: string) => (
            <span key={r} className="badge">{r}</span>
          ))}
        </div>
      </section>

      <section className="card p-4">
        <div className="text-sm text-neutral-500 mb-2">過去12ヶ月</div>
        <div className="grid grid-cols-12 gap-1 items-end h-40">
          {Array.isArray(series) && series.map((pt: any) => (
            <div key={pt.period} className="flex flex-col items-center gap-1">
              <div title={`¥${pt.your_payout}`}
                   className="w-4 bg-brand-gold/70"
                   style={{ height: `${Math.min(100, (pt.your_payout / 30000) * 100)}%` }} />
              <div className="text-[10px] text-neutral-500">{pt.period.slice(5)}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

