import { lazy, Suspense } from 'react';
import {createRoot} from 'react-dom/client';
import { PreviewAccess } from './components/PreviewAccess';
import './index.css';
import './design/ui-modes.css';
import './design/checkboxes.css';

const DesignSpec = lazy(() => import('./design/DesignSpec'));
const App = lazy(() => import('./App'));
const isSpec = new URLSearchParams(window.location.search).get('view') === 'design-system';
createRoot(document.getElementById('root')!).render(<PreviewAccess><Suspense fallback={<p role="status">正在加载…</p>}>{isSpec ? <DesignSpec /> : <App />}</Suspense></PreviewAccess>);
