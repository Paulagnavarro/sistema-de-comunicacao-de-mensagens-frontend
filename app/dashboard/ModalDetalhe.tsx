'use client';

import { Mensagem } from './types';

interface ModalDetalheProps {
    isOpen: boolean;
    mensagem: Mensagem | null;
    onClose: () => void;
}

export function ModalDetalhe({ isOpen, mensagem, onClose }: ModalDetalheProps) {
    if (!isOpen || !mensagem) return null;
    return (
        <div onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '600px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', boxSizing: 'border-box' }}>
                <h3 style={{ marginTop: 0, borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem', color: '#1e3a8a' }}>Detalhes da Mensagem</h3>
                <div style={{ margin: '1rem 0', fontSize: '0.9rem', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div><strong>De:</strong> {mensagem.remetente?.nome} ({mensagem.remetente?.email})</div>
                    <div><strong>Para:</strong> {mensagem.destinatario?.nome} ({mensagem.destinatario?.email})</div>
                    <div><strong>Data de Envio:</strong> {new Date(mensagem.criadoEm).toLocaleString('pt-BR')}</div>
                </div>
                <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '6px', border: '1px solid #e5e7eb', minHeight: '100px', whiteSpace: 'pre-wrap', marginBottom: '1.5rem', boxSizing: 'border-box' }}>
                    {mensagem.conteudo}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={onClose} style={{ padding: '0.6rem 1.5rem', backgroundColor: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}