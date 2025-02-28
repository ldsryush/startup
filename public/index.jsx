import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function SearchForm() {
  const [query, setQuery] = useState('');

  function handleSearch(event) {
    event.preventDefault();
    alert(`Search query submitted: ${query}`);
  }

  return (
    <form onSubmit={handleSearch} className="search-form">
      <input
        type="text"
        name="query"
        placeholder="Search..."
        className="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="search-button">Search</button>
    </form>
  );
}

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin(event) {
    event.preventDefault();
    alert(`Login submitted for user: ${username}`);
  }

  return (
    <form id="login-form" onSubmit={handleLogin}>
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <br /><br />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <br /><br />
      <button type="submit">Login</button>
    </form>
  );
}

function Actions() {
  return (
    <section className="right-align">
      <p className="font2">Actions</p>
      <ul>
        <li className="font1"><a href="sell.html">Sell</a></li>
        <li className="font1"><a href="apparel.html">Apparel</a></li>
        <li className="font1"><a href="equipment.html">Equipment</a></li>
      </ul>
    </section>
  );
}

function WebSocketComponent() {
  const [websocketData, setWebsocketData] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://example.com');

    ws.onopen = () => {
      console.log('WebSocket connection established.');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setWebsocketData((prevData) => [...prevData, data]);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed.');
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div id="websocket-data">
      {websocketData.map((data, index) => (
        <p key={index}>{JSON.stringify(data)}</p>
      ))}
    </div>
  );
}

function DatabaseContent() {
  const [databaseContent, setDatabaseContent] = useState(null);

  useEffect(() => {
    async function fetchDatabaseContent() {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        const data = await response.json();
        setDatabaseContent(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchDatabaseContent();
  }, []);

  return (
    <div id="database-content">
      {databaseContent && <pre>{JSON.stringify(databaseContent, null, 2)}</pre>}
    </div>
  );
}

function ThirdPartyServiceResult() {
  const [serviceResult, setServiceResult] = useState(null);

  useEffect(() => {
    async function callThirdPartyService() {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/2');
        const data = await response.json();
        setServiceResult(data);
      } catch (error) {
        console.error('Error calling service:', error);
      }
    }

    callThirdPartyService();
  }, []);

  return (
    <div id="service-result">
      {serviceResult && <pre>{JSON.stringify(serviceResult, null, 2)}</pre>}
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <h1 className="font3">Oyee Marketplace</h1>
      <h1 className="font4">Second-hand Winter Gear</h1>
      <SearchForm />
      <a className="font2" href="https://github.com/ldsryush/startup.git">My Startup Repository</a>
      <LoginForm />
      <main>
        <Actions />
      </main>
      <aside>
        <img
          src="https://visitutahkenticoprod.blob.core.windows.net/cmsroot/visitutah/media/site-assets/winter-photography/ski-resorts/snowbird/ski-resorts_snowbird_markewitz_dsc2227.jpg"
          width="1000"
          height="800"
          alt="Winter Gear"
        />
      </aside>
      <WebSocketComponent />
      <DatabaseContent />
      <ThirdPartyServiceResult />
      <footer>
        <a href="https://github.com/ldsryush/startup">My Github Link</a>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
