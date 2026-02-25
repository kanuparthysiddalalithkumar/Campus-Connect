import { useState } from 'react';
import { ACTIVITIES, REGISTRATIONS, USERS } from './data';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { ShieldCheck, Plus, Edit2, Trash2, X, Bell, Send, Users } from 'lucide-react';

const cats = ['Club', 'Sport', 'Event'];
const blank = { title: '', description: '', category: 'Club', date: '', time: '', location: '', maxParticipants: 30 };

export default function AdminPanel() {
    const { user } = useAuth();
    const [acts, setActs] = useState([...ACTIVITIES]);
    const [tab, setTab] = useState('activities');
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(blank);
    const [editId, setEditId] = useState(null);
    const [notifMsg, setNotifMsg] = useState('');
    const s = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

    const openCreate = () => { setForm(blank); setEditId(null); setModal('form'); };
    const openEdit = a => { setForm({ title: a.title, description: a.description, category: a.category, date: a.date, time: a.time, location: a.location, maxParticipants: a.maxParticipants }); setEditId(a.id); setModal('form'); };

    const save = () => {
        if (!form.title || !form.date || !form.location) { toast.error('Fill required fields'); return; }
        if (editId) {
            setActs(p => p.map(a => a.id === editId ? { ...a, ...form } : a));
            toast.success('Activity updated!');
        } else {
            setActs(p => [{ ...form, id: 'a' + Date.now(), createdBy: user.id, currentParticipants: 0, gradient: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#7c3aed', tags: [], featured: false }, ...p]);
            toast.success('Activity created!');
        }
        setModal(null);
    };

    const del = id => { if (!window.confirm('Delete this activity?')) return; setActs(p => p.filter(a => a.id !== id)); toast.success('Deleted'); };

    const sendNotif = () => {
        if (!notifMsg.trim()) { toast.error('Enter a message'); return; }
        toast.success(`Notification sent to ${USERS.filter(u => u.role === 'student').length} students!`);
        setNotifMsg(''); setModal(null);
    };

    const students = USERS.filter(u => u.role === 'student').length;

    return (
        <div className="page-in" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 'clamp(20px,3vw,28px)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <ShieldCheck size={22} style={{ color: 'var(--green)' }} /> Admin Panel
                    </h1>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Manage all campus activities and student registrations</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => setModal('notify')} className="btn btn-secondary">
                        <Bell size={15} /> Notify Students
                    </button>
                    <button onClick={openCreate} className="btn btn-primary">
                        <Plus size={15} /> New Activity
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 14 }}>
                {[
                    { label: 'Activities', val: acts.length, color: '#a78bfa' },
                    { label: 'Registrations', val: REGISTRATIONS.length, color: '#60a5fa' },
                    { label: 'Students', val: students, color: '#34d399' },
                    { label: 'Featured', val: acts.filter(a => a.featured).length, color: '#fbbf24' },
                ].map(s => (
                    <div key={s.label} className="card-static" style={{ padding: '18px', textAlign: 'center' }}>
                        <div style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Plus Jakarta Sans', color: s.color, marginBottom: 4 }}>{s.val}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Tab row */}
            <div style={{ display: 'flex', gap: 8 }}>
                {['activities', 'registrations'].map(t => (
                    <button key={t} onClick={() => setTab(t)} className={`chip${tab === t ? ' active' : ''}`} style={{ textTransform: 'capitalize' }}>
                        {t === 'activities' ? '📋 Activities' : '👥 Registrations'}
                    </button>
                ))}
            </div>

            {/* Tables */}
            <div className="card-static" style={{ overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    {tab === 'activities' && (
                        <table className="table">
                            <thead>
                                <tr><th>Activity</th><th>Category</th><th>Date</th><th>Location</th><th>Participants</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {acts.map(act => (
                                    <tr key={act.id}>
                                        <td>
                                            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{act.title}</div>
                                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{act.description}</div>
                                        </td>
                                        <td><span className={`badge badge-${act.category.toLowerCase()}`}>{act.category}</span></td>
                                        <td>
                                            <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{act.date}</div>
                                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{act.time}</div>
                                        </td>
                                        <td style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{act.location}</td>
                                        <td>
                                            <div style={{ fontWeight: 600, fontSize: 14 }}>{act.currentParticipants}/{act.maxParticipants}</div>
                                            <div className="progress-track" style={{ width: 80, marginTop: 5 }}>
                                                <div className="progress-fill" style={{ width: `${Math.round((act.currentParticipants / act.maxParticipants) * 100)}%` }} />
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <button onClick={() => openEdit(act)} className="btn btn-icon btn-ghost" style={{ color: 'var(--green)' }}><Edit2 size={14} /></button>
                                                <button onClick={() => del(act.id)} className="btn btn-icon btn-ghost" style={{ color: '#f43f5e' }}><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {tab === 'registrations' && (
                        <table className="table">
                            <thead>
                                <tr><th>Student</th><th>Activity</th><th>Category</th><th>Registered On</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                {REGISTRATIONS.map(reg => {
                                    const stu = USERS.find(u => u.id === reg.studentId);
                                    const act = ACTIVITIES.find(a => a.id === reg.activityId);
                                    if (!stu || !act) return null;
                                    return (
                                        <tr key={reg.id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: '#fff', flexShrink: 0 }}>{stu.avatar}</div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, fontSize: 14 }}>{stu.name}</div>
                                                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{stu.department}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: 600, fontSize: 14 }}>{act.title}</td>
                                            <td><span className={`badge badge-${act.category.toLowerCase()}`}>{act.category}</span></td>
                                            <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{reg.registeredAt}</td>
                                            <td><span className={`status-${reg.status.toLowerCase()}`}>{reg.status}</span></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Form Modal */}
            {modal === 'form' && (
                <div className="overlay" onClick={() => setModal(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 20 }}>{editId ? 'Edit Activity' : 'Create Activity'}</h2>
                            <button onClick={() => setModal(null)} className="btn btn-ghost btn-icon"><X size={18} /></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div><label className="label">Title *</label><input className="input" placeholder="Activity title" value={form.title} onChange={s('title')} /></div>
                            <div><label className="label">Description</label><textarea className="input" rows={3} placeholder="Brief description..." value={form.description} onChange={s('description')} style={{ resize: 'vertical' }} /></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div>
                                    <label className="label">Category *</label>
                                    <select className="input" value={form.category} onChange={s('category')} style={{ cursor: 'pointer' }}>
                                        {cats.map(c => <option key={c} value={c} style={{ background: '#fff', color: '#0f2817' }}>{c}</option>)}
                                    </select>
                                </div>
                                <div><label className="label">Max Participants</label><input type="number" className="input" value={form.maxParticipants} onChange={s('maxParticipants')} /></div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div><label className="label">Date *</label><input type="date" className="input" value={form.date} onChange={s('date')} /></div>
                                <div><label className="label">Time</label><input type="time" className="input" value={form.time} onChange={s('time')} /></div>
                            </div>
                            <div><label className="label">Location *</label><input className="input" placeholder="e.g. Main Hall, Room 204" value={form.location} onChange={s('location')} /></div>
                            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                                <button onClick={() => setModal(null)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                                <button onClick={save} className="btn btn-primary" style={{ flex: 1 }}>{editId ? 'Save Changes' : 'Create Activity'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Notify Modal */}
            {modal === 'notify' && (
                <div className="overlay" onClick={() => setModal(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Bell size={20} style={{ color: 'var(--green)' }} /> Send Notification
                            </h2>
                            <button onClick={() => setModal(null)} className="btn btn-ghost btn-icon"><X size={18} /></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div><label className="label">Message *</label><textarea className="input" rows={4} placeholder="Write your announcement..." value={notifMsg} onChange={e => setNotifMsg(e.target.value)} style={{ resize: 'vertical' }} /></div>
                            <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)', fontSize: 13, color: 'var(--green-dark)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Users size={14} /> Sends to {students} active students
                            </div>
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button onClick={() => setModal(null)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                                <button onClick={sendNotif} className="btn btn-primary" style={{ flex: 1 }}>
                                    <Send size={14} /> Send Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
