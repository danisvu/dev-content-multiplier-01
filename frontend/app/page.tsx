'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Idea {
  id: number;
  title: string;
  description?: string;
  rationale?: string;
  persona?: string;
  industry?: string;
  status: string;
  created_at: string;
}

interface CreateIdeaInput {
  title: string;
  description?: string;
  rationale?: string;
  persona?: string;
  industry?: string;
  status?: string;
}

interface GenerateIdeasRequest {
  persona: string;
  industry: string;
  model?: 'gemini' | 'deepseek';
  temperature?: number;
}

interface GeneratedIdea {
  title: string;
  description: string;
  rationale: string;
}

interface GenerateIdeasResponse {
  success: boolean;
  ideas?: GeneratedIdea[];
  error?: string;
}

const API_BASE_URL = 'http://localhost:3911/api';

export default function Home() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<CreateIdeaInput>({
    title: '',
    description: '',
    rationale: '',
    persona: '',
    industry: '',
    status: 'pending'
  });

  // AI Generation states
  const [generateForm, setGenerateForm] = useState<GenerateIdeasRequest>({
    persona: '',
    industry: '',
    model: 'gemini',
    temperature: 0.7
  });
  const [generating, setGenerating] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<GeneratedIdea[]>([]);
  const [generateError, setGenerateError] = useState<string | null>(null);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ideas`);
      setIdeas(response.data);
    } catch (error) {
      console.error('Error fetching ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      await axios.post(`${API_BASE_URL}/ideas`, formData);
      setFormData({
        title: '',
        description: '',
        rationale: '',
        persona: '',
        industry: '',
        status: 'pending'
      });
      fetchIdeas();
    } catch (error) {
      console.error('Error creating idea:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/ideas/${id}`);
      fetchIdeas();
    } catch (error) {
      console.error('Error deleting idea:', error);
    }
  };

  const handleGenerateIdeas = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!generateForm.persona.trim() || !generateForm.industry.trim()) {
      setGenerateError('Vui lòng nhập cả persona và industry');
      return;
    }

    setGenerating(true);
    setGenerateError(null);
    setGeneratedIdeas([]);

    try {
      // First, check if server is reachable
      try {
        await axios.get(`${API_BASE_URL.replace('/api', '')}/health`, { timeout: 5000 });
      } catch (healthError) {
        const errorDetails = healthError instanceof Error ? healthError.message : 'Unknown error';
        throw new Error(`Server không phản hồi (${API_BASE_URL}). Chi tiết: ${errorDetails}`);
      }

      const response = await axios.post<GenerateIdeasResponse>(
        `${API_BASE_URL}/ideas/generate`,
        generateForm,
        { timeout: 60000 }
      );

      if (response.data.success && response.data.ideas) {
        setGeneratedIdeas(response.data.ideas);
        fetchIdeas(); // Refresh the ideas list
      } else {
        setGenerateError(response.data.error || 'Đã có lỗi xảy ra khi tạo ý tưởng');
      }
    } catch (error) {
      console.error('Error generating ideas:', error);

      let errorMessage = 'Không thể kết nối đến server. Vui lòng thử lại sau.';

      if (error instanceof Error) {
        if (error.message.includes('Server không phản hồi')) {
          errorMessage = error.message;
        } else if (error.message.includes('Network')) {
          errorMessage = `Lỗi mạng: ${error.message}. Kiểm tra xem backend đã khởi động chưa (${API_BASE_URL})`;
        } else if (error.message.includes('timeout')) {
          errorMessage = `Hết thời gian chờ. Server đang chậm hoặc không phản hồi.`;
        }
      }

      setGenerateError(errorMessage);
    } finally {
      setGenerating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Content Ideas Manager
        </h1>

        {/* AI Generation Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            🤖 Tự động sinh ý tưởng bằng AI
          </h2>
          
          <form onSubmit={handleGenerateIdeas} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Persona *
                </label>
                <input
                  type="text"
                  required
                  value={generateForm.persona}
                  onChange={(e) => setGenerateForm({ ...generateForm, persona: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="VD: Content Creator, Digital Marketer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry *
                </label>
                <input
                  type="text"
                  required
                  value={generateForm.industry}
                  onChange={(e) => setGenerateForm({ ...generateForm, industry: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="VD: Technology, Fashion, Food"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model AI
                </label>
                <select
                  value={generateForm.model}
                  onChange={(e) => setGenerateForm({ ...generateForm, model: e.target.value as 'gemini' | 'deepseek' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="gemini">Gemini (Google)</option>
                  <option value="deepseek">Deepseek</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperature: {generateForm.temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={generateForm.temperature}
                  onChange={(e) => setGenerateForm({ ...generateForm, temperature: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Conservative</span>
                  <span>Creative</span>
                </div>
              </div>
            </div>

            {generateError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {generateError}
              </div>
            )}

            <button
              type="submit"
              disabled={generating}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center"
            >
              {generating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang tạo ý tưởng...
                </>
              ) : (
                '🚀 Generate Ideas'
              )}
            </button>
          </form>

          {/* Generated Ideas Display */}
          {generatedIdeas.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                ✨ Ý tưởng vừa được tạo ({generatedIdeas.length} ý tưởng)
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {generatedIdeas.map((idea, index) => (
                  <div key={index} className="border border-purple-200 bg-purple-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {index + 1}. {idea.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">{idea.description}</p>
                    <p className="text-purple-700 text-xs italic">
                      <strong>Lý do:</strong> {idea.rationale}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Tạo ý tưởng mới
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu đề *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tiêu đề ý tưởng"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Mô tả chi tiết ý tưởng"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lý do
                  </label>
                  <textarea
                    value={formData.rationale}
                    onChange={(e) => setFormData({ ...formData, rationale: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="Tại sao ý tưởng này sẽ hiệu quả?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Persona
                  </label>
                  <input
                    type="text"
                    value={formData.persona}
                    onChange={(e) => setFormData({ ...formData, persona: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Đối tượng mục tiêu"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngành
                  </label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Lĩnh vực/ngành"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Tạo ý tưởng
                </button>
              </form>
            </div>
          </div>

          {/* Ideas List Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Danh sách ý tưởng ({ideas.length})
              </h2>
              
              {ideas.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Chưa có ý tưởng nào. Hãy tạo ý tưởng đầu tiên!
                </div>
              ) : (
                <div className="space-y-4">
                  {ideas.map((idea) => (
                    <div
                      key={idea.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {idea.title}
                        </h3>
                        <button
                          onClick={() => handleDelete(idea.id)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Xóa
                        </button>
                      </div>
                      
                      {idea.description && (
                        <p className="text-gray-600 mb-3">{idea.description}</p>
                      )}
                      
                      {idea.rationale && (
                        <p className="text-purple-700 text-sm mb-3 italic">
                          <strong>Lý do:</strong> {idea.rationale}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {idea.persona && (
                          <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                            👤 {idea.persona}
                          </span>
                        )}
                        {idea.industry && (
                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            🏢 {idea.industry}
                          </span>
                        )}
                        <span className={`inline-block text-xs px-2 py-1 rounded ${
                          idea.status === 'completed' 
                            ? 'bg-gray-100 text-gray-800'
                            : idea.status === 'in-progress'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {idea.status === 'completed' ? '✅' : 
                           idea.status === 'in-progress' ? '🔄' : '⏳'} {idea.status}
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        📅 {formatDate(idea.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
