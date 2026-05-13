import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { predictNews, getExplanation } from '../services/api';
import Header from './Header';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import ResultCard from './results/ResultCard';
import ResultSkeleton from './results/ResultSkeleton';
import HistorySidebar from './sidebar/HistorySidebar';
import SearchIcon from '@mui/icons-material/Search';
import ClearAllIcon from '@mui/icons-material/ClearAll';

export default function MainPage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const { token, logout } = useAuth();
  const { addToast } = useToast();
  const resultRef = useRef(null);

  const handleAnalyze = async (overrideText = null) => {
    const textToAnalyze = overrideText || text;
    if (!textToAnalyze.trim()) {
      addToast('Please paste a news article or headline first.', 'error');
      return;
    }

    if (textToAnalyze.length > 10000) {
      addToast('Text is too long. Maximum 10,000 characters allowed.', 'error');
      return;
    }

    setLoading(true);
    setResult(null);
    if (overrideText) setText(overrideText);

    try {
      const data = await predictNews(textToAnalyze.trim(), token);
      // Set result WITHOUT explanation initially (fast response)
      setResult({ ...data, explanation: null, newsText: textToAnalyze.trim() });
      setHistoryRefresh(prev => prev + 1);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    } catch (err) {
      if (err.status === 401) {
        addToast('Session expired. Please login again.', 'error');
        logout();
        return;
      }
      addToast('Error: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExplain = async () => {
    if (!result || !result.newsText) return;

    try {
      setResult(prev => ({ ...prev, explanationLoading: true }));
      const data = await getExplanation(result.newsText, token);
      setResult(prev => ({ ...prev, explanation: data.explanation, explanationLoading: false }));
    } catch (err) {
      if (err.status === 401) {
        addToast('Session expired. Please login again.', 'error');
        logout();
        return;
      }
      addToast('Error: ' + err.message, 'error');
      setResult(prev => ({ ...prev, explanationLoading: false }));
    }
  };

  const handleClear = () => {
    setText('');
    setResult(null);
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleAnalyze();
    }
  };

  const handleHistoryClick = (snippet) => {
    handleAnalyze(snippet);
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Sidebar */}
      <HistorySidebar refreshTrigger={historyRefresh} onHistoryClick={handleHistoryClick} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-4xl px-4 sm:px-6 pb-12 pt-4">
          <Header />

          {/* Hero */}
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
              Is that news{' '}
              <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
                Real or Fake?
              </span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
              Paste an article or headline below to get an instant AI-powered verification with explainable results.
            </p>
          </div>

          {/* Input Card */}
          <Card className="shadow-lg mb-8 animate-fade-in">
            <CardContent className="p-5 sm:p-6">
              <textarea
                id="news-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste news content or headline here..."
                rows={6}
                maxLength={10000}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:bg-white dark:focus:bg-gray-800"
                aria-label="News text input"
              />

              {/* Character counter */}
              <p className={`text-xs text-right mt-1 ${text.length > 9000 ? 'text-red-500' : 'text-gray-400'}`}>
                {text.length.toLocaleString()} / 10,000
              </p>

              <div className="flex gap-3 mt-3">
                <Button
                  onClick={() => handleAnalyze()}
                  disabled={loading}
                  className="flex-[2]"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <SearchIcon fontSize="small" />
                      Verify News
                    </>
                  )}
                </Button>
                <Button onClick={handleClear} variant="secondary" className="flex-1" size="lg">
                  <ClearAllIcon fontSize="small" />
                  Clear
                </Button>
              </div>

              <p className="text-xs text-gray-400 mt-3 text-center">
                Tip: Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">Ctrl + Enter</kbd> to submit
              </p>
            </CardContent>
          </Card>

          {/* Loading Skeleton */}
          {loading && <ResultSkeleton />}

          {/* Results */}
          <div ref={resultRef}>
            {result && !loading && (
              <ResultCard 
                data={result} 
                onExplain={handleExplain} 
              />
            )}
          </div>

          {/* Footer */}
          <footer className="text-center mt-12 text-xs text-gray-400 dark:text-gray-500" role="contentinfo">
            Built with Scikit-Learn, Flask & Explainable AI (LIME)
          </footer>
        </div>
      </div>
    </div>
  );
}
