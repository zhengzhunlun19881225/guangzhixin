import { lazy, Suspense } from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const DesignSpec = lazy(() => import('./design/DesignSpec'));
const isSpec = new URLSearchParams(window.location.search).get('view') === 'design-system';
createRoot(document.getElementById('root')!).render(isSpec ? <Suspense fallback={<p role="status">正在加载设计规范…</p>}><DesignSpec /></Suspense> : <App />);
