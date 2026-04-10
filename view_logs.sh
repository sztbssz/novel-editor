#!/bin/bash
# 日志查看脚本
# 用法: ./view_logs.sh [选项]

LOG_FILE="/root/.openclaw/workspace/novel-editor/trope_collection.log"
CRON_LOG="/root/.openclaw/workspace/novel-editor/cron.log"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 显示帮助
show_help() {
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  -t, --today       查看今天的采集记录"
    echo "  -a, --all         查看所有采集记录"
    echo "  -s, --stats       查看统计数据"
    echo "  -e, --errors      查看错误信息"
    echo "  -c, --cron        查看定时任务日志"
    echo "  -l, --last        查看最后一次采集"
    echo "  -f, --follow      实时跟踪日志"
    echo "  -h, --help        显示帮助"
    echo ""
    echo "示例:"
    echo "  $0 -t             # 查看今天采集"
    echo "  $0 -s             # 查看统计"
    echo "  $0 -f             # 实时跟踪"
}

# 查看今天的记录
view_today() {
    echo -e "${GREEN}=== 今日采集记录 ===${NC}"
    TODAY=$(date +%Y-%m-%d)
    
    if [ -f "$LOG_FILE" ]; then
        grep "$TODAY" "$LOG_FILE" | tail -50
    else
        echo -e "${RED}日志文件不存在: $LOG_FILE${NC}"
    fi
}

# 查看所有记录
view_all() {
    echo -e "${GREEN}=== 所有采集记录 ===${NC}"
    
    if [ -f "$LOG_FILE" ]; then
        less "$LOG_FILE"
    else
        echo -e "${RED}日志文件不存在: $LOG_FILE${NC}"
    fi
}

# 查看统计
view_stats() {
    echo -e "${GREEN}=== 采集统计 ===${NC}"
    
    if [ -f "$LOG_FILE" ]; then
        echo "总采集次数:"
        grep "开始每日桥段采集" "$LOG_FILE" | wc -l
        
        echo ""
        echo "最近5次采集时间:"
        grep "开始每日桥段采集" "$LOG_FILE" | tail -5
        
        echo ""
        echo "新增桥段统计:"
        grep "新增桥段:" "$LOG_FILE" | tail -5
        
        echo ""
        echo "失败次数统计:"
        grep "采集完成统计" -A 5 "$LOG_FILE" | grep "失败关键词" | tail -5
    else
        echo -e "${RED}日志文件不存在: $LOG_FILE${NC}"
    fi
}

# 查看错误
view_errors() {
    echo -e "${RED}=== 错误信息 ===${NC}"
    
    if [ -f "$LOG_FILE" ]; then
        grep -E "(ERROR|失败|错误)" "$LOG_FILE" | tail -30
    else
        echo -e "${RED}日志文件不存在: $LOG_FILE${NC}"
    fi
}

# 查看定时任务日志
view_cron() {
    echo -e "${GREEN}=== 定时任务日志 ===${NC}"
    
    if [ -f "$CRON_LOG" ]; then
        tail -50 "$CRON_LOG"
    else
        echo -e "${YELLOW}定时任务日志不存在: $CRON_LOG${NC}"
        echo "这是正常的，表示定时任务还未执行过或没有错误输出"
    fi
}

# 查看最后一次采集
view_last() {
    echo -e "${GREEN}=== 最后一次采集 ===${NC}"
    
    if [ -f "$LOG_FILE" ]; then
        # 找到最后一次采集的统计信息
        LAST_LINE=$(grep -n "采集完成统计" "$LOG_FILE" | tail -1 | cut -d: -f1)
        if [ -n "$LAST_LINE" ]; then
            tail -n +$LAST_LINE "$LOG_FILE" | head -10
        else
            echo "未找到采集记录"
        fi
    else
        echo -e "${RED}日志文件不存在: $LOG_FILE${NC}"
    fi
}

# 实时跟踪
view_follow() {
    echo -e "${GREEN}=== 实时跟踪日志 (按 Ctrl+C 退出) ===${NC}"
    
    if [ -f "$LOG_FILE" ]; then
        tail -f "$LOG_FILE"
    else
        echo -e "${RED}日志文件不存在: $LOG_FILE${NC}"
    fi
}

# 主程序
case "${1:-}" in
    -t|--today)
        view_today
        ;;
    -a|--all)
        view_all
        ;;
    -s|--stats)
        view_stats
        ;;
    -e|--errors)
        view_errors
        ;;
    -c|--cron)
        view_cron
        ;;
    -l|--last)
        view_last
        ;;
    -f|--follow)
        view_follow
        ;;
    -h|--help|*)
        show_help
        ;;
esac
