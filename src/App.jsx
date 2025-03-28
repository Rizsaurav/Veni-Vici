import React, { useState, useEffect } from 'react';
import { Cat, History } from './CatDiscovery';
import { PawPrint } from 'lucide-react';

function App() {
  const [currentCat, setCurrentCat] = useState(null);
  const [bannedAttributes, setBannedAttributes] = useState({
    origins: [],
    weights: [],
    lifeSpans: []
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const isAttributeBanned = (cat) => {
    return (
      bannedAttributes.origins.includes(cat.origin) ||
      bannedAttributes.weights.includes(cat.weight) ||
      bannedAttributes.lifeSpans.includes(cat.lifeSpan)
    );
  };

  const fetchRandomCat = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://api.thecatapi.com/v1/images/search?has_breeds=1',
        {
          headers: {
            'x-api-key': 'live_vPYe7BpHGXGlcNCjcRHfzZPYJBG3ZSnS0J9TyeGHd2anWw36c5TZ53ZL7O3zR421'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const [data] = await response.json();

      if (data.breeds && data.breeds[0]) {
        const breed = data.breeds[0];
        const newCat = {
          name: breed.name,
          origin: breed.origin,
          weight: breed.weight.imperial,
          lifeSpan: breed.life_span,
          imageUrl: data.url
        };

        if (!isAttributeBanned(newCat)) {
          setCurrentCat(newCat);
          setHistory(prev => [
            ...prev,
            { ...newCat, timestamp: new Date().toLocaleString() }
          ]);
        } else {
          fetchRandomCat();
        }
      }
    } catch (error) {
      console.error('Error fetching cat:', error);
    } finally {
      setLoading(false);
    }
  };

  const banAttribute = (type, value) => {
    setBannedAttributes(prev => ({
      ...prev,
      [type]: [...prev[type], value]
    }));
  };

  const removeFromBanList = (type, value) => {
    setBannedAttributes(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item !== value)
    }));
  };

  useEffect(() => {
    fetchRandomCat();
  }, []);

  return (
    <div className="main-grid">
      {/* Left Panel: History */}
      <div className="panel">
        <h2>Who have we seen so far?</h2>
        {history.map((cat, index) => (
          <div key={index} className="history-item">
            <img src={cat.imageUrl} alt={cat.name} className="history-img" />
            <p>A {cat.name} cat from {cat.origin}</p>
            <p className="timestamp">{cat.timestamp}</p>
          </div>
        ))}
      </div>

      {/* Center Panel: Main Cat Display */}
      <div className="panel text-center">
        <header>
          <h1>Trippin' on Cats</h1>
          <p>Discover cats from your wildest dreams!</p>
          <div>😺😽😼😸😻😾🙀😿</div>
        </header>

        {currentCat && (
          <>
            <h2 className="cat-name">{currentCat.name}</h2>
            <div className="cat-buttons">
              <button className="cat-button" onClick={() => banAttribute('origins', currentCat.origin)}>
                {currentCat.origin}
              </button>
              <button className="cat-button" onClick={() => banAttribute('weights', currentCat.weight)}>
                {currentCat.weight} lbs
              </button>
              <button className="cat-button" onClick={() => banAttribute('lifeSpans', currentCat.lifeSpan)}>
                {currentCat.lifeSpan} years
              </button>
              <button className="cat-button">{currentCat.name}</button>
            </div>
            <img src={currentCat.imageUrl} className="cat-img" alt={currentCat.name} />
            <button className="discover-button" onClick={fetchRandomCat} disabled={loading}>
              {loading ? 'Loading...' : '🐾 Discover!'}
            </button>
          </>
        )}
      </div>

      {/* Right Panel: Ban List */}
      <div className="panel">
        <h2>Ban List</h2>
        <p>Select an attribute in your listing to ban it</p>
        {Object.entries(bannedAttributes).map(([type, values]) => (
          values.length > 0 && (
            <div key={type} className="ban-group">
              <div className="ban-title">{type}</div>
              {values.map((val, idx) => (
                <div
                  key={idx}
                  className="ban-item cursor-pointer hover:bg-red-600"
                  onClick={() => removeFromBanList(type, val)}
                  title="Click to remove from ban list"
                >
                  {val}
                </div>
              ))}
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default App;
