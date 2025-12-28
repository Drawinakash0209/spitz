import { AlertCircle, Lock, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const signIn = useAuthStore((state) => state.signIn);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #2563eb, #4f46e5, #7c3aed)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.1,
        pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute',
          top: '5rem',
          left: '5rem',
          width: '18rem',
          height: '18rem',
          background: 'white',
          borderRadius: '9999px',
          filter: 'blur(64px)',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '5rem',
          right: '5rem',
          width: '24rem',
          height: '24rem',
          background: 'white',
          borderRadius: '9999px',
          filter: 'blur(64px)',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          animationDelay: '1s'
        }}></div>
      </div>

      <div style={{
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        borderRadius: '1rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: '2rem',
        width: '100%',
        maxWidth: '28rem',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {/* Logo/Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '4rem',
            height: '4rem',
            background: 'linear-gradient(to bottom right, #2563eb, #4f46e5)',
            borderRadius: '1rem',
            marginBottom: '1rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }}>
            <svg style={{ width: '2.5rem', height: '2.5rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 700,
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            Spitz Dental Lab
          </h1>
          <p style={{ color: '#6b7280' }}>
            Welcome back! Please sign in to continue
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              marginBottom: '1.25rem'
            }}>
              <AlertCircle style={{ width: '1.25rem', height: '1.25rem', marginTop: '0.125rem', flexShrink: 0 }} />
              <span style={{ fontSize: '0.875rem' }}>{error}</span>
            </div>
          )}

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                left: 0,
                paddingLeft: '1rem',
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none'
              }}>
                <Mail style={{ height: '1.25rem', width: '1.25rem', color: '#9ca3af' }} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '3rem',
                  paddingRight: '1rem',
                  paddingTop: '0.75rem',
                  paddingBottom: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.75rem',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                placeholder="you@example.com"
                required
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                left: 0,
                paddingLeft: '1rem',
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none'
              }}>
                <Lock style={{ height: '1.25rem', width: '1.25rem', color: '#9ca3af' }} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '3rem',
                  paddingRight: '1rem',
                  paddingTop: '0.75rem',
                  paddingBottom: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.75rem',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                placeholder="••••••••"
                required
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.875rem',
            marginBottom: '1.25rem'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                style={{
                  width: '1rem',
                  height: '1rem',
                  borderRadius: '0.25rem',
                  border: '1px solid #d1d5db',
                  cursor: 'pointer'
                }}
              />
              <span style={{ color: '#6b7280' }}>Remember me</span>
            </label>
            <button
              type="button"
              style={{
                color: '#2563eb',
                fontWeight: 500,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#1d4ed8'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#2563eb'}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#9ca3af' : 'linear-gradient(to right, #2563eb, #4f46e5)',
              color: 'white',
              paddingTop: '0.875rem',
              paddingBottom: '0.875rem',
              borderRadius: '0.75rem',
              fontWeight: 600,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              opacity: loading ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <svg style={{ animation: 'spin 1s linear infinite', height: '1.25rem', width: '1.25rem' }} viewBox="0 0 24 24">
                  <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          Need help? <a href="#" style={{
            color: '#2563eb',
            fontWeight: 500,
            textDecoration: 'none'
          }}>Contact Support</a>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}