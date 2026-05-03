import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Copy, Plus, Trash2, LogOut, BarChart2 } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3666';

interface Token {
  id: string;
  name: string;
  token: string;
  createdAt: string;
}

interface User {
  email: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTokenName, setNewTokenName] = useState('');
  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchTokens();
  }, [navigate]);

  const fetchTokens = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/tokens`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setTokens(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch tokens:', err);
    }
  };

  const handleCreateToken = async () => {
    if (!newTokenName.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/tokens`,
        { name: newTokenName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCreatedToken(response.data.data.token);
        setNewTokenName('');
        fetchTokens();
      }
    } catch (err) {
      console.error('Failed to create token:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteToken = async (tokenId: string) => {
    if (!confirm('Are you sure you want to delete this token?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/tokens/${tokenId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTokens();
    } catch (err) {
      console.error('Failed to delete token:', err);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="bg-violet-600 text-white px-2 py-1 rounded text-xl font-bold">⚡</span>
              <h1 className="text-xl font-bold">zrokui</h1>
            </div>
            <nav className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="text-violet-400 hover:text-violet-300 transition-colors font-medium"
              >
                Tokens
              </Link>
              <Link
                to="/metrics"
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
              >
                <BarChart2 size={18} />
                Metrics
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-zinc-400">{user.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">API Tokens</h2>
          <p className="text-zinc-400">
            Create and manage tokens for CLI authentication
          </p>
        </div>

        {/* Create Token Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-6"
        >
          <Plus size={20} />
          Create Token
        </button>

        {/* Tokens List */}
        <div className="space-y-4">
          {tokens.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
              <p className="text-zinc-400">No tokens yet. Create one to get started!</p>
            </div>
          ) : (
            tokens.map((token) => (
              <div
                key={token.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-lg">{token.name}</h3>
                  <p className="text-zinc-500 text-sm">
                    Created {new Date(token.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteToken(token.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Create Token Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full">
            {!createdToken ? (
              <>
                <h3 className="text-xl font-bold mb-4">Create API Token</h3>
                <input
                  type="text"
                  value={newTokenName}
                  onChange={(e) => setNewTokenName(e.target.value)}
                  placeholder="Token name (e.g., My Laptop)"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 mb-4"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateToken}
                    disabled={loading || !newTokenName.trim()}
                    className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    {loading ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4">Token Created!</h3>
                <p className="text-zinc-400 mb-4">
                  Copy this token now. You won't be able to see it again!
                </p>
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 mb-4">
                  <code className="text-sm text-violet-400 break-all">{createdToken}</code>
                </div>
                <button
                  onClick={() => {
                    handleCopy(createdToken, 'new');
                    setTimeout(() => {
                      setCreatedToken(null);
                      setShowCreateModal(false);
                    }, 1000);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  <Copy size={18} />
                  {copied === 'new' ? 'Copied!' : 'Copy Token'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
