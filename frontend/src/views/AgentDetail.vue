<template>
  <div class="detail-page" v-if="agent">
    <!-- Header -->
    <header class="detail-header" :style="{ borderColor: agent.color }">
      <router-link to="/home" class="back-link">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        返回首页
      </router-link>
      <div class="dh-title">
        <span class="dh-icon">{{ agent.icon }}</span>
        <span>{{ agent.name }}</span>
      </div>
      <router-link :to="{ path: '/chat', query: { agent: agent.id } }" class="dh-cta">
        试用 Demo
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </router-link>
    </header>

    <div class="detail-content">
      <!-- Hero Section -->
      <div class="dh-hero" :style="{ '--accent': agent.color, '--accent-bg': agent.colorLight }">
        <div class="dh-hero-content">
          <span class="dh-badge">{{ agent.tagline }}</span>
          <h1>{{ agent.name }}</h1>
          <p>{{ agent.description }}</p>
        </div>
        <div class="dh-stats">
          <div class="dh-stat" v-for="s in agent.stats" :key="s.label">
            <span class="dhs-value">{{ s.value }}</span>
            <span class="dhs-label">{{ s.label }}</span>
          </div>
        </div>
      </div>

      <!-- Highlight Example -->
      <div class="detail-section">
        <h2 class="ds-title">技术亮点举例</h2>
        <div class="highlight-box" :style="{ borderColor: agent.color }">
          <div class="hb-icon">💡</div>
          <p>{{ agent.highlightExample }}</p>
        </div>
      </div>

      <!-- Core Capabilities -->
      <div class="detail-section">
        <h2 class="ds-title">核心能力</h2>
        <div class="cap-grid">
          <div class="cap-card" v-for="(c, i) in agent.capabilities" :key="c">
            <div class="cc-number">{{ String(i + 1).padStart(2, '0') }}</div>
            <div class="cc-name">{{ c }}</div>
          </div>
        </div>
      </div>

      <!-- Tech Stack -->
      <div class="detail-section">
        <h2 class="ds-title">AI 技术栈选型</h2>
        <div class="tech-grid">
          <div class="tech-card" v-for="t in agent.techStack" :key="t.name" :style="{ '--accent': agent.color }">
            <div class="tc-name">{{ t.name }}</div>
            <div class="tc-role">
              <span class="tc-role-label">角色</span>
              {{ t.role }}
            </div>
            <div class="tc-reason">
              <span class="tc-reason-label">为什么选它</span>
              {{ t.reason }}
            </div>
          </div>
        </div>
      </div>

      <!-- Related Data Sources -->
      <div class="detail-section" v-if="relatedFiles.length">
        <h2 class="ds-title">关联数据源</h2>
        <div class="file-grid">
          <div class="file-card" v-for="f in relatedFiles" :key="f.path">
            <div class="fc-icon">{{ f.icon }}</div>
            <div class="fc-info">
              <div class="fc-path">{{ f.path }}</div>
              <div class="fc-desc">{{ f.desc }}</div>
            </div>
            <div class="fc-role" :class="f.role">{{ f.role === 'core' ? '核心' : '辅助' }}</div>
          </div>
        </div>
      </div>

      <!-- Try Demo CTA -->
      <div class="detail-cta">
        <h3>试试看</h3>
        <p>选择左侧快捷模板或自由输入，体验 {{ agent.name }} 的决策过程</p>
        <router-link :to="{ path: '/chat', query: { agent: agent.id } }" class="btn btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          进入 {{ agent.name }} 演示
        </router-link>
      </div>
    </div>
  </div>

  <!-- 404 -->
  <div class="not-found" v-else>
    <h1>Agent 未找到</h1>
    <router-link to="/home" class="btn btn-primary">返回首页</router-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { agents } from '../mock/data'

const route = useRoute()
const agent = computed(() => agents.find(a => a.id === route.params.id))

interface FileRef { icon: string; path: string; desc: string; role: 'core' | 'aux' }

const relatedFiles = computed((): FileRef[] => {
  const id = agent.value?.id
  if (id === 'bom') return [
    { icon: '📊', path: 'EXCEL/工程统量_20240830.xlsx', desc: '265 MB 工程统量数据', role: 'core' },
    { icon: '📊', path: 'EXCEL/装饰材料下料清单_20240906.xlsx', desc: '84 MB 装饰材料下料', role: 'core' },
    { icon: '📊', path: 'EXCEL/阳江吊顶0915.xlsx', desc: '59 MB 吊顶材料清单', role: 'core' },
    { icon: '📋', path: '同僚/SANDRA/阳江墙板信息表_*.xlsx', desc: '4个版本墙板信息', role: 'core' },
    { icon: '💰', path: '同僚/DENNIS/报价单_20240310.xlsx', desc: '供应商报价单', role: 'aux' },
    { icon: '🚪', path: 'EXCEL/阳江门表_20240505.xlsx', desc: '门表数据', role: 'aux' },
  ]
  if (id === 'progress') return [
    { icon: '📐', path: 'CAD/new/before/', desc: '10版安装示意图迭代', role: 'core' },
    { icon: '🧊', path: 'RHINO/NEW/BEFORE/', desc: '7版墙板模型迭代', role: 'core' },
    { icon: '📸', path: 'JPG/现场照片/阳江/', desc: '1,600+ 张现场施工照片', role: 'core' },
    { icon: '🎬', path: '同僚/泽念/0422勘测/', desc: '12个现场勘测视频', role: 'aux' },
    { icon: '📄', path: 'PDF/阳江项目计划表.pdf', desc: '项目计划表基准', role: 'aux' },
    { icon: '📝', path: 'WORD/会议纪要_20240313.docx', desc: '里程碑参照', role: 'aux' },
  ]
  if (id === 'change') return [
    { icon: '🧊', path: '同僚/结构廖/', desc: '6版结构施工图迭代', role: 'core' },
    { icon: '📐', path: '同僚/幕墙tim/', desc: '4版幕墙工程图', role: 'core' },
    { icon: '📝', path: 'WORD/会议纪要_20240313.docx', desc: '14条决策变更触发源', role: 'core' },
    { icon: '🧊', path: '同僚/SANDRA/', desc: '墙板信息表+加工图', role: 'aux' },
    { icon: '📁', path: 'IN/业主/', desc: '业主指令/确定样板', role: 'aux' },
    { icon: '📦', path: 'out/', desc: '交付/提资资料', role: 'aux' },
  ]
  return []
})
</script>

<style scoped>
.detail-page { min-height: 100vh; background: #0b0f1a; }

/* Header */
.detail-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 2rem; height: 56px; position: sticky; top: 0; z-index: 10;
  background: rgba(11,15,26,0.95); backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.back-link {
  display: flex; align-items: center; gap: 6px;
  color: rgba(255,255,255,0.6); text-decoration: none; font-size: 0.85rem;
  transition: color 0.2s;
}
.back-link:hover { color: #fff; }
.dh-title { display: flex; align-items: center; gap: 8px; font-weight: 700; color: #fff; font-size: 1rem; }
.dh-icon { font-size: 1.2rem; }
.dh-cta {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 18px; border-radius: 8px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: #fff; text-decoration: none; font-size: 0.82rem; font-weight: 600;
  transition: all 0.2s;
}
.dh-cta:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(59,130,246,0.3); }

/* Content */
.detail-content { max-width: 1000px; margin: 0 auto; padding: 0 2rem 4rem; }

/* Hero */
.dh-hero {
  padding: 3rem 0; margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.dh-badge {
  display: inline-block; padding: 4px 12px; margin-bottom: 1rem;
  border-radius: 16px; font-size: 0.75rem; font-weight: 600;
  background: var(--accent-bg); color: var(--accent);
}
.dh-hero-content h1 { font-size: 2rem; font-weight: 800; color: #fff; margin-bottom: 0.8rem; }
.dh-hero-content p { font-size: 1rem; color: rgba(255,255,255,0.5); line-height: 1.6; max-width: 600px; margin-bottom: 2rem; }
.dh-stats { display: flex; gap: 2rem; flex-wrap: wrap; }
.dh-stat { display: flex; flex-direction: column; gap: 2px; }
.dhs-value { font-size: 1.3rem; font-weight: 800; color: var(--accent); }
.dhs-label { font-size: 0.78rem; color: rgba(255,255,255,0.4); }

/* Sections */
.detail-section { margin-bottom: 2.5rem; }
.ds-title { font-size: 1.2rem; font-weight: 700; color: #fff; margin-bottom: 1.2rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.06); }

/* Highlight */
.highlight-box {
  padding: 1.5rem; border-radius: 12px;
  background: rgba(255,255,255,0.02); border-left: 4px solid;
  display: flex; gap: 1rem;
}
.hb-icon { font-size: 1.6rem; flex-shrink: 0; }
.highlight-box p { font-size: 0.9rem; color: rgba(255,255,255,0.6); line-height: 1.7; }

/* Capabilities */
.cap-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; }
.cap-card {
  padding: 1.2rem; border-radius: 10px;
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
  transition: all 0.2s;
}
.cap-card:hover { background: rgba(255,255,255,0.05); transform: translateY(-2px); }
.cc-number { font-size: 1.6rem; font-weight: 800; color: rgba(255,255,255,0.08); margin-bottom: 0.3rem; }
.cc-name { font-size: 0.9rem; font-weight: 600; color: #fff; }

/* Tech Stack */
.tech-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; }
.tech-card {
  padding: 1.5rem; border-radius: 12px;
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
  transition: all 0.2s;
}
.tech-card:hover { border-color: var(--accent); background: rgba(255,255,255,0.04); }
.tc-name { font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
.tc-role, .tc-reason { margin-bottom: 0.8rem; }
.tc-role-label, .tc-reason-label {
  display: block; font-size: 0.7rem; font-weight: 600; color: rgba(255,255,255,0.35);
  text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.3rem;
}
.tc-role, .tc-reason { font-size: 0.85rem; color: rgba(255,255,255,0.6); line-height: 1.5; }

/* Files */
.file-grid { display: flex; flex-direction: column; gap: 8px; }
.file-card {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px; border-radius: 10px;
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
  transition: all 0.2s;
}
.file-card:hover { background: rgba(255,255,255,0.04); }
.fc-icon { font-size: 1.2rem; }
.fc-info { flex: 1; }
.fc-path { font-size: 0.82rem; font-weight: 600; color: #60a5fa; font-family: 'SF Mono', 'Consolas', monospace; }
.fc-desc { font-size: 0.75rem; color: rgba(255,255,255,0.4); margin-top: 2px; }
.fc-role {
  padding: 3px 10px; border-radius: 12px; font-size: 0.7rem; font-weight: 600;
  background: rgba(59,130,246,0.1); color: #60a5fa;
}
.fc-role.aux { background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.5); }

/* CTA */
.detail-cta {
  text-align: center; padding: 3rem 2rem; margin-top: 2rem;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(59,130,246,0.06), rgba(139,92,246,0.06));
  border: 1px solid rgba(59,130,246,0.12);
}
.detail-cta h3 { font-size: 1.3rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem; }
.detail-cta p { font-size: 0.9rem; color: rgba(255,255,255,0.5); margin-bottom: 1.5rem; }
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 28px; border-radius: 10px; font-size: 0.95rem; font-weight: 600;
  text-decoration: none; cursor: pointer; border: none;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: #fff; box-shadow: 0 4px 24px rgba(59,130,246,0.3);
  transition: all 0.25s;
}
.btn:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(59,130,246,0.45); }

/* Not Found */
.not-found {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  height: 100vh; gap: 1.5rem; background: #0b0f1a;
}
.not-found h1 { color: #fff; }

@media (max-width: 768px) {
  .dh-stats { flex-direction: column; gap: 1rem; }
  .cap-grid { grid-template-columns: 1fr 1fr; }
  .tech-grid { grid-template-columns: 1fr; }
}
</style>
