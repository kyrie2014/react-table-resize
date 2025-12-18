# 🚀 快速开始指南

## 📦 项目已准备就绪！

这是一个完全独立的开源项目，可以直接发布到 npm 和 GitHub。

## 🏗️ 项目结构

```
react-table-resize/
├── src/                    # 源代码
│   ├── index.tsx          # 主组件和 Hook
│   └── style.less         # 样式文件
├── tests/                  # 测试文件
├── examples/               # 使用示例
├── .github/                # GitHub Actions 和 模板
├── README.md              # 项目文档（英文）
├── CHANGELOG.md           # 版本历史
├── CONTRIBUTING.md        # 贡献指南
├── OPENSOURCE_CHECKLIST.md  # 📋 发布清单（最重要！）
└── package.json           # npm 配置
```

## ✅ 接下来的 3 个步骤

### 第1步：修改配置信息

在以下文件中替换占位符：

1. **`package.json`**
   ```json
   {
     "name": "react-table-resize",
     "author": "Kyrie liu <kyrie.liu@gmail.com>",
     "repository": {
       "url": "https://github.com/kyrie2014/react-table-resize.git"
     }
   }
   ```

2. **`LICENSE`**
   - 已更新为 `Kyrie liu`

3. **`README.md`**
   - 已更新为 `kyrie2014`
   - 已更新为 `kyrie.liu@gmail.com`

### 第2步：安装依赖并测试

```bash
cd c:\projects\react-table-resize

# 安装依赖
npm install

# 运行测试
npm run test

# 构建项目
npm run build

# 查看构建产物
dir dist
```

### 第3步：发布

**方式1：使用 npm 手动发布**
```bash
# 登录 npm
npm login

# 发布包
npm publish
```

**方式2：推送到 GitHub（自动发布）**
```bash
# 在 GitHub 创建新仓库
# 然后执行：
git remote add origin https://github.com/kyrie2014/react-table-resize.git
git push -u origin main

# 创建 Release 会自动触发 npm 发布（需要配置 NPM_TOKEN）
```

## 📖 详细步骤

请查看 **`OPENSOURCE_CHECKLIST.md`** 文件，里面有完整的发布清单和详细说明。

## 🎯 核心功能

✅ **列宽调整** - 拖动列头调整宽度  
✅ **单元格调整** - 拖动单元格右下角调整宽高  
✅ **行列同步** - 拖动一个单元格，整行/整列同步  
✅ **持久化** - 列宽保存到 localStorage  
✅ **双击自适应** - 双击列头自动调整宽度  
✅ **TypeScript** - 完整的类型定义  
✅ **性能优化** - 防抖 + RAF + 直接 DOM 操作  

## 🛠️ 可用的脚本

```bash
npm run build              # 构建生产版本
npm run build:watch        # 监听模式构建
npm run test               # 运行测试
npm run test:coverage      # 测试覆盖率
npm run lint               # 代码检查
npm run lint:fix           # 自动修复代码问题
npm run format             # 格式化代码
npm run type-check         # TypeScript 类型检查
```

## 📦 构建产物

运行 `npm run build` 后，会在 `dist/` 目录生成：

- `index.js` - CommonJS 格式
- `index.esm.js` - ES Module 格式
- `index.d.ts` - TypeScript 类型定义
- `style.css` - 编译后的样式

## 🔧 本地测试

在发布前，可以在本地项目中测试：

```bash
# 在 react-table-resize 目录
npm link

# 在你的测试项目目录
cd /path/to/your-test-project
npm link react-table-resize

# 在测试项目中使用
import { useTableResize } from 'react-table-resize';
import 'react-table-resize/dist/style.css';
```

## 🌟 推荐的发布流程

1. ✅ 修改配置信息（package.json, LICENSE, README.md）
2. ✅ 本地测试：`npm install && npm test && npm run build`
3. ✅ 创建 GitHub 仓库
4. ✅ 推送代码到 GitHub
5. ✅ 在 GitHub 设置中添加 `NPM_TOKEN` secret
6. ✅ 在 GitHub 创建 Release（自动发布到 npm）
7. ✅ 在 README 徽章中更新包名
8. ✅ 在社区推广（Twitter, Reddit, Dev.to）

## 💡 提示

- 包名在 npm 上必须是唯一的，可以用 `npm view react-table-resize` 检查是否已被占用
- 如果被占用，可以使用 scoped package: `@yourname/react-table-resize`
- 首次发布建议版本号为 `1.0.0`
- 遵循语义化版本规范：`major.minor.patch`

## 🆘 遇到问题？

查看以下文件：
- `OPENSOURCE_CHECKLIST.md` - 完整的发布清单
- `CONTRIBUTING.md` - 贡献指南
- `README.md` - API 文档和使用说明

## 📞 获取帮助

- 📧 如有问题，请创建 GitHub Issue
- 💬 查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解如何参与贡献

---

祝你的开源项目大获成功！🎉

