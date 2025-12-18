# 开源准备清单

## ✅ 已完成的文件

### 📦 核心文件
- [x] `index.tsx` - 主要组件和 hook
- [x] `style.less` - 样式文件
- [x] `package.json` - npm 包配置
- [x] `tsconfig.json` - TypeScript 配置
- [x] `rollup.config.js` - 打包配置

### 📖 文档
- [x] `README.md` - 项目说明文档（英文）
- [x] `CHANGELOG.md` - 版本更新日志
- [x] `CONTRIBUTING.md` - 贡献指南
- [x] `LICENSE` - MIT 许可证

### 🔧 配置文件
- [x] `.gitignore` - Git 忽略规则
- [x] `.npmignore` - npm 发布忽略规则
- [x] `.eslintrc.js` - ESLint 配置
- [x] `.prettierrc.js` - Prettier 配置
- [x] `jest.config.js` - Jest 测试配置

### 🧪 测试
- [x] `tests/setup.ts` - 测试环境配置
- [x] `tests/index.test.tsx` - 基础测试用例

### 🎨 示例
- [x] `examples/BasicExample.tsx` - 基础使用示例
- [x] `examples/AdvancedExample.tsx` - 高级功能示例

### 🚀 CI/CD
- [x] `.github/workflows/ci.yml` - 持续集成配置
- [x] `.github/workflows/publish.yml` - npm 发布配置

---

## 📋 发布前准备步骤

### 1. 代码准备 ✅
```bash
# 确保项目结构正确
react-table-resize/
├── src/
│   ├── index.tsx
│   └── style.less
├── tests/
│   ├── setup.ts
│   └── index.test.tsx
├── examples/
│   ├── BasicExample.tsx
│   └── AdvancedExample.tsx
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── publish.yml
├── package.json
├── tsconfig.json
├── rollup.config.js
├── jest.config.js
├── .eslintrc.js
├── .prettierrc.js
├── .gitignore
├── .npmignore
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
└── LICENSE
```

### 2. 修改配置信息 🔄

#### 在以下文件中替换占位符：

**package.json:**
```json
{
  "name": "react-table-resize",
  "author": "Kyrie liu <kyrie.liu@gmail.com>",
  "repository": {
    "url": "https://github.com/kyrie2014/react-table-resize.git"
  },
  "bugs": {
    "url": "https://github.com/kyrie2014/react-table-resize/issues"
  },
  "homepage": "https://github.com/kyrie2014/react-table-resize#readme"
}
```

**LICENSE:**
- 已更新为 `Kyrie liu`

**README.md:**
- 已更新为 `kyrie2014`
- 已更新为 `kyrie.liu@gmail.com`
- 更新徽章链接

### 3. 代码质量检查 🔍

```bash
# 运行 linter
npm run lint

# 运行类型检查
npm run type-check

# 运行测试
npm run test

# 检查测试覆盖率
npm run test:coverage

# 格式化代码
npm run format
```

### 4. 构建检查 🏗️

```bash
# 构建项目
npm run build

# 检查 dist 目录
ls -la dist/
# 应该包含:
# - index.js (CommonJS)
# - index.esm.js (ES Module)
# - index.d.ts (TypeScript 定义)
# - style.css (样式)
```

### 5. 本地测试 🧪

```bash
# 使用 npm link 在本地项目中测试
cd /path/to/react-table-resize
npm link

cd /path/to/test-project
npm link react-table-resize

# 在测试项目中导入并使用
```

### 6. GitHub 仓库设置 📦

```bash
# 初始化 Git 仓库
git init
git add .
git commit -m "Initial commit"

# 在 GitHub 创建仓库后
git remote add origin https://github.com/kyrie2014/react-table-resize.git
git branch -M main
git push -u origin main
```

**仓库设置：**
- ✅ 添加仓库描述
- ✅ 添加主题标签（react, table, resize, typescript, antd）
- ✅ 启用 Issues
- ✅ 启用 Discussions（可选）
- ✅ 添加仓库 Logo/Banner

### 7. npm 账号准备 📝

```bash
# 注册 npm 账号（如果没有）
npm adduser

# 登录 npm
npm login

# 验证登录
npm whoami
```

### 8. 添加 npm 徽章 🏷️

在 npm 发布后，更新 README.md 中的徽章链接：
```markdown
[![npm version](https://img.shields.io/npm/v/react-table-resize.svg)](https://www.npmjs.com/package/react-table-resize)
[![npm downloads](https://img.shields.io/npm/dm/react-table-resize.svg)](https://www.npmjs.com/package/react-table-resize)
```

### 9. 配置 GitHub Secrets 🔐

在 GitHub 仓库设置中添加：
- `NPM_TOKEN` - 用于自动发布到 npm
- `CODECOV_TOKEN` - 用于代码覆盖率报告（可选）

获取 NPM Token:
```bash
npm token create --read-only=false
```

### 10. 发布到 npm 🚀

```bash
# 确保版本号正确
# 遵循语义化版本: major.minor.patch

# 首次发布
npm publish

# 后续发布
npm version patch # 或 minor/major
git push --tags
npm publish
```

### 11. 创建 GitHub Release 📢

1. 在 GitHub 仓库页面点击 "Releases"
2. 点击 "Create a new release"
3. 填写：
   - Tag version: v1.0.0
   - Release title: v1.0.0 - Initial Release
   - Description: 从 CHANGELOG.md 复制内容
4. 上传构建文件（可选）
5. 发布

### 12. 推广和维护 📣

**文档网站（可选）：**
```bash
# 使用 VitePress 创建文档站点
npm run docs:dev
npm run docs:build
npm run docs:preview

# 部署到 GitHub Pages
# 在 .github/workflows/ 添加 docs 部署配置
```

**社区推广：**
- [ ] 在 Twitter 分享
- [ ] 在 Reddit r/reactjs 发帖
- [ ] 在 Dev.to 写文章
- [ ] 在 Product Hunt 发布（如果适用）
- [ ] 添加到 awesome-react 列表

**持续维护：**
- [ ] 响应 Issues
- [ ] 审查 Pull Requests
- [ ] 定期更新依赖
- [ ] 发布新版本
- [ ] 更新文档

---

## 🎯 发布检查清单

发布前最后确认：

- [ ] 所有测试通过
- [ ] 代码已格式化
- [ ] 文档完整且准确
- [ ] 示例可以正常运行
- [ ] 版本号已更新
- [ ] CHANGELOG 已更新
- [ ] LICENSE 文件正确
- [ ] README 链接有效
- [ ] 构建成功且产物正确
- [ ] 本地 npm link 测试成功
- [ ] GitHub 仓库已创建
- [ ] npm 账号已登录
- [ ] GitHub Secrets 已配置

---

## 📊 发布后

1. ✅ 验证 npm 包可安装：
```bash
npm view react-table-resize
```

2. ✅ 检查包内容：
```bash
npm pack --dry-run
```

3. ✅ 在新项目中安装测试：
```bash
npx create-react-app test-app
cd test-app
npm install react-table-resize antd
```

4. ✅ 监控统计：
- npm downloads: https://npm-stat.com/charts.html?package=react-table-resize
- GitHub stars, forks, issues
- 用户反馈

---

## 🆘 常见问题

### Q: 如何修改已发布的版本？
A: npm 不允许覆盖已发布版本，需要发布新版本。

### Q: 如何撤回已发布的版本？
A: 
```bash
npm unpublish react-table-resize@1.0.0
```
注意：只能撤回 72 小时内发布的版本。

### Q: 如何添加 beta 版本？
A:
```bash
npm version prerelease --preid=beta
npm publish --tag beta
```

### Q: 如何更新文档？
A: 直接修改 README.md 并推送到 GitHub，npm 包页面会自动更新。

---

## 📚 参考资源

- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Rollup Documentation](https://rollupjs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

祝你开源项目成功！🎉

