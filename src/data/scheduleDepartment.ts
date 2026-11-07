// Demonstration roster transcribed from the supplied department-view reference.
export const SCHEDULE_DEPARTMENT_MEMBERS = [
  {id:'liu-xiangyang',name:'刘向阳',role:'物业经营部总经理',avatar:'向阳'},
  {id:'hk-investment-general',name:'香港投资-综合',role:'综合',avatar:'综合'},
  {id:'mai-baowen',name:'麦宝文',role:'行政主管',avatar:'宝文'},
  {id:'rong-zixin',name:'荣梓鑫',role:'综合管理部副总经理',avatar:'梓鑫'},
  {id:'hk-guangkong-admin',name:'香港广控管理员',role:'综合',avatar:'管理员'},
  {id:'jia-xiaolin',name:'贾晓琳',role:'审计主管',avatar:'晓琳'},
  {id:'chen-xiaoyi',name:'陈小毅',role:'',avatar:'小毅'},
  {id:'yi-haijiao',name:'易海娇',role:'',avatar:'海娇'},
] as const;
export type ScheduleDepartmentMember = typeof SCHEDULE_DEPARTMENT_MEMBERS[number];
