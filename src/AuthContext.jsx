import { createContext, useContext, useState, useEffect } from 'react';
import { USERS, NOTIFICATIONS, REGISTRATIONS } from './data';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [registrations, setRegistrations] = useState([...REGISTRATIONS]);

    useEffect(() => {
        const stored = localStorage.getItem('cc_user');
        if (stored) {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            setNotifications(NOTIFICATIONS.filter(n => n.userId === parsed.id));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        const found = USERS.find(u => u.email === email && u.password === password);
        if (!found) throw new Error('Invalid email or password');
        const { password: _, ...safeUser } = found;
        setUser(safeUser);
        setNotifications(NOTIFICATIONS.filter(n => n.userId === safeUser.id));
        localStorage.setItem('cc_user', JSON.stringify(safeUser));
        return safeUser;
    };

    const register = (name, email, password, department, year) => {
        if (USERS.find(u => u.email === email)) throw new Error('Email already registered');
        const newUser = {
            id: String(Date.now()), name, email, role: 'student',
            department, year: year || '1st Year',
            avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
            joinedAt: new Date().toISOString().split('T')[0],
            registeredActivities: [],
        };
        USERS.push({ ...newUser, password });
        setUser(newUser);
        setNotifications([]);
        localStorage.setItem('cc_user', JSON.stringify(newUser));
        return newUser;
    };

    const logout = () => {
        setUser(null); setNotifications([]);
        localStorage.removeItem('cc_user');
    };

    const markRead = (id) => setNotifications(p => p.map(n => n.id === id ? { ...n, isRead: true } : n));
    const markAllRead = () => setNotifications(p => p.map(n => ({ ...n, isRead: true })));

    const registerForActivity = (activityId) => {
        if (!user || registrations.find(r => r.studentId === user.id && r.activityId === activityId)) return false;
        setRegistrations(p => [...p, {
            id: 'r' + Date.now(), studentId: user.id, activityId,
            status: 'Registered', registeredAt: new Date().toISOString().split('T')[0],
        }]);
        return true;
    };

    const getMyRegistrations = () => registrations.filter(r => r.studentId === user?.id);
    const isRegistered = (aId) => registrations.some(r => r.studentId === user?.id && r.activityId === aId);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <AuthContext.Provider value={{
            user, loading, notifications, registrations, unreadCount,
            login, register, logout, markRead, markAllRead,
            registerForActivity, getMyRegistrations, isRegistered,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be inside AuthProvider');
    return ctx;
};
