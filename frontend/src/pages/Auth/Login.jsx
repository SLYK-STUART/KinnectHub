import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/auth.store';
import Button from '../../components/ui/Button/Button';
import Card from '../../components/ui/Card/Card';
import Input from '../../components/ui/Input/Input';
import styles from './Login.module.css';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter your username and password.');
      return;
    }

    setLoading(true);

    // Simulate async auth — replace with real call later
    await new Promise(r => setTimeout(r, 600));

    const mockUser = {
      id: 1,
      name: username.trim(),
      role: 'member',
      isAdmin: false,
    };

    login(mockUser, 'mock-token');
    navigate('/');
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className={styles.page}>

      {/* Background leaf pattern */}
      <div className={styles.bgAccent} aria-hidden="true" />

      <Card>
        <div className={styles.card}>

          {/* Header */}
          <div className={styles.header}>
            <div className={styles.brandMark}>K</div>
            <h1 className={styles.title}>KinnectHub</h1>
            <p className={styles.subtitle}>Your private family space</p>
          </div>

          {/* Form */}
          <div className={styles.form} onKeyDown={handleKeyDown}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="username">Username</label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label className={styles.label} htmlFor="password">Password</label>
                <button className={styles.forgotLink} type="button">Forgot password?</button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className={styles.errorMsg} role="alert">{error}</p>
            )}

            <Button onClick={handleLogin} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </div>

          {/* Footer note */}
          <p className={styles.footerNote}>
            Access is by invitation only. Contact your family admin if you need an account.
          </p>

        </div>
      </Card>
    </div>
  );
}