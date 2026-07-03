<template>
  <div class="chat-page">
    <!-- Header -->
    <header class="chat-header">
      <router-link to="/home" class="back-link">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        返回首页
      </router-link>
      <div class="header-title">
        <span class="ht-icon">🤖</span>
        <span>AI Agent 演示台</span>
      </div>
      <div class="header-right">
        <span class="demo-badge">Demo Mode</span>
      </div>
    </header>

    <div class="chat-body">
      <!-- Left Panel -->
      <aside class="chat-sidebar">
        <div class="sidebar-section">
          <h3 class="sidebar-title">选择 Agent</h3>
          <div class="agent-tabs">
            <button
              v-for="a in allAgents"
              :key="a.id"
              class="agent-tab"
              :class="{ active: currentAgent === a.id }"
              :style="currentAgent === a.id ? { borderColor: a.color, background: a.colorLight } : {}"
              @click="selectAgent(a.id)"
            >
              <span class="at-icon">{{ a.icon }}</span>
              <div class="at-info">
                <span class="at-name">{{ a.name.replace(' Agent', '') }}</span>
                <span class="at-tag">{{ a.tagline }}</span>
              </div>
            </button>
          </div>
        </div>

        <div class="sidebar-section" v-if="currentAgentInfo">
          <h3 class="sidebar-title">快捷模板</h3>
          <div class="templates">
            <button
              class="template-btn"
              v-for="t in currentAgentInfo.demoTemplates"
              :key="t.label"
              @click="useTemplate(t.prompt)"
            >
              <span class="tb-label">{{ t.label }}</span>
              <span class="tb-prompt">{{ t.prompt }}</span>
            </button>
          </div>
        </div>

        <div class="sidebar-section">
          <div class="poc-note">
            <div class="pn-title">Demo 说明</div>
            <p>本演示基于阳江工厂真实工程数据构建。选择 Agent 并输入问题，查看 Agent 的决策过程和结构化输出。</p>
          </div>
        </div>
      </aside>

      <!-- Chat Area -->
      <main class="chat-main">
        <!-- Empty State -->
        <div class="empty-state" v-if="messages.length === 0">
          <div class="es-icon">{{ currentAgentInfo?.icon || '🤖' }}</div>
          <h2 class="es-title">{{ currentAgentInfo?.name || 'AI Agent' }}</h2>
          <p class="es-desc">{{ currentAgentInfo?.description }}</p>
          <div class="es-workflow">
            <div class="esw-step" v-for="(step, i) in workflowSteps" :key="i">
              <div class="esw-icon">{{ step.icon }}</div>
              <div class="esw-label">{{ step.label }}</div>
              <div class="esw-arrow" v-if="i < workflowSteps.length - 1">→</div>
            </div>
          </div>
          <div class="es-hint">选择左侧快捷模板或直接输入问题开始</div>
        </div>

        <!-- Messages -->
        <div class="messages" ref="messagesRef" v-else>
          <div class="message" v-for="msg in messages" :key="msg.id" :class="msg.role" :data-message-id="msg.id">
            <!-- User Message -->
            <div class="msg-bubble msg-user" v-if="msg.role === 'user'">
              <div class="msg-text">{{ msg.content }}</div>
            </div>

            <!-- Agent Message -->
            <div class="msg-bubble msg-agent" v-if="msg.role === 'agent'" :style="{ borderColor: getAgentColor(msg.agentId) }">
              <!-- Agent Label -->
              <div class="msg-agent-label" :style="{ color: getAgentColor(msg.agentId) }">
                <span>{{ getAgentIcon(msg.agentId) }}</span>
                <span>{{ getAgentName(msg.agentId) }}</span>
                <span class="llm-badge" v-if="msg.llmProvider">🤖 {{ msg.llmProvider }}</span>
              </div>

              <!-- Result Cards (verdict first, then evidence) -->
              <div class="result-cards" v-if="msg.resultCards?.length">
                <!-- Verdict Card -->
                <div class="rc-verdict" v-for="(card, ci) in msg.resultCards.filter(c => c.type === 'verdict')" :key="'v'+ci" :class="card.data.severity?.toLowerCase()">
                  <div class="rv-header">
                    <span class="rv-severity" :class="card.data.severity?.toLowerCase()">{{ card.data.severity }}</span>
                    <span class="rv-title">{{ card.title }}</span>
                  </div>
                  <div class="rv-finding">{{ card.data.finding }}</div>
                  <div class="rv-meta">
                    <div class="rv-row"><span class="rv-label">影响范围</span><span class="rv-value">{{ card.data.impact }}</span></div>
                    <div class="rv-row"><span class="rv-label">建议动作</span><span class="rv-value rv-action">{{ card.data.action }}</span></div>
                  </div>
                </div>

                <!-- Evidence Cards -->
                <div class="result-card" v-for="(card, ci) in msg.resultCards.filter(c => c.type !== 'verdict')" :key="'e'+ci">
                  <!-- Evidence Card -->
                  <div class="rc-evidence" v-if="card.type === 'evidence'">
                    <div class="rc-title">{{ card.title }}</div>
                    <div class="evidence-grid">
                      <div class="evidence-item" v-for="item in card.data.items" :key="item.title">
                        <div class="evidence-media" v-if="item.src">
                          <img :src="item.src" :alt="item.title" />
                        </div>
                        <div class="evidence-media evidence-file" v-else>
                          <span>{{ item.label }}</span>
                        </div>
                        <div class="evidence-copy">
                          <span class="evidence-label">{{ item.label }}</span>
                          <strong>{{ item.title }}</strong>
                          <p>{{ item.desc }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Table Card -->
                  <div class="rc-table" v-if="card.type === 'table'">
                    <div class="rc-title">{{ card.title }}</div>
                    <div class="table-scroll">
                      <table>
                        <thead>
                          <tr><th v-for="col in card.data.columns" :key="col">{{ col }}</th></tr>
                        </thead>
                        <tbody>
                          <tr v-for="(row, ri) in card.data.rows" :key="ri">
                            <td v-for="(val, vi) in row" :key="vi">
                              <span :class="getCellClass(val)">{{ val }}</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <!-- Timeline Card -->
                  <div class="rc-timeline" v-if="card.type === 'timeline'">
                    <div class="rc-title">{{ card.title }}</div>
                    <div class="tl-scroll">
                      <div class="rc-tl-item" v-for="(item, ti) in card.data" :key="ti" :class="item.status">
                        <div class="rc-tl-dot"></div>
                        <div class="rc-tl-date">{{ item.date }}</div>
                        <div class="rc-tl-ver">{{ item.version }}</div>
                        <div class="rc-tl-label">{{ item.label }}</div>
                      </div>
                    </div>
                  </div>

                  <!-- Alert Card -->
                  <div class="rc-alerts" v-if="card.type === 'alert'">
                    <div class="rc-title">{{ card.title }}</div>
                    <div class="alert-item" v-for="(alert, ai) in card.data" :key="ai" :class="alert.level.toLowerCase()">
                      <span class="alert-level">{{ alert.level }}</span>
                      <span class="alert-msg">{{ alert.message }}</span>
                      <span class="alert-date">{{ alert.date }}</span>
                    </div>
                  </div>

                  <!-- Metric Card -->
                  <div class="rc-metrics" v-if="card.type === 'metric'">
                    <div class="rc-title">{{ card.title }}</div>
                    <div class="metric-grid">
                      <div class="metric-item" v-for="(m, mi) in card.data" :key="mi">
                        <div class="mi-value">{{ m.value }}</div>
                        <div class="mi-label">{{ m.label }}</div>
                      </div>
                    </div>
                  </div>

                  <!-- Chain Card -->
                  <div class="rc-chain" v-if="card.type === 'chain'">
                    <div class="rc-title">{{ card.title }}</div>
                    <div class="chain-flow">
                      <div class="chain-node" v-for="(node, ni) in card.data.nodes" :key="ni" :class="node.type">
                        <div class="cn-label">{{ node.label }}</div>
                        <div class="cn-source">{{ node.source }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Trace (collapsed) -->
              <div class="msg-trace" v-if="msg.trace?.length">
                <button class="trace-toggle" @click="msg._traceOpen = !msg._traceOpen">
                  <span class="tt-arrow" :class="{ open: msg._traceOpen }">▸</span>
                  Agent 决策过程
                </button>
                <div class="trace-steps" v-show="msg._traceOpen">
                  <div class="trace-step" v-for="(step, i) in msg.trace" :key="i" :class="step.status">
                    <span class="ts-icon">{{ step.icon }}</span>
                    <div class="ts-info">
                      <span class="ts-label">{{ step.label }}</span>
                      <span class="ts-detail">{{ step.detail }}</span>
                    </div>
                    <span class="ts-check" v-if="step.status === 'done'">✓</span>
                  </div>
                </div>
              </div>

              <!-- Content -->
              <div class="msg-content" v-html="renderMarkdown(msg.content)"></div>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div class="message agent" v-if="loading">
            <div class="msg-bubble msg-agent typing-indicator">
              <div class="typing-dots">
                <span></span><span></span><span></span>
              </div>
              <span class="typing-text">Agent 分析中...</span>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="input-area">
          <div class="input-wrapper">
            <textarea
              ref="inputRef"
              v-model="inputText"
              :placeholder="`向 ${currentAgentInfo?.name || 'Agent'} 提问...`"
              rows="1"
              @keydown.enter.exact.prevent="sendMessage"
              @input="autoResize"
            ></textarea>
            <div class="input-actions">
              <button class="ia-btn ia-clear" @click="clearMessages" title="清空对话">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
              <button class="ia-btn ia-send" @click="sendMessage" :disabled="!inputText.trim() || loading">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { agents as allAgentsData, getDemoResponse, getDemoResponseByIndex, getExactDemoResponse, type ChatMessage, type AgentInfo } from '../mock/data'

const route = useRoute()
const allAgents = allAgentsData
const currentAgent = ref('bom')
const messages = ref<ChatMessage[]>([])
const inputText = ref('')
const loading = ref(false)
const messagesRef = ref<HTMLElement>()
const inputRef = ref<HTMLTextAreaElement>()

const currentAgentInfo = computed(() => allAgents.find(a => a.id === currentAgent.value))

const workflowSteps = computed(() => {
  const id = currentAgent.value
  if (id === 'bom') return [
    { icon: '📝', label: '需求输入' },
    { icon: '📦', label: 'BOM 审核 Agent' },
    { icon: '⚡', label: '交叉校验' },
    { icon: '📋', label: '审核报告' }
  ]
  if (id === 'progress') return [
    { icon: '📝', label: '需求输入' },
    { icon: '⏱', label: '进度预警 Agent' },
    { icon: '🔍', label: 'RAG + Vision' },
    { icon: '⚠️', label: '风险预警' }
  ]
  return [
    { icon: '📝', label: '需求输入' },
    { icon: '🔄', label: '变更追踪 Agent' },
    { icon: '🔗', label: '影响链分析' },
    { icon: '📊', label: '变更报告' }
  ]
})

function selectAgent(id: string) {
  currentAgent.value = id
  messages.value = []
}

function useTemplate(prompt: string) {
  inputText.value = prompt
  nextTick(() => sendMessage())
}

function getAgentColor(id?: string) {
  return allAgents.find(a => a.id === id)?.color || '#3b82f6'
}
function getAgentIcon(id?: string) {
  return allAgents.find(a => a.id === id)?.icon || '🤖'
}
function getAgentName(id?: string) {
  return allAgents.find(a => a.id === id)?.name || 'AI Agent'
}

function getCellClass(val: string) {
  if (val === 'HIGH') return 'cell-high'
  if (val === 'MEDIUM') return 'cell-medium'
  if (val === 'LOW') return 'cell-low'
  return ''
}

function renderMarkdown(text: string): string {
  return text
    .replace(/## (.+)/g, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n(\d+)\. /g, '<br>$1. ')
    .replace(/\n- /g, '<br>• ')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>')
    .replace(/> (.+)/g, '<blockquote>$1</blockquote>')
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

async function sendMessage() {
  const text = inputText.value.trim()
  if (!text || loading.value) return

  messages.value.push({
    id: `msg-${Date.now()}`,
    role: 'user',
    content: text,
    timestamp: Date.now()
  })
  inputText.value = ''
  loading.value = true
  await nextTick()
  scrollToBottom()

  const agentMsg: any = {
    id: `msg-${Date.now()}-agent`,
    role: 'agent',
    agentId: currentAgent.value,
    content: '',
    trace: undefined,
    resultCards: undefined,
    timestamp: Date.now(),
    llmProvider: undefined,
    _traceOpen: false,
  }
  messages.value.push(agentMsg)

  let streamTimer: ReturnType<typeof setTimeout> | undefined
  let routedFallback: ChatMessage | null = null

  try {
    if (!API_BASE) throw new Error('demo_mode')

    const controller = new AbortController()
    streamTimer = setTimeout(() => controller.abort(), 60000)

    const resp = await fetch(`${API_BASE}/api/agent/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: text, agent_id: currentAgent.value }),
      signal: controller.signal,
    })

    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)

    const reader = resp.body!.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const data = JSON.parse(line.slice(6))

        if (data.type === 'route') {
          if (data.reliable && data.agent_id && typeof data.template_index === 'number') {
            routedFallback = getDemoResponseByIndex(data.agent_id, data.template_index)
            if (routedFallback) {
              agentMsg.agentId = data.agent_id
              agentMsg.resultCards = routedFallback.resultCards
            }
          }
        } else if (data.type === 'trace') {
          agentMsg.trace = data.trace
          agentMsg.llmProvider = 'Qwen-plus (百炼)'
        } else if (data.type === 'content') {
          agentMsg.content += data.content
          await nextTick()
          scrollToBottom()
        } else if (data.type === 'error') {
          agentMsg.content = `> LLM 调用失败，切换至本地规则模式\n\n${data.content}`
          throw new Error('llm_error')
        } else if (data.type === 'done') {
          break
        }
      }
    }
  } catch {
    const fallback = routedFallback || getExactDemoResponse(text, currentAgent.value)
    agentMsg.trace = agentMsg.trace || fallback?.trace
    agentMsg.resultCards = agentMsg.resultCards || fallback?.resultCards
    if (!agentMsg.content.trim()) {
      agentMsg.content = fallback?.content || '当前 LLM 服务未连接，且这个自由问题没有命中可验证模板。请补充具体文件、日期、构件名称，或先点击左侧模板查看可复核的证据演示。'
      agentMsg.llmProvider = undefined
    }
  } finally {
    if (streamTimer) clearTimeout(streamTimer)
  }

  if (!agentMsg.resultCards && routedFallback) {
    agentMsg.resultCards = routedFallback.resultCards
  }

  loading.value = false
  await nextTick()
  scrollToMessage(agentMsg.id)
}

function clearMessages() {
  messages.value = []
}

function scrollToBottom() {
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

function scrollToMessage(id: string) {
  const container = messagesRef.value
  const target = container?.querySelector<HTMLElement>(`[data-message-id="${id}"]`)
  if (!container || !target) {
    scrollToBottom()
    return
  }
  container.scrollTop = target.offsetTop - container.offsetTop - 12
}

function autoResize() {
  const el = inputRef.value
  if (el) {
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }
}

onMounted(() => {
  const agentParam = route.query.agent as string
  if (agentParam && allAgents.some(a => a.id === agentParam)) {
    currentAgent.value = agentParam
  }
})
</script>

<style scoped>
.chat-page { display: flex; flex-direction: column; height: 100vh; background: #0b0f1a; }

/* Header */
.chat-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 1.5rem; height: 56px; flex-shrink: 0;
  background: rgba(11,15,26,0.95); border-bottom: 1px solid rgba(255,255,255,0.06);
}
.back-link {
  display: flex; align-items: center; gap: 6px;
  color: rgba(255,255,255,0.6); text-decoration: none; font-size: 0.85rem;
  transition: color 0.2s;
}
.back-link:hover { color: #fff; }
.header-title { display: flex; align-items: center; gap: 8px; font-weight: 700; color: #fff; font-size: 1rem; }
.ht-icon { font-size: 1.2rem; }
.header-right { display: flex; align-items: center; }
.demo-badge {
  padding: 3px 10px; border-radius: 12px; font-size: 0.7rem; font-weight: 600;
  background: rgba(16,185,129,0.12); color: #6ee7b7; border: 1px solid rgba(16,185,129,0.2);
}

/* Body */
.chat-body { display: flex; flex: 1; overflow: hidden; }

/* Sidebar */
.chat-sidebar {
  width: 320px; flex-shrink: 0; overflow-y: auto;
  border-right: 1px solid rgba(255,255,255,0.06);
  padding: 1rem; display: flex; flex-direction: column; gap: 1.2rem;
  background: rgba(14,18,37,0.5);
}
.sidebar-title { font-size: 0.78rem; font-weight: 700; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.8rem; }

/* Agent Tabs */
.agent-tabs { display: flex; flex-direction: column; gap: 8px; }
.agent-tab {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px; border-radius: 10px; cursor: pointer;
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.7); font-size: 0.85rem; text-align: left;
  transition: all 0.2s;
}
.agent-tab:hover { background: rgba(255,255,255,0.05); }
.agent-tab.active { border-width: 2px; }
.at-icon { font-size: 1.4rem; }
.at-info { display: flex; flex-direction: column; gap: 2px; }
.at-name { font-weight: 600; color: #fff; font-size: 0.85rem; }
.at-tag { font-size: 0.7rem; color: rgba(255,255,255,0.4); }

/* Templates */
.templates { display: flex; flex-direction: column; gap: 8px; }
.template-btn {
  padding: 10px 14px; border-radius: 10px; cursor: pointer; text-align: left;
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
  transition: all 0.2s;
}
.template-btn:hover { background: rgba(59,130,246,0.08); border-color: rgba(59,130,246,0.2); }
.tb-label { display: block; font-size: 0.82rem; font-weight: 600; color: #60a5fa; margin-bottom: 4px; }
.tb-prompt { display: block; font-size: 0.75rem; color: rgba(255,255,255,0.4); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

/* PoC Note */
.poc-note {
  padding: 1rem; border-radius: 10px;
  background: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.15);
}
.pn-title { font-size: 0.82rem; font-weight: 700; color: #f59e0b; margin-bottom: 0.4rem; }
.poc-note p { font-size: 0.75rem; color: rgba(255,255,255,0.45); line-height: 1.5; }

/* Chat Main */
.chat-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

/* Empty State */
.empty-state {
  flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 2rem; text-align: center;
}
.es-icon { font-size: 4rem; margin-bottom: 1rem; }
.es-title { font-size: 1.6rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem; }
.es-desc { font-size: 0.95rem; color: rgba(255,255,255,0.45); max-width: 500px; line-height: 1.6; margin-bottom: 2rem; }
.es-workflow {
  display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; justify-content: center;
  margin-bottom: 1.5rem;
}
.esw-step { display: flex; align-items: center; gap: 6px; }
.esw-icon { font-size: 1.4rem; }
.esw-label { padding: 6px 14px; border-radius: 8px; font-size: 0.82rem; font-weight: 600; background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.7); }
.esw-arrow { color: rgba(255,255,255,0.2); font-size: 1rem; }
.es-hint { font-size: 0.82rem; color: rgba(255,255,255,0.3); }

/* Messages */
.messages { flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.2rem; }
.message { display: flex; }
.message.user { justify-content: flex-end; }
.message.agent { justify-content: flex-start; }

.msg-bubble { max-width: 85%; border-radius: 14px; }
.msg-user {
  padding: 10px 16px; font-size: 0.9rem; color: #fff;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  border-bottom-right-radius: 4px;
}
.msg-agent {
  padding: 1.2rem 1.5rem; border-bottom-left-radius: 4px;
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
  width: 100%; max-width: 900px;
}
.msg-agent-label {
  display: flex; align-items: center; gap: 6px;
  font-size: 0.82rem; font-weight: 700; margin-bottom: 1rem;
}
.llm-badge {
  padding: 2px 10px; border-radius: 12px; font-size: 0.68rem; font-weight: 600;
  background: rgba(16,185,129,0.12); color: #6ee7b7; border: 1px solid rgba(16,185,129,0.2);
  margin-left: auto;
}

/* Trace */
.msg-trace { margin-bottom: 1.2rem; }
.trace-toggle {
  display: flex; align-items: center; gap: 6px;
  background: none; border: none; cursor: pointer;
  font-size: 0.78rem; font-weight: 600; color: rgba(255,255,255,0.35);
  padding: 4px 0; transition: color 0.2s;
}
.trace-toggle:hover { color: rgba(255,255,255,0.6); }
.tt-arrow { display: inline-block; transition: transform 0.2s; font-size: 0.7rem; }
.tt-arrow.open { transform: rotate(90deg); }
.trace-steps { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
.trace-step {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 12px; border-radius: 8px;
  background: rgba(255,255,255,0.02); font-size: 0.82rem;
}
.trace-step.done { border-left: 2px solid #10b981; }
.trace-step.active { border-left: 2px solid #f59e0b; background: rgba(245,158,11,0.05); }
.trace-step.pending { border-left: 2px solid rgba(255,255,255,0.1); opacity: 0.5; }
.ts-icon { font-size: 1rem; }
.ts-info { flex: 1; display: flex; flex-direction: column; gap: 1px; }
.ts-label { font-weight: 600; color: #fff; font-size: 0.82rem; }
.ts-detail { font-size: 0.72rem; color: rgba(255,255,255,0.4); }
.ts-check { color: #10b981; font-weight: 700; }

/* Result Cards */
.result-cards { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.2rem; }
.result-card {
  border-radius: 10px; overflow: hidden;
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
}

/* Verdict Card */
.rc-verdict {
  padding: 1.2rem 1.4rem; border-radius: 10px;
  border-left: 4px solid #ef4444;
  background: rgba(239,68,68,0.04);
}
.rc-verdict.medium { border-left-color: #f59e0b; background: rgba(245,158,11,0.04); }
.rc-verdict.low { border-left-color: #10b981; background: rgba(16,185,129,0.04); }
.rv-header { display: flex; align-items: center; gap: 10px; margin-bottom: 0.8rem; }
.rv-severity {
  padding: 2px 10px; border-radius: 6px; font-size: 0.72rem; font-weight: 800;
  background: rgba(239,68,68,0.15); color: #ef4444; letter-spacing: 0.04em;
}
.rv-severity.medium { background: rgba(245,158,11,0.15); color: #f59e0b; }
.rv-severity.low { background: rgba(16,185,129,0.15); color: #10b981; }
.rv-title { font-size: 0.82rem; font-weight: 600; color: rgba(255,255,255,0.5); }
.rv-finding { font-size: 1.05rem; font-weight: 700; color: #fff; line-height: 1.5; margin-bottom: 1rem; }
.rv-meta { display: flex; flex-direction: column; gap: 6px; }
.rv-row { display: flex; gap: 10px; font-size: 0.82rem; }
.rv-label { color: rgba(255,255,255,0.35); min-width: 70px; flex-shrink: 0; }
.rv-value { color: rgba(255,255,255,0.65); }
.rv-action { color: #60a5fa; font-weight: 600; }
.rc-title { padding: 10px 14px; font-size: 0.82rem; font-weight: 700; color: #fff; background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.06); }

/* Evidence */
.rc-evidence { background: rgba(255,255,255,0.015); }
.evidence-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding: 14px;
}
.evidence-item {
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr);
  gap: 12px;
  min-height: 96px;
  padding: 10px;
  border-radius: 10px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
}
.evidence-media {
  width: 100%;
  height: 96px;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(255,255,255,0.06);
}
.evidence-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.evidence-file {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #93c5fd;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  border: 1px dashed rgba(147,197,253,0.35);
  background: rgba(59,130,246,0.08);
}
.evidence-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}
.evidence-label {
  width: fit-content;
  padding: 2px 7px;
  border-radius: 999px;
  color: #5eead4;
  background: rgba(20,184,166,0.12);
  border: 1px solid rgba(20,184,166,0.18);
  font-size: 0.68rem;
  font-weight: 700;
}
.evidence-copy strong {
  color: #fff;
  font-size: 0.86rem;
  line-height: 1.3;
}
.evidence-copy p {
  color: rgba(255,255,255,0.48);
  font-size: 0.74rem;
  line-height: 1.45;
  margin: 0;
}

/* Table */
.table-scroll { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 0.78rem; }
th { padding: 8px 12px; text-align: left; font-weight: 600; color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.02); white-space: nowrap; }
td { padding: 8px 12px; border-top: 1px solid rgba(255,255,255,0.04); color: rgba(255,255,255,0.7); }
.cell-high { color: #ef4444; font-weight: 700; }
.cell-medium { color: #f59e0b; font-weight: 600; }
.cell-low { color: #10b981; }

/* Timeline */
.tl-scroll { padding: 1rem 14px; display: flex; flex-direction: column; gap: 8px; }
.rc-tl-item { display: flex; align-items: center; gap: 10px; font-size: 0.8rem; }
.rc-tl-dot { width: 8px; height: 8px; border-radius: 50%; background: #3b82f6; flex-shrink: 0; }
.rc-tl-item.warning .rc-tl-dot { background: #f59e0b; }
.rc-tl-item.alert .rc-tl-dot { background: #ef4444; }
.rc-tl-item.done .rc-tl-dot { background: #10b981; }
.rc-tl-date { color: rgba(255,255,255,0.4); font-family: monospace; min-width: 48px; }
.rc-tl-ver { color: #60a5fa; font-weight: 600; min-width: 32px; }
.rc-tl-label { color: rgba(255,255,255,0.7); }

/* Alerts */
.rc-alerts { padding: 1rem 14px; display: flex; flex-direction: column; gap: 8px; }
.alert-item {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 10px 14px; border-radius: 8px; font-size: 0.8rem;
  background: rgba(255,255,255,0.02);
}
.alert-item.high { border-left: 3px solid #ef4444; background: rgba(239,68,68,0.05); }
.alert-item.medium { border-left: 3px solid #f59e0b; background: rgba(245,158,11,0.05); }
.alert-level {
  padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 700;
  background: rgba(239,68,68,0.15); color: #ef4444; white-space: nowrap;
}
.alert-item.medium .alert-level { background: rgba(245,158,11,0.15); color: #f59e0b; }
.alert-msg { color: rgba(255,255,255,0.7); flex: 1; line-height: 1.4; }
.alert-date { color: rgba(255,255,255,0.3); font-size: 0.72rem; white-space: nowrap; }

/* Metrics */
.rc-metrics { padding: 1rem 14px; }
.metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 0.8rem; }
.metric-item { text-align: center; padding: 0.8rem; border-radius: 8px; background: rgba(255,255,255,0.03); }
.mi-value { font-size: 1.2rem; font-weight: 800; color: #60a5fa; }
.mi-label { font-size: 0.72rem; color: rgba(255,255,255,0.4); margin-top: 2px; }

/* Chain */
.rc-chain { padding: 1rem 14px; }
.chain-flow { display: flex; align-items: center; gap: 0; flex-wrap: wrap; }
.chain-node {
  padding: 10px 16px; border-radius: 8px; font-size: 0.8rem;
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
  position: relative; text-align: center;
}
.chain-node.trigger { border-color: #f59e0b; background: rgba(245,158,11,0.06); }
.chain-node.change { border-color: #8b5cf6; background: rgba(139,92,246,0.06); }
.chain-node.downstream { border-color: #3b82f6; background: rgba(59,130,246,0.06); }
.chain-node:not(:last-child)::after {
  content: '→'; position: absolute; right: -16px; top: 50%; transform: translateY(-50%);
  color: rgba(255,255,255,0.3); font-size: 1rem;
}
.cn-label { font-weight: 600; color: #fff; }
.cn-source { font-size: 0.68rem; color: rgba(255,255,255,0.35); margin-top: 2px; }

/* Content */
.msg-content { font-size: 0.88rem; color: rgba(255,255,255,0.75); line-height: 1.7; }
.msg-content :deep(h3) { font-size: 1.05rem; font-weight: 700; color: #fff; margin: 0 0 0.5rem 0; }
.msg-content :deep(strong) { color: #fff; }
.msg-content :deep(code) { padding: 2px 6px; border-radius: 4px; background: rgba(255,255,255,0.06); font-family: 'SF Mono', 'Consolas', monospace; font-size: 0.82rem; color: #60a5fa; }
.msg-content :deep(blockquote) {
  padding: 0.6rem 1rem; margin: 0.8rem 0; border-radius: 8px;
  background: rgba(59,130,246,0.06); border-left: 3px solid rgba(59,130,246,0.3);
  font-size: 0.82rem; color: rgba(255,255,255,0.55);
}

/* Typing */
.typing-indicator { display: flex; align-items: center; gap: 10px; }
.typing-dots { display: flex; gap: 4px; }
.typing-dots span {
  width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.3);
  animation: bounce 1.4s infinite ease-in-out;
}
.typing-dots span:nth-child(1) { animation-delay: 0s; }
.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes bounce { 0%,80%,100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }
.typing-text { font-size: 0.82rem; color: rgba(255,255,255,0.4); }

/* Input Area */
.input-area {
  padding: 1rem 1.5rem; flex-shrink: 0;
  background: rgba(11,15,26,0.95); border-top: 1px solid rgba(255,255,255,0.06);
}
.input-wrapper {
  display: flex; align-items: flex-end; gap: 8px;
  padding: 8px 8px 8px 16px; border-radius: 14px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  transition: border-color 0.2s;
}
.input-wrapper:focus-within { border-color: rgba(59,130,246,0.4); }
textarea {
  flex: 1; background: transparent; border: none; outline: none;
  color: #fff; font-size: 0.9rem; font-family: inherit;
  resize: none; padding: 6px 0; max-height: 120px;
}
textarea::placeholder { color: rgba(255,255,255,0.3); }
.input-actions { display: flex; gap: 4px; }
.ia-btn {
  width: 36px; height: 36px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; border: none; transition: all 0.2s;
}
.ia-clear { background: transparent; color: rgba(255,255,255,0.4); }
.ia-clear:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.7); }
.ia-send {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: #fff;
}
.ia-send:hover { filter: brightness(1.15); }
.ia-send:disabled { opacity: 0.4; cursor: not-allowed; }

/* Responsive */
@media (max-width: 768px) {
  .chat-sidebar { display: none; }
  .msg-bubble { max-width: 95%; }
  .evidence-grid { grid-template-columns: 1fr; }
  .evidence-item { grid-template-columns: 112px minmax(0, 1fr); }
}
</style>
