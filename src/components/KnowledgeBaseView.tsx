import { SearchField, DateRangeField } from './FieldControls';
import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FileText, 
  User, 
  Layers, 
  ArrowLeft,
  BookMarked
} from 'lucide-react';
import { KnowledgeTree } from './KnowledgeTree';
import { figmaAssets } from '../data/figmaAssets';
import { KNOWLEDGE_ITEMS, KNOWLEDGE_FILES } from '../data/mockData';

interface KnowledgeBaseViewProps {
  onOpenFilePreview: (fileName: string) => void;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({
  onOpenFilePreview
}) => {
  const [subTab, setSubTab] = useState<'general' | 'org' | 'team' | 'personal' | 'search'>(() => new URLSearchParams(window.location.search).get('section') === 'org' ? 'org' : 'team');
  const [selectedTeam, setSelectedTeam] = useState('团队名称(8)');
  const [inDetailView, setInDetailView] = useState(() => new URLSearchParams(window.location.search).get('section') === 'files');
  const [selectedFolder, setSelectedFolder] = useState('广新集团制度汇编(截至2019.14.1)');
  const [folderSearch, setFolderSearch] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [fileSearch, setFileSearch] = useState('');
  const [selectedTeamIndex,setSelectedTeamIndex] = useState(2);
  const [teamSearch,setTeamSearch] = useState('');
  const [searchDoc, setSearchDoc] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const teams = [
    '团队名称(3)',
    '团队名称(10)',
    '团队名称(8)',
    '团队名称(16)',
    '团队名称(8)',
    '团队名称(17)',
    '团队名称(67)',
    '团队名称(63)'
  ];

  return (
    <div className={`knowledge-view design-panel flex-1 flex flex-col h-full bg-[#f8fafc]/50 overflow-hidden select-none ${inDetailView ? "knowledge-detail-view" : ""}`}>
      {/* Top Header Bar (Image 2) */}
      <div className="h-14 px-8 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-orange-500 rounded-full" />
            <span className="text-base font-bold text-slate-800">知识库</span>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => {
                setSubTab('general');
                setInDetailView(false);
              }}
              className={`transition-colors ${
                subTab === 'general' ? 'text-red-500 font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              通用
            </button>
            <button
              onClick={() => {
                setSubTab('org');
                setInDetailView(false);
              }}
              className={`relative py-1 transition-colors ${
                subTab === 'org'
                  ? 'text-red-500 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-red-500'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              组织知识库
            </button>
            <button
              onClick={() => {
                setSubTab('team');
                setInDetailView(false);
              }}
              className={`relative py-1 transition-colors ${
                subTab === 'team'
                  ? 'text-red-500 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-red-500'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              团体知识库
            </button>
            <button
              onClick={() => {
                setSubTab('personal');
                setInDetailView(false);
              }}
              className={`transition-colors ${
                subTab === 'personal' ? 'text-red-500 font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              个人知识库
            </button>
            <button
              onClick={() => {
                setSubTab('search');
                setInDetailView(false);
              }}
              className={`transition-colors ${
                subTab === 'search' ? 'text-red-500 font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              全局搜索
            </button>
          </div>
        </div>

        {/* Right Storage & Manage */}
        <div className="flex items-center gap-5">
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-slate-500">
              <span className="text-red-500 font-semibold">657.32MB</span> 可用，共750MB
            </span>
            <div className="w-36 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-[30%] h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full" />
            </div>
          </div>

          <button
            onClick={() => {}}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>管理知识库</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      {!inDetailView ? (
        /* Team / Org Knowledge Base Main View (Images 2 & 5) */
        <div className="flex-1 flex min-h-0">
          {/* Left Sidebar inside Knowledge View */}
          <div className="w-64 border-r border-slate-100 bg-white p-4 flex flex-col shrink-0">
            {/* Search */}
            <SearchField className="relative mb-4" label="搜索团队或组织" value={teamSearch} onChange={setTeamSearch}/>

            {/* List */}
            {subTab === 'org' ? (
              <KnowledgeTree query={teamSearch} onSelect={setSelectedTeam} />
            ) : (
              /* Team List (Image 2) */
              <div className="kb-teams flex-1 overflow-y-auto space-y-1 text-xs">
                {teams.map((item, idx) => (
                  <button
                    key={`${item}-${idx}`}
                    hidden={!!teamSearch && !item.includes(teamSearch)}
                    onClick={() => {setSelectedTeam(item);setSelectedTeamIndex(idx);}}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                      selectedTeamIndex === idx
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="knowledge-team-icon w-5 h-5 rounded-md bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <img src={figmaAssets['71-4112:img1']} width="18" height="14" alt="" />
                      </div>
                      <span>{item}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Cards Grid */}
          <div className="kb-content flex-1 flex flex-col p-6 overflow-y-auto">
            {/* Top Bar inside content: Title, Date, Search */}
            <div className="knowledge-toolbar flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h2 className="text-base font-bold text-slate-800">
                {selectedTeam}
              </h2>

              <div className="flex items-center gap-3">
                <DateRangeField start={startDate} end={endDate} onStartChange={setStartDate} onEndChange={setEndDate}/>

                {/* Search */}
                <SearchField className="relative w-44" label="搜索知识库" value={searchDoc} onChange={setSearchDoc}/>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {KNOWLEDGE_ITEMS.filter(item => {
                const created = item.createTime.slice(0, 10).replaceAll('/', '-');
                return (!searchDoc || item.name.includes(searchDoc)) && (!startDate || created >= startDate) && (!endDate || created <= endDate);
              }).map((item) => (
                <div
                  key={item.id}
                  onClick={() => setInDetailView(true)}
                  role="button" tabIndex={0}
                  onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setInDetailView(true); } }}
                  className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between knowledge-card h-44 group"
                >
                  <div className="flex items-start gap-3">
                    {/* Blue 3D Book Icon */}
                    <img className="knowledge-book" src={figmaAssets['71-4112:img5']} width="40" height="40" alt="" />

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-800 truncate mb-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-400">
                        文档数：{item.docCount}份
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-50 text-[11px] text-slate-400 space-y-1 font-mono">
                    <div className="flex items-center gap-1.5">
                      <img src={figmaAssets['71-4112:img2']} width="14" height="14" alt="" />
                      <span className="font-sans">{item.creator}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <img src={figmaAssets['71-4112:img4']} width="14" height="14" alt="" />
                      <span>{item.createTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Knowledge Base Detail / File List View (Image 3) */
        <div className="flex-1 flex flex-col min-h-0 bg-white">
          {/* Back Header */}
          <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-3">
            <button
              onClick={() => setInDetailView(false)}
              className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>返回</span>
            </button>
            
            <span className="text-xs font-semibold text-slate-800">
              知识库名称根目录
            </span>
          </div>

          <div className="flex-1 flex min-h-0">
            {/* Left Folder Tree */}
            <div className="w-64 border-r border-slate-100 p-4 flex flex-col shrink-0">
              <SearchField className="relative mb-3" label="搜索知识库目录" value={folderSearch} onChange={setFolderSearch}/>

              <KnowledgeTree detail query={folderSearch} onSelect={setSelectedFolder} />
            </div>

            {/* Right File Table */}
            <div className="kb-content flex-1 flex flex-col p-6 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-bold text-slate-800">
                  {selectedFolder}
                </h3>

                <SearchField className="kb-file-search relative w-52" label="搜索文件" value={fileSearch} onChange={setFileSearch}/>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="kb-files w-full text-left text-xs text-slate-700 border-collapse">
                  <colgroup><col style={{width:'36px'}}/><col/><col style={{width:'11%'}}/><col style={{width:'10%'}}/><col style={{width:'7%'}}/><col style={{width:'12.5%'}}/><col style={{width:'6%'}}/></colgroup>
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-medium">
                      <th className="py-3 px-3 w-8">
                        <input type="checkbox" aria-label="全选文件" checked={KNOWLEDGE_FILES.filter(file => !fileSearch || file.name.includes(fileSearch)).every(file => selectedFiles.includes(file.id)) && selectedFiles.length > 0} onChange={event => setSelectedFiles(event.target.checked ? KNOWLEDGE_FILES.filter(file => !fileSearch || file.name.includes(fileSearch)).map(file => file.id) : [])} className="rounded-sm border-slate-300" />
                      </th>
                      <th className="py-3 px-3">文件名称</th>
                      <th className="py-3 px-3">文件大小</th>
                      <th className="py-3 px-3">分块数</th>
                      <th className="py-3 px-3">切片方法</th>
                      <th className="py-3 px-3">更新时间</th>
                      <th className="py-3 px-3 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {KNOWLEDGE_FILES.filter(file=>!fileSearch||file.name.includes(fileSearch)).map((file) => (
                      <tr key={file.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3">
                          <input type="checkbox" aria-label={`选择${file.name}`} checked={selectedFiles.includes(file.id)} onChange={event => setSelectedFiles(ids => event.target.checked ? [...ids, file.id] : ids.filter(id => id !== file.id))} className="rounded-sm border-slate-300" />
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            {file.type === 'folder' ? <img className="kb-file-icon" src={figmaAssets['71-3575:img']} alt="" /> : <span className={`kb-file-icon kb-file-${file.type}`}><img src={figmaAssets[file.type === 'pdf' ? '71-3575:img1' : '71-3575:img2']} alt="" /></span>}
                            <button className={`kb-file-name ${file.type === 'folder' ? 'is-folder' : ''}`} title={file.name} onClick={() => onOpenFilePreview(file.name)}>{file.name}</button>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono">{file.size}</td>
                        <td className="py-3 px-3 font-mono">{file.chunks}</td>
                        <td className="py-3 px-3">{file.chunkMethod}</td>
                        <td className="py-3 px-3 font-mono text-slate-500">{file.updateTime}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => onOpenFilePreview(file.name)}
                            className="text-blue-500 hover:text-blue-700 font-medium"
                          >
                            预览
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
