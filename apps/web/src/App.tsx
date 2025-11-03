import { Outlet, Link, useLocation } from 'react-router-dom';

function TabItem({ to, label }: { to: string; label: string }) {
  const loc = useLocation();
  const active = loc.pathname === to || (to === '/' && loc.pathname === '/');
  return (
    <Link to={to} className={active ? 'text-brand-gold' : 'text-neutral-500'}>
      <span>{label}</span>
    </Link>
  );
}

export default function App() {
  return (
    <div className="min-h-screen pb-16">
      <div className="p-4">
        <Outlet />
      </div>

      <nav className="tabbar flex">
        <TabItem to="/" label="Returns" />
        <TabItem to="/news" label="News" />
        <TabItem to="/events" label="Events" />
        <TabItem to="/chat" label="Chat" />
        <TabItem to="/me" label="Me" />
      </nav>
    </div>
  );
}

