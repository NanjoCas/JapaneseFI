# 上传项目到 Git 仓库

本文档提供了将 Furigana Injector 项目上传到 GitHub 的详细步骤。

## 前置要求

1. **GitHub 账户** - 已创建且可访问
2. **Git 命令行工具** - 已安装
3. **仓库地址** - 你的 GitHub 仓库 URL

## 步骤一：初始化本地 Git 仓库

在项目目录执行以下命令：

```bash
cd /Users/nanjo/Desktop/projects/JPP
git init
```

## 步骤二：添加 .gitignore 文件

创建 `.gitignore` 文件以排除不必要的文件：

```bash
cat > .gitignore << 'EOF'
# 依赖
node_modules/
package-lock.json

# 构建输出
dist/
*.tgz

# 临时文件
*.log
.DS_Store
.vscode/
.idea/

# 测试文件
benchmark-results-*.json
stress-test.html
test.sh
benchmark.js

# 打包脚本（可选）
package-extension.sh
package-clean.sh

# 发布包
releases/

# IDE
.env
.env.local
EOF
```

## 步骤三：配置 Git 用户信息

```bash
git config --global user.name "你的用户名"
git config --global user.email "你的邮箱@example.com"
```

## 步骤四：添加文件到暂存区

```bash
git add .
```

## 步骤五：创建初始提交

```bash
git commit -m "Initial commit: Furigana Injector Chrome Extension v1.0.0

- Auto-annotate kanji with furigana readings
- Support for 44+ websites
- Beautiful UI with smooth animations
- Whitelist management
- High-performance processing"
```

## 步骤六：添加远程仓库

将 `YOUR_REPO_URL` 替换为你的 GitHub 仓库 URL（格式：`https://github.com/username/repo.git` 或 `git@github.com:username/repo.git`）：

```bash
git remote add origin YOUR_REPO_URL
```

验证远程仓库已添加：

```bash
git remote -v
```

应该看到类似输出：
```
origin  https://github.com/username/repo.git (fetch)
origin  https://github.com/username/repo.git (push)
```

## 步骤七：推送到 GitHub

```bash
git branch -M main
git push -u origin main
```

> **注意**：
> - 第一次推送可能需要输入 GitHub 凭证（用户名和 Personal Access Token）
> - 如果使用 SSH，需要先配置 SSH 密钥

## 完整一键上传脚本

如果你已经配置好仓库，可以使用以下脚本一步完成：

```bash
#!/bin/bash

REPO_URL="YOUR_REPO_URL"  # 替换为你的仓库地址
BRANCH_NAME="main"

cd /Users/nanjo/Desktop/projects/JPP

# 初始化
git init
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 添加 .gitignore
cat > .gitignore << 'EOF'
node_modules/
dist/
releases/
*.log
.DS_Store
.env
EOF

# 提交
git add .
git commit -m "Initial commit: Furigana Injector Chrome Extension v1.0.0"

# 推送
git remote add origin "$REPO_URL"
git branch -M "$BRANCH_NAME"
git push -u origin "$BRANCH_NAME"

echo "✅ 推送完成！"
```

## 如何获取 Personal Access Token（如果需要）

1. 登录 GitHub
2. 点击个人头像 → Settings
3. 左侧菜单 → Developer settings
4. 点击 Personal access tokens → Tokens (classic)
5. 点击 Generate new token
6. 选择以下权限：
   - `repo` - 完整的代码库访问
   - `workflow` - 工作流权限（可选）
7. 生成令牌并复制（只会显示一次！）
8. 在 Git push 时以密码形式使用该令牌

## 问题排查

### 推送被拒绝

**问题**: `fatal: unable to access 'https://github.com/...': Could not resolve host`

**解决**: 检查网络连接

### 认证失败

**问题**: `fatal: Authentication failed`

**解决**:
1. 使用 Personal Access Token 替代密码
2. 或配置 SSH 密钥（推荐）

### 仓库已存在

如果 GitHub 仓库中已有内容，需要先拉取：

```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

## 后续管理

### 创建新的提交

```bash
git add .
git commit -m "Your commit message"
git push
```

### 创建分支

```bash
git checkout -b feature/feature-name
git push -u origin feature/feature-name
```

### 查看提交历史

```bash
git log --oneline
```

## 推荐的 GitHub 仓库设置

### README.md
确保仓库根目录有清晰的 README.md（已包含）

### .gitignore
已为你创建，包含所有不必要的文件

### License
建议添加 LICENSE 文件（MIT 或 GPL）

### GitHub Actions（可选）
可以配置自动构建和测试流程

---

**准备好了？按照步骤六和七执行，你的项目就会出现在 GitHub 上！** 🚀
