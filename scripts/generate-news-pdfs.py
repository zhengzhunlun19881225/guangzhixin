"""Generate local demonstration attachments from the same news content as the portal."""
import json,re,shutil
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,HRFlowable
from pypdf import PdfReader
root=Path(__file__).resolve().parent.parent
content=json.loads((root/'src/data/portalNewsContent.json').read_text())
titles=re.findall(r"\['([^']+)','[^']+','[^']+','[^']+'\]",(root/'src/data/portalNews.ts').read_text())
assert len(titles)==24
out=root/'output/pdf/news';out.mkdir(parents=True,exist_ok=True)
public=root/'public/assets/portal/documents';public.mkdir(parents=True,exist_ok=True)
pdfmetrics.registerFont(UnicodeCIDFont('STSong-Light'))
styles={
 'title':ParagraphStyle('title',fontName='STSong-Light',fontSize=18,leading=28,textColor=HexColor('#03091B'),spaceAfter=12,wordWrap='CJK'),
 'meta':ParagraphStyle('meta',fontName='STSong-Light',fontSize=10,leading=16,textColor=HexColor('#83899F'),spaceAfter=16,wordWrap='CJK'),
 'body':ParagraphStyle('body',fontName='STSong-Light',fontSize=11,leading=21,textColor=HexColor('#4E5969'),spaceAfter=14,firstLineIndent=22,wordWrap='CJK'),
 'heading':ParagraphStyle('heading',fontName='STSong-Light',fontSize=13,leading=22,textColor=HexColor('#03091B'),spaceAfter=8,wordWrap='CJK')}
def footer(canvas,doc):
 canvas.setFont('STSong-Light',9);canvas.setFillColor(HexColor('#83899F'));canvas.drawString(48,28,'广智新门户 / 示例资料，仅用于本地交互演示');canvas.drawRightString(547,28,str(doc.page))
for k,prefix in enumerate(['ai','group']):
 for i,paras in enumerate(content[prefix]):
  title=titles[k*12+i]
  for kind,label in [('brief','交流材料'),('checklist','行动清单')]:
   file=out/f'{prefix}-{i}-{kind}.pdf'
   story=[Paragraph(escape(title),styles['title']),Paragraph(f'{label} · 示例资料 · 2026-11-{5-i//3:02d}',styles['meta']),HRFlowable(width='100%',thickness=.5,color=HexColor('#EBEEF5')),Spacer(1,20)]
   if kind=='brief':
    story += [Paragraph(escape(p),styles['body']) for p in paras]
   else:
    sections=[('一、讨论目标',paras[0]),('二、重点工作',paras[2]),('三、后续行动',paras[3]),('四、跟踪记录','请结合实际场景填写牵头岗位、协作人员、计划时间与检查方式。记录当前问题、已完成动作和下一步安排，复盘时补充使用反馈及调整原因。本清单不代表已下发正式任务。')]
    for h,p in sections:story.extend([Paragraph(h,styles['heading']),Paragraph(escape(p),styles['body'])])
   SimpleDocTemplate(str(file),pagesize=(595.28,841.89),leftMargin=48,rightMargin=48,topMargin=44,bottomMargin=48,title=f'{title}-{label}',author='广智新门户示例').build(story,onFirstPage=footer,onLaterPages=footer)
   reader=PdfReader(file);assert reader.pages and title in ''.join(p.extract_text() for p in reader.pages)
   shutil.copy2(file,public/file.name)
print(f'Generated and text-checked {len(list(out.glob("*.pdf")))} PDFs')
