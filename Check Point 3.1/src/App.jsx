import { useState, useEffect } from 'react';
import './App.css'; 

const DADOS_MUSICAS_INICIAIS = [
  {
    id: 1,
    titulo: " Que eu Sofra",
    artista: "Baco Exu do Blues ",
    duracao: "3:37",
    favorito: true,
    capaUrl: "/musica1.avif",
  },
  {
    id: 2,
    titulo: "Turning Page",
    artista: "Sleeping At Last",
    duracao: "4:37",
    favorito: false,
    capaUrl: "/musica2.twilight.jpg",
  },
  {
    id: 3,
    titulo: "All The Things She Said",
    artista: " t.A.T.u",
    duracao: "3:47",
    favorito: false,
    capaUrl: "/musicaa3.webp",
  },
  {
    id: 4,
    titulo: "Heavy Is the Crown",
    artista: "Linkin Park",
    duracao: "2:48",
    favorito: true,
    capaUrl: "/musica4.jpg",
  },
  {
    id: 5,
    titulo: "Coisas Que Não Aprendi Contigo",
    artista: "2ZDinizz",
    duracao: "4:24",
    favorito: false,
    capaUrl: "/musica5.jpg",
  },
  {
    id: 6,
    titulo: "Universo",
    artista: " BK",
    duracao: "4:17",
    favorito: false,
    capaUrl: "/musica6.jpg",
  },
  {
    id: 7,
    titulo: "100% MOLHO",
    artista: "Brandão85 e Jovem Dex",
    duracao: "4:52",
    favorito: false,
    capaUrl: "/musica7.jpg",
  },
  {
    id: 8,
    titulo: "Bohemian Rhapsody",
    artista: " Queen ",
    duracao: "6:00",
    favorito: false,
    capaUrl: "/musica8.jpg",
  },
  {
    id: 9,
    titulo: "Dharma",
    artista: " Ajuliacosta e Maffalda",
    duracao: "2:18",
    favorito: false,
    capaUrl: "/musica9.jpg",
  },
  {
    id: 10,
    titulo: "Sozinho",
    artista: " Caetano Veloso",
    duracao: "2:44",
    favorito: false,
    capaUrl: "/musica10.jpg",
  },
  {
    id: 11,
    titulo: "Botando Botando",
    artista: "Mc Reino",
    duracao: "2:20",
    favorito: false,
    capaUrl: "/musica11.jpg",
  },
  {
    id: 12,
    titulo:"Eu Vou Te Machucar Eu Vou Te Maltratar",
    artista: " DJ 2K, DJ JL O Único",
    duracao: "2:51",
    favorito: false,
    capaUrl: "/musica12.jpg",
  },
];

const DADOS_PLAYLISTS_INICIAIS = [
  { id: 1, nome: "Músicas Curtidas", musicas: [] },
  { id: 2, nome: "Rock Nacional", musicas: [] },
  { id: 3, nome: "Foco", musicas: [] },
  { id: 4, nome: "Relax", musicas: [] },
];

const CircularImage = ({ src, alt, size = 70, className = "" }) => (
  <img
    src={src || "https://via.placeholder.com/40"}
    alt={alt}
    className={`circular-image ${className}`}
    style={{ width: size, height: size, marginRight: "15px" }}
  />
);

const Header = ({ busca, setBusca }) => (
  <div className="header">
    <h2>Sua Biblioteca</h2>
    <input
      type="text"
      placeholder="Buscar música ou artista..."
      value={busca}
      onChange={(e) => setBusca(e.target.value)}
      className="search-input"
    />
  </div>
);

const ListaMusicas = ({
  musicas,
  musicaAtual,
  handleSetMusica,
  handleToggleFavorito,
  adicionarMusicaAPlaylist,
  playlists,
}) => {
  const [menuAbertoId, setMenuAbertoId] = useState(null); 

  return (
    <div className="music-library">
      <h3>Músicas para você</h3>
      <div className="music-list">
        {musicas.map((m) => (
          <div
            key={m.id}
            onClick={() => handleSetMusica(m)}
            className={`music-item ${musicaAtual.id === m.id ? "active" : ""}`}
            style={{ position: 'relative' }} 
          >
            <CircularImage src={m.capaUrl} alt={m.titulo} size={50} />

            <div className="music-details">
              <p className="title">{m.titulo}</p>
              <p className="artist">{m.artista}</p>
            </div>
            
            <span
              onClick={(e) => {
                e.stopPropagation();
                handleToggleFavorito(m.id);
              }}
              className={`favorite-star ${m.favorito ? "is-favorite" : ""}`}
            >
              {m.favorito ? "★" : "☆"}
            </span>
          
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuAbertoId(menuAbertoId === m.id ? null : m.id); 
              }}
              style={{ marginLeft: '10px', background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2em' }}
            >
              ...
            </button>
            {menuAbertoId === m.id && (
              <div
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '60px',
                  zIndex: 10,
                  backgroundColor: '#282828',
                  border: '1px solid #444',
                  borderRadius: '5px',
                  padding: '5px 0',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
                  minWidth: '150px'
                }}
              >
                <p style={{ margin: '0 10px', fontSize: '0.8em', color: '#b3b3b3' }}>Adicionar a:</p>
                {playlists.map(p => (
                  <div
                    key={p.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      adicionarMusicaAPlaylist(m, p.id);
                      setMenuAbertoId(null); 
                    }}
                    style={{ padding: '8px 10px', cursor: 'pointer', fontSize: '0.9em' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3e3e3e'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {p.nome}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {musicas.length === 0 && (
          <p className="text-gray">Nenhuma música encontrada.</p>
        )}
      </div>
    </div>
  );
};
const Playlists = ({ playlists, handleAddPlaylist }) => (
  <div className="playlists">
    <h3>Suas Playlists</h3>
    <div className="playlist-list">
      {playlists.map((p) => (
        <p key={p.id}>{p.nome}</p> 
      ))}
    </div>
    <button onClick={handleAddPlaylist} className="playlist-button">
      + Criar Nova Playlist
    </button>
  </div>
);

const Player = ({ musicaAtual, isPlaying, progresso, handlePlayPause, proximaMusica, musicaAnterior }) => {
  const [volume, setVolume] = useState(70);

  return (
    <div className="music-player">
      <div className="player-info">
        <CircularImage
          src={musicaAtual.capaUrl}
          alt={musicaAtual.titulo}
          size={55} 
        />
        <div>
          <p className="title">{musicaAtual.titulo}</p>
          <p className="artist">{musicaAtual.artista}</p>
        </div>
      </div>

      <div className="player-controls">
        <div className="control-buttons">
          <button onClick={musicaAnterior}>⏪</button>
          <button onClick={handlePlayPause} className="play-pause-button">
            {isPlaying ? "❚❚" : "▶"}
          </button>
          <button onClick={proximaMusica}>⏩</button>
        </div>

        <div className="progress-container">
          <span>0:00</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progresso}%` }} />
          </div>
          <span>{musicaAtual.duracao}</span>
        </div>
      </div>

      <div className="volume-control">
        <span>🔊</span>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

const SpotifyClone = () => {
  const [todasAsMusicas, setTodasAsMusicas] = useState(DADOS_MUSICAS_INICIAIS);
  const [indiceMusica, setIndiceMusica] = useState(0);
  const musicaAtual = todasAsMusicas[indiceMusica]; 

  const [isPlaying, setIsPlaying] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [playlists, setPlaylists] = useState(DADOS_PLAYLISTS_INICIAIS);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgresso((prev) => (prev < 100 ? prev + 1 : 0));
      }, 500);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleSetMusica = (musica) => {
    const novoIndice = todasAsMusicas.findIndex(m => m.id === musica.id);
    setIndiceMusica(novoIndice);
    setProgresso(0);
    setIsPlaying(true);
  };

  const proximaMusica = () => {
    setIndiceMusica((prevIndice) => (prevIndice + 1) % todasAsMusicas.length);
    setProgresso(0); 
    setIsPlaying(true);
  };

  const musicaAnterior = () => {
    const totalMusicas = todasAsMusicas.length;
    const anteriorIndice = (indiceMusica - 1 + totalMusicas) % totalMusicas;
    setIndiceMusica(anteriorIndice);
    setProgresso(0); 
    setIsPlaying(true);
  };

  const handleToggleFavorito = (id) => {
    const novaLista = todasAsMusicas.map((musica) => {
      if (musica.id === id) {
        const novoEstadoFavorito = !musica.favorito;

        if (musicaAtual.id === id) {
          setIndiceMusica((prevIndice) => prevIndice); 
        }

        return { ...musica, favorito: novoEstadoFavorito };
      }
      return musica;
    });

    setTodasAsMusicas(novaLista);
  };

  const handleAddPlaylist = () => {
    const nome = prompt("Digite o nome da nova playlist:");
    if (nome && nome.trim() !== "") {
      const novaPlaylist = {
        id: Date.now(),
        nome: nome.trim(),
        musicas: [],
      };
      setPlaylists((prev) => [...prev, novaPlaylist]);
    }
  };

  const adicionarMusicaAPlaylist = (musica, playlistId) => {
      const playlistsAtualizadas = playlists.map(playlist => {
          if (playlist.id === playlistId) {
              const musicaExiste = playlist.musicas.some(m => m.id === musica.id);
              
              if (!musicaExiste) {
                  return { ...playlist, musicas: [...playlist.musicas, musica] };
              } else {
                  alert(`"${musica.titulo}" já está na playlist "${playlist.nome}"!`);
                  return playlist;
              }
          }
          return playlist;
      });
      
      setPlaylists(playlistsAtualizadas);
      alert(`Música "${musica.titulo}" adicionada à playlist!`);
  };

  const musicasFiltradas = todasAsMusicas.filter(
    (musica) =>
      musica.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      musica.artista.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="spotify-app">
      <div className="main-content">
        <div className="sidebar">
          <div className="sidebar-header">
            <CircularImage src="/musa.jpg" alt="MUSA" size={90} />
            <h1>MUSA </h1>
          </div>

          <div className="sidebar-nav">
            <p>🏠 Início</p>
            <p>🔍 Buscar</p>
          </div>

          <hr />

          <Playlists
            playlists={playlists}
            handleAddPlaylist={handleAddPlaylist}
          />
        </div>

        <div className="library">
          <Header busca={busca} setBusca={setBusca} />
          <ListaMusicas
            musicas={musicasFiltradas}
            musicaAtual={musicaAtual}
            handleSetMusica={handleSetMusica}
            handleToggleFavorito={handleToggleFavorito}
            adicionarMusicaAPlaylist={adicionarMusicaAPlaylist}
            playlists={playlists}
          />
        </div>
      </div>

      <Player
        musicaAtual={musicaAtual}
        isPlaying={isPlaying}
        progresso={progresso}
        handlePlayPause={handlePlayPause}
        proximaMusica={proximaMusica}
        musicaAnterior={musicaAnterior}
      />
    </div>
  );
};

export default SpotifyClone;