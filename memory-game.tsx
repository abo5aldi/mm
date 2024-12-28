import { useState, useEffect } from 'react';

const symbols = ['🌟', '🎈', '🎨', '🎭', '🎪', '🎯', '🎲', '🎮', '🎸', '🎺'];
const cards = [...symbols, ...symbols];

const MemoryGame = () => {
  const [shuffledCards, setShuffledCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [showAllCards, setShowAllCards] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffled = [...cards]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
      }));
    setShuffledCards(shuffled);
  };

  const handleCardClick = (index) => {
    if (
      showAllCards ||
      selectedCards.length === 2 ||
      shuffledCards[index].isFlipped ||
      matchedPairs.includes(shuffledCards[index].symbol)
    ) {
      return;
    }

    const newCards = [...shuffledCards];
    newCards[index].isFlipped = true;
    setShuffledCards(newCards);

    const newSelected = [...selectedCards, { index, symbol: shuffledCards[index].symbol }];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setTimeout(checkMatch, 1000);
    }
  };

  const checkMatch = () => {
    const [first, second] = selectedCards;
    if (first.symbol === second.symbol) {
      setMatchedPairs([...matchedPairs, first.symbol]);
      setScores({
        ...scores,
        [`player${currentPlayer}`]: scores[`player${currentPlayer}`] + 10,
      });
    } else {
      const newCards = [...shuffledCards];
      newCards[first.index].isFlipped = false;
      newCards[second.index].isFlipped = false;
      setShuffledCards(newCards);
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
    setSelectedCards([]);
  };

  const toggleShowCards = () => {
    setShowAllCards(!showAllCards);
  };

  const switchPlayer = () => {
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  };

  const addPoints = (player, points) => {
    setScores(prev => ({
      ...prev,
      [`player${player}`]: Math.max(0, prev[`player${player}`] + points)
    }));
  };

  const resetGame = () => {
    setShuffledCards([]);
    setSelectedCards([]);
    setMatchedPairs([]);
    setScores({ player1: 0, player2: 0 });
    setCurrentPlayer(1);
    setShowAllCards(false);
    initializeGame();
  };

  return (
    <div 
      className="min-h-screen p-4"
      style={{
        backgroundImage: `url('/api/placeholder/1920/1080')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 rounded-lg shadow-xl p-6">
          <div className="mb-4 text-center">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">لعبة الذاكرة</h1>
            
            <div className="flex justify-center gap-8 mb-4">
              <div className="flex flex-col items-center gap-2">
                <div className={`p-3 rounded-lg ${currentPlayer === 1 ? 'bg-blue-100/90' : 'bg-gray-100/90'} shadow`}>
                  <div className="font-bold mb-1">اللاعب 1</div>
                  <div className="text-xl">{scores.player1} نقطة</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => addPoints(1, 10)}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    +10
                  </button>
                  <button
                    onClick={() => addPoints(1, -10)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    -10
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <div className={`p-3 rounded-lg ${currentPlayer === 2 ? 'bg-blue-100/90' : 'bg-gray-100/90'} shadow`}>
                  <div className="font-bold mb-1">اللاعب 2</div>
                  <div className="text-xl">{scores.player2} نقطة</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => addPoints(2, 10)}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    +10
                  </button>
                  <button
                    onClick={() => addPoints(2, -10)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    -10
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mb-4 text-lg font-semibold text-gray-700">
              دور اللاعب {currentPlayer}
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={toggleShowCards}
              className={`px-4 py-2 rounded-lg shadow transition-colors ${
                showAllCards 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-purple-500 hover:bg-purple-600'
              } text-white`}
            >
              {showAllCards ? 'إخفاء البطاقات' : 'إظهار البطاقات'}
            </button>
            <button
              onClick={switchPlayer}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600 transition-colors"
            >
              تبديل اللاعب
            </button>
            <button
              onClick={resetGame}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors"
            >
              لعبة جديدة
            </button>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {shuffledCards.map((card, index) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(index)}
                className={`aspect-square text-3xl flex items-center justify-center rounded-lg shadow-lg
                  ${card.isFlipped || showAllCards ? 'bg-white' : 'bg-blue-500'} 
                  ${matchedPairs.includes(card.symbol) ? 'bg-green-200' : ''}
                  transition-all duration-300 hover:transform hover:scale-105`}
                disabled={matchedPairs.includes(card.symbol)}
              >
                {card.isFlipped || showAllCards ? card.symbol : ''}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryGame;
