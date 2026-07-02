<template>
  <div class="home">
    <nav class="nav" :class="{ scrolled: navScrolled }">
      <div class="nav-inner">
        <a class="nav-brand" href="#top" @click.prevent="scrollTo('top')">鸿轩展示中心</a>
        <div class="nav-links">
          <a href="#location" @click.prevent="scrollTo('location')">区位</a>
          <a href="#project" @click.prevent="scrollTo('project')">项目</a>
          <a href="#source" @click.prevent="scrollTo('source')">资料输入</a>
          <a href="#agents" @click.prevent="scrollTo('agents')">AI Agent</a>
        </div>
        <router-link to="/chat" class="nav-cta">
          进入演示台
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </router-link>
      </div>
    </nav>

    <section id="top" class="hero">
      <img class="hero-bg" src="/夜景建筑侧立面.png" alt="广东鸿轩展示中心夜景" />
      <div class="hero-shade"></div>
      <div class="hero-content">
        <span class="eyebrow">AI Agent 设计管理 Demo</span>
        <h1>
          <span>广东鸿轩实业集团</span>
          <span>展示中心</span>
        </h1>
        <p class="hero-lead">用阳江工厂真实工程资料，演示从图纸、清单、现场照片到 AI 审核、预警、追踪的闭环。</p>
        <div class="hero-actions">
          <router-link to="/chat" class="primary-btn">
            进入 Agent 演示
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </router-link>
          <a href="#location" class="secondary-btn" @click.prevent="scrollTo('location')">查看场地位置</a>
        </div>
      </div>
      <div class="hero-facts">
        <div v-for="item in keyFacts" :key="item.label" class="fact-item">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </div>
      </div>
    </section>

    <section id="location" class="section location-section">
      <div class="section-copy">
        <span class="eyebrow">Site Context</span>
        <h2>项目位置 / 场地参考</h2>
      </div>
      <div class="map-layout">
        <div class="map-frame-wrap">
          <iframe
            class="map-frame"
            :src="mapShareUrl"
            title="阳江项目百度地图"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </section>

    <section id="project" class="section project-section">
      <div class="section-copy">
        <span class="eyebrow">Project Evidence</span>
        <h2>2,690 个工程文件背后的实体建筑</h2>
        <p>这不是概念方案，而是已经落地交付的建筑——广东鸿轩实业集团阳江展示中心，AI Agent 的全部能力都建立在这些真实图纸、清单和现场影像之上。</p>
      </div>

      <div class="gallery-wrap">
        <div class="gallery-grid" @mouseleave="clearHovered">
          <!-- LEFT: hero image shown in full -->
          <figure class="gallery-item gallery-hero" @mouseenter="setHovered('/夜景建筑正立面.png', '建筑正立面夜景')" @mouseleave="clearHovered">
            <img src="/夜景建筑正立面.png" alt="阳江展示中心正立面夜景" loading="eager" />
            <figcaption>
              <span>Facade</span>
              <strong>建筑正立面</strong>
            </figcaption>
          </figure>

          <!-- RIGHT: mosaic of interior & exterior views, cropped to show highlights -->
          <div class="gallery-mosaic" @mouseleave="clearHovered">
            <figure class="gallery-item" @mouseenter="setHovered('/大厅.png', '前厅接待区')" @mouseleave="clearHovered">
              <img src="/大厅.png" alt="展示中心大厅" loading="lazy" />
              <figcaption><span>1F</span><strong>前厅接待区</strong></figcaption>
            </figure>
            <figure class="gallery-item" @mouseenter="setHovered('/中庭.png', '共享中庭')" @mouseleave="clearHovered">
              <img src="/中庭.png" alt="展示中心中庭" loading="lazy" />
              <figcaption><span>1F-3F</span><strong>共享中庭</strong></figcaption>
            </figure>
            <figure class="gallery-item mosaic-wide" @mouseenter="setHovered('/楼梯间.png', '楼梯间夜景')" @mouseleave="clearHovered">
              <img src="/楼梯间.png" alt="楼梯间夜景" loading="lazy" />
              <figcaption><span>Stairs</span><strong>楼梯间</strong></figcaption>
            </figure>
            <figure class="gallery-item" @mouseenter="setHovered('/待客.png', '待客区')" @mouseleave="clearHovered">
              <img src="/待客.png" alt="待客区" loading="lazy" />
              <figcaption><span>1F</span><strong>待客区</strong></figcaption>
            </figure>
            <figure class="gallery-item" @mouseenter="setHovered('/展厅.png', '企业展厅')" @mouseleave="clearHovered">
              <img src="/展厅.png" alt="企业展厅" loading="lazy" />
              <figcaption><span>2F</span><strong>企业展厅</strong></figcaption>
            </figure>
            <figure class="gallery-item mosaic-tall" @mouseenter="setHovered('/夜景建筑人视图.png', '建筑人视夜景')" @mouseleave="clearHovered">
              <img src="/夜景建筑人视图.png" alt="阳江展示中心人视夜景" loading="lazy" />
              <figcaption><span>Eye-level</span><strong>夜景人视</strong></figcaption>
            </figure>
            <figure class="gallery-item" @mouseenter="setHovered('/会议.png', '会议空间')" @mouseleave="clearHovered">
              <img src="/会议.png" alt="会议空间" loading="lazy" />
              <figcaption><span>2F</span><strong>会议空间</strong></figcaption>
            </figure>
          </div>
        </div>

        <!-- Hover Preview Overlay -->
        <div class="gallery-preview" v-if="hoveredImage">
          <div class="gp-panel">
            <img :src="hoveredImage.src" :alt="hoveredImage.alt" />
            <span class="gp-label">{{ hoveredImage.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <section id="source" class="section source-section">
      <div class="source-layout">
        <div class="source-copy">
          <span class="eyebrow">Real Project Inputs</span>
          <h2>从真实工程图纸到 AI Agent 闭环</h2>
          <p>透明 PNG 图纸不直接放在深色背景上，而是作为浅色图纸板展示。它们的作用不是装饰，而是说明 Agent 的输入来自真实项目资料。</p>
          <div class="source-stats">
            <div v-for="item in sourceStats" :key="item.label">
              <strong>{{ item.value }}</strong>
              <span>{{ item.label }}</span>
            </div>
          </div>
          <div class="drawing-tabs" role="tablist" aria-label="图纸类型">
            <button
              v-for="drawing in drawings"
              :key="drawing.id"
              type="button"
              :class="{ active: selectedDrawing === drawing.id }"
              @click="selectedDrawing = drawing.id"
            >
              {{ drawing.label }}
            </button>
          </div>
        </div>

        <div class="drawing-board" :class="`drawing-${currentDrawing.id}`">
          <div class="drawing-meta">
            <span>{{ currentDrawing.kicker }}</span>
            <strong>{{ currentDrawing.title }}</strong>
          </div>
          <div class="drawing-canvas">
            <img :src="currentDrawing.src" :alt="currentDrawing.title" />
          </div>
        </div>
      </div>
    </section>

    <section class="section loop-section">
      <div class="product-panel">
        <div class="product-copy">
          <span class="eyebrow">Product Display</span>
          <h2>产品构造进入 Agent 的判断语境</h2>
          <p>墙板、楼板、节点和现场立面不只是展示素材，它们对应 BOM 审核、进度预警和设计变更追踪中的真实构件对象。</p>
          <div class="product-tags">
            <span>墙板系统</span>
            <span>楼板构造</span>
            <span>节点复核</span>
            <span>现场闭环</span>
          </div>
          <div class="product-feature-list">
            <div v-for="item in productFeatures" :key="item.title" class="product-feature">
              <strong>{{ item.title }}</strong>
              <p>{{ item.desc }}</p>
            </div>
          </div>
        </div>
        <div class="product-showcase" aria-label="产品展示">
          <figure class="product-shot product-shot-main">
            <img src="/product/wall-panel.png" alt="墙板系统构造图" />
            <figcaption>
              <span>Wall Panel</span>
              <strong>墙板系统构造</strong>
            </figcaption>
          </figure>
          <figure class="product-shot product-shot-floor">
            <img src="/product/floor-panel.png" alt="楼板系统构造图" />
            <figcaption>
              <span>Floor Panel</span>
              <strong>楼板构造与包边节点</strong>
            </figcaption>
          </figure>
          <figure class="product-shot product-shot-detail-a">
            <img src="/product/facade-detail-1.png" alt="建筑墙板细节" />
            <figcaption>
              <span>Site Detail</span>
              <strong>立面分缝与材料质感</strong>
            </figcaption>
          </figure>
          <figure class="product-shot product-shot-detail-b">
            <img src="/product/facade-detail-2.png" alt="建筑立面现场照片" />
            <figcaption>
              <span>As Built</span>
              <strong>现场效果验证</strong>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section id="agents" class="section agents-section">
      <div class="section-copy centered">
        <span class="eyebrow">AI Solution</span>
        <h2>三类项目痛点，对应三个 Agent</h2>
        <p>首页只讲用户能立刻理解的价值，复杂技术链路放进详情页和演示台。</p>
      </div>

      <div class="pain-grid">
        <article v-for="agent in agentCards" :key="agent.id" class="agent-card" :style="{ '--accent': agent.color }" @click="goToAgent(agent.id)">
          <div class="agent-head">
            <span>{{ agent.index }}</span>
            <strong>{{ agent.name }}</strong>
          </div>
          <div class="agent-body">
            <p><b>痛点</b>{{ agent.pain }}</p>
            <p><b>能力</b>{{ agent.solution }}</p>
          </div>
          <div class="agent-actions">
            <router-link :to="{ path: '/chat', query: { agent: agent.id } }" class="agent-link" @click.stop>试用 Demo</router-link>
            <router-link :to="`/agent/${agent.id}`" class="agent-link ghost" @click.stop>查看详情</router-link>
          </div>
        </article>
      </div>
    </section>

    <section class="section cta-section">
      <div class="cta-inner">
        <h2>进入真实工程场景里的 AI Agent 演示</h2>
        <p>选择一个 Agent，查看它如何基于图纸、清单、照片和会议资料给出结构化结果。</p>
        <router-link to="/chat" class="primary-btn">
          进入演示台
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const navScrolled = ref(false)
const selectedDrawing = ref('plan')
const mapShareUrl = 'https://map.baidu.com/?newmap=1&shareurl=1&l=18.70614215464824&tn=B_EARTH_MAP&hb=B_SATELLITE_STREET&c=12462447,2474515&s=s%26da_src%3DsearchBox.button%26wd%3D%E9%98%B3%E6%B1%9F%E5%B8%82%E9%B8%BF%E8%BD%A9%E5%B7%A5%E4%B8%9A%E5%88%B6%E9%80%A0%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8%26c%3D257%26src%3D0%26wd2%3D%E9%98%B3%E6%B1%9F%E5%B8%82%E6%B1%9F%E5%9F%8E%E5%8C%BA%26pn%3D0%26sug%3D1%26l%3D12%26from%3Dwebmap%26biz_forward%3D%7B%22scaler%22%3A2%2C%22styles%22%3A%22pl%22%7D%26sug_forward%3Dd5464cf81dc02154fda77813%26device_ratio%3D2'

const hoveredImage = ref<{src: string; alt: string; label: string} | null>(null)
let hoverTimer: ReturnType<typeof setTimeout> | null = null

function setHovered(src: string, label: string) {
  if (hoverTimer) clearTimeout(hoverTimer)
  hoverTimer = setTimeout(() => {
    hoveredImage.value = { src, alt: label, label }
    hoverTimer = null
  }, 1000)
}

function clearHovered() {
  if (hoverTimer) { clearTimeout(hoverTimer); hoverTimer = null }
  hoveredImage.value = null
}

const keyFacts = [
  { label: '地点', value: '广东阳江' },
  { label: '规模', value: '地上4层' },
  { label: '周期', value: '11个月' },
  { label: '资料', value: '2,690个文件' },
]

const sourceStats = [
  { label: 'CAD 图纸', value: '256' },
  { label: 'Rhino 模型', value: '58' },
  { label: '现场照片', value: '1,651' },
  { label: '物料清单', value: '17' },
]

const drawings = [
  { id: 'plan', label: '平面', kicker: 'Plan', title: '建筑平面图', src: '/阳江平面.png' },
  { id: 'section', label: '剖面', kicker: 'Section', title: '建筑剖面图', src: '/阳江出版剖面.png' },
  { id: 'analysis', label: '分析', kicker: 'Analysis', title: '设计分析图', src: '/阳江出版分析图.png' },
]

const currentDrawing = computed(() => drawings.find((item) => item.id === selectedDrawing.value) ?? drawings[0])

const agentCards = [
  {
    id: 'bom',
    index: '01',
    name: 'BOM 智能审核 Agent',
    color: '#3b82f6',
    pain: '物料清单多版本并行，数量、品类、报价很容易错漏。',
    solution: '自动比对清单与图纸，标记数量偏差和异常报价。',
  },
  {
    id: 'progress',
    index: '02',
    name: '工程进度风险预警 Agent',
    color: '#f59e0b',
    pain: '图纸高频迭代和现场照片分散，风险通常发现得太晚。',
    solution: '追踪版本密度、现场状态和关键节点，提前提示滞后风险。',
  },
  {
    id: 'change',
    index: '03',
    name: '设计变更追踪 Agent',
    color: '#8b5cf6',
    pain: '变更来源、影响范围和下游文件经常断链。',
    solution: '串联会议纪要、图纸版本和影响专业，生成变更影响链。',
  },
]

const productFeatures = [
  { title: 'BOM 审核有对象', desc: '把墙板、楼板和节点拆成可核验的材料条目，避免清单只停留在表格层。' },
  { title: '进度预警有现场', desc: '用现场立面照片对照构件安装状态，让风险提示落到真实施工画面。' },
  { title: '变更追踪有链路', desc: '从构造图、深化节点到最终效果，追踪每一次设计调整影响到哪里。' },
]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function goToAgent(id: string) {
  router.push(`/agent/${id}`)
}

function handleScroll() {
  navScrolled.value = window.scrollY > 40
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.home {
  --content-max: 1680px;
  min-height: 100vh;
  background: #080b12;
  color: #f6f7fb;
}

.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  height: 64px;
  padding: 0 32px;
  display: flex;
  align-items: center;
  transition: background 0.25s, border-color 0.25s;
}

.nav.scrolled {
  background: rgba(8, 11, 18, 0.88);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(14px);
}

.nav-inner {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.nav-brand,
.nav-links a,
.nav-cta {
  color: #fff;
  text-decoration: none;
}

.nav-brand {
  font-size: 15px;
  font-weight: 800;
}

.nav-links {
  display: flex;
  gap: 28px;
}

.nav-links a {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.64);
  transition: color 0.2s;
}

.nav-links a:hover {
  color: #fff;
}

.nav-cta,
.primary-btn,
.secondary-btn,
.agent-link,
.map-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  font-weight: 800;
  text-decoration: none;
  transition: transform 0.2s, background 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.nav-cta {
  padding: 9px 16px;
  font-size: 14px;
  background: #1f6bff;
}

.nav-cta:hover,
.primary-btn:hover,
.map-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 34px rgba(31, 107, 255, 0.28);
}

.hero {
  position: relative;
  min-height: 92vh;
  padding: 150px 10vw 112px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-bg,
.hero-shade {
  position: absolute;
  inset: 0;
}

.hero-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 35%;
  transform: scale(1.02);
}

.hero-shade {
  background:
    linear-gradient(90deg, rgba(5, 10, 17, 0.85) 0%, rgba(5, 10, 17, 0.5) 36%, rgba(5, 10, 17, 0.05) 74%),
    linear-gradient(180deg, rgba(5, 10, 17, 0.08) 0%, rgba(5, 10, 17, 0.55) 100%);
}

.hero-content {
  position: relative;
  z-index: 1;
  width: min(720px, 58vw);
}

.eyebrow {
  display: inline-flex;
  width: fit-content;
  margin-bottom: 16px;
  padding: 5px 10px;
  border: 1px solid rgba(123, 216, 197, 0.26);
  border-radius: 8px;
  color: #7bd8c5;
  background: rgba(123, 216, 197, 0.08);
  font-size: 12px;
  font-weight: 800;
}

.hero h1 {
  margin: 0 0 22px;
  font-size: clamp(48px, 6vw, 92px);
  line-height: 1;
  font-weight: 900;
}

.hero h1 span {
  display: block;
}

.hero-lead {
  max-width: 620px;
  margin: 0 0 34px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 19px;
  line-height: 1.75;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.primary-btn,
.secondary-btn {
  min-height: 48px;
  padding: 0 22px;
  font-size: 15px;
}

.primary-btn {
  color: #fff;
  background: #1f6bff;
}

.secondary-btn {
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.28);
  background: rgba(255, 255, 255, 0.08);
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.42);
}

.hero-facts {
  position: absolute;
  z-index: 1;
  left: 10vw;
  right: 10vw;
  bottom: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-bottom: 0;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  background: rgba(8, 18, 28, 0.78);
  backdrop-filter: blur(16px);
}

.fact-item {
  padding: 20px 24px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.fact-item:last-child {
  border-right: 0;
}

.fact-item span,
.source-stats span,
.map-info span {
  display: block;
  color: rgba(255, 255, 255, 0.48);
  font-size: 12px;
  font-weight: 700;
}

.fact-item strong {
  display: block;
  margin-top: 6px;
  color: #fff;
  font-size: 18px;
}

.section {
  padding: 96px 6vw;
}

.section-copy,
.location-copy {
  max-width: var(--content-max);
  margin: 0 auto 34px;
}

.section-copy p {
  max-width: 900px;
}

.section-copy h2,
.source-copy h2,
.product-copy h2,
.location-copy h2,
.cta-inner h2 {
  margin: 0 0 14px;
  color: #fff;
  font-size: clamp(30px, 4vw, 48px);
  line-height: 1.12;
  font-weight: 900;
}

.section-copy p,
.source-copy p,
.product-copy p,
.location-copy p,
.cta-inner p,
.map-info p {
  margin: 0;
  color: rgba(255, 255, 255, 0.62);
  font-size: 16px;
  line-height: 1.75;
}

.centered {
  text-align: center;
}

.centered .eyebrow {
  margin-left: auto;
  margin-right: auto;
}

.project-section {
  background: #080b12;
}

/* ========== GALLERY ========== */
.gallery-wrap {
  max-width: var(--content-max);
  margin: 0 auto;
  padding: 0 var(--content-pad);
  position: relative;
}

.gallery-preview {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 72px 6vw;
  background: rgba(5, 8, 13, 0.68);
  backdrop-filter: blur(10px);
  pointer-events: none;
}

.gp-panel {
  position: relative;
  max-width: min(1180px, 88vw);
  max-height: min(760px, 78vh);
  border-radius: 14px;
  overflow: hidden;
  background: #05080f;
  border: 1px solid rgba(255,255,255,0.16);
  box-shadow: 0 30px 100px rgba(0,0,0,0.72);
}

.gp-panel img {
  display: block;
  width: auto;
  height: auto;
  max-width: min(1180px, 88vw);
  max-height: min(760px, 78vh);
  object-fit: contain;
}

.gp-label {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 18px 20px;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  color: #fff; font-size: 0.85rem; font-weight: 600;
}

.gallery-grid {
  display: grid;
  grid-template-columns: clamp(315px, 23vw, 390px) minmax(0, 1fr);
  height: clamp(420px, 30vw, 500px);
  gap: 12px;
  align-items: stretch;
}

.gallery-item {
  position: relative;
  margin: 0;
  border-radius: 10px;
  overflow: hidden;
  background: #121823;
  cursor: crosshair;
}

.gallery-hero {
  align-self: stretch;
  background: #05080f;
}

.gallery-item.gallery-hero img {
  object-fit: contain;
  object-position: center;
  padding: 0;
  background: #05080f;
}

.gallery-mosaic {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  grid-template-rows: repeat(3, minmax(0, 1fr));
  gap: 12px;
  align-self: stretch;
  min-height: 0;
}

.gallery-mosaic .gallery-item:nth-child(1) { grid-column: 1 / span 2; grid-row: 1 / span 2; }
.gallery-mosaic .gallery-item:nth-child(2) { grid-column: 3; grid-row: 1 / span 2; }
.gallery-mosaic .gallery-item:nth-child(3) { grid-column: 4 / span 2; grid-row: 1; }
.gallery-mosaic .gallery-item:nth-child(4) { grid-column: 4; grid-row: 2; }
.gallery-mosaic .gallery-item:nth-child(5) { grid-column: 5; grid-row: 2; }
.gallery-mosaic .gallery-item:nth-child(6) { grid-column: 1 / span 2; grid-row: 3; }
.gallery-mosaic .gallery-item:nth-child(7) { grid-column: 3 / span 3; grid-row: 3; }

.gallery-mosaic .gallery-item:nth-child(1) img { object-position: center 56%; }
.gallery-mosaic .gallery-item:nth-child(2) img { object-position: center 45%; }
.gallery-mosaic .gallery-item:nth-child(3) img { object-position: center 52%; }
.gallery-mosaic .gallery-item:nth-child(4) img { object-position: center 50%; }
.gallery-mosaic .gallery-item:nth-child(5) img { object-position: center 52%; }
.gallery-mosaic .gallery-item:nth-child(6) img { object-position: center 58%; }
.gallery-mosaic .gallery-item:nth-child(7) img { object-position: center 48%; }

.gallery-item img {
  width: 100%; height: 100%;
  display: block;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.4s;
}

.gallery-item:hover img {
  transform: scale(1.06);
  filter: brightness(1.1);
}

.gallery-item figcaption {
  position: absolute;
  left: 0; right: 0; bottom: 0;
  padding: 32px 20px 18px;
  background: linear-gradient(180deg, transparent, rgba(0,0,0,0.82));
  opacity: 0;
  transform: translateY(6px);
  transition: all 0.35s;
}

.gallery-item:hover figcaption {
  opacity: 1;
  transform: translateY(0);
}

.gallery-item figcaption span {
  display: block;
  margin-bottom: 4px;
  color: #7bd8c5;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.05em;
}

.gallery-item figcaption strong {
  color: #fff;
  font-size: 17px;
}

.source-section {
  background: #0d111b;
}

.source-layout {
  max-width: var(--content-max);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(340px, 0.58fr) minmax(0, 1.42fr);
  gap: clamp(28px, 4vw, 64px);
  align-items: center;
}

.source-copy {
  min-width: 0;
}

.source-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 28px 0;
}

.source-stats div {
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
}

.source-stats strong {
  display: block;
  margin-bottom: 4px;
  color: #fff;
  font-size: 28px;
}

.drawing-tabs {
  display: flex;
  gap: 8px;
}

.drawing-tabs button {
  height: 38px;
  padding: 0 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.72);
  background: rgba(255, 255, 255, 0.04);
  cursor: pointer;
  font-weight: 800;
}

.drawing-tabs button.active {
  color: #07111f;
  border-color: #e8ded0;
  background: #e8ded0;
}

.drawing-board {
  position: relative;
  min-height: 0;
  padding: 14px;
  border-radius: 10px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.24), rgba(255, 255, 255, 0.04)),
    #d9d1c3;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 34px 90px rgba(0, 0, 0, 0.36);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 12px;
  overflow: hidden;
}

.drawing-board::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(90deg, rgba(7, 13, 22, 0.08) 1px, transparent 1px),
    linear-gradient(180deg, rgba(7, 13, 22, 0.06) 1px, transparent 1px);
  background-size: 36px 36px;
  opacity: 0.34;
}

.drawing-meta {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  min-height: 44px;
  padding: 0 4px 10px;
  border-bottom: 1px solid rgba(19, 25, 33, 0.12);
  color: #1b2532;
}

.drawing-meta span {
  font-size: 12px;
  font-weight: 900;
}

.drawing-meta strong {
  font-size: 18px;
}

.drawing-canvas {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 2.43 / 1;
  min-height: 300px;
  padding: clamp(12px, 1.6vw, 24px);
  border-radius: 8px;
  background:
    radial-gradient(circle at 12% 10%, rgba(255, 255, 255, 0.9), transparent 28%),
    #fbf8ef;
  border: 1px solid rgba(19, 25, 33, 0.12);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.55),
    0 14px 32px rgba(21, 16, 10, 0.14);
  overflow: hidden;
}

.drawing-canvas img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  filter: contrast(1.08) saturate(0.96);
}

.agents-section {
  background: #080b12;
}

.pain-grid {
  max-width: var(--content-max);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.agent-card {
  padding: 28px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  cursor: pointer;
  transition: transform 0.25s, border-color 0.25s, background 0.25s;
}

.agent-card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--accent) 62%, transparent);
  background: color-mix(in srgb, var(--accent) 9%, rgba(255, 255, 255, 0.03));
}

.agent-head {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 28px;
}

.agent-head span {
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #fff;
  background: var(--accent);
  font-weight: 900;
}

.agent-head strong {
  color: #fff;
  font-size: 22px;
  line-height: 1.3;
}

.agent-body {
  display: grid;
  gap: 14px;
  margin-bottom: 28px;
}

.agent-body p {
  margin: 0;
  color: rgba(255, 255, 255, 0.62);
  font-size: 15px;
  line-height: 1.65;
}

.agent-body b {
  display: block;
  margin-bottom: 4px;
  color: #fff;
}

.agent-actions {
  display: flex;
  gap: 10px;
}

.agent-link {
  flex: 1;
  min-height: 40px;
  color: #fff;
  background: var(--accent);
  font-size: 14px;
}

.agent-link.ghost {
  color: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: transparent;
}

.loop-section {
  background:
    radial-gradient(ellipse at 82% 18%, rgba(123, 216, 197, 0.08), transparent 34%),
    linear-gradient(180deg, #0d111b 0%, #0a0e17 100%);
}

.product-panel {
  max-width: var(--content-max);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(340px, 0.7fr) minmax(0, 1.3fr);
  gap: clamp(28px, 4.5vw, 72px);
  align-items: center;
}

.product-copy h2 {
  margin: 0 0 16px;
  color: #fff;
  font-size: clamp(32px, 4.2vw, 58px);
  line-height: 1.08;
  font-weight: 950;
}

.product-copy p {
  margin: 0;
  color: rgba(255, 255, 255, 0.64);
  font-size: 16px;
  line-height: 1.78;
}

.product-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 24px 0 28px;
}

.product-tags span {
  padding: 7px 10px;
  border-radius: 999px;
  color: #9ce8dc;
  background: rgba(123, 216, 197, 0.1);
  border: 1px solid rgba(123, 216, 197, 0.24);
  font-size: 12px;
  font-weight: 900;
}

.product-feature-list {
  display: grid;
  gap: 12px;
}

.product-feature {
  padding: 16px 18px;
  border-left: 3px solid rgba(123, 216, 197, 0.72);
  background: rgba(255, 255, 255, 0.035);
}

.product-feature strong {
  display: block;
  margin-bottom: 5px;
  color: #fff;
  font-size: 15px;
}

.product-feature p {
  color: rgba(255, 255, 255, 0.58);
  font-size: 14px;
  line-height: 1.65;
}

.product-showcase {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  grid-template-rows: minmax(210px, 0.92fr) minmax(190px, 0.82fr) minmax(170px, 0.72fr);
  gap: 12px;
  height: clamp(560px, 44vw, 700px);
}

.product-shot {
  position: relative;
  margin: 0;
  overflow: hidden;
  border-radius: 10px;
  background: #f4f6f4;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.28);
}

.product-shot-main {
  grid-row: 1 / span 2;
}

.product-shot-floor {
  grid-column: 2;
  grid-row: 1;
}

.product-shot-detail-a {
  grid-column: 2;
  grid-row: 2;
}

.product-shot-detail-b {
  grid-column: 1 / span 2;
  grid-row: 3;
}

.product-shot img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.55s ease, filter 0.35s ease;
}

.product-shot-main img,
.product-shot-floor img {
  object-fit: contain;
  padding: clamp(14px, 1.8vw, 26px);
  background: #f7f8f4;
}

.product-shot-detail-a img {
  object-position: center 42%;
}

.product-shot-detail-b img {
  object-position: center 54%;
}

.product-shot:hover img {
  transform: scale(1.045);
  filter: saturate(1.04) contrast(1.04);
}

.product-shot figcaption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 42px 18px 16px;
  background: linear-gradient(180deg, transparent, rgba(5, 8, 13, 0.78));
}

.product-shot-main figcaption,
.product-shot-floor figcaption {
  background: linear-gradient(180deg, transparent, rgba(5, 8, 13, 0.62));
}

.product-shot figcaption span {
  display: block;
  margin-bottom: 4px;
  color: #7bd8c5;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.04em;
}

.product-shot figcaption strong {
  color: #fff;
  font-size: 16px;
  line-height: 1.3;
}

.location-section {
  padding: 84px 6vw 96px;
  background:
    radial-gradient(ellipse at 18% 0%, rgba(123, 216, 197, 0.08), transparent 42%),
    linear-gradient(180deg, #0d111b 0%, #080b12 100%);
  color: #f6f7fb;
}


.map-layout {
  max-width: var(--content-max);
  margin: 0 auto;
}

.map-frame-wrap {
  min-height: min(760px, 70vh);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: #101722;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.42);
}

.map-frame {
  display: block;
  width: 100%;
  height: 100%;
  min-height: min(760px, 70vh);
  border: 0;
}

.cta-section {
  padding-top: 88px;
  padding-bottom: 110px;
  background: linear-gradient(180deg, #0d111b, #080b12);
}

.cta-inner {
  max-width: 760px;
  margin: 0 auto;
  text-align: center;
}

.cta-inner .primary-btn {
  margin-top: 28px;
}

@media (max-width: 1024px) {
  .hero-content {
    width: min(680px, 78vw);
  }

  .source-layout,
  .pain-grid,
  .product-panel,
  .map-layout {
    grid-template-columns: 1fr;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
    height: auto;
  }

  .gallery-hero {
    width: min(390px, 100%);
    height: min(520px, 133vw);
    justify-self: center;
  }

  .gallery-mosaic {
    height: 460px;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    grid-template-rows: repeat(3, minmax(0, 1fr));
  }

  .product-showcase {
    height: 620px;
  }
}

@media (max-width: 768px) {
  .nav {
    padding: 0 18px;
  }

  .nav-links {
    display: none;
  }

  .hero {
    min-height: auto;
    padding: 112px 22px 0;
    display: block;
  }

  .hero-content {
    width: 100%;
    padding-bottom: 54px;
  }

  .hero h1 {
    font-size: 38px;
    line-height: 1.08;
  }

  .hero-lead {
    font-size: 16px;
  }

  .hero-facts {
    position: relative;
    left: auto;
    right: auto;
    grid-template-columns: 1fr 1fr;
    margin: 0 -22px;
    border-radius: 0;
  }

  .fact-item {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .section {
    padding: 72px 18px;
  }

  .location-section {
    padding: 56px 18px 68px;
  }

  .location-title {
    margin-bottom: 16px;
  }

  .section-copy h2,
  .source-copy h2,
  .product-copy h2,
  .cta-inner h2 {
    font-size: 32px;
  }

  .product-showcase {
    grid-template-columns: 1fr;
    grid-template-rows: 300px 230px 240px 240px;
    height: auto;
  }

  .product-shot-main,
  .product-shot-floor,
  .product-shot-detail-a,
  .product-shot-detail-b {
    grid-column: 1;
    grid-row: auto;
  }

  .product-tags {
    margin-bottom: 20px;
  }

  .gallery-mosaic {
    height: 640px;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 2fr 1fr 2fr 2fr 2fr;
  }

  .gallery-mosaic .gallery-item:nth-child(1) { grid-column: 1 / span 2; grid-row: 1; }
  .gallery-mosaic .gallery-item:nth-child(2) { grid-column: 1 / span 2; grid-row: 2; }
  .gallery-mosaic .gallery-item:nth-child(3) { grid-column: 1 / span 2; grid-row: 3; }
  .gallery-mosaic .gallery-item:nth-child(4) { grid-column: 1; grid-row: 4; }
  .gallery-mosaic .gallery-item:nth-child(5) { grid-column: 2; grid-row: 4; }
  .gallery-mosaic .gallery-item:nth-child(6) { grid-column: 1; grid-row: 5; }
  .gallery-mosaic .gallery-item:nth-child(7) { grid-column: 2; grid-row: 5; }

  .source-stats {
    grid-template-columns: 1fr 1fr;
  }

  .drawing-board {
    padding: 14px;
  }

  .drawing-canvas {
    min-height: 220px;
  }

  .agent-actions {
    flex-direction: column;
  }

  .map-frame-wrap,
  .map-frame {
    min-height: 380px;
  }
}

@media (max-width: 520px) {
  .hero-facts,
  .source-stats {
    grid-template-columns: 1fr;
  }

  .hero-actions,
  .drawing-tabs {
    flex-direction: column;
    align-items: stretch;
  }

  .drawing-tabs button {
    width: 100%;
  }
}
</style>
