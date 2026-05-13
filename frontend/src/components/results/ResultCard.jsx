import { cn } from '../../lib/utils';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export default function ResultCard({ data, onExplain }) {
  const isReal = data.prediction.toLowerCase() === 'real';
  const confValue = parseFloat(data.confidence);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-5 animate-slide-up">
      {/* Verdict Card */}
      <div
        className={cn(
          'md:col-span-2 rounded-2xl border p-6 shadow-sm',
          isReal
            ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/20'
            : 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/20'
        )}
      >
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Verdict</p>

        <div className="flex items-center gap-3 mb-4">
          {isReal ? (
            <CheckCircleIcon className="text-emerald-500" sx={{ fontSize: 36 }} />
          ) : (
            <CancelIcon className="text-red-500" sx={{ fontSize: 36 }} />
          )}
          <h2
            className={cn(
              'text-3xl font-extrabold',
              isReal ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
            )}
          >
            {data.prediction.toUpperCase()}
          </h2>
        </div>

        {/* Confidence bar */}
        <div className="space-y-2">
          <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full confidence-bar-animated',
                isReal ? 'bg-emerald-500' : 'bg-red-500'
              )}
              style={{ '--bar-width': `${confValue}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Confidence: <strong className="text-gray-700 dark:text-gray-200">{data.confidence}</strong>
          </p>
        </div>
      </div>

      {/* Explanation Card */}
      <div className="md:col-span-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-1">AI Reasoning</h3>

        {/* Case 1: Explanation loaded */}
        {data.explanation && data.explanation.length > 0 && (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              These words most influenced the model's decision:
            </p>
            <div className="flex flex-wrap gap-2" role="list" aria-label="Influential words">
              {data.explanation.map((item, i) => (
                <div
                  key={i}
                  role="listitem"
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold border transition-transform hover:scale-105',
                    item.impact === 'Real'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700'
                      : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700'
                  )}
                >
                  {item.word}
                  <span className="text-xs opacity-70">
                    ({item.weight > 0 ? '+' : ''}{item.weight})
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Case 2: Loading explanation */}
        {data.explanationLoading && (
          <div className="flex items-center gap-3 mt-4">
            <svg className="animate-spin h-5 w-5 text-brand-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm text-gray-500 dark:text-gray-400">Generating detailed explanation...</p>
          </div>
        )}

        {/* Case 3: Not yet requested */}
        {!data.explanation && !data.explanationLoading && (
          <div className="mt-3">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Click the button below to see which words influenced the AI's decision.
            </p>
            <button
              onClick={onExplain}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-brand-600 to-purple-600 text-white hover:from-brand-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
            >
              <AutoAwesomeIcon sx={{ fontSize: 18 }} />
              Show AI Explanation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
