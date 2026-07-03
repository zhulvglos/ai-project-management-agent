# AI 工程项目管理 Agent 平台

面向工程项目管理场景的 AI Agent 原型平台。项目以真实装配式建筑工程资料为业务背景，围绕工程资料管理、BOM 审核、进度风险识别、设计变更追踪等工作流，构建一个可用于作品集和简历展示的 AI 工程项目管理系统。

在线 Demo：[https://zhulvglos.github.io/ai-project-management-agent/](https://zhulvglos.github.io/ai-project-management-agent/)

## 项目定位

本项目对应简历中的 **AI 工程项目管理 Agent 平台**，核心主题是：

- **Agent x 工程管理**：把工程项目中的资料、进度、变更、物料审核流程抽象为多个协同 Agent。
- **AI x 装配式建筑**：基于装配式建筑项目中真实存在的 CAD、Rhino、Excel、图片、会议纪要等资料类型设计业务能力。
- **产品化展示**：提供前端页面、数据看板和 Agent 工作流说明，用于展示 AI 产品经理对业务场景、数据流和 AI 能力选型的理解。

## 核心 Agent

### 1. BOM 智能审核 Agent

用于处理工程物料清单、报价单、门窗表、墙板信息表等结构化资料。

- 跨版本 BOM 差异比对
- 数量异常、品类遗漏、价格波动识别
- 物料清单与图纸、门窗表、墙板表之间的交叉校验
- 输出结构化审核结果，支持前端看板展示

适用 AI 能力：

- Code Interpreter / Python 数据分析
- Structured Output / JSON Schema
- Agentic Workflow 多步骤审核流程

### 2. 工程进度风险预警 Agent

用于分析图纸版本迭代、现场照片、计划进度表之间的关系，识别潜在进度风险。

- 统计图纸版本迭代密度
- 识别高频返工或长时间停滞的风险信号
- 将现场照片时间线与图纸版本、计划进度进行对照
- 生成风险等级、影响范围和建议动作

适用 AI 能力：

- RAG 检索增强生成
- Vision 多模态理解
- 结构化风险输出

### 3. 设计变更追踪 Agent

用于追踪会议纪要、业主指令、现场勘测、图纸版本变化之间的因果关系。

- 从非结构化文档中提取变更触发事件
- 关联上游变更与下游专业图纸、BOM、加工图
- 生成变更影响链路
- 检测“上游已变更、下游未同步”的断链风险

适用 AI 能力：

- Document AI 文档解析
- Agentic Loop 自检与补全
- 变更链路图谱构建

## Agent 协同关系

```text
工程资料数据层
CAD 图纸 / Rhino 模型 / Excel 物料 / 现场照片 / 会议纪要 / 业主指令
        |
        v
进度风险预警 Agent  ->  设计变更追踪 Agent  ->  BOM 智能审核 Agent
        ^                     |                         |
        |                     v                         v
        +----------- 综合项目风险与决策看板 <------------+
```

协同逻辑：

- 进度 Agent 发现某类图纸迭代异常后，触发变更 Agent 追溯原因。
- 变更 Agent 确认实质性变更后，触发 BOM Agent 复核受影响物料。
- BOM Agent 发现数量异常后，反查变更 Agent 判断是否存在遗漏变更记录。
- 三个 Agent 最终汇总到统一的项目风险与决策看板。

## 技术栈

前端：

- Vue 3
- TypeScript
- Vite

后端：

- Python
- FastAPI

工程化：

- Git / GitHub
- npm
- 前后端分离目录结构

## 目录结构

```text
.
├── backend/                 # Python 后端服务
│   ├── main.py
│   └── requirements.txt
├── frontend/                # Vue 前端应用
│   ├── public/              # 展示图片与静态资源
│   ├── src/
│   │   ├── mock/            # 模拟业务数据
│   │   ├── router/          # 前端路由
│   │   └── views/           # 页面视图
│   ├── package.json
│   └── vite.config.ts
├── package.json
├── vite.config.ts
└── README.md
```

## 本地运行

安装前端依赖：

```bash
cd frontend
npm install
```

启动前端：

```bash
npm run dev
```

安装后端依赖：

```bash
cd backend
pip install -r requirements.txt
```

启动后端：

```bash
python main.py
```

## 简历展示亮点

这个项目重点展示的不是单一页面开发，而是 AI 产品经理对复杂工程场景的产品抽象能力：

- 能把真实工程项目中的混乱资料，拆解为可计算、可追踪、可协同的数据流。
- 能为不同业务痛点选择合适的 AI 能力，而不是笼统地“接入大模型”。
- 能围绕 Agent 构建闭环工作流，包括输入、推理、校验、输出和反馈。
- 能把 AI 能力转化为面向业务角色的看板、审核结果和风险预警。

## 仓库说明

本仓库主要提交代码、前端展示资源和项目说明。原始工程资料、模型文件、视频和大型项目归档文件未纳入 Git 版本管理。
