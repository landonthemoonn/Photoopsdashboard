import { motion, AnimatePresence } from 'motion/react';
import { Search, BookOpen, ChevronRight, Tag, Plus, Pencil, Trash2, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Article {
  id: string;
  title: string;
  category: string;
  tags: string[];
  updated: string;
  readTime: string;
  pinned: boolean;
  body?: string;
}

const DEFAULT_ARTICLES: Article[] = [
  { id: '1', title: 'Setting Up Capture One for Tethered Shooting', category: 'Setup', tags: ['Capture One', 'Tethering'], updated: 'Apr 18', readTime: '5 min', pinned: true },
  { id: '2', title: 'Jamf Pro: Enrolling a New Mac', category: 'IT Setup', tags: ['Jamf', 'MDM', 'Onboarding'], updated: 'Apr 15', readTime: '8 min', pinned: true },
  { id: '3', title: 'Resilio Sync: Folder Configuration Guide', category: 'File Sync', tags: ['Resilio', 'Sync'], updated: 'Apr 12', readTime: '6 min', pinned: false },
  { id: '4', title: 'Troubleshooting: Mac Won\'t Connect to Tether', category: 'Troubleshooting', tags: ['Capture One', 'USB'], updated: 'Apr 10', readTime: '4 min', pinned: false },
  { id: '5', title: 'Apple Business Manager: Adding Devices', category: 'IT Setup', tags: ['ABM', 'MDM'], updated: 'Apr 8', readTime: '7 min', pinned: false },
  { id: '6', title: 'Network Setup: Main Stage WiFi & Ethernet', category: 'Network', tags: ['Networking', 'WiFi'], updated: 'Apr 5', readTime: '10 min', pinned: false },
  { id: '7', title: 'Daily Studio Startup Checklist', category: 'Operations', tags: ['Checklists', 'Daily'], updated: 'Apr 3', readTime: '3 min', pinned: false },
  { id: '8', title: 'Capture One: Session vs Catalog — Which to Use', category: 'Setup', tags: ['Capture One', 'Workflow'], updated: 'Mar 28', readTime: '6 min', pinned: false },
];

const CATEGORY_COLORS: Record<string, string> = {
  'Setup': '#E07060',
  'IT Setup': '#9888C8',
  'Troubleshooting': '#D86040',
  'File Sync': '#F0A870',
  'Network': '#E09040',
  'Operations': '#8FBF8A',
};

function loadArticles(): Article[] {
  try {
    const s = localStorage.getItem('photoops_kb');
    return s ? JSON.parse(s) : DEFAULT_ARTICLES;
  } catch { return DEFAULT_ARTICLES; }
}

function saveArticles(articles: Article[]) {
  localStorage.setItem('photoops_kb', JSON.stringify(articles));
}

function ArticleModal({ initial, categories, onSave, onClose }: { initial: Article | null; categories: string[]; onSave: (a: Article) => void; onClose: () => void }) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [category, setCategory] = useState(initial?.category ?? categories[0] ?? 'Setup');
  const [newCat, setNewCat] = useState('');
  const [tagsRaw, setTagsRaw] = useState(initial?.tags.join(', ') ?? '');
  const [readTime, setReadTime] = useState(initial?.readTime ?? '5 min');
  const [pinned, setPinned] = useState(initial?.pinned ?? false);
  const [body, setBody] = useState(initial?.body ?? '');
  const [showNewCat, setShowNewCat] = useState(false);

  const allCats = [...new Set([...categories, category])].filter(Boolean);

  const handleSave = () => {
    if (!title.trim()) return;
    const cat = (showNewCat && newCat.trim()) ? newCat.trim() : category;
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      title: title.trim(),
      category: cat,
      tags: tagsRaw.split(',').map(t => t.trim()).filter(Boolean),
      updated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      readTime: readTime.trim() || '5 min',
      pinned,
      body: body.trim(),
    });
  };

  const inp = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--foreground)', padding: '8px 12px', fontSize: 13, width: '100%', outline: 'none' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }} onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg mx-4 rounded-2xl overflow-hidden"
        style={{ background: 'rgba(18,13,10,0.98)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{initial ? 'Edit Article' : 'New Article'}</h2>
          <button onClick={onClose} style={{ color: 'var(--muted-foreground)' }}><X size={16} /></button>
        </div>

        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="text-[10px] tracking-widest uppercase mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Title</label>
            <input style={inp} value={title} onChange={e => setTitle(e.target.value)} placeholder="Article title" />
          </div>
          <div>
            <label className="text-[10px] tracking-widest uppercase mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Category</label>
            {!showNewCat ? (
              <div className="flex gap-2">
                <select style={{ ...inp, flex: 1 }} value={category} onChange={e => setCategory(e.target.value)}>
                  {allCats.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button onClick={() => setShowNewCat(true)} className="px-3 py-2 rounded-lg text-xs" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--muted-foreground)', border: '1px solid rgba(255,255,255,0.1)', whiteSpace: 'nowrap' }}>+ New</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input style={{ ...inp, flex: 1 }} value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="New category name" autoFocus />
                <button onClick={() => setShowNewCat(false)} className="px-3 py-2 rounded-lg text-xs" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--muted-foreground)', border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
              </div>
            )}
          </div>
          <div>
            <label className="text-[10px] tracking-widest uppercase mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Tags <span style={{ opacity: 0.5 }}>(comma separated)</span></label>
            <input style={inp} value={tagsRaw} onChange={e => setTagsRaw(e.target.value)} placeholder="Jamf, MDM, Setup" />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-[10px] tracking-widest uppercase mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Read Time</label>
              <input style={inp} value={readTime} onChange={e => setReadTime(e.target.value)} placeholder="5 min" />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <div onClick={() => setPinned(p => !p)} className="w-9 h-5 rounded-full transition-colors relative" style={{ background: pinned ? 'rgba(224,112,96,0.3)' : 'rgba(255,255,255,0.08)', border: pinned ? '1px solid rgba(224,112,96,0.4)' : '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="absolute top-0.5 w-4 h-4 rounded-full transition-all" style={{ background: pinned ? '#E07060' : 'rgba(255,255,255,0.3)', left: pinned ? '18px' : '2px' }} />
                </div>
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Pinned</span>
              </label>
            </div>
          </div>
          <div>
            <label className="text-[10px] tracking-widest uppercase mb-1.5 block" style={{ color: 'var(--muted-foreground)' }}>Content <span style={{ opacity: 0.5 }}>(optional)</span></label>
            <textarea style={{ ...inp, height: 100, resize: 'vertical' as const }} value={body} onChange={e => setBody(e.target.value)} placeholder="Article body or notes..." />
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-medium" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--muted-foreground)', border: '1px solid rgba(255,255,255,0.08)' }}>Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg text-xs font-medium" style={{ background: 'rgba(224,112,96,0.15)', color: '#E07060', border: '1px solid rgba(224,112,96,0.3)' }}>Save</button>
        </div>
      </motion.div>
    </div>
  );
}

export function KnowledgeBase() {
  const [articles, setArticles] = useState<Article[]>(loadArticles);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [modal, setModal] = useState<{ open: boolean; editing: Article | null }>({ open: false, editing: null });

  useEffect(() => { saveArticles(articles); }, [articles]);

  const categories = ['All', ...Array.from(new Set(articles.map(a => a.category))).sort()];

  const filtered = articles.filter(a => {
    const matchesCat = category === 'All' || a.category === category;
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleSave = (a: Article) => {
    setArticles(prev => {
      const idx = prev.findIndex(x => x.id === a.id);
      return idx >= 0 ? prev.map(x => x.id === a.id ? a : x) : [a, ...prev];
    });
    setModal({ open: false, editing: null });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this article?')) setArticles(prev => prev.filter(a => a.id !== id));
  };

  const glass = { background: 'rgba(22,16,12,0.55)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 'var(--radius)' };
  const catColor = (cat: string) => CATEGORY_COLORS[cat] || '#E07060';

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-1" style={{ color: 'var(--neon-blue)' }}>Reference</p>
          <h1 className="text-2xl font-medium" style={{ color: 'var(--foreground)', letterSpacing: '-0.025em' }}>Knowledge Base</h1>
        </div>
        <button onClick={() => setModal({ open: true, editing: null })} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all" style={{ background: 'rgba(224,112,96,0.1)', border: '1px solid rgba(224,112,96,0.2)', color: '#E07060' }}>
          <Plus size={15} /> New Article
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="relative mb-4">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
        <input type="text" placeholder="Search articles, tags..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 text-sm rounded-xl focus:outline-none transition-all" style={{ ...glass, borderRadius: '0.75rem', color: 'var(--foreground)' }}
          onFocus={e => { (e.target as HTMLElement).style.borderColor = 'rgba(224,112,96,0.3)'; }}
          onBlur={e => { (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; }}
        />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex gap-2 flex-wrap mb-5">
        {categories.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200" style={{ background: category === cat ? 'rgba(224,112,96,0.12)' : 'rgba(255,255,255,0.04)', color: category === cat ? 'var(--neon-blue)' : 'var(--muted-foreground)', border: category === cat ? '1px solid rgba(224,112,96,0.25)' : '1px solid rgba(255,255,255,0.06)' }}>
            {cat}
          </button>
        ))}
      </motion.div>

      {filtered.some(a => a.pinned) && category === 'All' && !search && (
        <div className="mb-5">
          <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-3" style={{ color: 'var(--muted-foreground)' }}>Pinned</p>
          <div className="grid grid-cols-2 gap-3">
            {filtered.filter(a => a.pinned).map((article, i) => (
              <motion.div key={article.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="p-5 rounded-xl cursor-pointer transition-all duration-200 group relative"
                style={{ ...glass, borderColor: `${catColor(article.category)}30` }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${catColor(article.category)}40`; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${catColor(article.category)}15`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${catColor(article.category)}30`; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${catColor(article.category)}15`, color: catColor(article.category), border: `1px solid ${catColor(article.category)}30` }}>{article.category}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={e => { e.stopPropagation(); setModal({ open: true, editing: article }); }} className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--muted-foreground)' }}><Pencil size={10} /></button>
                    <button onClick={e => { e.stopPropagation(); handleDelete(article.id); }} className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'rgba(216,96,64,0.1)', color: '#D86040' }}><Trash2 size={10} /></button>
                  </div>
                </div>
                <h3 className="text-sm font-medium mb-2 leading-snug" style={{ color: 'var(--foreground)' }}>{article.title}</h3>
                <p className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>{article.readTime} read · Updated {article.updated}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-3" style={{ color: 'var(--muted-foreground)' }}>
        {filtered.length} Article{filtered.length !== 1 ? 's' : ''}
      </p>
      <motion.div style={glass} className="overflow-hidden">
        {filtered.filter(a => !a.pinned || category !== 'All' || search).map((article, i, arr) => (
          <motion.div key={article.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
            className="flex items-center gap-4 px-5 py-4 transition-all duration-150 group"
            style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${catColor(article.category)}12` }}>
              <BookOpen size={14} style={{ color: catColor(article.category) }} />
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
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button onClick={() => setModal({ open: true, editing: article })} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--muted-foreground)', border: '1px solid rgba(255,255,255,0.08)' }}><Pencil size={11} /></button>
              <button onClick={() => handleDelete(article.id)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(216,96,64,0.08)', color: '#D86040', border: '1px solid rgba(216,96,64,0.15)' }}><Trash2 size={11} /></button>
            </div>
            <ChevronRight size={14} style={{ color: 'var(--muted-foreground)' }} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-1" />
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <BookOpen size={20} style={{ color: 'var(--muted-foreground)' }} />
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>No articles found</p>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {modal.open && (
          <ArticleModal initial={modal.editing} categories={Array.from(new Set(articles.map(a => a.category)))} onSave={handleSave} onClose={() => setModal({ open: false, editing: null })} />
        )}
      </AnimatePresence>
    </div>
  );
}
