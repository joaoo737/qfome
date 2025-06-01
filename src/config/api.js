// src/config/api.js
const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8082',
    ENDPOINTS: {
      // Autenticação
      AUTH: {
        CLIENTE: {
          LOGIN: '/cliente/auth/login',
          REGISTER: '/cliente/auth/register'
        },
        FORNECEDOR: {
          LOGIN: '/fornecedor/auth/login',
          REGISTER: '/fornecedor/auth/register'
        },
        ENTREGADOR: {
          LOGIN: '/entregador/auth/login',
          REGISTER: '/entregador/auth/register'
        }
      },
      
      // Busca
      BUSCA: {
        GERAL: '/busca/geral',
        CATEGORIA: '/busca/categoria',
        FILTROS: '/busca/filtros',
        PROXIMOS: '/busca/proximos',
        SUGESTOES: '/busca/sugestoes',
        CATEGORIAS: '/busca/categorias'
      },
      
      // Usuários
      CLIENTE: '/clientes',
      FORNECEDOR: '/fornecedores',
      ENTREGADOR: '/entregadores',
      
      // Produtos e Pedidos
      PRODUTOS: '/produtos',
      PEDIDOS: '/pedidos',
      ESTOQUE: '/fornecedor/estoque'
    },
    
    // Configurações de timeout
    TIMEOUT: 30000,
    
    // Headers padrão
    DEFAULT_HEADERS: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
  
  // Utilitário para construir URLs completas
  export const buildUrl = (endpoint) => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
  };
  
  // Utilitário para obter headers com autenticação
  export const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };
  
  // Utilitário para fazer requisições com tratamento de erro
  export const apiRequest = async (endpoint, options = {}) => {
    const url = buildUrl(endpoint);
    const config = {
      timeout: API_CONFIG.TIMEOUT,
      headers: getAuthHeaders(),
      ...options
    };
  
    try {
      const response = await fetch(url, config);
      
      // Se a resposta não for ok, lançar erro
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
      }
      
      // Se não houver conteúdo, retornar sucesso
      if (response.status === 204) {
        return { success: true };
      }
      
      // Tentar parsear JSON
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Erro na requisição:', error);
      
      // Se for erro de rede ou timeout
      if (error.name === 'TypeError' || error.name === 'NetworkError') {
        throw new Error('Erro de conexão. Verifique sua internet.');
      }
      
      // Se for erro de timeout
      if (error.name === 'AbortError') {
        throw new Error('Tempo limite da requisição esgotado.');
      }
      
      // Outros erros
      throw error;
    }
  };
  
  // Métodos de conveniência para diferentes tipos de requisição
  export const api = {
    get: (endpoint, params = {}) => {
      const url = new URL(buildUrl(endpoint));
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          url.searchParams.append(key, params[key]);
        }
      });
      
      return apiRequest(url.pathname + url.search, {
        method: 'GET'
      });
    },
    
    post: (endpoint, data = {}) => {
      return apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    
    put: (endpoint, data = {}) => {
      return apiRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    
    patch: (endpoint, data = {}) => {
      return apiRequest(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(data)
      });
    },
    
    delete: (endpoint) => {
      return apiRequest(endpoint, {
        method: 'DELETE'
      });
    }
  };
  
  export default API_CONFIG;