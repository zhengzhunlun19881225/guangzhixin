export const PPT_TEMPLATE_CATEGORIES = ['全部模板', '通用商务', '工作汇报', '金融投资', '战略咨询', '培训教学', '学术研究', '宣传推广'];
export const PPT_TEMPLATES = [
  {id:'business',name:'通用商务',category:'通用商务'},
  {id:'operations',name:'经营汇报',category:'工作汇报'},
  {id:'finance',name:'财务分析',category:'金融投资'},
] as const;
export type PptTemplate = typeof PPT_TEMPLATES[number];
export const pptTemplateImage=(template:PptTemplate)=>`assets/ppt-templates/${template.id}.png`;
