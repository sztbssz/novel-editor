#!/bin/bash
# spawn-tracked.sh - 子代理追踪

register() {
    local task="$1"
    local type="${2:-other}"
    local id="sub-$(date +%s)"
    
    cd /root/.openclaw/workspace
    bash sandbox/subagent-tracker.sh register "agent:main:subagent:$id" "$task" "$type" 2>/dev/null || true
    echo "子代理ID: $id"
}

case "${1:-}" in
    register) register "$2" "$3" ;;
    *) echo "用法: $0 register <任务> [类型]" ;;
esac
