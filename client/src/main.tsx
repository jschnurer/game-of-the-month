import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
);

export const portalRoot = (document.getElementById("portalRoot") as HTMLElement);
