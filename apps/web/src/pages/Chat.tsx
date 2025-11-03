import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { myThread, listMessages, sendMessage } from '../lib/api';
import { useState } from 'react';

export default function Chat() {
  const qc = useQueryClient();
  const { data: thread } = useQuery({ queryKey: ['thread'], queryFn: myThread });
  const { data: messages } = useQuery({ queryKey: ['messages', thread?.thread_id], queryFn: () => listMessages(thread?.thread_id || 't1'), enabled: !!thread });
  const [text, setText] = useState('');
  const m = useMutation({
    mutationFn: () => sendMessage(thread?.thread_id || 't1', text),
    onSuccess: () => { setText(''); qc.invalidateQueries({ queryKey: ['messages'] }); },
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="card p-4 min-h-48">
        {(messages?.items || []).map((msg: any) => (
          <div key={msg.id} className={msg.sender_role === 'owner' ? 'text-right' : 'text-left'}>
            <span className="inline-block px-3 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-700 my-1">{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="flex-1 rounded-lg border px-3 py-2 bg-white dark:bg-neutral-800" value={text} onChange={(e) => setText(e.target.value)} placeholder="メッセージを入力" />
        <button className="btn" onClick={() => m.mutate()} disabled={!text.trim()}>送信</button>
      </div>
    </div>
  );
}

