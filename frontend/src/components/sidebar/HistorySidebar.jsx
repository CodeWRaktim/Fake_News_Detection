import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { fetchHistory } from '../../services/api';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export default function HistorySidebar({ refreshTrigger, onHistoryClick }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, logout } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchHistory(token);
        setHistory(data);
      } catch (err) {
        if (err.status === 401) {
          logout();
          return;
        }
        addToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadHistory();
    }
  }, [token, refreshTrigger, addToast, logout]);

  if (loading) {
    return (
      <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 mt-8 lg:mt-0">
        <div className="animate-pulse flex space-x-2 items-center mb-6">
          <div className="rounded-full bg-gray-300 dark:bg-gray-700 h-6 w-6"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col lg:h-screen lg:sticky lg:top-0 mt-8 lg:mt-0">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
        <HistoryIcon className="text-gray-500" fontSize="small" />
        <h2 className="font-bold text-gray-700 dark:text-gray-300">Your History</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {history.length === 0 ? (
          <p className="text-sm text-gray-500 text-center mt-6">No history yet. Start verifying!</p>
        ) : (
          history.map(item => (
            <div 
              key={item.id} 
              onClick={() => onHistoryClick(item.snippet)}
              className="p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
            >
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2 italic">"{item.snippet}"</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 ${
                  item.prediction === 'Real' 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {item.prediction === 'Real' ? <CheckCircleIcon sx={{fontSize: 14}}/> : <CancelIcon sx={{fontSize: 14}}/>}
                  {item.prediction}
                </span>
                <span className="text-[10px] text-gray-400">{item.created_at}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
