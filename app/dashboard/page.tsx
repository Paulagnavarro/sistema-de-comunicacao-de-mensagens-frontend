'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../services/api';
import { Usuario, Mensagem, UsuarioLista } from './types';
import { ModalNovaMsg } from './ModalNovaMsg';
import { ModalDetalhe } from './ModalDetalhe';

export default function Dashboard() {
    const router = useRouter();
    const [mensagens, setMensagens] = useState<Mensagem[]>([]);
    const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>(null);
    const [usuarios, setUsuarios] = useState<UsuarioLista[]>([]);
    const [remetenteId, setRemetenteId] = useState('');

    // Filtros
    const [busca, setBusca] = useState('');
    const [statusLida, setStatusLida] = useState('');

    // Lading e erros
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [carregandoUsuarios, setCarregandoUsuarios] = useState(false);

    // Modais
    const [modalNovaAberto, setModalNovaAberto] = useState(false);
    const [modalDetalheAberto, setModalDetalheAberto] = useState(false);
    const [mensagemSelecionada, setMensagemSelecionada] = useState<Mensagem | null>(null);

    // Verifica se o usuário tem sessão ativa ao entrar na página
    useEffect(() => {
        const userStorage = localStorage.getItem('@Mensagens:user');
        const tokenStorage = localStorage.getItem('@Mensagens:token');

        if (!userStorage || !tokenStorage || userStorage === 'undefined' || tokenStorage === 'undefined') {
            localStorage.clear();
            router.push('/');
            return;
        }

        setUsuarioLogado(JSON.parse(userStorage));
    }, [router]);

    // Recarrega as mensagens sempre que o usuário logado muda ou algum filtro é alterado
    useEffect(() => {
        if (usuarioLogado) {
            carregarMensagens();
            carregarUsuarios();
        }
    }, [usuarioLogado, busca, statusLida, remetenteId]);

    // Busca as mensagens no back-end aplicando os filtros
    async function carregarMensagens() {
        setCarregando(true);
        setErro('');
        try {
            const params: any = {};
            if (busca.trim()) params.busca = busca;
            if (statusLida) params.statusLida = statusLida;
            if (remetenteId) params.remetenteId = remetenteId;

            const resposta = await api.get('/mensagens', { params });
            const dadosOrdenados = resposta.data.sort((a: Mensagem, b: Mensagem) => 
                new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
            );

            setMensagens(dadosOrdenados);
        } catch (err: any) {
            setErro('Não foi possível carregar as mensagens.');
            console.error(err);
        } finally {
            setCarregando(false);
        }
    }

    // Carrega a lista de usuários cadastrados para usar no filtro e no envio de mensagens
    async function carregarUsuarios() {
        setCarregandoUsuarios(true);
        try {
            const resposta = await api.get('/usuarios');
            setUsuarios(resposta.data);
        } catch (err) {
            console.error('Erro ao carregar usuários:', err);
        } finally {
            setCarregandoUsuarios(false);
        }
    }

    const handleAbrirModalNova = () => {
        setModalNovaAberto(true);
        carregarUsuarios();
    };

    async function handleAbrirDetalhe(msg: Mensagem) {
        setMensagemSelecionada(msg);
        setModalDetalheAberto(true);

        const idLogado = Number(usuarioLogado?.id);
        const idDestinatarioMsg = Number(msg.destinatario?.id);

        if (idLogado && idDestinatarioMsg === idLogado && !msg.lida) {
            setMensagens(prev => prev.map(m => m.id === msg.id ? { ...m, lida: true } : m));
            try {
                await api.patch(`/mensagens/${msg.id}/ler`);
                await carregarMensagens();
            } catch (err) {
                console.error('Erro ao marcar como lida:', err);
                setMensagens(prev => prev.map(m => m.id === msg.id ? { ...m, lida: false } : m));
                setErro('Erro ao confirmar leitura da mensagem.');
            }
        }
    }

    function handleLogout() {
        localStorage.clear();
        router.push('/');
    }

    const handleFocus = (e: React.FocusEvent<any>) => {
        e.target.style.borderColor = '#3b82f6';
        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.15)';
    };

    const handleBlur = (e: React.FocusEvent<any>) => {
        e.target.style.borderColor = '#d1d5db';
        e.target.style.boxShadow = 'none';
    };

    if (!usuarioLogado) {
        return (
            <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f3f4f6', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563' }}>
                <strong>Verificando autenticação...</strong>
            </div>
        );
    }

    const isAdmin = usuarioLogado.perfil?.toLowerCase() === 'administrador';

    return (
        <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f3f4f6', minHeight: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
        
        {/* Header */}
        <header style={{ backgroundColor: '#1e3a8a', color: '#fff', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <h1 style={{ margin: 0, fontSize: '1.25rem' }}>Sistema de Comunicação de Mensagens</h1>
                <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                    Olá, <strong>{usuarioLogado.nome}</strong>
                </span>
            </div>
            <button onClick={handleLogout} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.2s' }}>
                Sair
            </button>
        </header>

        {/* Área Principal */}
        <main style={{ flex: 1, maxWidth: '1000px', width: '100%', margin: '2rem auto', padding: '0 1rem', boxSizing: 'border-box' }}>
            <section style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'space-between' }}>
            
                {/* Input de Busca */}
                <div style={{ flex: 1 }}>
                    <input type="text" placeholder="🔍 Buscar por palavra-chave..." value={busca} onChange={(e) => setBusca(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #d1d5db', boxSizing: 'border-box', outline: 'none', transition: 'all 0.2s' }} onFocus={handleFocus} onBlur={handleBlur}/>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexShrink: 0 }}>
                    
                    {/* Select Status */}
                    <div>
                        <select value={statusLida} onChange={(e) => setStatusLida(e.target.value)}
                            style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #d1d5db', outline: 'none', transition: 'all 0.2s', backgroundColor: '#fff', minWidth: '160px', cursor: 'pointer' }} onFocus={handleFocus} onBlur={handleBlur}>
                                <option value="">Todas as mensagens</option>
                                <option value="lidas">Apenas Lidas</option>
                                <option value="nao_lidas">Apenas Não Lidas</option>
                        </select>
                    </div>

                    {/* Select Remetente */}
                    <div>
                        <select value={remetenteId} onChange={(e) => setRemetenteId(e.target.value)} style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #d1d5db', outline: 'none', transition: 'all 0.2s', backgroundColor: '#fff', minWidth: '170px', cursor: 'pointer' }} onFocus={handleFocus} onBlur={handleBlur}>
                            <option value="">Todos os remetentes</option>
                            {usuarios.map(usr => (
                                <option key={usr.id} value={usr.id}>
                                    {usr.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Botão Nova Mensagem */}
                    <button onClick={handleAbrirModalNova} style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.2s', whiteSpace: 'nowrap' }}>
                        + Nova Mensagem
                    </button>
                </div>
            </section>

            {erro && <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>{erro}</div>}

            {/* Tabela de mensagens */}
            {carregando ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#4b5563' }}>Carregando mensagens...</div>
            ) : (
            <section style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                {mensagens.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>Nenhuma mensagem encontrada.</div>
                ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Remetente</th>
                            {isAdmin && <th style={{ padding: '1rem' }}>Destinatário</th>}
                            <th style={{ padding: '1rem' }}>Conteúdo</th>
                            <th style={{ padding: '1rem' }}>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mensagens.map((msg) => {
                            const idLogado = Number(usuarioLogado?.id);
                            const idRemetente = Number(msg.remetente?.id);
                            const souRemetente = idLogado === idRemetente;
                            const deveDestacar = !souRemetente && !msg.lida;

                            return (
                            <tr key={msg.id} onClick={() => handleAbrirDetalhe(msg)} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = deveDestacar ? '#e6fbf0' : '#f9fafb'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = deveDestacar ? '#f0fdf4' : '#fff'; }} 
                                style={{ borderBottom: '1px solid #e5e7eb', cursor: 'pointer', fontWeight: deveDestacar ? 'bold' : 'normal', backgroundColor: deveDestacar ? '#f0fdf4' : '#fff', transition: 'background-color 0.15s ease' }} >
                                <td style={{ padding: '1rem' }}>
                                    {souRemetente ? (
                                        <span style={{ color: '#059669', fontSize: '0.85rem' }}>
                                            {msg.lida ? '✓ Lida' : '✉ Enviada'}
                                        </span>
                                    ) : (
                                        msg.lida ? (
                                        <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Lida</span>
                                        ) : (
                                        <span style={{ backgroundColor: '#3b82f6', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '12px', fontSize: '0.75rem' }}>Nova</span>
                                        )
                                    )}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {souRemetente ? 'Você' : (msg.remetente?.nome || 'Desconhecido')}
                                </td>
                                {isAdmin && (
                                    <td style={{ padding: '1rem', color: '#4b5563' }}>
                                        {idLogado === Number(msg.destinatario?.id) ? 'Você' : (msg.destinatario?.nome || 'Desconhecido')}
                                    </td>
                                )}
                                <td style={{ padding: '1rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {msg.conteudo}
                                </td>
                                <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.85rem' }}>
                                    {new Date(msg.criadoEm).toLocaleString('pt-BR')}
                                </td>
                            </tr>
                            );
                        })}
                    </tbody>
                </table>
                )}
            </section>
            )}
        </main>

        {/* Rodapé */}
        <footer style={{ backgroundColor: '#1e293b', color: '#94a3b8', padding: '1rem 2rem', textAlign: 'center', fontSize: '0.875rem', borderTop: '1px solid #334155', marginTop: 'auto' }}>
            <p style={{ margin: 0 }}>© {new Date().getFullYear()} — Sistema de Comunicação de Mensagens</p>
        </footer>

        {/* Modais */}
        <ModalNovaMsg 
            isOpen={modalNovaAberto}
            onClose={() => setModalNovaAberto(false)}
            usuarios={usuarios}
            carregandoUsuarios={carregandoUsuarios}
            onSuccess={carregarMensagens}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
        />

        <ModalDetalhe 
            isOpen={modalDetalheAberto}
            mensagem={mensagemSelecionada}
            onClose={() => { setModalDetalheAberto(false); setMensagemSelecionada(null); }}
        />
        </div>
    );
}