'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../services/api';

const styles = {
    main: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1e3a8a',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '1rem',
        boxSizing: 'border-box' as const,
    },
    card: {
        backgroundColor: '#ffffff',
        padding: '3rem 2.5rem',
        borderRadius: '24px',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.15)',
        width: '100%',
        maxWidth: '440px',
        position: 'relative' as const,
        boxSizing: 'border-box' as const,
    },
    iconContainer: {
        position: 'absolute' as const,
        top: '-50px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100px',
        height: '100px',
        backgroundColor: '#60a5fa',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 15px 30px rgba(96, 165, 250, 0.3)',
        zIndex: 10,
    },
};

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState('');

    // Função que faz a chamada de login na API e guarda os dados da sessão
    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setCarregando(true);
        setErro('');

        try {
            // Envia o e-mail e senha para a rota de autenticação
            const resposta = await api.post('/auth/login', { email, senha });
            const token = resposta.data.access_token || resposta.data.token;
            const dadosUsuario = resposta.data.user || resposta.data.usuario || {
                id: resposta.data.id,
                nome: resposta.data.nome,
                email: resposta.data.email,
                perfil: resposta.data.perfil,
            };

            if (!token || !dadosUsuario?.id) {
                throw new Error('Dados de login incompletos.');
            }

            localStorage.setItem('@Mensagens:token', token);
            localStorage.setItem('@Mensagens:user', JSON.stringify(dadosUsuario));

            router.push('/dashboard');
        } catch (err: any) {
            const mensagemErro = err.response?.data?.message || err.message || 'E-mail ou senha incorretos.';
            setErro(mensagemErro);
            console.warn('Falha no login:', mensagemErro);
        } finally {
            setCarregando(false);
        }
    }
    return (
        <main style={styles.main}>
            <div style={styles.card}>
                {/* Ícone */}
                <div style={styles.iconContainer}>
                    <span style={{ fontSize: '52px' }}>✉️</span>
                </div>

                {/* Cabeçalho */}
                <div style={{ textAlign: 'center', marginTop: '65px', marginBottom: '2.2rem' }}>
                    <h1 style={{ margin: 0, fontSize: '1.9rem', fontWeight: '700', color: '#1e3a8a', lineHeight: '1.2'}}>
                        Sistema de Comunicação<br />de Mensagens
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.05rem', marginTop: '0.6rem' }}>
                        Acesse sua conta
                    </p>
                </div>

                {/* Mensagem de Erro */}
                {erro && (
                  <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', padding: '1rem', borderRadius: '12px', marginBottom: '1.8rem', fontSize: '0.96rem', textAlign: 'center', border: '1px solid #fecaca'}}>
                      {erro}
                  </div>
                )}

                {/* Formulário */}
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.6rem', color: '#334155', fontWeight: '600', fontSize: '0.95rem' }}>
                            E-mail
                        </label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1.05rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                            placeholder="Digite seu e-mail:"
                            onFocus={(e) => {
                                e.target.style.borderColor = '#3b82f6';
                                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.15)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#e2e8f0';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                  <div>
                      <label style={{ display: 'block', marginBottom: '0.6rem', color: '#334155', fontWeight: '600', fontSize: '0.95rem' }}>
                          Senha
                      </label>
                      <input type="password" required value={senha} onChange={(e) => setSenha(e.target.value)}
                          style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1.05rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s'}}
                          placeholder="Digite sua senha:"
                          onFocus={(e) => {
                              e.target.style.borderColor = '#3b82f6';
                              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.15)';
                          }}
                          onBlur={(e) => {
                              e.target.style.borderColor = '#e2e8f0';
                              e.target.style.boxShadow = 'none';
                          }}
                      />
                  </div>

                  <button 
                      type="submit"
                      disabled={carregando}
                      style={{ width: '100%', padding: '1.1rem', borderRadius: '12px', border: 'none', backgroundColor: carregando ? '#93c5fd' : '#1e40af', color: '#fff', fontWeight: '700', fontSize: '1.1rem', cursor: carregando ? 'not-allowed' : 'pointer' }} >
                      {carregando ? 'Entrando...' : 'Entrar no Sistema'}
                  </button>
                </form>

                {/* Rodapé */}
                <p style={{ textAlign: 'center', marginTop: '2.2rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                    © {new Date().getFullYear()} — Sistema de Comunicação de Mensagens
                </p>
            </div>
        </main>
    );
}