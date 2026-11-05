import React, { useState } from 'react';
import { figmaAssets } from '../data/figmaAssets';

type TreeNode = { id: string; name: string; children?: TreeNode[] };
const rootTitle = '广新集团制度汇编(截至2019.14.1)';
export function KnowledgeTree({ detail = false, query = '', onSelect }: { detail?: boolean; query?: string; onSelect: (name: string) => void }) {
  const [expanded, setExpanded] = useState(['root', 'manual', 'selected']);
  const [selected, setSelected] = useState('selected');
  const nodes: TreeNode[] = [{ id: 'root', name: '一级 1', children: [
    { id: 'manual', name: detail ? '法务系统操作手册-2025.06' : '一级 1', children: [
      { id: 'selected', name: detail ? rootTitle : '一级 1', children: [
        ... (detail ? ['安全环保类', '财务类制度', '党务管理类'] : ['课程设计', '课程规划与设计', '补充阅读材料']).map((name, i) => ({ id: 'leaf-' + i, name })),
      ] },
      ... (detail ? ['法务风控类', '公司治理类制度'] : ['课程模块说明', '课程目标与学习']).map((name, i) => ({ id: 'extra-' + i, name, children: [{ id: 'extra-file-' + i, name: detail ? '管理制度' : '课程资料' }] })),
    ] },
    { id: 'cross', name: '跨学科课程设计', children: [{ id: 'cross-file', name: '课程资料' }] },
    { id: 'material', name: '教材与学习资料', children: [{ id: 'material-file', name: '学习资料' }] },
  ] }];
  const matches = (node: TreeNode): boolean => node.name.includes(query) || !!node.children?.some(matches);
  const render = (items: TreeNode[], depth = 0): React.ReactNode => items.filter(matches).map(node => {
    const open = expanded.includes(node.id) || !!query;
    return <React.Fragment key={node.id}>
      <div className={`kb-tree-row ${selected === node.id ? 'is-selected' : ''}`} style={{ paddingLeft: (detail ? 22 : 36) + depth * 18 }}>
        {node.children ? <button className="kb-tree-toggle" aria-label={`${open ? '收起' : '展开'}${node.name}`} aria-expanded={open} onClick={() => setExpanded(value => open ? value.filter(id => id !== node.id) : [...value, node.id])}><img className={open ? '' : 'is-closed'} src={figmaAssets['71-3575:imgCaretBottom']} alt="" /></button> : <span className="kb-tree-toggle" />}
        <button className="kb-tree-select" title={node.name} aria-current={selected === node.id ? 'true' : undefined} onClick={() => { setSelected(node.id); onSelect(node.name); }}>
          <img src={detail ? figmaAssets['71-3575:img'] : figmaAssets[node.children ? '71-3808:img59' : '71-3808:img60']} alt="" /><span>{node.name}</span>
        </button>
      </div>
      {node.children && open && render(node.children, depth + 1)}
    </React.Fragment>;
  });
  return <div className="kb-tree" aria-label={detail ? '知识库目录' : '组织目录'}>{render(nodes)}{!nodes.some(matches) && <p className="workspace-empty">暂无匹配目录</p>}</div>;
}
