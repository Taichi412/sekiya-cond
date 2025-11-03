import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { parse } from 'csv-parse/sync';
import dayjs from 'dayjs';

const app = express();
app.use(cors());
app.use(express.json());

// In-memory fixtures
const now = dayjs();
const period = now.format('YYYY-MM');
const returnsSeries = Array.from({ length: 12 }).map((_, i) => {
  const d = now.subtract(11 - i, 'month');
  const occ = 0.65 + ((i % 4) * 0.03);
  const payout = Math.round((15000 + (i % 3) * 3000) * (0.9 + (i % 2) * 0.1));
  return { period: d.format('YYYY-MM'), occupancy_pct: Number(occ.toFixed(2)), your_payout: payout, finalized: true };
});

let summary = {
  period,
  occupancy_pct: 0.78,
  payout_per_room: 15000,
  your_payout: 30000,
  finalized: true,
  rooms: ['A-101', 'A-102']
};

// Returns (owner)
app.get('/returns/summary', (req, res) => {
  res.json(summary);
});
app.get('/returns/series', (req, res) => {
  res.json(returnsSeries);
});

// Admin returns CSV import/preview/finalize (room_code, occupancy_pct, payout_yen)
const upload = multer();
let adminImport = { period, rows: 0, occupancy_pct: 0, rooms: [], breakdown: [] };
app.post('/admin/returns/import-csv', upload.single('file'), (req, res) => {
  const { period: per } = req.body;
  if (!req.file) return res.status(400).json({ error: 'file missing' });
  const csv = req.file.buffer.toString('utf8');
  const records = parse(csv, { columns: true, skip_empty_lines: true, trim: true });
  const rooms = [];
  const ownerRooms = new Map();
  let occSum = 0; let occCnt = 0;
  for (const r of records) {
    const room = r.room_code;
    const occ = String(r.occupancy_pct).replace('%','');
    const payout = Number(r.payout_yen || 0);
    rooms.push(room);
    occSum += Number(occ);
    occCnt += 1;
    // mock owner mapping: first letter before '-' as building owner key
    const key = room.split('-')[0];
    const ownerKey = key === 'A' ? 'ownerA' : key === 'B' ? 'ownerB' : key === 'C' ? 'ownerC' : 'ownerD';
    ownerRooms.set(ownerKey, [...(ownerRooms.get(ownerKey) || []), { room, payout }]);
  }
  const occAvg = occCnt ? Number((occSum / occCnt / 100).toFixed(2)) : 0;
  const breakdown = Array.from(ownerRooms.entries()).map(([owner_id, items]) => ({
    owner_id,
    owner_name: owner_id.replace('owner','Owner '),
    amount: items.reduce((a,b)=>a+b.payout,0),
    rooms: items.map(x=>x.room)
  }));
  adminImport = { period: per || period, rows: records.length, occupancy_pct: occAvg, rooms, breakdown };
  res.json({ period: adminImport.period, rows: adminImport.rows, occupancy_pct: adminImport.occupancy_pct, rooms });
});
app.get('/admin/returns/preview', (req, res) => {
  res.json({ period: adminImport.period, occupancy_pct: adminImport.occupancy_pct, breakdown: adminImport.breakdown, total: adminImport.breakdown.reduce((a,b)=>a+b.amount,0) });
});
app.post('/admin/returns/finalize', (req, res) => {
  // apply to owner summary (mock): take first owner amount
  const me = adminImport.breakdown.find(b=>b.owner_id==='ownerA');
  if (me) {
    summary = { ...summary, period: adminImport.period, occupancy_pct: adminImport.occupancy_pct, payout_per_room: null, your_payout: me.amount, finalized: true, rooms: me.rooms };
  }
  res.json({ period: adminImport.period, finalized: true, applied_at: dayjs().toISOString() });
});

// Announcements
const news = [
  { id:'n1', title:'設備点検のお知らせ', publish_at: dayjs().subtract(3,'day').toISOString(), is_read:false, excerpt:'共有部の設備点検を実施します。' },
  { id:'n2', title:'レストラン新メニュー', publish_at: dayjs().subtract(7,'day').toISOString(), is_read:true, excerpt:'季節の特別メニューをご紹介。' }
];
app.get('/announcements', (req,res)=> res.json({ items: news, next_cursor: null }));
app.get('/announcements/:id', (req,res)=> {
  const n=news.find(x=>x.id===req.params.id); if(!n) return res.sendStatus(404);
  res.json({ ...n, body:`<p>${n.excerpt}</p>` });
});
app.post('/announcements/:id/read', (req,res)=>{
  const n=news.find(x=>x.id===req.params.id); if(n) n.is_read=true; res.json({ ok:true });
});

// Events
const events = [
  { id:'ev1', title:'オーナー交流会', starts_at: dayjs().add(10,'day').hour(18).minute(0).second(0).toISOString(), ends_at: dayjs().add(10,'day').hour(20).toISOString(), location:'ラウンジ', category:'community', capacity:30, going_count:22, waitlist_enabled:true, my_status:'going' },
  { id:'ev2', title:'朝ヨガ', starts_at: dayjs().add(12,'day').hour(7).minute(0).toISOString(), ends_at: dayjs().add(12,'day').hour(8).toISOString(), location:'屋上', category:'wellness', capacity:15, going_count:15, waitlist_enabled:true, my_status:'waitlist' }
];
const rsvp = { ev1:{ status:'going', participants:[{kind:'owner',name:'あなた'}], capacity:30, remaining:8 }, ev2:{ status:'waitlist', participants:[{kind:'owner',name:'あなた'}], capacity:15, remaining:0 } };
app.get('/events', (req,res)=>{
  res.json(events);
});
app.get('/events/:id', (req,res)=>{
  const e=events.find(x=>x.id===req.params.id); if(!e) return res.sendStatus(404);
  res.json({ ...e, description:'イベント詳細', cancel_deadline_at: dayjs(e.starts_at).subtract(24,'hour').toISOString(), is_paid:false });
});
app.get('/events/:id/rsvp', (req,res)=>{
  const data=rsvp[req.params.id]; if(!data) return res.sendStatus(404); res.json(data);
});
app.get('/events/:id/eligible-participants', (req,res)=>{
  res.json({ owner:{ id:'owner1', name:'あなた' }, family:[{id:'fam1',name:'配偶者'},{id:'fam2',name:'子ども'}] });
});
app.post('/events/:id/rsvp', (req,res)=>{
  const { action } = req.body || {};
  if(action==='cancel') { rsvp[req.params.id].status='cancelled'; return res.json({ status:'cancelled' }); }
  rsvp[req.params.id].status='going'; return res.json({ status:'going', rsvp_id:'r1', participants:rsvp[req.params.id].participants, remaining:Math.max(0,(rsvp[req.params.id].remaining||0)-1) });
});

// Chat
const messages = [
  { id:'m1', sender_role:'manager', text:'ご確認ください', created_at: dayjs().subtract(1,'hour').toISOString(), read_at: dayjs().toISOString() },
  { id:'m2', sender_role:'owner', text:'確認しました', created_at: dayjs().subtract(30,'minute').toISOString(), read_at: null }
];
app.get('/chat/threads/me', (req,res)=>{
  res.json({ thread_id:'t1', unread_count:1, last_message: messages[messages.length-1] });
});
app.get('/chat/threads/:id/messages', (req,res)=>{
  res.json({ items: messages, next_cursor: null });
});
app.post('/chat/threads/:id/messages', (req,res)=>{
  const { text } = req.body || {}; const m = { id: 'm'+(messages.length+1), sender_role:'owner', text, created_at: dayjs().toISOString(), read_at: null }; messages.push(m); res.json(m);
});
app.post('/chat/threads/:id/read', (req,res)=>{ messages.forEach(m=>{ if(m.sender_role==='manager') m.read_at=dayjs().toISOString(); }); res.json({ ok:true }); });

// Me
let profile = { name:'山田太郎', kana:'ヤマダタロウ', email:'owner@example.com', phone:'+81...', address:{ country:'JP', pref:'東京都', city:'千代田区', line:'1-1-1', postal:'100-0001' }, locale:'ja', notif:{ email:true, push:false, categories:{ news:true, events:true, chat:true } } };
let family = [ { id:'fam1', name:'山田花子', relation:'spouse', birthdate:'1987-03-01', phone:'+81...' } ];
const units = [ { unit_id:'u1', unit_code:'A-101', building:'棟A', weight:1.0, status:'active', latest_return_amount:15000 }, { unit_id:'u2', unit_code:'A-102', building:'棟A', weight:1.0, status:'active', latest_return_amount:15000 } ];
app.get('/me/profile', (req,res)=> res.json(profile));
app.put('/me/profile', (req,res)=> { profile = { ...profile, ...req.body }; res.json({ updated:true, profile }); });
app.get('/me/family', (req,res)=> res.json(family));
app.post('/me/family', (req,res)=> { const id='fam'+(family.length+1); const f={ id, ...req.body }; family.push(f); res.json(f); });
app.patch('/me/family/:id', (req,res)=> { const i=family.findIndex(f=>f.id===req.params.id); if(i<0) return res.sendStatus(404); family[i]={ ...family[i], ...req.body }; res.json(family[i]); });
app.delete('/me/family/:id', (req,res)=> { const i=family.findIndex(f=>f.id===req.params.id); if(i<0) return res.sendStatus(404); family.splice(i,1); res.json({ ok:true }); });
app.get('/me/units', (req,res)=> res.json(units));

const PORT = process.env.PORT || 8081;
app.listen(PORT, ()=> console.log(`mock-api listening on :${PORT}`));

