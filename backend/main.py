"""
Yangjiang AI Agent backend.

The backend uses Qwen-plus for intent interpretation and narrative output,
while the frontend keeps deterministic evidence cards for reliable demo scenes.
"""
import json
import os
from difflib import SequenceMatcher
from typing import List, Dict

import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from openai import OpenAI
from pydantic import BaseModel


for key in ("HTTP_PROXY", "HTTPS_PROXY", "http_proxy", "https_proxy", "ALL_PROXY", "all_proxy"):
    os.environ.pop(key, None)

_http_client = httpx.Client(
    transport=httpx.HTTPTransport(proxy=None, verify=False),
    timeout=httpx.Timeout(60.0),
)

client = OpenAI(
    api_key=os.getenv("DASHSCOPE_API_KEY") or os.getenv("QWEN_API_KEY") or "sk-7d4cb205a2224025ac8109293b0751e7",
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
    http_client=_http_client,
)

app = FastAPI(title="Yangjiang AI Agent API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    prompt: str
    agent_id: str


TEMPLATES = {
    "bom": [
        "比对阳江办公室装修工程清单 2024-08-18 和 2024-09-24 两个版本的差异",
        "校验门表（30扇门/70.66㎡）与物料清单中门类条目是否一致",
        "审核报价单中哪些物料单价偏离预算控制目标超过 15%",
        "检查墙板信息表中是否有遗漏的品类，对照标准物料分类体系",
    ],
    "progress": [
        "分析安装示意图在2024年7-8月间的迭代密度，是否存在返工风险",
        "对比现场照片（2024年8月）与设计预期，计算进度偏差天数",
        "检测结构施工图和幕墙工程图的迭代是否同步，是否存在接口协调风险",
        "检查墙板模型7个版本的间隔，标记间隔异常（过密/过疏）的版本",
    ],
    "change": [
        "防火门尺寸从900×2100改为1000×2200，溯源变更原因",
        "结构施工图终版（2024-05-24）变更后，分析对下游所有文件的影响",
        "检测是否存在“上游已变更但下游未更新”的断链情况",
        "查询安装示意图从0731到0922共10个版本的完整变更历史",
    ],
}

EVIDENCE_CONTEXT = {
    ("bom", 0): "过程证据：E:\\筑造实践\\阳江工厂\\EXCEL 中 2024-08 过程清单；最终依据：20241029阳江项目资料汇总\\阳江办公室装修工程清单2024-09-23.xlsx；图纸证据：pic\\阳江图纸\\阳江1_2层.png。",
    ("bom", 1): "过程证据：E:\\筑造实践\\阳江工厂\\EXCEL\\阳江门表_20240309.xlsx、阳江门表_20240505.xlsx；最终依据：20241029阳江项目资料汇总\\CAD\\阳江门窗详图1007_t3.dwg；图纸证据：pic\\阳江图纸\\阳江3_4层.png。",
    ("bom", 2): "过程证据：E:\\筑造实践\\阳江工厂\\EXCEL 中报价/物料过程表；最终依据：20241029阳江项目资料汇总\\阳江灯光灯具实际结算清单20241028.pdf；现场证据：pic\\阳江施工日志\\20241008。",
    ("bom", 3): "过程证据：E:\\筑造实践\\阳江工厂\\EXCEL\\阳江墙面单元板表_20240407.xlsx；最终依据：20241029阳江项目资料汇总\\装饰材料下料清单2024-09-8.pdf；图纸证据：pic\\阳江图纸\\20240417蜂窝铝标准板安装图.png。",
    ("progress", 0): "现场证据：pic\\阳江施工日志\\20240731、20240827；最终依据：20241029阳江项目资料汇总\\CAD\\阳江装配图纸0922.dwg。",
    ("progress", 1): "现场证据：pic\\阳江施工日志\\20240820、20240823；过程计划：E:\\筑造实践\\阳江工厂\\EXCEL\\阳江20240512项目计划进度表.xlsx。",
    ("progress", 2): "图纸证据：pic\\阳江图纸\\阳江剖立面.png；现场证据：pic\\阳江施工日志\\20240809；最终依据：20241029阳江项目资料汇总\\CAD\\阳江建筑图纸20240905.dwg。",
    ("progress", 3): "现场证据：pic\\阳江施工日志\\20240814、20240905；最终依据：20241029阳江项目资料汇总\\RHINO\\阳江装配模型20240906.3dm。",
    ("change", 0): "图纸证据：pic\\阳江图纸\\阳江1_2层.png；过程证据：E:\\筑造实践\\阳江工厂\\EXCEL\\阳江门表_20240309.xlsx、阳江门表_20240505.xlsx；最终依据：20241029阳江项目资料汇总\\CAD\\阳江门窗详图1007_t3.dwg。",
    ("change", 1): "图纸证据：pic\\阳江图纸\\阳江剖立面.png；现场证据：pic\\阳江施工日志\\20240718；最终依据：20241029阳江项目资料汇总\\CAD\\阳江建筑图纸20240905.dwg。",
    ("change", 2): "现场证据：pic\\阳江施工日志\\20240724；图纸证据：pic\\阳江图纸\\20240417蜂窝铝标准板安装图.png；最终依据：20241029阳江项目资料汇总\\阳江项目工程量统计表20241028.xls。",
    ("change", 3): "现场证据：pic\\阳江施工日志\\20240726、20240913；最终依据：20241029阳江项目资料汇总\\CAD\\阳江装配图纸0922.dwg。",
}

AGENT_NAMES = {
    "bom": "BOM 智能审核 Agent",
    "progress": "工程进度风险预警 Agent",
    "change": "设计变更追踪 Agent",
}

SYSTEM_PROMPTS = {
    "bom": """你是广东鸿轩阳江展示中心项目的 BOM 智能审核 Agent。
你的任务不是凭空生成数据，而是基于已知证据口径解释 BOM 审核思路。

资料边界：
- E:\\筑造实践\\阳江工厂\\EXCEL 是过程版本，可用于版本差异、门表、报价、材料表对比。
- D:\\pythonProject1\\Product_Manager\\yangjiang\\pic\\20241029阳江项目资料汇总 是最终归档口径。
- D:\\pythonProject1\\Product_Manager\\yangjiang\\pic\\阳江图纸 是图纸视觉证据。

回答要求：
1. 先说明你识别到的问题类型。
2. 明确区分“过程版本”和“最终归档依据”。
3. 只能引用用户上下文中列出的证据文件和日期，严禁编造未列出的文件名、版本号、核定单编号。
4. 如果用户问题没有足够证据，提出需要补充的文件/日期/构件，不要编造结论。
5. 输出专业中文，段落清晰，尽量短。""",
    "progress": """你是广东鸿轩阳江展示中心项目的工程进度风险预警 Agent。
你的任务是把图纸迭代、现场照片日期、最终汇总资料串成可解释的进度判断。

资料边界：
- D:\\pythonProject1\\Product_Manager\\yangjiang\\pic\\阳江施工日志 是现场照片/视频来源。
- D:\\pythonProject1\\Product_Manager\\yangjiang\\pic\\阳江图纸 是图纸视觉证据。
- E:\\筑造实践\\阳江工厂\\EXCEL 中的计划表是过程计划。
- D:\\pythonProject1\\Product_Manager\\yangjiang\\pic\\20241029阳江项目资料汇总 是最终归档口径。

回答要求：
1. 先判断问题属于迭代密度、进度偏差、专业耦合还是版本间隔。
2. 明确引用现场日期或图纸版本作为依据。
3. 只能引用用户上下文中列出的证据文件和日期，严禁编造未列出的文件名、版本号、核定单编号。
4. 如果无法可靠判断，提出需要的现场日期或图纸版本。
5. 输出专业中文，段落清晰，尽量短。""",
    "change": """你是广东鸿轩阳江展示中心项目的设计变更追踪 Agent。
你的任务是解释变更来源、影响范围和下游同步风险。

资料边界：
- E:\\筑造实践\\阳江工厂\\EXCEL 是门表、清单、计划等过程版本。
- D:\\pythonProject1\\Product_Manager\\yangjiang\\pic\\阳江图纸 是图纸视觉证据。
- D:\\pythonProject1\\Product_Manager\\yangjiang\\pic\\阳江施工日志 可作为现场验证。
- D:\\pythonProject1\\Product_Manager\\yangjiang\\pic\\20241029阳江项目资料汇总 是最终归档口径。

回答要求：
1. 先说明变更触发源、图纸变化和下游影响。
2. 明确哪些是过程证据，哪些是最终归档依据。
3. 只能引用用户上下文中列出的证据文件和日期，严禁编造未列出的文件名、版本号、核定单编号。
4. 如果用户问题没有足够证据，提出需要补充的文件/日期/构件。
5. 输出专业中文，段落清晰，尽量短。""",
}


def get_trace_steps(agent_id: str) -> List[Dict]:
    return {
        "bom": [
            {"icon": "🔎", "label": "意图识别", "detail": "识别为 BOM/清单/报价审核类请求", "status": "done"},
            {"icon": "📊", "label": "证据路由", "detail": "区分过程 Excel 与最终归档清单", "status": "done"},
            {"icon": "🧠", "label": "Qwen 推理", "detail": "调用 Qwen-plus 生成解释和追问", "status": "done"},
            {"icon": "📋", "label": "结构化输出", "detail": "前端挂接可复核证据卡", "status": "done"},
        ],
        "progress": [
            {"icon": "🔎", "label": "意图识别", "detail": "识别为进度/现场/版本风险类请求", "status": "done"},
            {"icon": "📷", "label": "证据路由", "detail": "匹配施工日志日期、图纸和计划表", "status": "done"},
            {"icon": "🧠", "label": "Qwen 推理", "detail": "调用 Qwen-plus 解释风险链路", "status": "done"},
            {"icon": "⚠️", "label": "风险输出", "detail": "输出偏差、原因和建议动作", "status": "done"},
        ],
        "change": [
            {"icon": "🔎", "label": "意图识别", "detail": "识别为变更溯源/影响/断链类请求", "status": "done"},
            {"icon": "📐", "label": "证据路由", "detail": "匹配图纸、过程表和最终汇总包", "status": "done"},
            {"icon": "🧠", "label": "Qwen 推理", "detail": "调用 Qwen-plus 生成变更解释", "status": "done"},
            {"icon": "🔗", "label": "影响链输出", "detail": "输出变更来源和下游影响", "status": "done"},
        ],
    }.get(agent_id, [])


def route_prompt(prompt: str, agent_id: str) -> dict:
    prompt_norm = prompt.strip().lower()
    best = {"agent_id": agent_id, "template_index": None, "prompt": None, "score": 0.0, "reliable": False}
    agents_to_scan = [agent_id] + [a for a in TEMPLATES if a != agent_id]
    for aid in agents_to_scan:
        for index, template in enumerate(TEMPLATES[aid]):
            score = SequenceMatcher(None, prompt_norm, template.lower()).ratio()
            keyword_score = sum(1 for token in ("门", "清单", "报价", "品类", "进度", "现场", "图纸", "变更", "断链", "版本", "墙板", "结构", "幕墙") if token in prompt and token in template) * 0.08
            final_score = min(score + keyword_score, 1.0)
            if final_score > best["score"]:
                best = {"agent_id": aid, "template_index": index, "prompt": template, "score": round(final_score, 3), "reliable": final_score >= 0.42}
    return best


@app.post("/api/agent/chat")
async def agent_chat(req: ChatRequest):
    route = route_prompt(req.prompt, req.agent_id)
    active_agent = route["agent_id"] if route["reliable"] else req.agent_id
    system_prompt = SYSTEM_PROMPTS.get(active_agent, SYSTEM_PROMPTS["bom"])

    route_context = (
        f"路由结果：{'已匹配模板' if route['reliable'] else '未可靠匹配模板'}；"
        f"当前 Agent={AGENT_NAMES.get(active_agent, active_agent)}；"
        f"相似度={route['score']}；"
        f"匹配模板={route['prompt'] or '无'}。\n"
        f"可引用证据：{EVIDENCE_CONTEXT.get((route['agent_id'], route['template_index']), '没有可靠证据包；只能说明分析路径并提出需要补充的资料。')}\n"
        "硬性约束：除上述证据外，不得编造任何文件名、日期、编号、版本号或现场状态。"
        "如果上下文只列出文件路径或照片日期，只能说“可作为核验对象/可用于复核”，"
        "不得声称已经从该图纸、照片或表格中读取到了未明示的尺寸、数量、原因或完成状态。"
        "避免使用“可见、显示、记录、明确采用、已经完成”等暗示已读取文件内容的措辞，"
        "除非这些事实在用户问题或证据上下文中已经明示。"
    )

    async def generate():
        yield f"data: {json.dumps({'type': 'route', **route}, ensure_ascii=False)}\n\n"
        yield f"data: {json.dumps({'type': 'trace', 'trace': get_trace_steps(active_agent), 'agent_id': active_agent, 'agent_name': AGENT_NAMES.get(active_agent)}, ensure_ascii=False)}\n\n"

        try:
            stream = client.chat.completions.create(
                model="qwen-plus",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"{route_context}\n\n用户问题：{req.prompt}"},
                ],
                stream=True,
                temperature=0.35,
                max_tokens=1200,
            )
            for chunk in stream:
                if chunk.choices and chunk.choices[0].delta.content:
                    yield f"data: {json.dumps({'type': 'content', 'content': chunk.choices[0].delta.content}, ensure_ascii=False)}\n\n"
        except Exception as exc:
            yield f"data: {json.dumps({'type': 'error', 'content': f'LLM 调用失败: {exc}'}, ensure_ascii=False)}\n\n"

        yield f"data: {json.dumps({'type': 'done'}, ensure_ascii=False)}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")


@app.get("/api/health")
async def health():
    return {"status": "ok", "llm": "qwen-plus", "provider": "dashscope"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8080)
