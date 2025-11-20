'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Video,
  Zap,
  TrendingUp,
  Brain,
  Play,
  Download,
  Share2,
  Clock,
  Target,
  Wand2
} from 'lucide-react';

type Agent = {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: 'idle' | 'working' | 'completed';
  progress: number;
  output?: string;
};

type VideoJob = {
  id: string;
  topic: string;
  status: 'generating' | 'completed' | 'failed';
  progress: number;
  videoUrl?: string;
  script?: string;
  hooks?: string[];
  thumbnail?: string;
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<'create' | 'agents' | 'library'>('create');
  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('trending');
  const [jobs, setJobs] = useState<VideoJob[]>([]);
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'trend-analyzer',
      name: 'Trend Analyzer',
      description: 'Analyzes viral trends and suggests hot topics',
      icon: TrendingUp,
      status: 'idle',
      progress: 0
    },
    {
      id: 'script-writer',
      name: 'Script Writer',
      description: 'Creates engaging scripts with viral hooks',
      icon: Brain,
      status: 'idle',
      progress: 0
    },
    {
      id: 'video-generator',
      name: 'Video Generator',
      description: 'Generates visual content and animations',
      icon: Video,
      status: 'idle',
      progress: 0
    },
    {
      id: 'optimizer',
      name: 'Optimizer',
      description: 'Optimizes titles, descriptions, and hashtags',
      icon: Target,
      status: 'idle',
      progress: 0
    }
  ]);

  const handleCreateShort = async () => {
    if (!topic.trim()) return;

    const jobId = Date.now().toString();
    const newJob: VideoJob = {
      id: jobId,
      topic: topic,
      status: 'generating',
      progress: 0
    };

    setJobs([newJob, ...jobs]);

    // Simulate agent workflow
    const agentSequence = [
      { id: 'trend-analyzer', duration: 2000, outputProgress: 25 },
      { id: 'script-writer', duration: 3000, outputProgress: 50 },
      { id: 'video-generator', duration: 4000, outputProgress: 85 },
      { id: 'optimizer', duration: 2000, outputProgress: 100 }
    ];

    for (const step of agentSequence) {
      // Update agent status
      setAgents(prev => prev.map(a =>
        a.id === step.id
          ? { ...a, status: 'working', progress: 0 }
          : a
      ));

      // Simulate progress
      const progressInterval = setInterval(() => {
        setAgents(prev => prev.map(a =>
          a.id === step.id && a.progress < 100
            ? { ...a, progress: Math.min(a.progress + 10, 100) }
            : a
        ));

        setJobs(prev => prev.map(j =>
          j.id === jobId
            ? { ...j, progress: Math.min(j.progress + 2, step.outputProgress) }
            : j
        ));
      }, step.duration / 10);

      await new Promise(resolve => setTimeout(resolve, step.duration));
      clearInterval(progressInterval);

      // Complete agent
      setAgents(prev => prev.map(a =>
        a.id === step.id
          ? { ...a, status: 'completed', progress: 100 }
          : a
      ));

      // Add outputs
      if (step.id === 'script-writer') {
        setJobs(prev => prev.map(j =>
          j.id === jobId
            ? {
                ...j,
                script: `Hook: "${topic}" will change everything!\n\nBody: The science behind this is fascinating...\n\nCTA: Follow for more insights!`,
                hooks: [
                  `The truth about ${topic} nobody talks about`,
                  `I tested ${topic} for 30 days, here's what happened`,
                  `${topic} explained in 60 seconds`
                ]
              }
            : j
        ));
      }
    }

    // Complete job
    setJobs(prev => prev.map(j =>
      j.id === jobId
        ? {
            ...j,
            status: 'completed',
            progress: 100,
            videoUrl: '/api/placeholder-video',
            thumbnail: `https://picsum.photos/seed/${jobId}/720/1280`
          }
        : j
    ));

    // Reset agents
    setTimeout(() => {
      setAgents(prev => prev.map(a => ({ ...a, status: 'idle', progress: 0 })));
    }, 1000);

    setTopic('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-lg bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">YouTube Shorts Creator</h1>
                <p className="text-sm text-gray-400">AI Agent System</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
                Settings
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-4 border-b border-white/10">
          {[
            { id: 'create', label: 'Create', icon: Wand2 },
            { id: 'agents', label: 'Agents', icon: Zap },
            { id: 'library', label: 'Library', icon: Video }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-purple-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <AnimatePresence mode="wait">
          {activeTab === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Create Form */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold mb-4">Create New Short</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Topic or Idea</label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., AI productivity hacks, cooking tips, fitness myths..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleCreateShort()}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Niche</label>
                    <select
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="trending">Trending Topics</option>
                      <option value="educational">Educational</option>
                      <option value="entertainment">Entertainment</option>
                      <option value="howto">How-To Guides</option>
                      <option value="motivational">Motivational</option>
                      <option value="tech">Technology</option>
                      <option value="lifestyle">Lifestyle</option>
                    </select>
                  </div>

                  <button
                    onClick={handleCreateShort}
                    disabled={!topic.trim()}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Generate Short with AI Agents
                  </button>
                </div>
              </div>

              {/* Active Jobs */}
              {jobs.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Generation Queue</h3>
                  {jobs.map((job) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold">{job.topic}</h4>
                          <p className="text-sm text-gray-400 capitalize">{job.status}</p>
                        </div>
                        <div className="flex gap-2">
                          {job.status === 'completed' && (
                            <>
                              <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
                                <Download className="w-4 h-4" />
                              </button>
                              <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
                                <Share2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {job.status !== 'completed' && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{job.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${job.progress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>
                      )}

                      {job.status === 'completed' && job.script && (
                        <div className="mt-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white/5 p-4 rounded-lg">
                              <h5 className="text-sm font-semibold mb-2">Generated Script</h5>
                              <p className="text-sm text-gray-300 whitespace-pre-line">{job.script}</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-lg">
                              <h5 className="text-sm font-semibold mb-2">Viral Hooks</h5>
                              <ul className="space-y-2">
                                {job.hooks?.map((hook, idx) => (
                                  <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                                    <Zap className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                                    {hook}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="bg-white/5 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="text-sm font-semibold">Preview</h5>
                              <button className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm">
                                <Play className="w-3 h-3" />
                                Play
                              </button>
                            </div>
                            <div className="aspect-[9/16] max-w-xs mx-auto bg-white/5 rounded-lg flex items-center justify-center">
                              <Video className="w-12 h-12 text-gray-600" />
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'agents' && (
            <motion.div
              key="agents"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {agents.map((agent) => (
                  <motion.div
                    key={agent.id}
                    className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${
                        agent.status === 'working'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : agent.status === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-purple-500/20 text-purple-400'
                      }`}>
                        <agent.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{agent.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            agent.status === 'working'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : agent.status === 'completed'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {agent.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">{agent.description}</p>

                        {agent.status === 'working' && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Processing</span>
                              <span>{agent.progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                                style={{ width: `${agent.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-4">Agent Workflow</h3>
                <div className="space-y-3">
                  {[
                    { step: 1, name: 'Trend Analysis', desc: 'Analyzes current trends and audience preferences' },
                    { step: 2, name: 'Script Generation', desc: 'Creates engaging scripts with viral hooks' },
                    { step: 3, name: 'Visual Generation', desc: 'Generates or sources visual content' },
                    { step: 4, name: 'Optimization', desc: 'Optimizes for maximum engagement' }
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                      <div className="w-8 h-8 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'library' && (
            <motion.div
              key="library"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 text-center py-20">
                <Video className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-semibold mb-2">No shorts yet</h3>
                <p className="text-gray-400 mb-6">Create your first AI-generated short to see it here</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition"
                >
                  Create Your First Short
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
