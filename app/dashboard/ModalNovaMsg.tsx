'use client';

import { useState } from 'react';
import { api } from '../../services/api';
import { UsuarioLista } from './types';

interface ModalNovaMsgProps {
    isOpen: boolean;
    onClose: () => void;
    usuarios: UsuarioLista[];
    carregandoUsuarios: boolean;
    onSuccess: () => Promise<void>;
    handleFocus: (e: React.FocusEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<any>) => void;
}

export function ModalNovaMsg({
    isOpen,
    onClose,
    usuarios,
    carregandoUsuarios,
    onSuccess,
    handleFocus,
    handleBlur,
}: ModalNovaMsgProps) {
    const [idDestinatario, setIdDestinatario] = useState('');
    const [conteudoNovaMsg, setConteudoNovaMsg] = useState('');
    const [enviando, setEnviando] = useState(false);
    
    const [feedback, setFeedback] = useState<{ texto: string; tipo: 'sucesso' | 'erro' } | null>(null);

    if (!isOpen) return null;

    const handleFecharModal = () => {
        setFeedback(null);
        setConteudoNovaMsg('');
        setIdDestinatario('');
        onClose();
    };

    async function handleEnviarMensagem(e: React.FormEvent) {
        e.preventDefault();
        if (!idDestinatario || !conteudoNovaMsg.trim()) return;

        setEnviando(true);
        setFeedback(null);
        
        try {
            await api.post('/mensagens', {
                destinatarioId: Number(idDestinatario),
                conteudo: conteudoNovaMsg.trim(),
            });

            setFeedback({ texto: 'Mensagem enviada com sucesso!', tipo: 'sucesso' });
            setConteudoNovaMsg('');
            setIdDestinatario('');
            await onSuccess();
            
            setTimeout(() => {
                handleFecharModal();
            }, 1500);
        } catch (err) {
            setFeedback({ texto: 'Erro ao enviar mensagem. Tente novamente.', tipo: 'erro' });
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div onClick={handleFecharModal} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} >
            <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '500px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', boxSizing: 'border-box' }} >
                <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#1f2937', fontFamily: 'sans-serif', fontSize: '1.25rem', fontWeight: 'bold' }}>
                    Enviar Nova Mensagem
                </h3>
                
                <form onSubmit={handleEnviarMensagem} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'sans-serif' }}>
                    
                    {/* Campo de Seleção do Destinatário */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#4b5563' }}>
                            Destinatário
                        </label>
                        <select required value={idDestinatario} onChange={(e) => setIdDestinatario(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '4px', border: '1px solid #d1d5db', outline: 'none', transition: 'all 0.2s', backgroundColor: '#fff', fontSize: '0.9rem', color: '#1f2937', boxSizing: 'border-box', cursor: 'pointer' }} disabled={carregandoUsuarios || enviando} onFocus={handleFocus} onBlur={handleBlur} >
                            <option value="">Selecione o destinatário...</option>
                            {usuarios.map((user) => (
                                <option key={user.id} value={user.id}>{user.nome}</option>
                            ))}
                        </select>
                        {carregandoUsuarios && (
                            <small style={{ color: '#6b7280', marginTop: '0.25rem', fontSize: '0.75rem' }}>
                                Carregando usuários...
                            </small>
                        )}
                    </div>

                    {/* Campo de Texto da Mensagem */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#4b5563' }}>
                            Conteúdo da Mensagem
                        </label>
                        <textarea required rows={5} value={conteudoNovaMsg} onChange={(e) => setConteudoNovaMsg(e.target.value)} 
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #d1d5db', resize: 'vertical', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box', fontSize: '0.9rem', color: '#1f2937', lineHeight: '1.4' }} placeholder="Digite o texto da mensagem aqui..." disabled={enviando} onFocus={handleFocus} onBlur={handleBlur}/>
                    </div>

                    {feedback && (
                        <div style={{ color: feedback.tipo === 'sucesso' ? '#065f46' : '#dc2626', backgroundColor: feedback.tipo === 'sucesso' ? '#d1fae5' : '#fee2e2', padding: '0.8rem', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '500', textAlign: 'center', transition: 'all 0.2s' }}>
                            {feedback.texto}
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <button type="button" onClick={handleFecharModal} style={{ padding: '0.6rem 1.2rem', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#fff', color: '#374151', fontSize: '0.9rem', fontWeight: '500', transition: 'background-color 0.2s' }} >
                            Cancelar
                        </button>
                        <button type="submit" disabled={enviando} style={{ padding: '0.6rem 1.2rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: enviando ? 'not-allowed' : 'pointer', fontSize: '0.9rem', transition: 'background-color 0.2s' }} >
                            {enviando ? 'Enviando...' : 'Enviar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}