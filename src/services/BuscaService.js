// src/services/buscaService.js
const API_BASE_URL = 'http://localhost:8082';

class BuscaService {
  
  // Obter token de autenticação
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Busca geral por termo
  async buscarGeral(termo, opcoes = {}) {
    const { 
      latitude = null, 
      longitude = null, 
      raioKm = 10, 
      page = 0, 
      size = 20 
    } = opcoes;

    const params = new URLSearchParams({
      termo,
      page: page.toString(),
      size: size.toString(),
      raioKm: raioKm.toString()
    });

    if (latitude && longitude) {
      params.append('latitude', latitude.toString());
      params.append('longitude', longitude.toString());
    }

    try {
      const response = await fetch(`${API_BASE_URL}/busca/geral?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Erro na busca: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na busca geral:', error);
      throw error;
    }
  }

  // Busca por categoria
  async buscarPorCategoria(categoria, opcoes = {}) {
    const { 
      latitude = null, 
      longitude = null, 
      raioKm = 10, 
      page = 0, 
      size = 20 
    } = opcoes;

    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      raioKm: raioKm.toString()
    });

    if (latitude && longitude) {
      params.append('latitude', latitude.toString());
      params.append('longitude', longitude.toString());
    }

    try {
      const response = await fetch(`${API_BASE_URL}/busca/categoria/${categoria}?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Erro na busca por categoria: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na busca por categoria:', error);
      throw error;
    }
  }

  // Busca com filtros avançados
  async buscarComFiltros(filtros, opcoes = {}) {
    const { page = 0, size = 20 } = opcoes;

    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    });

    try {
      const response = await fetch(`${API_BASE_URL}/busca/filtros?${params}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(filtros)
      });

      if (!response.ok) {
        throw new Error(`Erro na busca com filtros: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na busca com filtros:', error);
      throw error;
    }
  }

  // Buscar fornecedores próximos
  async buscarProximos(latitude, longitude, opcoes = {}) {
    const { raioKm = 5, limite = 20 } = opcoes;

    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      raioKm: raioKm.toString(),
      limite: limite.toString()
    });

    try {
      const response = await fetch(`${API_BASE_URL}/busca/proximos?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Erro na busca de próximos: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na busca de próximos:', error);
      throw error;
    }
  }

  // Obter sugestões para autocomplete
  async obterSugestoes(termo, limite = 8) {
    if (!termo || termo.length < 2) {
      return [];
    }

    const params = new URLSearchParams({
      termo,
      limite: limite.toString()
    });

    try {
      const response = await fetch(`${API_BASE_URL}/busca/sugestoes?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Erro ao obter sugestões: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao obter sugestões:', error);
      return [];
    }
  }

  // Listar categorias disponíveis
  async listarCategorias() {
    try {
      const response = await fetch(`${API_BASE_URL}/busca/categorias`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Erro ao listar categorias: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao listar categorias:', error);
      throw error;
    }
  }

  // Converter categoria do front-end para back-end
  converterCategoriaParaBackend(categoria) {
    const mapping = {
      'hamburgueria': 'HAMBURGUERIA',
      'comida-japonesa': 'COMIDAJAPONESA',
      'pizzaria': 'PIZZARIA',
      'acai': 'ACAI',
      'bebidas': 'BEBIDA'
    };
    
    return mapping[categoria] || categoria.toUpperCase();
  }

  // Converter categoria do back-end para front-end
  converterCategoriaParaFrontend(categoria) {
    const mapping = {
      'HAMBURGUERIA': 'hamburgueria',
      'COMIDAJAPONESA': 'comida-japonesa',
      'PIZZARIA': 'pizzaria',
      'ACAI': 'acai',
      'BEBIDA': 'bebidas'
    };
    
    return mapping[categoria] || categoria.toLowerCase();
  }
}

export default new BuscaService();