import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { Button } from './UI';
import './preview-access.css';

// A static preview entry gate, not server authorization. Only the digest is
// shipped; raw passwords are never stored. Deployment enables this via Vite.
const expected = (import.meta.env.VITE_PREVIEW_ACCESS_DIGEST || '').toLowerCase();
const sessionKey = 'guangxin-preview-access';
function hasAccess() {
  if (!expected) return true;
  try { return sessionStorage.getItem(sessionKey) === expected; } catch { return false; }
}
export function PreviewAccess({ children }: { children: ReactNode }) {
  const [allowed, setAllowed] = useState(hasAccess);
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const input = useRef<HTMLInputElement>(null);
  if (allowed) return <>{children}</>;
  const submit = async (event: FormEvent) => {
    event.preventDefault(); if (busy || !password) return;
    setBusy(true); setError('');
    try {
      const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
      const digest = Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, '0')).join('');
      if (digest !== expected) { setError('访问密码不正确，请重新输入。'); requestAnimationFrame(() => { input.current?.focus(); input.current?.select(); }); return; }
      try { sessionStorage.setItem(sessionKey, digest); } catch { /* Access still works for this page when storage is unavailable. */ }
      setPassword(''); setAllowed(true);
    } catch { setError('暂时无法验证，请刷新页面后重试。'); }
    finally { setBusy(false); }
  };
  return <main className="preview-access">
    <form className="preview-access-card" onSubmit={submit} aria-labelledby="access-title">
      <div className="preview-access-brand">广智新</div>
      <div className="preview-access-icon"><LockKeyhole size={24} aria-hidden="true"/></div>
      <h1 id="access-title">访问验证</h1><p>请输入访问密码，继续查看系统。</p>
      <label htmlFor="preview-password">访问密码</label>
      <div className="preview-access-input"><input ref={input} id="preview-password" type={visible ? 'text' : 'password'} autoComplete="current-password" autoFocus required maxLength={128} value={password} disabled={busy} aria-invalid={!!error} aria-describedby={error ? 'access-error' : undefined} onChange={event => { setPassword(event.target.value); setError(''); }} placeholder="请输入访问密码"/><button type="button" aria-label={visible ? '隐藏密码' : '显示密码'} aria-pressed={visible} disabled={busy} onClick={() => setVisible(value => !value)}>{visible ? <EyeOff size={16}/> : <Eye size={16}/>}</button></div>
      {error && <p id="access-error" className="preview-access-error" role="alert">{error}</p>}
      <Button variant="primary" type="submit" loading={busy} disabled={!password}>进入系统</Button>
    </form>
  </main>;
}
