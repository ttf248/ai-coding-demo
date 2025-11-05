@echo off
setlocal enabledelayedexpansion

echo 开始批量重命名图片文件...
set count=0

for %%a in (*.jpg) do (
    set "filename=%%~na"
    set "extension=%%~xa"
    
    rem 提取括号内的数字部分
    set "newname=!filename:*(=!"
    set "newname=!newname:)=!"
    
    rem 检查提取的数字是否有效
    if not "!newname!"=="" if "!newname!" NEQ "!filename!" (
        rem 增加计数器
        set /a count+=1
        
        rem 重命名文件
        echo 正在重命名: %%a -^> !newname!%%~xa
        git mv "%%a" "!newname!%%~xa"
        
        rem 如果计数器达到35则停止
        if !count! EQU 35 goto :done
    )
)

:done
echo 批量重命名完成，共处理 !count! 个文件。
endlocal