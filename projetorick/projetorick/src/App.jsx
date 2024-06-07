import React, { useState, useEffect } from 'react';
import './App.css';

// Função principal do componente App
function App() {
  // Definição dos estados usando useState
  const [image, setImage] = useState(''); // Estado para armazenar a URL da imagem do personagem
  const [id, setId] = useState(''); // Estado para armazenar o ID do personagem
  const [name, setName] = useState(''); // Estado para armazenar o nome do personagem
  const [status, setStatus] = useState(''); // Estado para armazenar o status do personagem
  const [species, setSpecies] = useState(''); // Estado para armazenar a espécie do personagem
  const [gender, setGender] = useState(''); // Estado para armazenar o gênero do personagem
  const [origin, setOrigin] = useState(''); // Estado para armazenar a origem do personagem
  const [location, setLocation] = useState(''); // Estado para armazenar a localização atual do personagem
  const [episodes, setEpisodes] = useState([]); // Estado para armazenar a lista de episódios do personagem
  const [loading, setLoading] = useState(false); // Estado para controlar o estado de carregamento

  // Função para buscar informações do personagem na API
  const buscarPer = async (characterId) => {
    setLoading(true); // Define o estado de carregamento como verdadeiro
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/character/${characterId}`);
      if (!response.ok) {
        throw new Error('Personagem não encontrado');
      }
      const data = await response.json();
      // Atualiza os estados com as informações do personagem
      setImage(data.image);
      setId(data.id);
      setName(data.name);
      setStatus(data.status);
      setSpecies(data.species);
      setGender(data.gender);
      setOrigin(data.origin.name);
      setLocation(data.location.name);

      // Busca informações dos episódios do personagem
      const episodePromises = data.episode.map((episodeUrl) => fetch(episodeUrl).then((res) => res.json()));
      const episodeData = await Promise.all(episodePromises);
      setEpisodes(episodeData);
    } catch (error) {
      console.error('Erro ao buscar personagem:', error);
      alert('Personagem não encontrado. Por favor, insira um ID válido.');
    }
    setLoading(false); // Define o estado de carregamento como falso
  };

  // Função para buscar personagem ao pressionar a tecla Enter
  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      await buscarPer(id);
    }
  };

  // Função para buscar o próximo personagem
  const handleNext = async () => {
    const nextId = parseInt(id, 10) + 1;
    await buscarPer(nextId);
  };

  // Função para buscar o personagem anterior
  const handlePrevious = async () => {
    const prevId = parseInt(id, 10) - 1;
    if (prevId > 0) {
      await buscarPer(prevId);
    } else {
      alert('Não há personagens com ID menor que 1.');
    }
  };

  // useEffect para buscar o personagem inicial com ID 1
  useEffect(() => {
    buscarPer(1);
  }, []);

  // Função para determinar a classe de cor do status
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'alive':
        return 'bg-success';
      case 'dead':
        return 'bg-danger';
      case 'unknown':
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="container text-center my-4">
      <div className="row align-items-center mb-4">
        <div className="col-12">
          <img src="/Rick_and_Morty.svg.png" alt="Logo" className="img-fluid" style={{ maxHeight: '150px' }} />
        </div>
      </div>
      <div className="row align-items-center">
        <div className="col">
          <button type="button" className="btn btn-primary" onClick={handlePrevious} disabled={loading || id <= 1}>
            Voltar
          </button>
        </div>
        <div className="col">
          <div className="card" style={{ width: '25rem' }}>
            <div className="position-relative">
              <img src={image} className="card-img-top" alt={name} />
              <span className={`badge ${getStatusClass(status)} position-absolute top-0 end-0 m-2`}>{status}</span>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="EX: 1 to 826"
                  onKeyDown={handleKeyPress}
                  onChange={(e) => setId(e.target.value)}
                />
                <button className="btn btn-primary mt-2" onClick={() => buscarPer(id)} disabled={loading}>
                  {loading ? 'Carregando...' : 'Pesquisar'}
                </button>
              </div>
              <p className="card-text">Id: <input type="text" readOnly value={id} className="form-control" /></p>
              <p className="card-text">Nome: <input type="text" readOnly value={name} className="form-control" /></p>
              <p className="card-text">Status: <input type="text" readOnly value={status} className="form-control" /></p>
              <p className="card-text">Espécie: <input type="text" readOnly value={species} className="form-control" /></p>
              <p className="card-text">Gênero: <input type="text" readOnly value={gender} className="form-control" /></p>
              <p className="card-text">Origem: <input type="text" readOnly value={origin} className="form-control" /></p>
              <p className="card-text">Local: <input type="text" readOnly value={location} className="form-control" /></p>
              <h5 className="card-title mt-4">Episódios:</h5>
              <ul className="list-group">
                {episodes.map((episode) => (
                  <li key={episode.id} className="list-group-item">
                    {episode.name} (S{episode.episode})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="col">
          <button type="button" className="btn btn-primary" onClick={handleNext} disabled={loading}>
            Avançar
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
