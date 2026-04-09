// 桥段素材库应用逻辑

let tropesData = {
    categories: [],
    tropes: [],
    sources: []
};

let currentFilter = 'all';
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
    try {
        const response = await fetch('data.json');
        if (response.ok) {
            tropesData = await response.json();
        }
    } catch (e) {
        console.log('使用默认数据');
    }
    
    // 从localStorage加载用户添加的数据
    const savedTropes = localStorage.getItem('tropeCollector_tropes');
    if (savedTropes) {
        const userTropes = JSON.parse(savedTropes);
        tropesData.tropes = [...tropesData.tropes, ...userTropes];
    }
}

// 保存数据到localStorage
function saveToLocalStorage() {
    const userTropes = tropesData.tropes.filter(t => t.isUserAdded);
    localStorage.setItem('tropeCollector_tropes', JSON.stringify(userTropes));
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
        const count = tropesData.tropes.filter(t => t.type === cat.id).length;
        html += `
            <div class="category-tag ${currentFilter === cat.id ? 'active' : ''}" onclick="filterByCategory('${cat.id}')">
                ${cat.name} <span class="count">${count}</span>
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
        filtered = filtered.filter(t => t.type === currentFilter);
    }
    
    // 搜索筛选
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(t => 
            t.title.toLowerCase().includes(q) ||
            t.content.toLowerCase().includes(q) ||
            (t.book && t.book.toLowerCase().includes(q)) ||
            (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
        );
    }
    
    // 排序
    const sortType = document.getElementById('sort-select').value;
    if (sortType === 'newest') {
        filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    } else if (sortType === 'popular') {
        filtered.sort((a, b) => (b.useCount || 0) - (a.useCount || 0));
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
    const category = tropesData.categories.find(c => c.id === trope.type);
    const typeClass = `type-${trope.type}`;
    const typeName = category ? category.name : trope.type;
    
    const tagsHtml = trope.tags ? trope.tags.map(tag => 
        `<span class="trope-tag">${tag}</span>`
    ).join('') : '';
    
    return `
        <div class="trope-card">
            <div class="trope-header">
                <span class="trope-type ${typeClass}">${typeName}</span>
                <div class="trope-actions">
                    <button onclick="useTrope('${trope.id}')" title="使用">✓</button>
                    <button onclick="copyTrope('${trope.id}')" title="复制">📋</button>
                    ${trope.isUserAdded ? `<button onclick="deleteTrope('${trope.id}')" title="删除">🗑</button>` : ''}
                </div>
            </div>
            <div class="trope-title">${trope.title}</div>
            <div class="trope-content">${trope.content}</div>
            ${tagsHtml ? `<div class="trope-tags">${tagsHtml}</div>` : ''}
            <div class="trope-source">
                ${trope.book ? `<span class="book">📚 ${trope.book}</span>` : ''}
                ${trope.author ? `<span>✍️ ${trope.author}</span>` : ''}
                ${trope.year ? `<span>📅 ${trope.year}</span>` : ''}
                ${trope.useCount ? `<span style="margin-left:auto;">使用 ${trope.useCount} 次</span>` : ''}
            </div>
        </div>
    `;
}

// 按分类筛选
function filterByCategory(categoryId) {
    currentFilter = categoryId;
    renderCategories();
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
}

// 关闭弹窗
function closeModal() {
    document.getElementById('add-modal').classList.remove('active');
}

// 填充类型选择框
function populateTypeSelect() {
    const select = document.getElementById('trope-type');
    tropesData.categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
    });
}

// 保存桥段
function saveTrope(event) {
    event.preventDefault();
    
    const tagsInput = document.getElementById('trope-tags').value;
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];
    
    const newTrope = {
        id: 'trope_' + Date.now(),
        type: document.getElementById('trope-type').value,
        title: document.getElementById('trope-title').value,
        content: document.getElementById('trope-content').value,
        book: document.getElementById('trope-book').value,
        author: document.getElementById('trope-author').value,
        year: parseInt(document.getElementById('trope-year').value) || null,
        tags: tags,
        createdAt: Date.now(),
        useCount: 0,
        isUserAdded: true
    };
    
    tropesData.tropes.push(newTrope);
    saveToLocalStorage();
    
    renderCategories();
    renderTropes();
    updateStats();
    closeModal();
    
    // 显示成功提示
    showNotification('桥段已保存！');
}

// 使用桥段（增加计数）
function useTrope(id) {
    const trope = tropesData.tropes.find(t => t.id === id);
    if (trope) {
        trope.useCount = (trope.useCount || 0) + 1;
        if (trope.isUserAdded) {
            saveToLocalStorage();
        }
        renderTropes();
        showNotification('使用次数 +1');
    }
}

// 复制桥段内容
function copyTrope(id) {
    const trope = tropesData.tropes.find(t => t.id === id);
    if (trope) {
        const text = `${trope.title}\n${trope.content}\n——《${trope.book || '未知'}》`;
        navigator.clipboard.writeText(text).then(() => {
            showNotification('已复制到剪贴板');
        });
    }
}

// 删除桥段
function deleteTrope(id) {
    if (confirm('确定删除这个桥段吗？')) {
        tropesData.tropes = tropesData.tropes.filter(t => t.id !== id);
        saveToLocalStorage();
        renderCategories();
        renderTropes();
        updateStats();
        showNotification('已删除');
    }
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
    const random = tropesData.tropes[Math.floor(Math.random() * tropesData.tropes.length)];
    const category = tropesData.categories.find(c => c.id === random.type);
    document.getElementById('inspiration-content').innerHTML = `
        <strong style="color:#e94560">[${category ? category.name : random.type}]</strong> ${random.title}<br>
        <span style="color:#ccc;font-size:14px">${random.content}</span>
    `;
}

// 更新统计
function updateStats() {
    document.getElementById('total-count').textContent = tropesData.tropes.length;
    
    const today = new Date().toDateString();
    const todayCount = tropesData.tropes.filter(t => {
        if (!t.createdAt) return false;
        return new Date(t.createdAt).toDateString() === today;
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

// 导出数据
function exportData() {
    const dataStr = JSON.stringify(tropesData.tropes.filter(t => t.isUserAdded), null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trope-collector-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// 导入数据
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (Array.isArray(imported)) {
                imported.forEach(t => {
                    t.isUserAdded = true;
                    t.id = 'trope_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                });
                tropesData.tropes = [...tropesData.tropes, ...imported];
                saveToLocalStorage();
                renderCategories();
                renderTropes();
                updateStats();
                showNotification(`成功导入 ${imported.length} 个桥段`);
            }
        } catch (err) {
            alert('导入失败：文件格式错误');
        }
    };
    reader.readAsText(file);
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
`;
document.head.appendChild(style);

// 点击模态框外部关闭
document.getElementById('add-modal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});
