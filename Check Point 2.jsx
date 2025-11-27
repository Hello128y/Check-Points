import React, { createContext, useState, useContext } from 'react';
import './app.css';

const GameContext = createContext();

const initialGameState = {
  attributePoints: 10,
  attributes: {
    forca: 0, 
    resistencia: 0, 
    inteligencia: 0, 
    sorte: 0, 
  },
  hp: 100,
  maxHp: 100,
  mana: 50, 
  maxMana: 50,
  xp: 0,
  level: 1,
  xpToNextLevel: 300,
  inventory: ['espada velha', 'poção de cura', 'mapa rasgado'],
  isInventoryOpen: false,
  activeStatusEffects: ['Envenenado', 'Abençoado'],

  missions: [
    { id: 1, name: 'Derrotar o Golem de Lama', category: 'Principal', completed: false },
    { id: 2, name: 'Coletar 5 Ervas', category: 'Secundária', completed: false },
  ],
  missionsCompletedCount: 0,

  gold: 50,
  shopItems: [
    { name: 'Poção de Vida', price: 15, effect: 'Cura +10 HP' }, 
    { name: 'Amuleto da Sorte', price: 50, effect: '+1 Sorte' }
  ],
  isShopOpen: false,
  characterName: "HERÓI DESCONHECIDO",
  race: 'Humano',
  class: 'Guerreiro',
  
  companions: [
    { name: 'Lisa', level: 3, class: 'Mago', xp: 450 },
    { name: 'Grom', level: 5, class: 'Arqueiro', xp: 1000 },
  ],
};

const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState(initialGameState);

  const usePotion = () => {
    if (gameState.inventory.includes('poção de cura') && gameState.hp < gameState.maxHp) {
      setGameState(prev => ({
        ...prev,
        hp: Math.min(prev.maxHp, prev.hp + 10),
        inventory: prev.inventory.filter((item, index) => index !== prev.inventory.indexOf('poção de cura')),
      }));
    }
  };

  const takeDamage = (damage = 15) => {
    setGameState(prev => ({
      ...prev,
      hp: Math.max(0, prev.hp - damage),
    }));
  };


  const completeMission = (missionId) => {
    setGameState(prev => {
      let newXp = prev.xp + 100; 
      let newGold = prev.gold + 25; 
      let newLevel = prev.level;
      let xpRemainder = 0;

      if (newXp >= prev.xpToNextLevel) {
        newLevel += 1;
        xpRemainder = newXp - prev.xpToNextLevel; 
        newXp = xpRemainder;
      }

      const updatedMissions = prev.missions.map(m => 
        m.id === missionId ? { ...m, completed: true } : m
      ).filter(m => !m.completed);
       return {
        ...prev,
        xp: newXp,
        level: newLevel,
        gold: newGold,
        missions: updatedMissions,
        missionsCompletedCount: prev.missionsCompletedCount + 1,
      };
    });
  };

  const buyItem = (itemName, cost) => {
    if (gameState.gold >= cost) {
      setGameState(prev => ({
        ...prev,
        gold: prev.gold - cost,
        inventory: [...prev.inventory, itemName],
      }));
      return true;
    }
    return false;
  };
  
  const adjustAttribute = (attribute, value) => {
    setGameState(prev => {
        const currentPoints = prev.attributePoints;
        const currentAttributeValue = prev.attributes[attribute];
        
        if ((value > 0 && currentPoints > 0) || (value < 0 && currentAttributeValue > 0)) {
            return {
                ...prev,
                attributePoints: currentPoints - value,
                attributes: {
                    ...prev.attributes,
                    [attribute]: currentAttributeValue + value,
                },
            };
        }
        return prev;
    });
  };

  const contextValue = {
    gameState,
    setGameState,
    usePotion,
    takeDamage,
    completeMission,
    buyItem,
    adjustAttribute,
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

const useGame = () => useContext(GameContext);

const HPBar = ({ current, max }) => {
    const percent = (current / max) * 100;
    let colorClass = 'hp-red';
    if (percent > 70) colorClass = 'hp-green'; 
    else if (percent >= 30) colorClass = 'hp-yellow'; 

    return (
        <div className="hp-bar-container">
            <div className={`hp-bar-fill ${colorClass}`} style={{ width: `${percent}%` }}>
                {current} / {max} HP
            </div>
        </div>
    );
};

function HeroStatus() {
  const { gameState, usePotion, takeDamage } = useGame();
  const { hp, maxHp, xp, gold, level, characterName } = gameState;
  
  return (
    <div className="status-box hero-status-panel">
      <h3>{characterName.toUpperCase()} - Nível {level}</h3> 
      <p>Vida:</p>
      <HPBar current={hp} max={maxHp} />
      <p>XP: {xp} / {gameState.xpToNextLevel} (Progresso: {(xp / gameState.xpToNextLevel * 100).toFixed(0)}%)</p>
      <div className="hp-bar-container" style={{ height: '10px' }}><div className="hp-bar-fill hp-green" style={{ width: `${(xp / gameState.xpToNextLevel * 100)}%` }}></div></div>
         <p>Ouro:{gold} 💰</p>
      
      <div className="controls">
        <button onClick={usePotion} disabled={!gameState.inventory.includes('poção de cura') || hp >= maxHp}>Usar Poção (+10 HP)</button> 
        <button onClick={() => takeDamage(15)}>Sofrer Dano (-15 HP)</button>
      </div>
    </div>
  );
}

function AttributeSystem() {
  const { gameState, adjustAttribute } = useGame();
  const { attributePoints, attributes } = gameState;

  const attributeList = [
    { key: 'forca', label: 'Força', effect: 'afeta dano' },
    { key: 'resistencia', label: 'Resistência', effect: 'afeta vida' },
    { key: 'inteligencia', label: 'Inteligência', effect: 'afeta mana' },
    { key: 'sorte', label: 'Sorte', effect: 'afeta críticos' },
  ];

  return (
    <div className="status-box attribute-panel">
      <h4>Sistema de Atributos</h4>
      
      <p style={{ fontWeight: 'bold' }}>
        Pontos para distribuir (inicia com 10 pontos): {attributePoints}
      </p>

      {attributeList.map(attr => (
        <div key={attr.key} className="attribute-item">
          
          <span style={{ minWidth: '150px' }}>
            {attr.label} ({attr.effect}): {attributes[attr.key]}
          </span>
          <button 
            onClick={() => adjustAttribute(attr.key, -1)} 
            disabled={attributes[attr.key] <= 0} 
          >
            -
          </button>
          <button 
            onClick={() => adjustAttribute(attr.key, 1)} 
            disabled={attributePoints <= 0}
          >
            +
          </button>
        </div>
      ))}
    </div>
  );
}

function MissionLog() {
  const { gameState, completeMission, setGameState } = useGame();
  const [newMissionName, setNewMissionName] = useState('');
  const [newMissionCategory, setNewMissionNameCategory] = useState('Secundária');

  const addMission = () => {
    if (newMissionName.trim() === '') return;

    const newMission = {
      id: Date.now(), 
      name: newMissionName.trim(),
      category: newMissionCategory, 
      completed: false,
    };

    setGameState(prev => ({
      ...prev,
      missions: [...prev.missions, newMission],
    }));

    setNewMissionName('');
  };

  const isLogOpen = gameState.isInventoryOpen; 
  return (
    <div className="status-box mission-log-panel">
      <button onClick={() => setGameState(prev => ({...prev, isInventoryOpen: !prev.isInventoryOpen}))}>
        {isLogOpen ? 'Esconder Diário' : 'Mostrar Diário'}
      </button>

      {isLogOpen && (
        <>
          <h4>Diário de Missões</h4>
      
          <p>🎯 Missões Concluídas: {gameState.missionsCompletedCount}</p>
          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <input
              type="text"
              value={newMissionName}
              onChange={(e) => setNewMissionName(e.target.value)}
              placeholder="Nome da Nova Missão"
            />
            <select value={newMissionCategory} onChange={(e) => setNewMissionNameCategory(e.target.value)}>
              <option>Principal</option>
              <option>Secundária</option>
              <option>Urgente</option>
            </select>
            <button onClick={addMission}>Adicionar</button>
          </div>
          <div className="mission-list">
            {gameState.missions.map((mission) => (
              <div key={mission.id} className="mission-item">
                <span>
                  [{mission.category}] {mission.name}
                </span>
                <button 
                  onClick={() => completeMission(mission.id)} 
                  title="Concluir e ganhar +100 XP e +25 Ouro"
                >
                  ✅
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function HeroRanking() {
  const { gameState, setGameState } = useGame();

  const rankedCompanions = [...gameState.companions]
    .sort((a, b) => {
      if (b.level !== a.level) return b.level - a.level;
      return b.xp - a.xp; 
    });

  const editLevel = (name, amount) => {
    setGameState(prev => ({
      ...prev,
      companions: prev.companions.map(c => 
        c.name === name ? { ...c, level: Math.max(1, c.level + amount) } : c
      ),
    }));
  };

  return (
    <div className="status-box ranking-panel">
      <h4>Ranking dos Heróis</h4>
      
      <ol>

        {rankedCompanions.map((hero, index) => (
          <li key={index} style={{ margin: '8px 0', fontWeight: index === 0 ? 'bold' : 'normal' }}>
            {index + 1}. {hero.name} ({hero.class}) - Nível {hero.level}
            
            <button onClick={() => editLevel(hero.name, 1)} title="Editar níveis em tempo real">+ Level</button>
            <button onClick={() => editLevel(hero.name, -1)} disabled={hero.level <= 1}>- Level</button>
          </li>
        ))}
      </ol>
      <p style={{fontSize:'small'}}>Classes específicas: Guerreiro, Mago, Arqueiro</p>
    </div>
  );
}

function Inventory() {
  const { gameState, setGameState } = useGame();
  const { inventory, isInventoryOpen, activeStatusEffects } = gameState;

  const toggleInventory = () => {
    setGameState(prev => ({
      ...prev,
      isInventoryOpen: !prev.isInventoryOpen,
    }));
  };

  const [showEffects, setShowEffects] = React.useState(false); 
  return (
    <div className="status-box inventory-panel">
  
      <button onClick={toggleInventory}>
        {isInventoryOpen ? 'Fechar Mochila 🎒' : 'Abrir Mochila 🎒'}
      </button>
      {!isInventoryOpen && <p>Inventário Fechado.</p>}
      {isInventoryOpen && (
        <div className="inventory-content">
          <h4>Lista de Itens (quando aberta)</h4>
          <ul>
            {inventory.length > 0 ? (
              inventory.map((item, index) => <li key={index}>⭐ {item}</li>)
            ) : (
              <li>Mochila vazia!</li>
            )}
          </ul>
          <hr/>
          <button onClick={() => setShowEffects(!showEffects)}>
            {showEffects ? 'Esconder' : 'Mostrar'} Status Effects
          </button>
          {showEffects && (
            <div className="status-effects">
              <p>Efeitos Ativos:</p>
              <ul>
                {activeStatusEffects.map((effect, index) => (
                  <li key={index} style={{ color: effect === 'Envenenado' ? 'red' : 'lightgreen' }}>{effect}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Shop() {
  const { gameState, buyItem, setGameState } = useGame();
  const { shopItems, gold, isShopOpen } = gameState;

  const toggleShop = () => {
    setGameState(prev => ({
      ...prev,
      isShopOpen: !prev.isShopOpen,
    }));
  };

  const handleBuy = (item) => {
    const success = buyItem(item.name, item.price);
    if (!success) {
      alert(`Ouro insuficiente para comprar ${item.name}!`);
    }
  };

  if (!isShopOpen) {
    return <button onClick={toggleShop}>Abrir Loja 🛍️</button>;
  }

  return (
    <div className="status-box shop-panel">
      <h4>Loja: Componente show/hide</h4>
      <p>Seu Ouro: {gold} 💰</p>
      <button onClick={toggleShop}>Fechar Loja</button>
      
      <div className="item-list">
        {shopItems.map((item, index) => (
          <div key={index}>
            <strong>{item.name}</strong> - Custo: {item.price} Ouro
            <button 
              onClick={() => handleBuy(item)} 
              disabled={gold < item.price}
            >
              Comprar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CharacterPanel() {
  const { gameState, setGameState } = useGame();
  const { characterName, race, class: charClass } = gameState;
  const [magicWord, setMagicWord] = useState('');
  const [enchantment, setEnchantment] = useState('...');
  
  const isNameValid = characterName.length > 2;

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setGameState(prev => ({
      ...prev,
      characterName: newName,
    }));
  };

  const handleSelectChange = (key, value) => {
    setGameState(prev => ({
      ...prev,
      [key]: value,
    }));
  };
  
  const generateEnchantment = () => {
    if (magicWord.length === 0) {
        setEnchantment("Digite uma palavra!");
        return;
    }
    const inverted = magicWord.split('').reverse().join('');
    const capitalized = inverted.charAt(0).toUpperCase() + inverted.slice(1);
    const newEnchantment = `${capitalized} Rúnicus`; 
    setEnchantment(newEnchantment);
  };
  
  const formattedName = characterName.toUpperCase() || "HERÓI DESCONHECIDO";

  return (
    <div className="status-box character-panel">
      <h4>Painel do Personagem</h4>
      
      <label>Nome do Personagem: </label>
      <input 
        type="text" 
        value={characterName} 
        onChange={handleNameChange} 
        placeholder="Aparece como título"
        style={{ borderColor: isNameValid ? '#556B2F' : '#CC0000' }} 
      />
      <h5>Título: {formattedName}</h5>

      <div style={{ margin: '10px 0' }}>
        <label>Raça: </label>
        <select value={race} onChange={(e) => handleSelectChange('race', e.target.value)}>
          <option>Humano</option><option>Elfo</option><option>Anão</option>
        </select>

        <label style={{ marginLeft: '15px' }}>Classe: </label>
        <select value={charClass} onChange={(e) => handleSelectChange('class', e.target.value)}>
          <option>Guerreiro</option><option>Mago</option><option>Arqueiro</option>
        </select>
      </div>
      <hr/>
      <h5>Gerador de Encantamentos</h5>
      <input 
        type="text" 
        value={magicWord} 
        onChange={(e) => setMagicWord(e.target.value)}
        placeholder="Input para palavra mágica base"
      />
      <button onClick={generateEnchantment}>Gerar Encantamento</button>
      
      <p>Encantamento Gerado: {enchantment}</p>
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <div className="rpg-app">
        <h1>⭐RPG Boladão ⭐</h1>
        <CharacterPanel /> 
        
        <div className="main-layout">
          <div className="status-box-group">
             <HeroStatus /> 
             <AttributeSystem /> 
          </div>
          <div className="status-box-group">
             <MissionLog /> 
             <HeroRanking /> 
          </div>
        </div>
        
        <div className="main-layout" style={{ marginTop: '20px' }}>
            <Inventory /> 
            <Shop /> 
        </div>
      </div>
    </GameProvider>
  );
}

export default App;