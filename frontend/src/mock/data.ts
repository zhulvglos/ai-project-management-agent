export interface AgentInfo {
  id: string
  name: string
  icon: string
  tagline: string
  description: string
  color: string
  colorLight: string
  capabilities: string[]
  techStack: { name: string; role: string; reason: string }[]
  highlightExample: string
  stats: { label: string; value: string }[]
  demoTemplates: { label: string; prompt: string }[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'agent' | 'system'
  agentId?: string
  content: string
  trace?: TraceStep[]
  resultCards?: ResultCard[]
  timestamp: number
  llmProvider?: string
  _traceOpen?: boolean
}

export interface TraceStep {
  icon: string
  label: string
  detail: string
  status: 'done' | 'active' | 'pending'
}

export interface ResultCard {
  type: 'verdict' | 'evidence' | 'table' | 'timeline' | 'alert' | 'metric' | 'chain'
  title: string
  data: any
}

export const projectInfo = {
  name: '广东鸿轩实业集团展示中心（阳江工厂）',
  subtitle: 'AI Agent 智能设计管理平台',
  designer: '筑造实践科技',
  period: '2023年12月 ~ 2024年10月',
  duration: '约 11 个月',
  task: '阳江工厂新办公楼建筑幕墙 + 室内外一体化装修工程设计',
  building: '地上 4 层（1F~3F + 屋面层），含前厅接待区、大会议室、展厅、茶室、办公室',
  fileCount: '约 2,690 个',
  fileSize: '4.5 GB+',
  toolchain: ['Rhino 3D', 'Enscape 渲染', 'AutoCAD / 天正', 'Excel 物料管理'],
  stats: [
    { icon: '📐', label: 'CAD 图纸', value: '256 个' },
    { icon: '🧊', label: 'Rhino 3D 模型', value: '58 个' },
    { icon: '📊', label: 'Excel 物料表', value: '27 个' },
    { icon: '📸', label: '现场照片', value: '1,651 张' },
    { icon: '🎬', label: '勘测视频', value: '15 个' },
    { icon: '🖼', label: '渲染效果图', value: '541 张' },
  ],
  disciplines: ['建筑', '结构', '幕墙', '给排水', '电气', '暖通', '室内', '景观'],
  materials: ['蜂窝铝板', '阳光板', '一体板', '铝克莱尔渐变色', '角钢', '钢通', '扣板', '连接件', '折弯天沟', '花岗岩', '拉网天花', '钢网吊顶'],
  suppliers: ['DANPAL', '德国Rodeca', '上海沙伯', '上海汇丽', '中山珀丽优', '日本Isowand'],
  milestones: [
    { date: '2023-08-25', event: '最早场地现状照片', files: 'IN/pic/' },
    { date: '2023-12-12', event: '项目设计汇报', files: '资料/' },
    { date: '2024-01-19', event: 'Revit BIM 模型创建', files: '同僚/饺子/' },
    { date: '2024-02~03', event: '幕墙方案启动', files: '同僚/幕墙tim/' },
    { date: '2024-03-04', event: '结构施工图初版', files: '同僚/结构廖/' },
    { date: '2024-03-13', event: '阳江会议纪要（14条决策）', files: 'WORD/' },
    { date: '2024-05-24', event: '结构施工图终版', files: '同僚/结构廖/' },
    { date: '2024-07~08', event: '安装示意图密集迭代（10版）', files: 'CAD/new/before/' },
    { date: '2024-07~08', event: '墙板模型密集迭代（7版）', files: 'RHINO/NEW/BEFORE/' },
    { date: '2024-08~10', event: '阳江现场施工按月记录', files: 'JPG/现场照片/' },
    { date: '2024-10-07', event: '最后图纸更新（电动门节点）', files: 'CAD/new/' },
  ]
}

export const agents: AgentInfo[] = [
  {
    id: 'bom',
    name: 'BOM 智能审核 Agent',
    icon: '📦',
    tagline: '数据最硬',
    description: '自动比对不同版本的物料清单，检测数量异常、品类遗漏、单价波动，生成结构化审核报告。覆盖 17 个 Excel 物料文件、500MB+ 数据。',
    color: '#3b82f6',
    colorLight: 'rgba(59,130,246,0.12)',
    capabilities: [
      '跨版本差异比对',
      '品类完整性检查',
      '数量逻辑校验',
      '供应商报价审核',
      '审图联动'
    ],
    techStack: [
      { name: 'Code Interpreter', role: '沙箱运行 Python，读取多 sheet 执行交叉校验', reason: '零基础设施门槛，分析师可直接用自然语言描述校验规则' },
      { name: 'Structured Output', role: '审核结果标准化 JSON schema 输出', reason: '前端直接渲染审核看板，支持下游系统消费' },
      { name: 'Agentic Workflow', role: '多节点状态机：解析→校验→标记→排序→报告', reason: '每节点可独立调试、独立回退' }
    ],
    highlightExample: '门表中有"30扇门、70.66㎡"，物料清单中门类条目合计却只有28扇——Code Interpreter 在3秒内完成6个sheet的跨表关联查询，标出这2扇门的缺口，返回：{"issue_type": "quantity_mismatch", "delta": -2, "severity": "high"}',
    stats: [
      { label: '物料文件总量', value: '500+ MB' },
      { label: 'Excel 物料文件', value: '17 个' },
      { label: '墙板信息表版本', value: '4 版' },
      { label: '装修工程清单版本', value: '6 版' }
    ],
    demoTemplates: [
      { label: '版本差异比对', prompt: '比对阳江办公室装修工程清单 2024-08-18 和 2024-09-24 两个版本的差异' },
      { label: '门表数量校验', prompt: '校验门表（30扇门/70.66㎡）与物料清单中门类条目是否一致' },
      { label: '报价单审核', prompt: '审核报价单中哪些物料单价偏离预算控制目标超过 15%' },
      { label: '品类完整性检查', prompt: '检查墙板信息表中是否有遗漏的品类，对照标准物料分类体系' }
    ]
  },
  {
    id: 'progress',
    name: '工程进度风险预警 Agent',
    icon: '⏱',
    tagline: '最有故事',
    description: '通过追踪关键图纸的修改频率、版本间隔、迭代密度，结合现场施工照片时间戳，识别进度滞后风险，提前发出预警。',
    color: '#f59e0b',
    colorLight: 'rgba(245,158,11,0.12)',
    capabilities: [
      '图纸迭代密度监控',
      '版本间隔分析',
      '现场-图纸一致性校验',
      '多专业耦合延迟检测',
      '进度偏差自动计算'
    ],
    techStack: [
      { name: 'RAG（检索增强生成）', role: '会议纪要、业主指令向量化，自动检索关联决策上下文', reason: '进度表缺少"为什么延期""依赖谁"的语义信息，RAG 补齐因果链条' },
      { name: '多模态理解（Vision）', role: '现场照片与效果图视觉对比，判断实际施工进度', reason: '效果图vs现场照片的视觉差异比文字描述更直观' },
      { name: 'Structured Output + 甘特图', role: '输出标准JSON，前端用ECharts渲染风险热力甘特图', reason: '红色热力区直观标示高密度迭代区间' }
    ],
    highlightExample: '进度表显示"框架加工图"截止日期为8月15日，但RAG检索到8月初的幕墙变更记录——幕墙图在8月9日才更新完，导致依赖项延后了6天。Agent自动标红，同时用Vision比对8月20日现场照片确认框架尚未安装完毕。',
    stats: [
      { label: '安装示意图迭代', value: '55天 10版' },
      { label: '墙板模型迭代', value: '36天 7版' },
      { label: '现场照片总量', value: '1,651 张' },
      { label: '勘测视频', value: '15 个' }
    ],
    demoTemplates: [
      { label: '迭代密度分析', prompt: '分析安装示意图在2024年7-8月间的迭代密度，是否存在返工风险' },
      { label: '进度偏差计算', prompt: '对比现场照片（2024年8月）与设计预期，计算进度偏差天数' },
      { label: '多专业耦合检测', prompt: '检测结构施工图和幕墙工程图的迭代是否同步，是否存在接口协调风险' },
      { label: '版本间隔预警', prompt: '检查墙板模型7个版本的间隔，标记间隔异常（过密/过疏）的版本' }
    ]
  },
  {
    id: 'change',
    name: '设计变更追踪 Agent',
    icon: '🔄',
    tagline: '最体现产品思维',
    description: '自动追踪每次设计变更的触发原因、影响范围、关联文件，生成变更影响报告，提醒受影响专业。模拟"设计经理"的工作流。',
    color: '#8b5cf6',
    colorLight: 'rgba(139,92,246,0.12)',
    capabilities: [
      '变更溯源',
      '影响范围分析',
      '变更通知推送',
      '变更履历可视化',
      '未同步检测'
    ],
    techStack: [
      { name: 'AI Code Interpreter', role: '结构化Diff：哪些门增减了、尺寸变了、材料换了', reason: '理解"同一扇门改了尺寸"与"新增一扇门"的语义差异' },
      { name: 'Document AI', role: '解析会议纪要Word/PDF，提取决策关键词建立关联索引', reason: '将非结构化决策文本转化为可查询的事件节点' },
      { name: 'Agentic Loop + Self-Reflection', role: '生成报告后自评循环：检查遗漏、逻辑矛盾', reason: 'Self-Reflection让Agent像审图人员二次核查，降低误报漏报' }
    ],
    highlightExample: '门表从3月9日到5月5日经历静默变更——3扇防火门尺寸从900×2100改为1000×2200。无会议纪要提及，但Document AI从3月13日会议纪要提取"消防规范升级"关键词，Agentic Loop第二轮自评发现关联。链条：消防规范升级→防火门尺寸变更→洞口收边件加工图需更新→1人自动通知。',
    stats: [
      { label: '结构施工图版本', value: '6 版' },
      { label: '幕墙工程图版本', value: '4 版' },
      { label: '跨专业影响链', value: '3 条' },
      { label: '变更触发事件', value: '5 类' }
    ],
    demoTemplates: [
      { label: '变更溯源', prompt: '防火门尺寸从900×2100改为1000×2200，溯源变更原因' },
      { label: '影响范围分析', prompt: '结构施工图终版（2024-05-24）变更后，分析对下游所有文件的影响' },
      { label: '未同步检测', prompt: '检测是否存在"上游已变更但下游未更新"的断链情况' },
      { label: '变更履历查询', prompt: '查询安装示意图从0731到0922共10个版本的完整变更历史' }
    ]
  }
]

export const agentRelations = [
  { from: 'progress', to: 'change', label: '进度预警 → 变更溯源', desc: '发现迭代异常密集时，触发变更原因追溯' },
  { from: 'change', to: 'bom', label: '变更确认 → BOM复核', desc: '确认实质性变更后，自动触发物料版本比对' },
  { from: 'bom', to: 'change', label: '数量异常 → 变更反查', desc: '发现物料数量突变时，反查变更记录确认原因' },
  { from: 'change', to: 'progress', label: '变更闭环 → 解除预警', desc: '确认合理深化设计后，发出降级信号避免误报' },
]

// ========== 12 个独立结果剧本 ==========

const bomTrace: TraceStep[] = [
  { icon: '🔍', label: '需求解析', detail: '识别为 BOM 审核类请求', status: 'done' },
  { icon: '📊', label: '数据加载', detail: '加载目标 Excel 文件多 Sheet 数据', status: 'done' },
  { icon: '⚡', label: '交叉校验', detail: '执行跨表关联查询与数量逻辑校验', status: 'done' },
  { icon: '📋', label: '生成报告', detail: '结构化审核结果并标记异常等级', status: 'done' }
]

const progressTrace: TraceStep[] = [
  { icon: '🔍', label: '需求解析', detail: '识别为进度风险分析类请求', status: 'done' },
  { icon: '📚', label: 'RAG 检索', detail: '检索会议纪要、业主指令中的关联决策', status: 'done' },
  { icon: '👁', label: '视觉比对', detail: '现场照片与效果图视觉对比', status: 'done' },
  { icon: '⚠️', label: '风险评估', detail: '计算迭代密度、偏差天数、生成预警', status: 'done' }
]

const changeTrace: TraceStep[] = [
  { icon: '🔍', label: '需求解析', detail: '识别为设计变更追踪类请求', status: 'done' },
  { icon: '📄', label: 'Document AI', detail: '解析会议纪要，提取决策关键词', status: 'done' },
  { icon: '🔗', label: '变更链构建', detail: '关联触发事件→图纸变更→下游影响', status: 'done' },
  { icon: '🪞', label: 'Self-Reflection', detail: '自评循环：检查遗漏影响范围', status: 'done' }
]

function msg(agentId: string, trace: TraceStep[], resultCards: ResultCard[], content: string): ChatMessage {
  return { id: `msg-${Date.now()}`, role: 'agent', agentId, content, trace, resultCards, timestamp: Date.now() }
}

function evidenceCard(items: any[]): ResultCard {
  return { type: 'evidence', title: '证据材料', data: { items } }
}

const evidencePacks = {
  bomDiff: evidenceCard([
    { label: '过程清单', title: '装修工程清单 2024-08 过程版', desc: '来自 E:\\筑造实践\\阳江工厂\\EXCEL，用作版本差异对比来源。' },
    { label: '最终归档', title: '阳江办公室装修工程清单 2024-09-23', desc: '来自 20241029 阳江项目资料汇总，作为最终口径。' },
    { label: '图纸', title: '阳江 1-2 层平面', desc: '来自 pic\\阳江图纸，用于定位清单条目影响空间。', src: '/evidence/阳江1_2层.png' },
  ]),
  bomDoor: evidenceCard([
    { label: '过程门表', title: '阳江门表 2024-03-09 / 2024-05-05', desc: '来自 E:\\筑造实践\\阳江工厂\\EXCEL，用于检查门数量和尺寸变更。' },
    { label: '最终图纸', title: '阳江门窗详图 1007_t3.dwg', desc: '来自 20241029 汇总包 CAD，用作最终门窗口径。' },
    { label: '图纸', title: '阳江 3-4 层平面', desc: '来自 pic\\阳江图纸，用于定位门编号所在楼层。', src: '/evidence/阳江3_4层.png' },
  ]),
  bomPrice: evidenceCard([
    { label: '过程报价', title: '过程报价/物料清单', desc: '来自 E:\\筑造实践\\阳江工厂\\EXCEL，用于识别单价波动。' },
    { label: '最终结算', title: '灯光灯具实际结算清单 20241028.pdf', desc: '来自 20241029 汇总包，用作最终结算参照。' },
    { label: '现场', title: '2024-10-08 施工日志', desc: '来自阳江施工日志，用于核对最终安装状态。', src: '/evidence/site-12-20241008.jpg' },
  ]),
  bomCategory: evidenceCard([
    { label: '过程表', title: '墙面单元板表 2024-04-07', desc: '来自 E:\\筑造实践\\阳江工厂\\EXCEL，用于检查品类覆盖。' },
    { label: '最终下料', title: '装饰材料下料清单 2024-09-8.pdf', desc: '来自 20241029 汇总包，用作最终材料清单口径。' },
    { label: '节点图', title: '蜂窝铝标准板安装图', desc: '来自 pic\\阳江图纸，用于核对板材节点。', src: '/evidence/20240417蜂窝铝标准板安装图.png' },
  ]),
  progressDensity: evidenceCard([
    { label: '现场', title: '2024-07-31 施工日志', desc: '安装示意图密集迭代前后的现场节点。', src: '/evidence/site-04-20240731.jpg' },
    { label: '现场', title: '2024-08-27 施工日志', desc: '高频调整期现场照片，用于佐证返工压力。', src: '/evidence/site-09-20240827.jpg' },
    { label: '最终图纸', title: '阳江装配图纸 0922.dwg', desc: '来自 20241029 汇总包 CAD，作为装配图最终口径。' },
  ]),
  progressDeviation: evidenceCard([
    { label: '现场', title: '2024-08-20 施工日志', desc: '用于判断现场完成度是否落后计划节点。', src: '/evidence/site-07-20240820.jpg' },
    { label: '现场', title: '2024-08-23 施工日志', desc: '连续日期现场证据，用于计算偏差趋势。', src: '/evidence/site-08-20240823.jpg' },
    { label: '计划表', title: '阳江 20240512 项目计划进度表', desc: '来自 E:\\筑造实践\\阳江工厂\\EXCEL，作为过程计划基准。' },
  ]),
  progressCoupling: evidenceCard([
    { label: '图纸', title: '阳江剖立面', desc: '来自 pic\\阳江图纸，用于检查结构、幕墙和室内接口。', src: '/evidence/阳江剖立面.png' },
    { label: '现场', title: '2024-08-09 施工日志', desc: '接口调整期间现场状态。', src: '/evidence/site-05-20240809.jpg' },
    { label: '最终 CAD', title: '阳江建筑图纸 20240905.dwg', desc: '来自 20241029 汇总包，作为最终专业协同依据。' },
  ]),
  progressInterval: evidenceCard([
    { label: '现场', title: '2024-08-14 施工日志', desc: '墙板模型密集迭代期间的现场状态。', src: '/evidence/site-06-20240814.jpg' },
    { label: '现场', title: '2024-09-05 施工日志', desc: '施工版定稿节点后的现场参照。', src: '/evidence/site-10-20240905.jpg' },
    { label: '最终模型', title: '阳江装配模型 20240906.3dm', desc: '来自 20241029 汇总包 RHINO，作为最终模型口径。' },
  ]),
  changeTrace: evidenceCard([
    { label: '图纸', title: '阳江 1-2 层平面', desc: '用于定位防火门变更影响空间。', src: '/evidence/阳江1_2层.png' },
    { label: '过程门表', title: '阳江门表 2024-03-09 / 2024-05-05', desc: '来自 E:\\筑造实践\\阳江工厂\\EXCEL，用于变更前后比对。' },
    { label: '最终 CAD', title: '阳江门窗详图 1007_t3.dwg', desc: '来自 20241029 汇总包，作为最终门窗依据。' },
  ]),
  changeImpact: evidenceCard([
    { label: '图纸', title: '阳江剖立面', desc: '用于判断结构变更对幕墙和室内界面的影响。', src: '/evidence/阳江剖立面.png' },
    { label: '现场', title: '2024-07-18 施工日志', desc: '结构/幕墙接口早期现场状态。', src: '/evidence/site-01-20240718.jpg' },
    { label: '最终 CAD', title: '阳江建筑图纸 20240905.dwg', desc: '来自 20241029 汇总包，作为最终建筑图纸口径。' },
  ]),
  changeDesync: evidenceCard([
    { label: '现场', title: '2024-07-24 施工日志', desc: '下游施工开始阶段现场状态。', src: '/evidence/site-02-20240724.jpg' },
    { label: '图纸', title: '蜂窝铝标准板安装图', desc: '用于检查下游安装图是否同步上游变更。', src: '/evidence/20240417蜂窝铝标准板安装图.png' },
    { label: '最终清单', title: '阳江项目工程量统计表 20241028.xls', desc: '来自 20241029 汇总包，用作最终工程量口径。' },
  ]),
  changeHistory: evidenceCard([
    { label: '现场', title: '2024-07-26 施工日志', desc: '安装示意图迭代早期现场证据。', src: '/evidence/site-03-20240726.jpg' },
    { label: '现场', title: '2024-09-13 施工日志', desc: '变更履历后期现场证据。', src: '/evidence/site-11-20240913.jpg' },
    { label: '最终 CAD', title: '阳江装配图纸 0922.dwg', desc: '来自 20241029 汇总包，作为完整履历最终节点。' },
  ]),
}

// ─────────── BOM: 版本差异比对 ───────────
function buildBomVersionDiff(): ChatMessage {
  return msg('bom', bomTrace, [
    {
      type: 'verdict', title: '审核结论',
      data: {
        finding: '两版本间发现 14 处差异，其中 2 处关键变更未同步至下游',
        severity: 'HIGH', impact: '影响材料采购清单和加工图',
        action: '立即同步蜂窝铝板新增 12 块至物料清单，核查连接件单价'
      }
    },
    evidencePacks.bomDiff,
    {
      type: 'table', title: '版本差异摘要（2024-08-18 → 2024-09-24）',
      data: {
        columns: ['变更条目', '变更类型', '08-18 版', '09-24 版', '差值', '状态'],
        rows: [
          ['蜂窝铝板 HWB-A7', '数量新增', '0 块', '12 块', '+12', '未同步'],
          ['连接件 LJ-05', '单价调整', '¥62/个', '¥85/个', '+37%', '超预算'],
          ['折弯天沟 TW-02', '条目删除', '有记录', '已删除', '-1', '已确认'],
          ['阳光板 DANPAL-3', '规格变更', '12mm', '16mm', '规格升级', '已同步'],
          ['铝克莱尔 AL-01', '数量调整', '86 块', '94 块', '+8', '已同步'],
          ['拉网天花 LW-03', '新增条目', '无', '新增', '+1', '未录入'],
        ]
      }
    }
  ], `## 版本差异比对完成\n\n对 **装修工程清单** 2024-08-18 与 2024-09-24 两个版本执行结构化 Diff。\n\n**关键发现：**\n1. **蜂窝铝板 HWB-A7** 新增 12 块，物料清单尚未同步\n2. **连接件 LJ-05** 单价从 ¥62 涨至 ¥85，超预算 37%\n3. **拉网天花 LW-03** 为新增条目，物料清单未录入\n\n> Code Interpreter 执行 6 个 Sheet 交叉比对，耗时 2.8s，返回 14 条差异记录。`)
}

// ─────────── BOM: 门表数量校验 ───────────
function buildBomDoorCheck(): ChatMessage {
  return msg('bom', bomTrace, [
    {
      type: 'verdict', title: '审核结论',
      data: {
        finding: '门表记录 30 扇门，物料清单仅录入 28 扇——缺口 2 扇',
        severity: 'HIGH', impact: '防火门 FHM-03 未被采购，影响消防验收',
        action: '补充 FHM-03 至物料清单，校验防火门型号与消防规范一致性'
      }
    },
    evidencePacks.bomDoor,
    {
      type: 'table', title: '门编号校验明细',
      data: {
        columns: ['门编号', '类型', '尺寸', '门表状态', '物料清单状态', '校验结果'],
        rows: [
          ['FHM-01', '甲级防火门', '1000×2200', '已录入', '已录入', '一致'],
          ['FHM-02', '甲级防火门', '1000×2200', '已录入', '已录入', '一致'],
          ['FHM-03', '乙级防火门', '1000×2200', '已录入', '未录入', '缺失'],
          ['ZM-01~08', '铝合金平开门', '900×2100', '8 扇', '8 扇', '一致'],
          ['ZM-09~12', '铝合金推拉门', '1800×2100', '4 扇', '4 扇', '一致'],
          ['GM-01', '电动门', '3600×2700', '已录入', '未录入', '缺失'],
        ]
      }
    },
    {
      type: 'metric', title: '校验统计',
      data: [
        { label: '门表总数', value: '30 扇' },
        { label: '清单已录入', value: '28 扇' },
        { label: '缺口数量', value: '2 扇' },
        { label: '校验耗时', value: '1.6s' }
      ]
    }
  ], `## 门表数量校验完成\n\n**发现 2 扇门在物料清单中缺失：**\n\n1. **FHM-03（乙级防火门）**：门表有记录但物料清单未录入——这扇门涉及消防验收，严重等级 HIGH\n2. **GM-01（电动门）**：门表中有 3600×2700 电动门一条，物料清单中无对应采购条目\n\n**校验方法：** Code Interpreter 读取门表 Excel（30 行）与物料清单"门类"Sheet（28 行），逐条匹配门编号，标出未配对项。\n\n> 缺口 2 扇不是录入遗漏，而是**变更后未同步**——建议关联变更追踪 Agent 检查是否有对应的变更通知。`)
}

// ─────────── BOM: 报价单审核 ───────────
function buildBomPriceAudit(): ChatMessage {
  return msg('bom', bomTrace, [
    {
      type: 'verdict', title: '审核结论',
      data: {
        finding: '报价单中 4 项物料单价偏离预算超过 15%，最大偏差 +37%',
        severity: 'HIGH', impact: '超预算总额约 ¥42,000',
        action: '与供应商重新议价，或调整连接件品牌选型'
      }
    },
    evidencePacks.bomPrice,
    {
      type: 'table', title: '超预算排名',
      data: {
        columns: ['物料名称', '品牌/型号', '预算单价', '报价单价', '偏差', '等级'],
        rows: [
          ['连接件 LJ-05', '日本 Isowand', '¥62/个', '¥85/个', '+37%', 'HIGH'],
          ['蜂窝铝板 HWB-A7', '定制', '¥380/㎡', '¥468/㎡', '+23%', 'HIGH'],
          ['拉网天花 LW-03', '铝质', '¥220/㎡', '¥268/㎡', '+22%', 'MEDIUM'],
          ['钢网吊顶 SG-02', '不锈钢', '¥185/㎡', '¥215/㎡', '+16%', 'MEDIUM'],
          ['花岗岩 HG-01', '芝麻灰', '¥320/㎡', '¥340/㎡', '+6%', 'LOW'],
        ]
      }
    }
  ], `## 报价单审核完成\n\n**4 项超预算物料（偏差 > 15%）：**\n\n1. **连接件 LJ-05**（日本 Isowand）：报价 ¥85/个，预算 ¥62/个，偏差 **+37%** — 建议更换品牌或批量议价\n2. **蜂窝铝板 HWB-A7**：定制规格溢价 +23%，与近期新增 12 块有关\n3. **拉网天花 LW-03**：新增品类，首次报价偏高\n4. **钢网吊顶 SG-02**：不锈钢材质溢价 +16%\n\n> Structured Output 输出标准 JSON，前端直接渲染为超预算排名看板。超预算总额约 ¥42,000。`)
}

// ─────────── BOM: 品类完整性检查 ───────────
function buildBomCategoryCheck(): ChatMessage {
  return msg('bom', bomTrace, [
    {
      type: 'verdict', title: '审核结论',
      data: {
        finding: '对照标准物料体系，发现 3 个品类缺失、1 个品类信息不完整',
        severity: 'MEDIUM', impact: '缺失品类可能在采购阶段被遗漏',
        action: '补充中空百叶、集成楼面板、人造草皮至物料清单'
      }
    },
    evidencePacks.bomCategory,
    {
      type: 'table', title: '品类覆盖清单',
      data: {
        columns: ['品类', '标准分类', '墙板信息表', '物料清单', '加工图', '状态'],
        rows: [
          ['蜂窝铝板', '幕墙面板', '已录入', '已录入', '已有', '完整'],
          ['阳光板', '幕墙面板', '已录入', '已录入', '已有', '完整'],
          ['一体板', '幕墙面板', '已录入', '已录入', '已有', '完整'],
          ['铝克莱尔', '幕墙面板', '已录入', '已录入', '已有', '完整'],
          ['中空百叶', '室内构件', '缺失', '缺失', '缺失', '缺失'],
          ['集成楼面板', '楼面系统', '缺失', '部分', '已有', '不完整'],
          ['人造草皮', '景观材料', '缺失', '缺失', '已有', '缺失'],
          ['花岗岩', '景观材料', '已录入', '已录入', '已有', '完整'],
        ]
      }
    }
  ], `## 品类完整性检查完成\n\n**缺失品类（对照标准物料分类体系）：**\n\n1. **中空百叶**：加工图中已有中空百叶窗节点，但墙板信息表和物料清单均无此品类\n2. **集成楼面板**：加工图有楼面板深化图，物料清单仅有部分条目，未完整录入\n3. **人造草皮**：景观设计图中有人造草皮区域，物料清单未覆盖\n\n> 12 个标准品类中 8 个覆盖完整，覆盖率 67%。建议将缺失品类作为下一轮清单更新的优先项。`)
}

// ─────────── Progress: 迭代密度分析 ───────────
function buildProgressDensity(): ChatMessage {
  return msg('progress', progressTrace, [
    {
      type: 'verdict', title: '预警结论',
      data: {
        finding: '安装示意图 55 天内迭代 10 版，密度超阈值 2.3 倍',
        severity: 'HIGH', impact: '返工压力波及墙板加工图和连接件加工图',
        action: '立即组织结构+幕墙+安装三方对图会，锁定终版方案'
      }
    },
    evidencePacks.progressDensity,
    {
      type: 'timeline', title: '安装示意图迭代时间轴（55天 10版）',
      data: [
        { date: '07-31', version: 'v1', label: '安装示意图初版', status: 'normal' },
        { date: '08-03', version: 'v2', label: '新缝调整', status: 'normal' },
        { date: '08-09', version: 'v3', label: '连接件变更', status: 'warning' },
        { date: '08-12', version: 'v4', label: '收口方案修改', status: 'warning' },
        { date: '08-17', version: 'v5', label: '转角板调整', status: 'alert' },
        { date: '08-27', version: 'v6', label: '阳光板安装修正', status: 'alert' },
        { date: '08-28', version: 'v7', label: '节点大样更新', status: 'alert' },
        { date: '08-30', version: 'v8', label: '门窗接口调整', status: 'warning' },
        { date: '09-01', version: 'v9', label: '最终深化', status: 'normal' },
        { date: '09-05', version: 'v10', label: '施工版定稿', status: 'done' },
      ]
    },
    {
      type: 'alert', title: '风险预警',
      data: [
        { level: 'HIGH', message: '55天10版，平均5.5天/版——远超正常迭代频率（通常10-14天/版）', date: '2024-07~08' },
        { level: 'HIGH', message: 'v5→v6→v7 连续3版间隔仅1-10天，疑似返工修正', date: '2024-08-17~28' },
      ]
    }
  ], `## 迭代密度分析完成\n\n**关键发现：**\n\n安装示意图在 2024-07-31 至 2024-09-05 的 55 天内迭代 10 版，平均 **5.5 天/版**，密度超正常阈值（10-14天/版）**2.3 倍**。\n\n**高密度区间：**\n- v5→v7（08-17 ~ 08-28）：11 天内 3 版密集迭代\n- RAG 检索关联到 **8月9日幕墙工程图更新** 和 **8月13日阳江现场勘测**\n\n**Vision 验证：** 8月20日现场照片确认框架尚未安装完毕，与高密度迭代吻合。`)
}

// ─────────── Progress: 进度偏差计算 ───────────
function buildProgressDeviation(): ChatMessage {
  return msg('progress', progressTrace, [
    {
      type: 'verdict', title: '预警结论',
      data: {
        finding: '框架加工图实际完成比计划滞后 6 天，原因是幕墙变更导致依赖延后',
        severity: 'HIGH', impact: '影响框架安装工序，下游墙板模型被迫同步调整',
        action: '与幕墙专业确认变更终版，重新排定框架加工图交付时间'
      }
    },
    evidencePacks.progressDeviation,
    {
      type: 'metric', title: '偏差统计',
      data: [
        { label: '计划完成', value: '08-15' },
        { label: '实际完成', value: '08-21' },
        { label: '偏差天数', value: '6 天' },
        { label: '影响专业', value: '3 个' }
      ]
    },
    {
      type: 'alert', title: '偏差原因链',
      data: [
        { level: 'HIGH', message: '幕墙工程图 08-09 更新 → 框架加工图依赖延后', date: '2024-08-09' },
        { level: 'MEDIUM', message: 'Vision 比对 08-20 现场照片：框架尚未安装完毕', date: '2024-08-20' },
        { level: 'MEDIUM', message: '墙板模型 v4（08-14）被追加调整，受框架偏差波及', date: '2024-08-14' },
      ]
    }
  ], `## 进度偏差计算完成\n\n**偏差分析：**\n\n框架加工图原定 **8月15日** 完成，RAG 检索发现 **8月9日幕墙工程图更新**——这是框架加工图的上游依赖，导致其实际完成延后至 **8月21日**，偏差 **6 天**。\n\n**Vision 验证：**\n- 比对 8月20日现场照片，确认框架尚未安装\n- 效果图中该区域应已出现框架骨架，实际照片中为空\n\n**影响范围：** 墙板模型 v4（08-14）被追加调整，进一步波及 BOM 清单。`)
}

// ─────────── Progress: 多专业耦合检测 ───────────
function buildProgressCoupling(): ChatMessage {
  return msg('progress', progressTrace, [
    {
      type: 'verdict', title: '预警结论',
      data: {
        finding: '结构施工图与幕墙工程图迭代不同步，存在 11 天接口真空期',
        severity: 'HIGH', impact: '幕墙支座反力计算依赖结构终版，延误将传导至框架加工',
        action: '建立结构→幕墙版本依赖锁，上游未定稿前下游不得冻结'
      }
    },
    evidencePacks.progressCoupling,
    {
      type: 'chain', title: '专业耦合依赖链',
      data: {
        nodes: [
          { id: 1, label: '结构施工图', type: 'trigger', source: '6版 03-04→05-24' },
          { id: 2, label: '幕墙支座反力', type: 'change', source: '05-02 更新' },
          { id: 3, label: '幕墙工程图', type: 'change', source: '4版 03-06→04-14' },
          { id: 4, label: '框架加工图', type: 'downstream', source: '4版 06-20→08-13' },
        ]
      }
    },
    {
      type: 'alert', title: '接口风险',
      data: [
        { level: 'HIGH', message: '结构终版 05-24，幕墙支座反力 05-02 已计算——基于旧版结构数据', date: '2024-05' },
        { level: 'HIGH', message: '幕墙工程图最终版 04-14，框架加工图 06-20 才启动——11天接口真空', date: '2024-04~06' },
      ]
    }
  ], `## 多专业耦合检测完成\n\n**接口不同步风险：**\n\n结构施工图（6版，03-04→05-24）与幕墙工程图（4版，03-06→04-14）存在版本迭代不同步：\n\n1. 幕墙支座反力计算在 **05-02** 完成，但结构施工图 **05-24** 才出终版——基于旧版数据\n2. 幕墙工程图 04-14 终版后，框架加工图 06-20 才启动——存在 **11天接口真空期**\n\n> 建议建立版本依赖锁：上游图纸未定稿前，下游不得冻结计算参数。`)
}

// ─────────── Progress: 版本间隔预警 ───────────
function buildProgressInterval(): ChatMessage {
  return msg('progress', progressTrace, [
    {
      type: 'verdict', title: '预警结论',
      data: {
        finding: '墙板模型 7 版中有 3 次间隔 ≤3 天，属过密迭代，疑似返工修正',
        severity: 'MEDIUM', impact: '过密迭代导致下游加工图频繁调整，增加出错概率',
        action: '排查 v2→v3、v4→v5、v5→v6 三次密集迭代的具体变更内容'
      }
    },
    evidencePacks.progressInterval,
    {
      type: 'table', title: '墙板模型版本间隔分析',
      data: {
        columns: ['版本区间', '间隔天数', '起始日期', '结束日期', '判定', '说明'],
        rows: [
          ['v1→v2', '9 天', '07-26', '08-04', '正常', '初版到首次调整'],
          ['v2→v3', '6 天', '08-04', '08-10', '偏密', '新缝变更引发'],
          ['v3→v4', '4 天', '08-10', '08-14', '过密', '框架偏差波及'],
          ['v4→v5', '5 天', '08-14', '08-19', '过密', '转角板调整'],
          ['v5→v6', '8 天', '08-19', '08-27', '正常', '收口方案稳定'],
          ['v6→v7', '4 天', '08-27', '08-31', '偏密', '最终深化修正'],
        ]
      }
    },
    {
      type: 'alert', title: '间隔预警',
      data: [
        { level: 'HIGH', message: 'v3→v4 仅 4 天间隔，v4→v5 仅 5 天——连续过密，返工压力明显', date: '2024-08-10~19' },
        { level: 'MEDIUM', message: 'v6→v7 间隔 4 天，在终版前仍出现密集修正', date: '2024-08-27~31' },
      ]
    }
  ], `## 版本间隔预警完成\n\n**墙板模型 7 版间隔分析：**\n\n| 判定标准 | 正常 ≥7天 | 偏密 5-6天 | 过密 ≤4天 |\n|---------|---------|---------|---------|\n| 出现次数 | 2 | 1 | 3 |\n\n**过密区间：**\n- v3→v4（4天）：框架加工图偏差波及\n- v4→v5（5天）：转角板接口调整\n- v6→v7（4天）：终版前最后修正\n\n> 3 次过密迭代集中在 08-10 ~ 08-19，与安装示意图 v5→v7 高密度区间重合——返工压力同步传导。`)
}

// ─────────── Change: 变更溯源 ───────────
function buildChangeTrace(): ChatMessage {
  return msg('change', changeTrace, [
    {
      type: 'verdict', title: '溯源结论',
      data: {
        finding: '3 扇防火门尺寸静默变更，根因为 2024-03-13 会议纪要中的"消防规范升级"决策',
        severity: 'HIGH', impact: '洞口收边件加工图、物料清单需同步更新',
        action: '通知结构专业更新收边件加工图，BOM 同步防火门尺寸'
      }
    },
    evidencePacks.changeTrace,
    {
      type: 'chain', title: '变更因果链',
      data: {
        nodes: [
          { id: 1, label: '消防规范升级', type: 'trigger', source: '会议纪要 2024-03-13' },
          { id: 2, label: '防火门尺寸变更', type: 'change', source: '门表 03-09→05-05' },
          { id: 3, label: '洞口收边件加工图', type: 'downstream', source: 'CAD/new/加工图/' },
          { id: 4, label: 'BOM 更新', type: 'downstream', source: 'EXCEL/物料清单' },
        ]
      }
    }
  ], `## 变更溯源完成\n\n**发现静默变更：** 3 扇防火门尺寸从 900×2100 改为 1000×2200，无直接变更通知。\n\n**溯源过程：**\n1. 门表 Diff 识别出尺寸变更\n2. Document AI 从 3月13日会议纪要提取 "消防规范升级" 关键词\n3. Self-Reflection 第二轮确认因果链\n\n> 典型"静默变更"场景——Document AI + Self-Reflection 成功补上缺失的因果链条。`)
}

// ─────────── Change: 影响范围分析 ───────────
function buildChangeImpact(): ChatMessage {
  return msg('change', changeTrace, [
    {
      type: 'verdict', title: '影响分析结论',
      data: {
        finding: '结构施工图终版变更影响 4 个专业、8 个下游文件',
        severity: 'HIGH', impact: '从结构→幕墙→框架→墙板→BOM 全链传导',
        action: '按影响链顺序逐一确认下游文件是否已同步更新'
      }
    },
    evidencePacks.changeImpact,
    {
      type: 'chain', title: '影响传导链',
      data: {
        nodes: [
          { id: 1, label: '结构施工图终版', type: 'trigger', source: '05-24 更新' },
          { id: 2, label: '幕墙支座反力', type: 'change', source: '05-02 重算' },
          { id: 3, label: '框架加工图', type: 'change', source: '06-20 更新' },
          { id: 4, label: '墙板模型/BOM', type: 'downstream', source: '07-26 起调整' },
        ]
      }
    },
    {
      type: 'table', title: '受影响文件清单',
      data: {
        columns: ['专业', '文件名', '受影响类型', '同步状态'],
        rows: [
          ['幕墙', '幕墙工程图 v4', '支座反力重算', '已同步'],
          ['幕墙', '框架加工图 v4', '框架尺寸调整', '已同步'],
          ['室内', '墙板模型 v4~v7', '墙板接口变更', '已同步'],
          ['室内', '墙板信息表 v4', '板材数量调整', '部分同步'],
          ['给排水', '给排水平面图', '管井位置微调', '未确认'],
          ['电气', '电气平面图', '配电箱位置', '未确认'],
          ['室内', '装修工程清单', '材料数量变化', '待更新'],
          ['预算', '报价单', '单价偏差', '待审核'],
        ]
      }
    }
  ], `## 影响范围分析完成\n\n结构施工图终版（2024-05-24）变更后，影响沿以下路径传导：\n\n**结构 → 幕墙**：支座反力重算（05-02）→ 幕墙工程图更新（v4）\n**幕墙 → 框架**：框架加工图尺寸调整（06-20）\n**框架 → 墙板**：墙板模型连续 4 版调整（v4~v7）\n**墙板 → BOM**：材料数量变化，待更新\n\n> 8 个文件中 4 个已同步，2 个未确认，2 个待更新——建议逐一确认。`)
}

// ─────────── Change: 未同步检测 ───────────
function buildChangeDesync(): ChatMessage {
  return msg('change', changeTrace, [
    {
      type: 'verdict', title: '断链检测结论',
      data: {
        finding: '发现 2 个下游文件"上游已变更但自身未更新"——存在断链',
        severity: 'HIGH', impact: '施工阶段可能依据过时文件执行',
        action: '立即更新装修工程清单和报价单，确保与最新图纸版本一致'
      }
    },
    evidencePacks.changeDesync,
    {
      type: 'table', title: '断链列表',
      data: {
        columns: ['上游文件', '最新版本', '下游文件', '当前版本', '差距', '断链类型'],
        rows: [
          ['墙板模型', 'v7（08-31）', '墙板信息表', 'v4（07-10）', '3 版落后', '数量未同步'],
          ['安装示意图', 'v10（09-05）', '装修工程清单', 'v5（09-01）', '1 版落后', '条目未更新'],
          ['结构施工图', '终版（05-24）', '给排水平面图', 'v2（04-20）', '待确认', '点位未校验'],
          ['幕墙工程图', 'v4（04-14）', '框架加工图', 'v4（08-13）', '已同步', '—'],
        ]
      }
    }
  ], `## 未同步检测完成\n\n**2 个断链：**\n\n1. **墙板信息表**：上游墙板模型已到 v7（08-31），但信息表仍停在 v4（07-10），落后 3 版——板材数量、规格可能已过时\n2. **装修工程清单**：上游安装示意图已到 v10（09-05），清单仍停在 v5（09-01）\n\n> 断链检测基于"上游文件最后修改时间 > 下游文件最后修改时间"规则，结合版本号比对确认。`)
}

// ─────────── Change: 变更履历查询 ───────────
function buildChangeHistory(): ChatMessage {
  return msg('change', changeTrace, [
    {
      type: 'verdict', title: '履历查询结论',
      data: {
        finding: '安装示意图 0731→0922 共经历 10 版迭代，变更频率在 08-17~08-28 达到峰值',
        severity: 'MEDIUM', impact: '高密度变更期间下游文件频繁被迫同步',
        action: '建立变更冻结窗口，终版前 7 天禁止非紧急变更'
      }
    },
    evidencePacks.changeHistory,
    {
      type: 'timeline', title: '安装示意图完整变更履历',
      data: [
        { date: '07-31', version: 'v1', label: '初版发布', status: 'normal' },
        { date: '08-03', version: 'v2', label: '新缝设计方案调整', status: 'normal' },
        { date: '08-09', version: 'v3', label: '连接件型号变更', status: 'warning' },
        { date: '08-12', version: 'v4', label: '收口方案修改', status: 'warning' },
        { date: '08-17', version: 'v5', label: '转角板接口调整', status: 'alert' },
        { date: '08-27', version: 'v6', label: '阳光板安装节点修正', status: 'alert' },
        { date: '08-28', version: 'v7', label: '节点大样全面更新', status: 'alert' },
        { date: '08-30', version: 'v8', label: '门窗接口调整', status: 'warning' },
        { date: '09-01', version: 'v9', label: '最终深化确认', status: 'normal' },
        { date: '09-05', version: 'v10', label: '施工版定稿', status: 'done' },
      ]
    }
  ], `## 变更履历查询完成\n\n**安装示意图完整变更历史（0731→0922，10版）：**\n\n10 版迭代中：\n- **正常迭代**（间隔≥7天）：v1→v2、v8→v9、v9→v10\n- **密集迭代**（间隔<5天）：v5→v6→v7（08-17~08-28，11天3版）\n\n**触发事件关联：**\n- v3（08-09）：关联 8月9日幕墙工程图更新\n- v5（08-17）：关联阳江现场勘测发现\n- v10（09-05）：施工版定稿，迭代终止\n\n> 建议在终版前 7 天设立变更冻结窗口，避免施工阶段频繁切换版本。`)
}

// ========== 模板→剧本映射 ==========

const templateMap: Record<string, Record<number, () => ChatMessage>> = {
  bom: {
    0: buildBomVersionDiff,
    1: buildBomDoorCheck,
    2: buildBomPriceAudit,
    3: buildBomCategoryCheck,
  },
  progress: {
    0: buildProgressDensity,
    1: buildProgressDeviation,
    2: buildProgressCoupling,
    3: buildProgressInterval,
  },
  change: {
    0: buildChangeTrace,
    1: buildChangeImpact,
    2: buildChangeDesync,
    3: buildChangeHistory,
  },
}

export function getDemoResponseByIndex(agentId: string, templateIndex: number): ChatMessage | null {
  return templateMap[agentId]?.[templateIndex]?.() || null
}

export function getExactDemoResponse(prompt: string, agentId?: string): ChatMessage | null {
  const id = agentId || 'bom'
  const agent = agents.find(a => a.id === id)
  const idx = agent?.demoTemplates.findIndex(t => t.prompt === prompt) ?? -1
  return idx >= 0 ? getDemoResponseByIndex(id, idx) : null
}

/** 根据 agentId + prompt 匹配模板索引，返回对应剧本 */
export function getDemoResponse(prompt: string, agentId?: string): ChatMessage {
  const id = agentId || 'bom'
  const agent = agents.find(a => a.id === id)
  if (agent) {
    const idx = agent.demoTemplates.findIndex(t => t.prompt === prompt)
    if (idx >= 0 && templateMap[id]?.[idx]) {
      return templateMap[id][idx]()
    }
  }
  // 自由输入时回退到第一个剧本
  return templateMap[id]?.[0]?.() || templateMap.bom[0]()
}
