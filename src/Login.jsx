import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { GraduationCap, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const s = k => v => setForm(p => ({ ...p, [k]: v }));

    const submit = async e => {
        e.preventDefault();
        if (!form.email || !form.password) { toast.error('Please fill in all fields'); return; }
        setLoading(true);
        try {
            await new Promise(r => setTimeout(r, 500));
            const u = login(form.email, form.password);
            toast.success(`Welcome back, ${u.name.split(' ')[0]}!`);
            navigate('/dashboard');
        } catch (err) { toast.error(err.message); }
        finally { setLoading(false); }
    };

    const quick = (email, password) => {
        try { const u = login(email, password); toast.success(`Welcome, ${u.name.split(' ')[0]}!`); navigate('/dashboard'); }
        catch (err) { toast.error(err.message); }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative', overflow: 'hidden' }}>
            <div className="mesh-bg" aria-hidden>
                <div className="mesh-blob" style={{ width: 500, height: 500, background: '#22c55e', top: -150, left: -150, opacity: 0.09 }} />
                <div className="mesh-blob" style={{ width: 400, height: 400, background: '#16a34a', bottom: -100, right: -100, opacity: 0.07 }} />
            </div>

            <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: '0 8px 24px rgba(22,163,74,0.35)' }}>
                        <GraduationCap size={28} color="#fff" />
                    </div>
                    <h1 className="font-display" style={{ fontWeight: 900, fontSize: 26, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>CampusConnect</h1>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Student Activity Management Platform</p>
                </div>

                <div className="glass" style={{ padding: 32 }}>
                    <h2 className="font-display" style={{ fontWeight: 800, fontSize: 20, marginBottom: 4, color: 'var(--text-primary)' }}>Welcome back</h2>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>Sign in to access your dashboard</p>

                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div>
                            <label className="label">Email Address</label>
                            <input className="input" type="email" placeholder="you@campus.edu" value={form.email} onChange={e => s('email')(e.target.value)} />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <label className="label">Password</label>
                            <input className="input" type={show ? 'text' : 'password'} placeholder="Your password" style={{ paddingRight: 44 }} value={form.password} onChange={e => s('password')(e.target.value)} />
                            <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: 14, bottom: 12, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                {show ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15, marginTop: 4 }}>
                            {loading ? <div className="spinner" style={{ width: 18, height: 18, borderTopColor: '#fff' }} /> : <><ArrowRight size={16} /> Sign In</>}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>
                        No account? <Link to="/register" style={{ color: 'var(--green-dark)', fontWeight: 700 }}>Create one free</Link>
                    </p>

                    <div style={{ borderTop: '1px solid rgba(22,163,74,0.12)', marginTop: 24, paddingTop: 20 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.7px', textAlign: 'center', marginBottom: 12 }}>Quick Demo Access</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            <button onClick={() => quick('admin@campus.edu', 'admin123')}
                                style={{ padding: '12px 10px', borderRadius: 12, border: '1px solid rgba(22,163,74,0.25)', background: 'rgba(22,163,74,0.08)', color: 'var(--green-dark)', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, transition: 'all 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(22,163,74,0.15)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(22,163,74,0.08)'}>
                                <span style={{ fontSize: 22 }}>🛡️</span> Admin Login
                            </button>
                            <button onClick={() => quick('sarah@campus.edu', 'student123')}
                                style={{ padding: '12px 10px', borderRadius: 12, border: '1px solid rgba(37,99,235,0.2)', background: 'rgba(37,99,235,0.06)', color: '#1d4ed8', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, transition: 'all 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(37,99,235,0.12)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(37,99,235,0.06)'}>
                                <span style={{ fontSize: 22 }}>📚</span> Student Login
                            </button>
                        </div>
                    </div>
                </div>

                <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--text-muted)' }}>
                    <Link to="/" style={{ color: 'var(--green-dark)', fontWeight: 600 }}>← Back to Home</Link>
                </p>
            </div>
        </div>
    );
}
