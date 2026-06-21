// Guarda os dados do usuário que está logado no sistema
export interface Usuario {
    id: number;
    nome: string;
    email: string;
    perfil: string;
}

// Define a estrutura completa de uma mensagem recebida da API
export interface Mensagem {
    id: number;
    conteudo: string;
    lida: boolean;
    criadoEm: string;
    remetente: { id: number; nome: string; email: string };
    destinatario: { id: number; nome: string; email: string };
}

// Preenche as listas e dropdowns de seleção
export interface UsuarioLista {
    id: number;
    nome: string;
}