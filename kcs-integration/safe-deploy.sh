#!/bin/bash
# safe-deploy.sh - 安全部署

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

# 检查点
checkpoint() {
    local msg="${1:-deploy-checkpoint}"
    cd /root/.openclaw/workspace
    bash sandbox/checkpoint.sh create "novel-editor" "$msg" 2>/dev/null
}

# 部署
deploy() {
    local msg="${1:-更新 novel-editor}"
    checkpoint "pre-deploy"
    git add .
    git commit -m "$msg" || true
    git push origin master
    echo "✅ 部署完成"
}

case "${1:-}" in
    checkpoint) checkpoint "$2" ;;
    deploy) deploy "$2" ;;
    *) echo "用法: $0 {deploy|checkpoint} [消息]" ;;
esac
