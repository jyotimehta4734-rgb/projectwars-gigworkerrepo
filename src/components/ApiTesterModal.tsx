import React, { useState } from 'react';
import { Terminal, Copy, Check, Play, Code2, Globe, Shield } from 'lucide-react';

export const ApiTesterModal: React.FC = () => {
  const [testPayload, setTestPayload] = useState(
    JSON.stringify(
      {
        input: 'Sir, Swiggy ne bina vajah Rs 500 ka fine laga diya, help karo',
      },
      null,
      2
    )
  );
  const [rawMode, setRawMode] = useState(true);
  const [responseOutput, setResponseOutput] = useState<string>('GRIEVANCE_DRAFTING');
  const [statusCode, setStatusCode] = useState<number>(200);
  const [loading, setLoading] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const curlCommand = `curl -X POST "http://localhost:3000/api/route${
    rawMode ? '?format=raw' : ''
  }" \\
  -H "Content-Type: application/json" \\
  -d '${testPayload.replace(/\n\s*/g, ' ')}'`;

  const runTest = async () => {
    setLoading(true);
    try {
      let parsed = {};
      try {
        parsed = JSON.parse(testPayload);
      } catch {
        parsed = { input: testPayload };
      }

      const url = `/api/route${rawMode ? '?format=raw' : ''}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });

      setStatusCode(res.status);
      if (rawMode) {
        const text = await res.text();
        setResponseOutput(text);
      } else {
        const json = await res.json();
        setResponseOutput(JSON.stringify(json, null, 2));
      }
    } catch (err: any) {
      setStatusCode(500);
      setResponseOutput(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="bg-neutral-900 text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-orange-400 text-xs font-mono font-bold tracking-wider uppercase mb-1">
            <Terminal className="w-4 h-4" />
            <span>DEVELOPER & AUTOMATION API ENDPOINTS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            Core Routing Agent API Specifications
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-2xl">
            Designed to integrate directly with WhatsApp bots, IVR call centers, driver apps, or automated evaluation test suites.
          </p>
        </div>

        <button
          onClick={copyCurl}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-semibold tracking-wide transition-all"
        >
          {copiedCurl ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Copied cURL</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy cURL</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Panel */}
        <div className="bg-white rounded-xl border border-neutral-300 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
            <span className="font-bold text-sm text-neutral-900 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-orange-600" />
              POST /api/route
            </span>

            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={rawMode}
                onChange={(e) => setRawMode(e.target.checked)}
                className="rounded border-neutral-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="font-mono text-neutral-700">Raw Token Only (?format=raw)</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">
              JSON Request Body:
            </label>
            <textarea
              rows={6}
              value={testPayload}
              onChange={(e) => setTestPayload(e.target.value)}
              className="w-full p-3 font-mono text-xs bg-neutral-950 text-emerald-400 rounded-lg outline-none border border-neutral-800"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-neutral-500">
              Content-Type: application/json
            </span>
            <button
              onClick={runTest}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{loading ? 'Executing...' : 'Send Request'}</span>
            </button>
          </div>
        </div>

        {/* Response Panel */}
        <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-5 shadow-inner flex flex-col justify-between font-mono text-xs text-neutral-200">
          <div>
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
              <span className="text-neutral-400 font-bold uppercase tracking-wider text-[11px]">
                Live HTTP Response
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  statusCode === 200
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-red-950 text-red-400 border border-red-800'
                }`}
              >
                Status: {statusCode}
              </span>
            </div>

            <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800 text-neutral-100 whitespace-pre-wrap leading-relaxed overflow-x-auto min-h-[140px]">
              {responseOutput}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800 text-[11px] text-neutral-500 flex items-center justify-between">
            <span>Response Content-Type: {rawMode ? 'text/plain' : 'application/json'}</span>
            <span className="text-emerald-400 font-semibold">Strict Category Token</span>
          </div>
        </div>
      </div>
    </div>
  );
};
