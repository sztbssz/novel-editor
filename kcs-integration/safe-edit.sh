#!/bin/bash
# safe-edit.sh - 安全编辑 launcher.html

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET="$SCRIPT_DIR/../launcher.html"

# 创建备份
backup() {
    local ts=$(date +%Y%m%d-%H%M%S)
    cp "$TARGET" "$TARGET.$ts.bak"
    echo "备份: $TARGET.$ts.bak"
}

# 验证 JS 语法
verify() {
    node -e "
const fs = require('fs');
const html = fs.readFileSync('$TARGET', 'utf-8');
const scripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
let errors = 0;
scripts.forEach((s, i) => {
    const code = s.replace(/<script[^>]*>|<\/script>/gi, '');
    if (!code.trim()) return;
    try {
        new Function(code);
    } catch(e) {
        console.log('Script', i+1, ':', e.message);
        errors++;
    }
});
if (errors) { console.log(errors, 'errors found'); process.exit(1); }
console.log('✅ JS syntax OK');
"
}

# 回滚
rollback() {
    local latest=$(ls -t $TARGET.*.bak 2>/dev/null | head -1)
    if [ -f "$latest" ]; then
        cp "$latest" "$TARGET"
        echo "✅ 已回滚到: $latest"
    else
        echo "❌ 无备份可用"
    fi
}

case "${1:-}" in
    backup) backup ;;
    verify) verify ;;
    rollback) rollback ;;
    *) echo "用法: $0 {backup|verify|rollback}" ;;
esac
