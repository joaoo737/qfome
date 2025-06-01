import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import StoreCard from '../../components/StoreCard/StoreCard';
import { categoryConfig } from '../../utils/categoryConfig';
import { useAuth } from '../../context/AuthContext';
import './Category.css';

const Category = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtroOrdem, setFiltroOrdem] = useState('');
  
  const categoryInfo = categoryConfig[categoryId];

  useEffect(() => {
    if (!categoryInfo) {
      navigate('/');
      return;
    }

    document.title = `${categoryInfo.name} - Delivery App`;
    loadCategoryStores(categoryId);
  }, [categoryId, categoryInfo, navigate]);

  const loadCategoryStores = async (category) => {
    setIsLoading(true);
    
    // Simular delay de carregamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Dados de exemplo de lojas baseados na categoria
    const mockStores = {
      acai: [
        {
          id: 1,
          nome: 'Açaí do João',
          descricao: 'Os melhores açaís da região com frutas frescas',
          imagem: 'https://via.placeholder.com/300x180/8e24aa/ffffff?text=Açaí+do+João',
          categoria: 'acai',
          avaliacao: 4.8,
          tempoEntrega: 25,
          taxaEntrega: 3.99,
          promocao: '20% OFF',
          cupom: 'Frete grátis acima de R$ 30'
        },
        {
          id: 2,
          nome: 'Açaí Premium',
          descricao: 'Açaí artesanal com ingredientes selecionados',
          imagem: 'https://via.placeholder.com/300x180/8e24aa/ffffff?text=Açaí+Premium',
          categoria: 'acai',
          avaliacao: 4.9,
          tempoEntrega: 30,
          taxaEntrega: 0,
          cupom: 'Desconto de R$ 5 na primeira compra'
        },
        {
          id: 3,
          nome: 'Açaí & Cia',
          descricao: 'Variedade de açaís e vitaminas naturais',
          imagem: 'https://via.placeholder.com/300x180/8e24aa/ffffff?text=Açaí+%26+Cia',
          categoria: 'acai',
          avaliacao: 4.6,
          tempoEntrega: 20,
          taxaEntrega: 2.50
        },
        {
          id: 4,
          nome: 'Açaí Express',
          descricao: 'Entrega rápida de açaí gelado',
          imagem: 'https://via.placeholder.com/300x180/8e24aa/ffffff?text=Açaí+Express',
          categoria: 'acai',
          avaliacao: 4.7,
          tempoEntrega: 15,
          taxaEntrega: 4.99,
          promocao: 'Entrega grátis'
        }
      ],
      hamburgueria: [
        {
          id: 5,
          nome: 'Burger House',
          descricao: 'Hambúrgueres artesanais com ingredientes frescos',
          imagem: 'https://via.placeholder.com/300x180/ff8c00/ffffff?text=Burger+House',
          categoria: 'hamburgueria',
          avaliacao: 4.9,
          tempoEntrega: 35,
          taxaEntrega: 5.99,
          promocao: 'Combo especial',
          cupom: '2 hambúrgueres pelo preço de 1'
        },
        {
          id: 6,
          nome: 'Smash Burger',
          descricao: 'Hambúrgueres smash com carne premium',
          imagem: 'https://via.placeholder.com/300x180/ff8c00/ffffff?text=Smash+Burger',
          categoria: 'hamburgueria',
          avaliacao: 4.8,
          tempoEntrega: 40,
          taxaEntrega: 0,
          cupom: 'Frete grátis acima de R$ 50'
        }
      ],
      'comida-japonesa': [
        {
          id: 7,
          nome: 'Sushi Master',
          descricao: 'Sushi e sashimi frescos preparados na hora',
          imagem: 'https://via.placeholder.com/300x180/7cb342/ffffff?text=Sushi+Master',
          categoria: 'comida-japonesa',
          avaliacao: 4.9,
          tempoEntrega: 45,
          taxaEntrega: 7.99,
          cupom: '10% OFF em combos'
        }
      ],
      pizzaria: [
        {
          id: 8,
          nome: 'Pizza Bella',
          descricao: 'Pizzas tradicionais e gourmet em forno a lenha',
          imagem: 'https://via.placeholder.com/300x180/8e24aa/ffffff?text=Pizza+Bella',
          categoria: 'pizzaria',
          avaliacao: 4.7,
          tempoEntrega: 50,
          taxaEntrega: 6.99,
          promocao: 'Pizza gigante'
        }
      ],
      bebidas: [
        {
          id: 9,
          nome: 'Drinks & More',
          descricao: 'Sucos naturais, refrigerantes e bebidas especiais',
          imagem: 'https://via.placeholder.com/300x180/ffa726/ffffff?text=Drinks+%26+More',
          categoria: 'bebidas',
          avaliacao: 4.5,
          tempoEntrega: 20,
          taxaEntrega: 2.99
        }
      ]
    };

    setStores(mockStores[category] || []);
    setIsLoading(false);
  };

  const sortStores = (stores, ordem) => {
    const storesCopy = [...stores];
    
    switch(ordem) {
      case 'avaliacao':
        return storesCopy.sort((a, b) => (b.avaliacao || 0) - (a.avaliacao || 0));
      case 'tempo':
        return storesCopy.sort((a, b) => a.tempoEntrega - b.tempoEntrega);
      case 'taxa':
        return storesCopy.sort((a, b) => a.taxaEntrega - b.taxaEntrega);
      case 'alfabetica':
        return storesCopy.sort((a, b) => a.nome.localeCompare(b.nome));
      default:
        return storesCopy;
    }
  };

  const storesFiltradas = sortStores(stores, filtroOrdem);

  if (!categoryInfo) {
    return null;
  }

  return (
    <div className="category-page">
      <Navbar />
      
      <div className="category-content">
        <div 
          className="category-header"
          style={{ background: categoryInfo.gradient }}
        >
          <div className="category-header-content">
            <span className="category-icon">{categoryInfo.icon}</span>
            <h1>{categoryInfo.name}</h1>
            <p>Descubra as melhores lojas da categoria</p>
          </div>
        </div>

        <div className="stores-section">
          <div className="stores-container">
            <div className="stores-header">
              <h2>Lojas Disponíveis</h2>
              
              <div className="stores-filters">
                <select 
                  value={filtroOrdem} 
                  onChange={(e) => setFiltroOrdem(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Ordenar por</option>
                  <option value="avaliacao">Melhor avaliação</option>
                  <option value="tempo">Menor tempo</option>
                  <option value="taxa">Menor taxa</option>
                  <option value="alfabetica">A-Z</option>
                </select>
              </div>
            </div>
            
            {isLoading ? (
              <div className="loading-stores">
                <div className="loading-spinner"></div>
                <p>Carregando lojas...</p>
              </div>
            ) : storesFiltradas.length > 0 ? (
              <div className="stores-grid">
                {storesFiltradas.map(store => (
                  <StoreCard 
                    key={store.id} 
                    store={store}
                    isLoggedIn={isLoggedIn}
                  />
                ))}
              </div>
            ) : (
              <div className="no-stores">
                <p>Nenhuma loja encontrada nesta categoria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Category;
