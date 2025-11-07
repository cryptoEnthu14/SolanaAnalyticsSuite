import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { TokenAnalyzer } from './pages/TokenAnalyzer';
import { PoolMonitor } from './pages/PoolMonitor';
import { WhaleTracker } from './pages/WhaleTracker';
import { BlockExplorer } from './pages/BlockExplorer';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<TokenAnalyzer />} />
            <Route path="/pools" element={<PoolMonitor />} />
            <Route path="/whales" element={<WhaleTracker />} />
            <Route path="/blocks" element={<BlockExplorer />} />
          </Routes>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
