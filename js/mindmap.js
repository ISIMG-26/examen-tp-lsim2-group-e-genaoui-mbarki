// mindmap.js — Mind Map (unified journal) page

const ENTRY_TYPES = [
    { key: 'thought',     label: 'Thought',     emoji: '💭', color: '#7c6fff', desc: 'Stream of consciousness' },
    { key: 'reflection',  label: 'Reflection',  emoji: '🔍', color: '#4ecdc4', desc: 'Look inward' },
    { key: 'gratitude',   label: 'Gratitude',   emoji: '🙏', color: '#ffd166', desc: 'Count your blessings' },
    { key: 'dream',       label: 'Dream',       emoji: '✨', color: '#ff6b9d', desc: 'Visions & goals' },
    { key: 'goal',        label: 'Goal',        emoji: '🎯', color: '#6bcb77', desc: 'Set intentions' },
];

const JOURNAL_TAGS = ['anxiety', 'joy', 'growth', 'relationships', 'work', 'health', 'creativity', 'spirituality', 'money', 'love', 'grief', 'hope', 'fear', 'gratitude'];

let mindmapState = {
    view: 'list',     // 'list' | 'write' | 'read'
    entries: [],
    currentEntry: null,
    prompt: null,
    selectedType: 'thought',
    selectedTags: [],
    autoSaveTimer: null,
    currentId: null,
    wordGoal: 200,
};

function renderMindMapPage(container) {
    container.innerHTML = `
        <div class="page-enter">
            <div class="page-header flex justify-between items-center" style="padding-right:48px">
                <div>
                    <h1 class="page-title">Mind Map</h1>
                    <p class="page-subtitle">Your thoughts, organized. Your mind, explored.</p>
                </div>
                <div style="display:flex;gap:10px">
                    <button class="btn btn-ghost" onclick="showSearch()">🔍 Search</button>
                    <button class="btn btn-primary" onclick="showWriteView()">+ New Entry</button>
                </div>
            </div>
            <div class="page-body" id="mindmapBody"></div>
        </div>
    `;
    showListView();
}

async function showListView() {
    mindmapState.view = 'list';
    const body = document.getElementById('mindmapBody');
    body.innerHTML = `
        <div>
            <!-- Type filter tabs -->
            <div class="pill-tabs" style="margin-bottom:24px">
                <button class="pill-tab active" data-type="all" onclick="filterEntries('all', this)">All</button>
                ${ENTRY_TYPES.map(t => `
                    <button class="pill-tab" data-type="${t.key}" onclick="filterEntries('${t.key}', this)">
                        ${t.emoji} ${t.label}
                    </button>
                `).join('')}
            </div>

            <div id="entriesContainer">
                <div class="text-center" style="padding:60px">
                    <div class="loading-dots"><span></span><span></span><span></span></div>
                </div>
            </div>
        </div>
    `;
    loadEntries('all');
}

async function loadEntries(type = 'all') {
    const url = type === 'all' ? 'api/journal.php?action=list' : `api/journal.php?action=list&type=${type}`;
    const data = await api(url);
    renderEntriesList(data.entries, data.total);
}

function renderEntriesList(entries, total) {
    const container = document.getElementById('entriesContainer');
    if (!entries?.length) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📖</div>
                <div class="empty-title">No entries yet</div>
                <div class="empty-sub">Start writing to fill your mind map.</div>
                <button class="btn btn-primary" style="margin-top:20px" onclick="showWriteView()">Write First Entry</button>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div style="margin-bottom:12px;font-size:13px;color:var(--text-muted)">${total} entries total</div>
        <div style="display:grid;gap:14px">
            ${entries.map(e => {
                const type = ENTRY_TYPES.find(t => t.key === e.entry_type) || ENTRY_TYPES[0];
                const tags = typeof e.tags === 'string' ? JSON.parse(e.tags || '[]') : (e.tags || []);
                return `
                    <div class="card" style="cursor:pointer;transition:all 0.2s;position:relative"
                        onclick="readEntry(${e.id})"
                        onmouseenter="this.style.borderColor='var(--border2)'"
                        onmouseleave="this.style.borderColor='var(--border)'">
                        ${e.is_pinned ? `<div style="position:absolute;top:16px;right:16px;font-size:14px">📌</div>` : ''}
                        <div style="display:flex;align-items:flex-start;gap:14px">
                            <div style="width:40px;height:40px;border-radius:10px;background:${type.color}18;border:1px solid ${type.color}44;
                                display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">
                                ${type.emoji}
                            </div>
                            <div style="flex:1;min-width:0">
                                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                                    <span style="font-size:15px;font-weight:600;color:var(--text)">
                                        ${e.title || `${type.label} — ${formatDate(e.created_at)}`}
                                    </span>
                                </div>
                                <div style="font-size:13px;color:var(--text-muted);line-height:1.6;margin-bottom:8px;
                                    overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">
                                    ${e.preview || ''}
                                </div>
                                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
                                    <span style="font-size:11px;color:${type.color};font-weight:600;text-transform:uppercase;letter-spacing:0.06em">${type.label}</span>
                                    <span style="color:var(--text-dim)">·</span>
                                    <span style="font-size:11px;color:var(--text-dim)">${e.word_count} words</span>
                                    <span style="color:var(--text-dim)">·</span>
                                    <span style="font-size:11px;color:var(--text-dim)">${timeAgo(e.created_at)}</span>
                                    ${tags.slice(0,3).map(t => `<span class="tag" style="pointer-events:none;font-size:10px;padding:2px 8px">#${t}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function filterEntries(type, btn) {
    document.querySelectorAll('.pill-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadEntries(type);
}

async function showWriteView(entryId = null) {
    mindmapState.view = 'write';
    mindmapState.currentId = entryId;
    mindmapState.selectedTags = [];

    // Load prompt
    const promptData = await api('api/journal.php?action=prompt');
    mindmapState.prompt = promptData.prompt;

    let existing = null;
    if (entryId) {
        const d = await api(`api/journal.php?action=get&id=${entryId}`);
        existing = d.entry;
        mindmapState.selectedType = existing.entry_type;
        mindmapState.selectedTags = typeof existing.tags === 'string' ? JSON.parse(existing.tags || '[]') : (existing.tags || []);
    }

    const body = document.getElementById('mindmapBody');
    body.innerHTML = `
        <div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
                <button class="btn btn-ghost btn-sm" onclick="showListView()">← Back</button>
                <div style="display:flex;gap:8px">
                    <span id="wordCountDisplay" style="font-size:13px;color:var(--text-muted);padding:8px 12px">0 words</span>
                    <button class="btn btn-primary btn-sm" onclick="saveEntry()">Save Entry</button>
                </div>
            </div>

            <div class="grid-2" style="gap:24px;align-items:start">
                <div>
                    <!-- Type selector -->
                    <div class="card" style="margin-bottom:16px">
                        <div class="section-title">Entry Type</div>
                        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px" id="typeGrid">
                            ${ENTRY_TYPES.map(t => `
                                <button class="type-btn" id="type-${t.key}" data-key="${t.key}"
                                    style="padding:10px 8px;border-radius:10px;border:1px solid var(--border);
                                    background:var(--surface3);cursor:pointer;color:var(--text);
                                    font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;transition:all 0.2s;
                                    display:flex;flex-direction:column;align-items:center;gap:4px"
                                    onclick="selectEntryType('${t.key}')">
                                    <span style="font-size:18px">${t.emoji}</span>${t.label}
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Daily prompt -->
                    ${mindmapState.prompt ? `
                        <div class="card" style="margin-bottom:16px;border-color:rgba(124,111,255,0.2);background:var(--accent-light)">
                            <div style="font-size:11px;font-weight:600;color:var(--accent);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px">
                                ✦ Today's Prompt
                            </div>
                            <div style="font-size:15px;line-height:1.6;color:var(--text)">${mindmapState.prompt.prompt_text}</div>
                            <button class="btn btn-ghost btn-sm" style="margin-top:10px" onclick="usePrompt()">
                                Use this prompt →
                            </button>
                        </div>
                    ` : ''}

                    <!-- Tags -->
                    <div class="card" style="margin-bottom:16px">
                        <div class="section-title">Tags</div>
                        <div style="display:flex;flex-wrap:wrap;gap:6px" id="tagGrid">
                            ${JOURNAL_TAGS.map(t => `
                                <span class="tag ${mindmapState.selectedTags.includes(t) ? 'active' : ''}"
                                    onclick="toggleJournalTag('${t}', this)">#${t}</span>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Word goal -->
                    <div class="card">
                        <div class="section-title">Word Goal</div>
                        <div style="display:flex;gap:8px;flex-wrap:wrap">
                            ${[50, 100, 200, 500].map(g => `
                                <button class="btn btn-sm ${g === 200 ? 'btn-primary' : 'btn-ghost'}" onclick="setWordGoal(${g}, this)">${g}</button>
                            `).join('')}
                        </div>
                        <div id="goalProgress" style="margin-top:12px">
                            <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                                <span style="font-size:12px;color:var(--text-muted)">Progress</span>
                                <span id="goalPct" style="font-size:12px;color:var(--accent)">0%</span>
                            </div>
                            <div style="height:4px;background:var(--surface3);border-radius:2px">
                                <div id="goalBar" style="height:100%;background:var(--accent);border-radius:2px;width:0%;transition:width 0.3s"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <!-- Title -->
                    <div class="card" style="margin-bottom:16px">
                        <input class="input" id="entryTitle" placeholder="Title (optional)"
                            style="font-size:18px;font-family:'Playfair Display',serif;background:transparent;border:none;padding:0;border-radius:0"
                            value="${existing?.title || ''}">
                    </div>

                    <!-- Editor -->
                    <div class="card" style="margin-bottom:16px">
                        <div style="display:flex;gap:8px;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--border)">
                            <button class="btn btn-ghost btn-sm" onclick="formatText('bold')"><b>B</b></button>
                            <button class="btn btn-ghost btn-sm" onclick="formatText('italic')"><i>I</i></button>
                            <button class="btn btn-ghost btn-sm" onclick="formatText('list')">≡</button>
                        </div>
                        <textarea class="input" id="entryContent" rows="20"
                            style="border:none;padding:0;background:transparent;border-radius:0;font-size:15px;line-height:1.9;resize:none;min-height:400px"
                            placeholder="Begin writing... let it flow without judgment."
                            oninput="onContentInput(this.value)">${existing?.content || ''}</textarea>
                    </div>

                    <button class="btn btn-primary btn-full btn-lg" onclick="saveEntry()">
                        Save to Mind Map ✦
                    </button>
                </div>
            </div>
        </div>
    `;

    // Select active type
    selectEntryType(mindmapState.selectedType);

    // Init word count
    if (existing?.content) onContentInput(existing.content);
}

function selectEntryType(key) {
    mindmapState.selectedType = key;
    document.querySelectorAll('.type-btn').forEach(b => {
        const type = ENTRY_TYPES.find(t => t.key === b.dataset.key);
        b.style.borderColor = 'var(--border)';
        b.style.background = 'var(--surface3)';
        b.style.color = 'var(--text)';
    });
    const btn = document.getElementById(`type-${key}`);
    const type = ENTRY_TYPES.find(t => t.key === key);
    if (btn && type) {
        btn.style.borderColor = type.color;
        btn.style.background = `${type.color}18`;
        btn.style.color = type.color;
    }
}

function toggleJournalTag(tag, el) {
    const idx = mindmapState.selectedTags.indexOf(tag);
    if (idx > -1) { mindmapState.selectedTags.splice(idx, 1); el.classList.remove('active'); }
    else { mindmapState.selectedTags.push(tag); el.classList.add('active'); }
}

function setWordGoal(goal, btn) {
    mindmapState.wordGoal = goal;
    document.querySelectorAll('#goalProgress').length;
    btn.closest('.card').querySelectorAll('.btn').forEach(b => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-ghost');
    });
    btn.classList.add('btn-primary');
    btn.classList.remove('btn-ghost');
    const content = document.getElementById('entryContent').value;
    onContentInput(content);
}

function onContentInput(value) {
    const wc = wordCount(value);
    document.getElementById('wordCountDisplay').textContent = `${wc} words`;
    const pct = Math.min(100, Math.round((wc / mindmapState.wordGoal) * 100));
    document.getElementById('goalPct').textContent = `${pct}%`;
    document.getElementById('goalBar').style.width = `${pct}%`;
    if (pct >= 100) {
        document.getElementById('goalBar').style.background = 'var(--green)';
    }

    // Auto-save draft
    clearTimeout(mindmapState.autoSaveTimer);
    mindmapState.autoSaveTimer = setTimeout(() => {
        if (mindmapState.currentId) saveEntry(true);
    }, 3000);
}

function usePrompt() {
    const content = document.getElementById('entryContent');
    if (content.value.trim()) {
        content.value += '\n\n' + mindmapState.prompt.prompt_text + '\n';
    } else {
        content.value = mindmapState.prompt.prompt_text + '\n\n';
    }
    content.focus();
    onContentInput(content.value);
}

function formatText(type) {
    const ta = document.getElementById('entryContent');
    const start = ta.selectionStart, end = ta.selectionEnd;
    const selected = ta.value.substring(start, end);
    let replacement = selected;
    if (type === 'bold') replacement = `**${selected}**`;
    else if (type === 'italic') replacement = `_${selected}_`;
    else if (type === 'list') replacement = `\n- ${selected || 'item'}`;
    ta.value = ta.value.substring(0, start) + replacement + ta.value.substring(end);
    ta.focus();
    onContentInput(ta.value);
}

async function saveEntry(silent = false) {
    const title = document.getElementById('entryTitle')?.value || '';
    const content = document.getElementById('entryContent')?.value || '';
    if (!content.trim()) {
        if (!silent) toast('Write something first!', 'error');
        return;
    }

    const payload = {
        title,
        content,
        type: mindmapState.selectedType,
        tags: mindmapState.selectedTags,
        prompt: mindmapState.prompt?.prompt_text || '',
    };

    if (mindmapState.currentId) {
        payload.id = mindmapState.currentId;
        await api('api/journal.php?action=update', { method: 'POST', body: JSON.stringify(payload) });
    } else {
        const result = await api('api/journal.php?action=create', { method: 'POST', body: JSON.stringify(payload) });
        if (result.id) mindmapState.currentId = result.id;
    }

    if (!silent) {
        toast('Entry saved to your Mind Map ✦', 'success');
        showListView();
    }
}

async function readEntry(id) {
    const data = await api(`api/journal.php?action=get&id=${id}`);
    const entry = data.entry;
    if (!entry) return;

    const type = ENTRY_TYPES.find(t => t.key === entry.entry_type) || ENTRY_TYPES[0];
    const tags = typeof entry.tags === 'string' ? JSON.parse(entry.tags || '[]') : (entry.tags || []);

    const body = document.getElementById('mindmapBody');
    body.innerHTML = `
        <div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px">
                <button class="btn btn-ghost btn-sm" onclick="showListView()">← Back</button>
                <div style="display:flex;gap:8px">
                    <button class="btn btn-ghost btn-sm" onclick="showWriteView(${id})">✎ Edit</button>
                    <button class="btn btn-ghost btn-sm" onclick="pinEntry(${id}, this)">
                        ${entry.is_pinned ? '📌 Pinned' : '📌 Pin'}
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteEntry(${id})">🗑 Delete</button>
                </div>
            </div>

            <div class="card" style="max-width:720px;margin:0 auto;padding:48px">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px">
                    <div style="width:36px;height:36px;border-radius:10px;background:${type.color}18;border:1px solid ${type.color}44;
                        display:flex;align-items:center;justify-content:center;font-size:16px">${type.emoji}</div>
                    <div>
                        <div style="font-size:11px;color:${type.color};font-weight:600;text-transform:uppercase;letter-spacing:0.06em">${type.label}</div>
                        <div style="font-size:12px;color:var(--text-muted)">${formatDate(entry.created_at)} · ${entry.word_count} words</div>
                    </div>
                </div>

                ${entry.title ? `<h1 style="font-family:'Playfair Display',serif;font-size:28px;font-weight:700;margin-bottom:20px;line-height:1.3">${entry.title}</h1>` : ''}

                <div style="font-size:15px;line-height:1.9;color:var(--text);white-space:pre-wrap">${entry.content}</div>

                ${tags.length ? `
                    <div style="margin-top:28px;padding-top:20px;border-top:1px solid var(--border);display:flex;gap:8px;flex-wrap:wrap">
                        ${tags.map(t => `<span class="tag" style="pointer-events:none">#${t}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

async function pinEntry(id, btn) {
    await api('api/journal.php?action=pin', { method: 'POST', body: JSON.stringify({ id }) });
    toast('Entry pin toggled', 'info');
}

async function deleteEntry(id) {
    if (!confirm('Delete this entry? This cannot be undone.')) return;
    await api('api/journal.php?action=delete', { method: 'POST', body: JSON.stringify({ id }) });
    toast('Entry deleted', 'info');
    showListView();
}

function showSearch() {
    const body = document.getElementById('mindmapBody');
    body.innerHTML = `
        <div>
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
                <button class="btn btn-ghost btn-sm" onclick="showListView()">← Back</button>
                <input class="input" id="searchInput" placeholder="Search your entries..." autofocus
                    oninput="searchEntries(this.value)" style="flex:1">
            </div>
            <div id="searchResults">
                <div class="empty-state" style="padding:40px">
                    <div class="empty-icon">🔍</div>
                    <div class="empty-title">Start typing to search</div>
                </div>
            </div>
        </div>
    `;
}

async function searchEntries(q) {
    if (q.length < 2) return;
    const data = await api(`api/journal.php?action=search&q=${encodeURIComponent(q)}`);
    const container = document.getElementById('searchResults');
    if (!data.entries?.length) {
        container.innerHTML = `<div class="empty-state"><div class="empty-sub">No results for "${q}"</div></div>`;
        return;
    }
    container.innerHTML = data.entries.map(e => {
        const type = ENTRY_TYPES.find(t => t.key === e.entry_type) || ENTRY_TYPES[0];
        return `
            <div class="card" style="margin-bottom:10px;cursor:pointer" onclick="readEntry(${e.id})">
                <div style="display:flex;align-items:center;gap:10px">
                    <span style="font-size:18px">${type.emoji}</span>
                    <div>
                        <div style="font-size:14px;font-weight:500">${e.title || type.label}</div>
                        <div style="font-size:12px;color:var(--text-muted)">${e.preview}</div>
                        <div style="font-size:11px;color:var(--text-dim);margin-top:4px">${timeAgo(e.created_at)}</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

window.renderMindMapPage = renderMindMapPage;
window.showWriteView = showWriteView;
window.showListView = showListView;
window.saveEntry = saveEntry;
window.readEntry = readEntry;
window.deleteEntry = deleteEntry;
window.pinEntry = pinEntry;
window.filterEntries = filterEntries;
window.selectEntryType = selectEntryType;
window.toggleJournalTag = toggleJournalTag;
window.setWordGoal = setWordGoal;
window.onContentInput = onContentInput;
window.usePrompt = usePrompt;
window.formatText = formatText;
window.showSearch = showSearch;
window.searchEntries = searchEntries;