#!/bin/bash

echo "重启SEC EDGAR服务器..."

# 停止可能运行的进程
pkill -f "node.*server"
pkill -f "npm.*start"

echo "等待2秒..."
sleep 2

echo "启动服务器..."
npm start