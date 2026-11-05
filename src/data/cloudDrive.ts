import { KNOWLEDGE_FILES } from './mockData';
export type DriveEntry = { id: string; parent: string | null; name: string; kind: 'folder' | 'word' | 'pdf' | 'image' | 'text' | 'other'; size: string; created: string; inTree?: boolean; treeOnly?: boolean; blob?: Blob; sampleText?: string };
export type DriveMessage = { id: string; contactId: string; entry: DriveEntry; sentAt: string };
export type DriveState = { entries: DriveEntry[]; messages: DriveMessage[] };
export const DRIVE_HOME = 'drive-current';
const rootTitle = '广新集团制度汇编(截至2019.14.1)';
const folder = (id: string, parent: string | null, name: string, treeOnly = false): DriveEntry => ({ id, parent, name, kind: 'folder', size: '—', created: '2022-08-21 12:29', inTree: true, treeOnly });
export const initialDriveState = (): DriveState => ({ entries: [
  folder('drive-root', null, '一级 1'), folder('drive-manual', 'drive-root', '法务系统操作手册-2025.06'), folder(DRIVE_HOME, 'drive-manual', rootTitle),
  ...['安全环保类', '财务类制度', '党务管理类'].map((name, i) => folder('drive-leaf-' + i, DRIVE_HOME, name, true)),
  folder('drive-legal', 'drive-manual', '法务风控类'), folder('drive-governance', 'drive-manual', '公司治理类制度'),
  folder('drive-cross', 'drive-root', '跨学科课程设计'), folder('drive-material', 'drive-root', '教材与学习资料'),
  folder('drive-legal-child', 'drive-legal', '管理制度'), folder('drive-governance-child', 'drive-governance', '管理制度'), folder('drive-cross-child', 'drive-cross', '课程资料'), folder('drive-material-child', 'drive-material', '学习资料'),
  ...KNOWLEDGE_FILES.map((f, i): DriveEntry => ({ id: 'drive-' + f.id, parent: DRIVE_HOME, name: i === 0 ? '数课程设计' : i === 3 ? '关于修订广东省广新控股集团有限公司《董事会决策清单》《董事会授权清单》的通知.docx' : f.name, kind: f.type as DriveEntry['kind'], size: f.size, created: f.updateTime, sampleText: f.type === 'folder' ? undefined : `示例文件内容\n\n${f.name.replace(/\.\.\.$/, '')}\n\n本文件用于演示云盘预览、重命名、导出和发送交互，不代表正式制度原文。\n\n请上传实际文件后查看和管理您的内容。` })),
], messages: [] });
function openDatabase(): Promise<IDBDatabase> { return new Promise((resolve, reject) => { const req = indexedDB.open('guangxin-cloud-drive', 1); req.onupgradeneeded = () => req.result.createObjectStore('state'); req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error); }); }
export async function loadDriveState(): Promise<DriveState> { const db = await openDatabase(); try { return await new Promise((resolve, reject) => { const req = db.transaction('state', 'readonly').objectStore('state').get('current'); req.onsuccess = () => resolve(req.result || initialDriveState()); req.onerror = () => reject(req.error); }); } finally { db.close(); } }
export async function saveDriveState(value: DriveState) { const db = await openDatabase(); try { await new Promise<void>((resolve, reject) => { const tx = db.transaction('state', 'readwrite'); tx.objectStore('state').put(value, 'current'); tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error); }); } finally { db.close(); } }
export function downloadDriveFile(entry: DriveEntry) { const blob = entry.blob || new Blob([entry.sampleText || entry.name], { type: 'text/plain;charset=utf-8' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = entry.blob ? entry.name : entry.name.replace(/\.[^.]+$/, '') + '.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
export function driveFileKind(file: File): DriveEntry['kind'] { const ext = file.name.split('.').pop()?.toLowerCase(); if (ext === 'pdf') return 'pdf'; if (['doc', 'docx', 'word'].includes(ext || '')) return 'word'; if (file.type.startsWith('image/')) return 'image'; if (file.type.startsWith('text/') || ['txt', 'md', 'csv', 'json'].includes(ext || '')) return 'text'; return 'other'; }
export function driveSize(bytes: number) { return bytes < 1024 ? bytes + 'B' : bytes < 1024 ** 2 ? (bytes / 1024).toFixed(2) + 'KB' : (bytes / 1024 ** 2).toFixed(2) + 'MB'; }
export function driveTimestamp() { const d = new Date(); const pad = (n: number) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`; }
