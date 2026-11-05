import React, { useState } from 'react';
import { X, Download, Maximize2, Minimize2, FileText, CheckCircle2 } from 'lucide-react';

interface FilePreviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  documentData?: {
    title: string;
    size: string;
    ready: boolean;
    content?: string;
  } | null;
}

export const FilePreviewDrawer: React.FC<FilePreviewDrawerProps> = ({
  isOpen,
  onClose,
  documentData
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    const textContent = `在〔会议名称〕上的总结讲话\n\n同志们：\n经过〔半天/全天〕的集中讨论，〔会议名称〕各项议程已全部完成。现在，我代表〔主办方/会议组织部门〕作总结讲话。总体看，这次会议主题明确、安排紧凑，大家准备充分、交流深入，形成了较为一致的工作认识，达到了预期目的。下面，我讲三点意见。\n\n一、回顾会议过程，会议开得务实、开得有效\n\n二、肯定各方贡献，凝聚抓落实的合力\n\n三、深化协同推进，确保各项目标圆满落地。`;
    const blob = new Blob([documentData?.content ?? textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = (documentData?.title || '在〔会议名称〕上的总结讲话').replace(/\.[^.]+$/, '') + '.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`file-preview fixed top-16 right-0 bottom-0 bg-white border-l border-slate-200 z-30 flex flex-col shadow-2xl transition-all duration-300 select-none ${
        isFullscreen ? 'is-fullscreen left-0 w-full' : 'w-[480px] lg:w-[540px]'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <FileText className="text-red-500" size={18}/>
          <span className="text-sm font-semibold text-slate-800">
            {documentData ? `文件预览 · ${documentData.content ? 'TXT' : 'DOCX'}` : '生成文件预览'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {documentData && (
            <>
              <button
                onClick={handleDownload}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                下载
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title={isFullscreen ? '退出全屏' : '全屏'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="关闭"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      {documentData ? (
        <div className="flex-1 flex flex-col min-h-0 bg-slate-100/50">
          {/* Sub bar */}
          <div className="px-6 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>文件已就绪</span>
            </div>
            <span>{documentData.size}</span>
          </div>

          {/* Doc View Paper */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 flex justify-center">
            <div className="w-full max-w-2xl bg-white shadow-sm border border-slate-200/80 rounded-xl p-8 md:p-10 text-slate-800 space-y-5 text-sm leading-relaxed">
              <h1 className="text-xl md:text-2xl font-bold text-center text-slate-900 tracking-tight pb-4 border-b border-slate-100">
                {documentData.title.replace(/\.(docx|txt)$/, '')}
              </h1>

              {documentData.content ? <div className="whitespace-pre-wrap break-words leading-7">{documentData.content.split('\n').slice(2).join('\n')}</div> : <>
              <p className="indent-8 text-slate-700">同志们：</p>
              
              <p className="indent-8 text-slate-700">
                经过〔半天/全天〕的集中讨论，〔会议名称〕各项议程已全部完成。现在，我代表〔主办方/会议组织部门〕作总结讲话。总体看，这次会议主题明确、安排紧凑，大家准备充分、交流深入，形成了较为一致的工作认识，达到了预期目的。下面，我讲三点意见。
              </p>

              <h2 className="text-base font-semibold text-slate-900 pt-2">
                一、回顾会议过程，会议开得务实、开得有效
              </h2>
              <p className="indent-8 text-slate-700">
                这次会议按照既定方案，依次安排了〔议程要点一〕、〔议程要点二〕、〔议程要点三〕等议程。与会同志围绕〔会议主要议题〕作了交流发言，既汇报工作、反映情况，也剖析问题、提出建议，讨论既有共识又有针对性。
              </p>
              <p className="indent-8 text-slate-700">
                从会议效果看，有三个特点比较明显：一是〔对会议第一个特点的概括，如“认识进一步统一”，结合会议实际情况展开1–2句〕；二是〔对会议第二个特点的概括，如“问题找得比较准”，结合会议实际情况展开1–2句〕；三是〔对会议第三个特点的概括，如“办法提得比较实”，结合会议实际情况展开1–2句〕。这些成果，为下一阶段推进〔相关工作领域〕工作提供了重要基础。
              </p>

              <h2 className="text-base font-semibold text-slate-900 pt-2">
                二、肯定各方贡献，凝聚抓落实的合力
              </h2>
              <p className="indent-8 text-slate-700">
                这次会议能够开好，离不开各方面共同努力。在此，我代表〔主办方〕向〔参会单位/部门〕以及为会议作出准备的同志表示衷心感谢。
              </p>
              <p className="indent-8 text-slate-700">
                〔参会方一部分单位〕在〔相关工作〕中作出了积极贡献，〔结合材料中的具体做法或成果作1–2句客观评价；无具体材料时写“有关做法和成效将在会后纪要中一并明确”〕；〔参会方二〕在〔具体事项〕上提出了不少务实建议，为会议决策提供了有益参考；〔参会方三/与会人员〕在会前认真准备、会中积极讨论，保证了会议质量和效率。
              </p>
              <p className="indent-8 text-slate-700">
                这里需要说明的是，本次会议就〔形成共识/议定事项〕达成了一致意见，但具体推进中还需加强跨体系协同协作。
              </p>

              </>}
              <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
                预览用于查看内容，完整排版请下载文件
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State (Image 9) */
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/40">
          <div className="w-48 h-48 mb-6 relative flex items-center justify-center">
            {/* Document graphic */}
            <div className="w-36 h-44 bg-white rounded-xl shadow-md border border-slate-200/80 p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-6 h-7 rounded bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 text-xs">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div className="w-16 h-2 bg-slate-100 rounded-full" />
              </div>
              <div className="space-y-2 py-4">
                <div className="w-full h-2 bg-slate-100 rounded-full" />
                <div className="w-4/5 h-2 bg-slate-100 rounded-full" />
                <div className="w-3/5 h-2 bg-slate-100 rounded-full" />
              </div>
              <div className="w-full h-16 bg-slate-50 border border-dashed border-slate-200 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 rounded bg-slate-200/50" />
              </div>
            </div>
          </div>

          <h3 className="text-base font-semibold text-slate-800 mb-2">
            这里将展示 AI 生成的文件
          </h3>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
            当您通过对话生成文档、报告或方案时，文件将在此处自动打开预览，支持在线查看、下载和分享。
          </p>
        </div>
      )}
    </div>
  );
};
