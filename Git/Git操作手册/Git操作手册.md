# Git操作手册

## 前言

本文不会深究Git的实现原理以及其文档版本管理机制，本文定位更像是一本工具书，记录一下我们生活中常用的Git操作命令，以便查阅！

---

## 创建Git

| 命令            | 描述           |
| --------------- | -------------- |
| git clone <url> | 克隆远程版本库 |
| git init        | 初始化本地仓库 |



## 修改和提交

| 命令                                                | 描述                       |
| --------------------------------------------------- | -------------------------- |
| git status                                          | 显示暂存区的状态           |
| git diff                                            | 查看变更内容               |
| git add .                                           | 将所有修改添加到暂存区     |
| git add <file>                                      | 将指定文件修改添加到暂存区 |
| git mv <source> <destination/destination directory> | 移动或重命名文件           |
| git rm <file>                                       | 在暂存区中删除指定文件     |
| git commit -m "commit message"                      | 提交所有暂存区的文件       |
| git commit --amend                                  | 修改最后一次提交           |



## 查看日志

| 命令              | 描述                             |
| ----------------- | -------------------------------- |
| git log           | 查看提交历史                     |
| git log -p <file> | 查看指定文件的提交历史           |
| git blame <file>  | 以列表方式查看指定文件的提交历史 |
| git reflog        | 查看所有分支的所有操作记录       |



## 撤销

| 命令                     | 描述                                   |
| ------------------------ | -------------------------------------- |
| git reset --hard HEAD    | 撤销工作目录中所有未提交文件的修改内容 |
| git checkout HEAD <file> | 撤销指定的未提交文件的修改内容         |
| git revert <commit>      | 撤销指定提交                           |



## 分支与标签

| 命令                      | 描述                 |
| ------------------------- | -------------------- |
| git branch                | 显示所有本地分支     |
| git checkout <branch/tag> | 切换到指定分支或标签 |
| git branch <new-branch>   | 创建新的分支         |
| git branch -d  <branch>   | 删除本地分支         |
| git tag                   | 列出所有本地标签     |
| git tag <tagname>         | 基于最新提交创建标签 |
| git tag -d <tagname>      | 删除标签             |



## 合并与衍合

| 命令                     | 描述                                             |
| ------------------------ | ------------------------------------------------ |
| git merge <branch>       | 合并指定分支到当前分支                           |
| git rebase <branch>      | 衍合指定分支到当前分支                           |
| git cherry-pick <commit> | 用于把另一个本地分支的commit修改应用到当前分支。 |



## 远程操作

| 命令                                 | 描述                   |
| ------------------------------------ | ---------------------- |
| git remote -v                        | 查看远程本版库信息     |
| git remote show <remote>             | 查看制定远程版本库信息 |
| git remote add <remote> <url>        | 添加远程版本库         |
| git fetch <remote>                   | 从远程版本库获取文件   |
| git pull <remote> <branch>           | 下载文件及快速合并     |
| git push <remote> <branch>           | 上传文件及快速合并     |
| git push <remote> :<branch/tag-name> | 删除远程分支或标签     |
| git push --tags                      | 上传所有标签           |



---

笔者专门在 github 上创建了一个仓库，用于记录平时学习全栈开发中的技巧、难点、易错点，欢迎大家点击下方链接浏览。如果觉得还不错，就请给个小星星吧！👍

---

2019/04/07

[AJie](https://github.com/KevinSalvatore/FullStackPoints.git)