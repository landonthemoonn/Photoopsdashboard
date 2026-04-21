import { motion } from 'motion/react';
import { Search, BookOpen, ChevronRight, Tag } from 'lucide-react';
import { useState } from 'react';

const articles = [
  { id: 1, title: 'Setting Up Capture One for Tethered Shooting', category: 'Setup', tags: ['Capture One', 'Tethering'], updated: 'Apr 18', readTime: '5 min', pinned: true },
  { id: 2, title: 'Jamf Pro: Enrolling a New Mac', category: 'IT Setup', tags: ['Jamf', 'MDM', 'Onboarding'], updated: 'Apr 15', readTime: '8 min', pinned: true },
  { id: 3, title: 'Resilio Sync: Folder Configuration Guide', category: 'File Sync', tags: ['Resilio', 'Sync'], updated: 'Apr 12', readTime: '6 min', pinned: false },
  { id: 4, title: 'Troubleshooting: Mac Won\'t Connect to Tether', category: 'Troubleshooting', tags: ['Capture One', 'USB'], updated: 'Apr 10', readTime: '4 min', pinned: false },
  { id: 5, title: 'Apple Business Manager: Adding Devices', category: 'IT Setup', tags: ['ABM', 'MDM'], updated: 'Apr 8', readTime: '7 min', pinned: false },
  { id: 6, title: 'Network Setup: Main Stage WiFi & Ethernet', category: 'Network', tags: ['Networking', 'WiFi'], updated: 'Apr 5', readTime: '10 min', pinned: false },
  { id: 7, title: 'Daily Studio Startup Checklist', category: 'Operations', tags: ['Checklists', 'Daily'], updated: 'Apr 3', readTime: '3 min', pinned: false },
  { id: 8, title: 'Capture One: Session vs Catalog — Which to Use', category: 'Setup', tags: ['Capture One', 'Workflow'], updated: 'Mar 28', readTime: '6 min', pinned: false },
];

const categories = ['All', 'Setup', 'IT Setup', 'Troubleshooting', 'File Sync', 'Network', 'Operations'];
const categoryColors: Record<string, string> = {
  'Setup': '#00B4FF',
  'IT Setup': '#BF5AF2',
  'Troubleshooting': '#FF2D78',
  'File Sync': '#00E5FF',
  'Network': '#FF9500',
  'Operations': '#00FF90',
};

export function KnowledgeBase() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = articles.filter(a => {
    const matchesCat = category === 'All' || a.category === category;
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const glass = { background: 'rgba(10,12,22,0.55)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 'var(--radius)' };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-1" style={{ color: 'var(--neon-blue)' }}>Reference</p>
        <h1 className="text-2xl font-medium" style={{ color: 'var(--foreground)', letterSpacing: '-0.025em' }}>Knowledge Base</h1>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="relative mb-4">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
        <input
          type="text"
          placeholder="Search articles, tags..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 text-sm rounded-xl focus:outline-none transition-all"
          style={{ ...glass, borderRadius: '0.75rem', color: 'var(--foreground)' }}
          onFocus={e => { (e.target as HTMLElement).style.borderColor = 'rgba(0,180,255,0.3)'; (e.target as HTMLElement).style.boxShadow = '0 0 20px rgba(0,180,255,0.1)'; }}
          onBlur={e => { (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.target as HTMLElement).style.boxShadow = 'none'; }}
        />
      </motion.div>

      {/* Category pills */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex gap-2 flex-wrap mb-5">
        {categories.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200" style={{ background: category === cat ? 'rgba(0,180,255,0.12)' : 'rgba(255,255,255,0.04)', color: category === cat ? 'var(--neon-blue)' : 'var(--muted-foreground)', border: category === cat ? '1px solid rgba(0,180,255,0.25)' : '1px solid rgba(255,255,255,0.06)' }}>
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Pinned */}
      {filtered.some(a => a.pinned) && category === 'All' && !search && (
        <div className="mb-5">
          <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-3" style={{ color: 'var(--muted-foreground)' }}>Pinned</p>
          <div className="grid grid-cols-2 gap-3">
            {filtered.filter(a => a.pinned).map((article, i) => (
              <motion.div key={article.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="p-5 rounded-xl cursor-pointer transition-all duration-200 group" style={{ ...glass, borderColor: `${categoryColors[article.category] || 'rgba(255,255,255,0.07)'}30` }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${categoryColors[article.category]}40`; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${categoryColors[article.category]}15`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${categoryColors[article.category] || 'rgba(255,255,255,0.07)'}30`; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${categoryColors[article.category]}15`, color: categoryColors[article.category], border: `1px solid ${categoryColors[article.category]}30` }}>{article.category}</span>
                  <ChevronRight size={14} style={{ color: 'var(--muted-foreground)' }} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-sm font-medium mb-2 leading-snug" style={{ color: 'var(--foreground)' }}>{article.title}</h3>
                <p className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>{article.readTime} read · Updated {article.updated}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* All articles */}
      <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-3" style={{ color: 'var(--muted-foreground)' }}>
        {filtered.length} Article{filtered.length !== 1 ? 's' : ''}
      </p>
      <motion.div style={glass} className="overflow-hidden">
        {filtered.filter(a => !a.pinned || category !== 'All' || search).map((article, i, arr) => (
          <motion.div key={article.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="flex items-center gap-4 px-5 py-4 cursor-pointer transition-all duration-150 group" style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${categoryColors[article.category] || '#00B4FF'}12` }}>
              <BookOpen size={14} style={{ color: categoryColors[article.category] || '#00B4FF' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>{article.title}</p>
              <div className="flex items-center gap-2 mt-1">
                {article.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="text-[10px] flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                    <Tag size={8} /> {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>{article.readTime}</p>
              <p className="text-[10px]" style={{ color: 'var(--muted-foreground)', opacity: 0.6 }}>{article.updated}</p>
            </div>
            <ChevronRight size={14} style={{ color: 'var(--muted-foreground)' }} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
