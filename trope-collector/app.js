// 桥段素材库应用逻辑 v2.0 - 支持后端API

const API_BASE_URL = localStorage.getItem('api_base_url') || '';
const USE_API = !!API_BASE_URL;

let tropesData = {
    categories: [],
    tropes: [],
    platforms: []
};

let currentFilter = 'all';
let currentSubType = 'all';
let searchQuery = '';

// 初始化
document.addEventListener('DOMContentLoaded', async function() {
    await loadData();
    renderCategories();
    renderTropes();
    updateStats();
    populateTypeSelect();
});

// 加载数据
async function loadData() {
    if (USE_API) {
        try {
            // 从API加载
            const [catRes, tropeRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/categories`),
                fetch(`${API_BASE_URL}/api/tropes?limit=1000`)
            ]);
            
            if (catRes.ok && tropeRes.ok) {
                tropesData.categories = await catRes.json();
                tropesData.tropes = await tropeRes.json();
                console.log('已从API加载数据');
                return;
            }
        } catch (e) {
            console.log('API加载失败，回退到本地数据:', e);
        }
    }
    
    // 从本地JSON加载
    try {
        const response = await fetch('data.json');
        if (response.ok) {
            tropesData = await response.json();
        }
    } catch (e) {
        console.log('使用默认数据');
    }
}

// 渲染分类标签
function renderCategories() {
    const container = document.getElementById('categories-bar');
    const allCount = tropesData.tropes.length;
    
    let html = `
        <div class="category-tag ${currentFilter === 'all' ? 'active' : ''}" onclick="filterByCategory('all')">
            全部 <span class="count">${allCount}</span>
        </div>
    `;
    
    tropesData.categories.forEach(cat => {
        const count = tropesData.tropes.filter(t => t.category === cat.id || t.type === cat.id).length;
        html += `
            <div class="category-tag ${currentFilter === cat.id ? 'active' : ''}" onclick="filterByCategory('${cat.id}')">
                ${cat.name} <span class="count">${count}</span>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // 渲染子类型筛选
    renderSubTypes();
}

// 渲染子类型
function renderSubTypes() {
    let container = document.getElementById('subtypes-bar');
    if (!container) {
        container = document.createElement('div');
        container.id = 'subtypes-bar';
        container.className = 'subtypes-bar';
        container.style.cssText = 'display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap;padding:0 20px;';
        document.querySelector('.categories-bar').after(container);
    }
    
    if (currentFilter === 'all') {
        container.innerHTML = '';
        return;
    }
    
    const category = tropesData.categories.find(c => c.id === currentFilter);
    if (!category || !category.sub_types) {
        container.innerHTML = '';
        return;
    }
    
    let html = `
        <div class="subtype-tag ${currentSubType === 'all' ? 'active' : ''}" onclick="filterBySubType('all')">
            全部
        </div>
    `;
    
    category.sub_types.forEach(subType => {
        const count = tropesData.tropes.filter(t => 
            (t.category === currentFilter || t.type === currentFilter) && 
            (t.sub_type === subType || t.subType === subType)
        ).length;
        html += `
            <div class="subtype-tag ${currentSubType === subType ? 'active' : ''}" onclick="filterBySubType('${subType}')">
                ${subType} (${count})
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// 渲染桥段列表
function renderTropes() {
    const container = document.getElementById('tropes-grid');
    let filtered = tropesData.tropes;
    
    // 分类筛选
    if (currentFilter !== 'all') {
        filtered = filtered.filter(t => t.category === currentFilter || t.type === currentFilter);
    }
    
    // 子类型筛选
    if (currentSubType !== 'all') {
        filtered = filtered.filter(t => t.sub_type === currentSubType || t.subType === currentSubType);
    }
    
    // 搜索筛选
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(t => 
            (t.title && t.title.toLowerCase().includes(q)) ||
            (t.content && t.content.toLowerCase().includes(q)) ||
            (t.book && t.book.toLowerCase().includes(q)) ||
            (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
        );
    }
    
    // 排序
    const sortType = document.getElementById('sort-select').value;
    if (sortType === 'newest') {
        filtered.sort((a, b) => (b.created_at || b.createdAt || 0) - (a.created_at || a.createdAt || 0));
    } else if (sortType === 'popular') {
        filtered.sort((a, b) => (b.use_count || b.useCount || 0) - (a.use_count || a.useCount || 0));
    }
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="empty-state-icon">📝</div>
                <h3>暂无桥段</h3>
                <p>点击"添加桥段"开始收集素材</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(trope => renderTropeCard(trope)).join('');
}

// 渲染单个桥段卡片
function renderTropeCard(trope) {
    const category = tropesData.categories.find(c => c.id === (trope.category || trope.type));
    const typeClass = `type-${trope.category || trope.type || 'default'}`;
    const typeName = category ? category.name : (trope.sub_type || trope.subType || '未分类');
    
    const tagsHtml = trope.tags ? trope.tags.map(tag => 
        `<span class="trope-tag">${tag}</span>`
    ).join('') : '';
    
    const useCount = trope.use_count || trope.useCount || 0;
    const isUserAdded = trope.is_user_added || trope.isUserAdded;
    
    return `
        <div class="trope-card">
            <div class="trope-header">
                <div>
                    <span class="trope-type ${typeClass}">${typeName}</span>
                    ${trope.sub_type || trope.subType ? `<span style="font-size:11px;color:#888;margin-left:8px;">${trope.sub_type || trope.subType}</span>` : ''}
                </div>
                <div class="trope-actions">
                    <button onclick="useTrope('${trope.id}')" title="使用">✓</button>
                    <button onclick="copyTrope('${trope.id}')" title="复制">📋</button>
                    ${isUserAdded ? `<button onclick="deleteTrope('${trope.id}')" title="删除">🗑</button>` : ''}
                </div>
            </div>
            <div class="trope-title">${trope.title}</div>
            <div class="trope-content">${trope.content}</div>
            ${tagsHtml ? `<div class="trope-tags">${tagsHtml}</div>` : ''}
            <div class="trope-source">
                ${trope.book ? `<span class="book">📚 ${trope.book}</span>` : ''}
                ${trope.author ? `<span>✍️ ${trope.author}</span>` : ''}
                ${trope.year ? `<span>📅 ${trope.year}</span>` : ''}
                ${trope.source ? `<span style="color:#666;">📍 ${trope.source}</span>` : ''}
                ${useCount > 0 ? `<span style="margin-left:auto;">使用 ${useCount} 次</span>` : ''}
            </div>
        </div>
    `;
}

// 按分类筛选
function filterByCategory(categoryId) {
    currentFilter = categoryId;
    currentSubType = 'all';
    renderCategories();
    renderTropes();
}

// 按子类型筛选
function filterBySubType(subType) {
    currentSubType = subType;
    renderSubTypes();
    renderTropes();
}

// 搜索
function searchTropes() {
    searchQuery = document.getElementById('search-input').value;
    renderTropes();
}

// 排序
function sortTropes() {
    renderTropes();
}

// 打开添加弹窗
function openModal() {
    document.getElementById('add-modal').classList.add('active');
    document.getElementById('trope-form').reset();
    populateTypeSelect();
}

// 关闭弹窗
function closeModal() {
    document.getElementById('add-modal').classList.remove('active');
}

// 填充类型选择框
function populateTypeSelect() {
    const categorySelect = document.getElementById('trope-category');
    const subTypeSelect = document.getElementById('trope-subtype');
    
    if (!categorySelect) return;
    
    // 如果没有category选择框，创建一个
    if (categorySelect.options.length === 0) {
        tropesData.categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            categorySelect.appendChild(option);
        });
    }
    
    // 更新子类型选项
    if (subTypeSelect) {
        const selectedCategory = tropesData.categories.find(c => c.id === categorySelect.value);
        subTypeSelect.innerHTML = '<option value="">选择子类型...</option>';
        
        if (selectedCategory && selectedCategory.sub_types) {
            selectedCategory.sub_types.forEach(subType => {
                const option = document.createElement('option');
                option.value = subType;
                option.textContent = subType;
                subTypeSelect.appendChild(option);
            });
        }
    }
}

// 保存桥段
async function saveTrope(event) {
    event.preventDefault();
    
    const categorySelect = document.getElementById('trope-category') || document.getElementById('trope-type');
    const subTypeSelect = document.getElementById('trope-subtype');
    
    const tagsInput = document.getElementById('trope-tags').value;
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];
    
    const newTrope = {
        category: categorySelect ? categorySelect.value : document.getElementById('trope-type').value,
        sub_type: subTypeSelect ? subTypeSelect.value : null,
        title: document.getElementById('trope-title').value,
        content: document.getElementById('trope-content').value,
        book: document.getElementById('trope-book').value,
        author: document.getElementById('trope-author').value,
        year: parseInt(document.getElementById('trope-year').value) || null,
        tags: tags,
        source: '用户添加'
    };
    
    if (USE_API) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/tropes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTrope)
            });
            
            if (response.ok) {
                await loadData();
                renderCategories();
                renderTropes();
                updateStats();
                closeModal();
                showNotification('桥段已保存到数据库！');
                return;
            }
        } catch (e) {
            console.error('API保存失败:', e);
        }
    }
    
    // 本地保存
    newTrope.id = 'trope_' + Date.now();
    newTrope.createdAt = Date.now();
    newTrope.useCount = 0;
    newTrope.isUserAdded = true;
    
    tropesData.tropes.push(newTrope);
    
    renderCategories();
    renderTropes();
    updateStats();
    closeModal();
    showNotification('桥段已保存！');
}

// 使用桥段（增加计数）
async function useTrope(id) {
    const trope = tropesData.tropes.find(t => t.id === id);
    if (!trope) return;
    
    if (USE_API) {
        try {
            await fetch(`${API_BASE_URL}/api/tropes/${id}/use`, { method: 'POST' });
        } catch (e) {
            console.error('API更新失败:', e);
        }
    }
    
    trope.use_count = (trope.use_count || trope.useCount || 0) + 1;
    if (trope.useCount !== undefined) trope.useCount++;
    
    renderTropes();
    showNotification('使用次数 +1');
}

// 复制桥段内容
function copyTrope(id) {
    const trope = tropesData.tropes.find(t => t.id === id);
    if (!trope) return;
    
    const text = `${trope.title}\n${trope.content}\n——《${trope.book || '未知'}》`;
    navigator.clipboard.writeText(text).then(() => {
        showNotification('已复制到剪贴板');
    });
}

// 删除桥段
async function deleteTrope(id) {
    if (!confirm('确定删除这个桥段吗？')) return;
    
    if (USE_API) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/tropes/${id}`, { method: 'DELETE' });
            if (response.ok) {
                await loadData();
                renderCategories();
                renderTropes();
                updateStats();
                showNotification('已删除');
                return;
            }
        } catch (e) {
            console.error('API删除失败:', e);
        }
    }
    
    tropesData.tropes = tropesData.tropes.filter(t => t.id !== id);
    renderCategories();
    renderTropes();
    updateStats();
    showNotification('已删除');
}

// 随机灵感
function showInspiration() {
    document.getElementById('inspiration-box').style.display = 'block';
    randomTrope();
}

function randomTrope() {
    if (tropesData.tropes.length === 0) {
        document.getElementById('inspiration-content').textContent = '暂无桥段，请先添加一些素材';
        return;
    }
    
    // 可以按分类筛选后随机
    let filtered = tropesData.tropes;
    if (currentFilter !== 'all') {
        filtered = filtered.filter(t => t.category === currentFilter || t.type === currentFilter);
    }
    if (currentSubType !== 'all') {
        filtered = filtered.filter(t => t.sub_type === currentSubType || t.subType === currentSubType);
    }
    
    const pool = filtered.length > 0 ? filtered : tropesData.tropes;
    const random = pool[Math.floor(Math.random() * pool.length)];
    
    const category = tropesData.categories.find(c => c.id === (random.category || random.type));
    const subType = random.sub_type || random.subType;
    
    document.getElementById('inspiration-content').innerHTML = `
        <strong style="color:#e94560">[${category ? category.name : '未分类'}${subType ? ' · ' + subType : ''}]</strong> ${random.title}<br>
        <span style="color:#ccc;font-size:14px">${random.content}</span>
    `;
}

// 更新统计
async function updateStats() {
    if (USE_API) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/stats`);
            if (response.ok) {
                const stats = await response.json();
                document.getElementById('total-count').textContent = stats.total_tropes || 0;
                document.getElementById('category-count').textContent = stats.total_categories || 9;
                document.getElementById('today-count').textContent = stats.today_tropes || 0;
                return;
            }
        } catch (e) {
            console.error('获取统计失败:', e);
        }
    }
    
    // 本地统计
    document.getElementById('total-count').textContent = tropesData.tropes.length;
    document.getElementById('category-count').textContent = tropesData.categories.length;
    
    const today = new Date().toDateString();
    const todayCount = tropesData.tropes.filter(t => {
        const created = t.created_at || t.createdAt;
        if (!created) return false;
        return new Date(created).toDateString() === today;
    }).length;
    document.getElementById('today-count').textContent = todayCount;
}

// 通知提示
function showNotification(message) {
    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #e94560;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    notif.textContent = message;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 2000);
}

// 设置API地址
function setApiUrl(url) {
    if (url) {
        localStorage.setItem('api_base_url', url);
        location.reload();
    } else {
        localStorage.removeItem('api_base_url');
        location.reload();
    }
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .subtype-tag {
        padding: 6px 12px;
        border-radius: 15px;
        background: rgba(255,255,255,0.05);
        cursor: pointer;
        transition: all 0.3s;
        font-size: 12px;
        border: 1px solid rgba(255,255,255,0.1);
    }
    .subtype-tag:hover {
        background: rgba(233, 69, 96, 0.2);
        border-color: rgba(233, 69, 96, 0.5);
    }
    .subtype-tag.active {
        background: rgba(233, 69, 96, 0.3);
        border-color: #e94560;
        color: #e94560;
    }
`;
document.head.appendChild(style);

// 点击模态框外部关闭
document.addEventListener('click', function(e) {
    if (e.target.id === 'add-modal') closeModal();
});
