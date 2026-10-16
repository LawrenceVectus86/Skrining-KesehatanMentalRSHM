import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Admin from './Admin.jsx';

window.addEventListener('hashchange', () => location.reload());
// halaman tes: /   · dashboard psikolog: /#/admin
createRoot(document.getElementById('root')).render(
  location.hash.startsWith('#/admin') ? <Admin /> : <App />
);
