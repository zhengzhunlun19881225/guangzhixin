import { SearchField } from './FieldControls';
import React, { useEffect, useRef, useState } from 'react';
import { Plus, MoreHorizontal, Smile, Image as ImageIcon, Folder, Volume2, Clock, QrCode, ChevronRight, Phone, X, ArrowLeft, Send, Paperclip } from 'lucide-react';
import { IM_CONTACTS, ORG_COMPANIES, GROUP_MEMBERS } from '../data/mockData';
import { IMSubView } from '../types';
import './im.css';
import { loadIMMessages, saveIMMessages } from '../data/imMessages';
import { DriveMessage, downloadDriveFile, loadDriveState } from '../data/cloudDrive';

interface IMChatViewProps {
  subView: IMSubView;
  initialContactId?: string;
  onSelectSubView: (view: IMSubView) => void;
}
const asset = (name: string) => `assets/im/${name}.png`;
const contacts = [...IM_CONTACTS.map((contact, index) => ({ ...contact, avatar: asset(`contact-${index}`) })), { id: 'chen-xiaoxiao', name: '陈晓晓', avatar: asset('contact-0'), lastMessage: '', time: '', unreadCount: 0, isGroup: false }];
type Contact = typeof contacts[number];
type Message = { id: number; content: string; file?: string };
type Modal = { kind: 'profile'; name: string; avatar: string } | { kind: 'add' } | { kind: 'leave' } | null;
const orgTabs = [{ id: 'org', label: '组织架构', image: 'org' }, { id: 'recent', label: '最近联系人', image: 'recent' }, { id: 'mygroups', label: '我的群组', image: 'groups' }] as const;

function SearchBox(props: {value:string;onChange:(value:string)=>void;label:string}) { return <SearchField {...props} className="im-search"/>; }

export const IMChatView: React.FC<IMChatViewProps> = ({ subView, onSelectSubView, initialContactId }) => {
  const [selectedContact, setSelectedContact] = useState(() => contacts.find(c => c.id === initialContactId) || contacts[4]);
  const [driveMessages, setDriveMessages] = useState<DriveMessage[]>([]);
  useEffect(() => { let live = true; loadDriveState().then(state => { if (live) setDriveMessages(state.messages); }).catch(() => {}); return () => { live = false; }; }, [initialContactId]);
  useEffect(() => { const contact = contacts.find(c => c.id === initialContactId); if (contact) setSelectedContact(contact); }, [initialContactId]);
  const [extraContacts, setExtraContacts] = useState<Contact[]>([]);
  const [composerNotice, setComposerNotice] = useState('');
  const [chatSearch, setChatSearch] = useState('');
  const [orgSearch, setOrgSearch] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [inputText, setInputText] = useState('');
  const [activeOrgTab, setActiveOrgTab] = useState<'org' | 'recent' | 'mygroups'>('org');
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(true);
  const [pinned, setPinned] = useState<string[]>([]);
  const [muted, setMuted] = useState<string[]>([]);
  const [leftGroups, setLeftGroups] = useState<string[]>([]);
  const [readContacts, setReadContacts] = useState<string[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>(loadIMMessages);
  const [addedMembers, setAddedMembers] = useState<Contact[]>([]);
  const [modal, setModal] = useState<Modal>(null);
  const [addSearch, setAddSearch] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [emojiOpen, setEmojiOpen] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const messageEnd = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const conversationFiles = driveMessages.filter(m => m.contactId === selectedContact.id);
  const messageCount = (messages[selectedContact.id]?.length ?? 0) + conversationFiles.length;
  useEffect(() => { if (messageCount) messageEnd.current?.scrollIntoView({ block: 'nearest' }); }, [messageCount]);
  useEffect(() => {
    const escape = (e: KeyboardEvent) => { if (e.key === 'Escape') { setModal(null); setHistoryOpen(false); setEmojiOpen(false); } };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, []);
  const openChat = (contact: Contact) => {
    if (!contacts.some(c => c.id === contact.id)) setExtraContacts(items => items.some(c => c.id === contact.id) ? items : [...items, contact]);
    setSelectedContact(contact); setInputText(''); setComposerNotice(''); setMemberSearch(''); setHistoryOpen(false);
    setReadContacts(current => [...current, contact.id]);
    onSelectSubView('chat');
  };
  const send = (file?: string) => {
    const content = file || inputText.trim();
    if (!content) return;
    const next = { ...messages, [selectedContact.id]: [...(messages[selectedContact.id] || []), { id: Date.now(), content, file }] };
    try { saveIMMessages(next); } catch { setComposerNotice('发送未成功，请重试。'); return; }
    setMessages(next); setComposerNotice('');
    setInputText(''); input.current?.focus();
  };
  const toggle = (setter: React.Dispatch<React.SetStateAction<string[]>>) => setter(current => current.includes(selectedContact.id) ? current.filter(id => id !== selectedContact.id) : [...current, selectedContact.id]);
  const currentMessages = messages[selectedContact.id] || [];
  const visibleContacts = [...contacts, ...extraContacts].filter(c => !leftGroups.includes(c.id) && c.name.includes(chatSearch)).sort((a, b) => Number(pinned.includes(b.id)) - Number(pinned.includes(a.id)));
  const members = [...GROUP_MEMBERS.map((m, i) => ({ name: m.name, avatar: asset(`member-${i}`) })), ...addedMembers];
  const profile = (name: string, avatar: string) => setModal({ kind: 'profile', name, avatar });
  const isGroup = Boolean(selectedContact.isGroup);
  const historyMessages = [...(isGroup ? [{ id: -1, content: '已取消' }, { id: -2, content: '黄家云 名片' }, { id: -3, content: '消息类型：特别关注、@提醒、语音通话、视频通话、文字、图片、文件、表情、短语音，链接、合并转发的信息。' }] : [{ id: -1, content: selectedContact.lastMessage }]), ...currentMessages, ...conversationFiles.map((message, index) => ({ id: -100 - index, content: message.entry.name }))];

  return <section className={`im-view im-workspace ${subView === 'chat' ? 'im-chat' : 'im-directory'}`} aria-label={subView === 'chat' ? '即时通讯' : '通讯录'}>
    <aside className="im-sidebar">
      <div className="im-sidebar-search">
        <SearchBox value={subView === 'chat' ? chatSearch : orgSearch} onChange={subView === 'chat' ? setChatSearch : setOrgSearch} label={subView === 'chat' ? '搜索会话' : '搜索组织或联系人'} />
        {subView === 'chat' && <button className="im-new-chat" title="发起会话" onClick={() => { setActiveOrgTab('recent'); setOrgSearch(''); onSelectSubView('org'); }}><Plus size={22} /></button>}
      </div>
      {subView === 'chat' ? <div className="im-contact-list">
        {visibleContacts.map(contact => <button key={contact.id} className={`im-contact ${selectedContact.id === contact.id ? 'is-selected' : ''}`} onClick={() => openChat(contact)}>
          <span className="im-contact-avatar"><img src={contact.avatar} alt="" />{contact.unreadCount && !readContacts.includes(contact.id) && <span className="im-unread">{contact.unreadCount}</span>}</span>
          <span className="im-contact-copy"><span className="im-contact-top"><span>{contact.name}</span><time>{(messages[contact.id]?.length ?? 0) ? '刚刚' : contact.time}</time></span><span className="im-contact-preview">{messages[contact.id]?.at(-1)?.content || driveMessages.filter(m => m.contactId === contact.id).at(-1)?.entry.name || (contact.isGroup ? <><em>[@所有人]</em> 下午1点半一个非常紧急需求会议...</> : contact.lastMessage)}</span></span>
        </button>)}
        {!visibleContacts.length && <p className="im-empty">暂无匹配的会话</p>}
      </div> : <nav className="im-org-nav" aria-label="通讯录分类">{orgTabs.map(tab => <button key={tab.id} className={activeOrgTab === tab.id ? 'is-selected' : ''} onClick={() => { setActiveOrgTab(tab.id); setSelectedCompany(null); setOrgSearch(''); }}><img src={asset(tab.image)} alt="" /><span>{tab.label}</span></button>)}</nav>}
    </aside>

    {subView === 'org' ? <div className="im-org-main">
      <header className="im-room-header"><h2>{orgTabs.find(tab => tab.id === activeOrgTab)?.label}</h2></header>
      <div className="im-org-scroll">
        {activeOrgTab === 'org' && <div className="im-org-breadcrumb"><button onClick={() => setSelectedCompany(null)}>广新集团</button>{selectedCompany && <><ChevronRight size={14} /><span>{selectedCompany}</span></>}</div>}
        {activeOrgTab === 'org' && !selectedCompany ? <div className="im-org-rows">{ORG_COMPANIES.filter(c => c.name.includes(orgSearch)).map(company => <button key={company.id} className="im-org-row" onClick={() => setSelectedCompany(company.name)}><img src={asset('company')} alt="" /><span>{company.name}（{company.count}人）</span><ChevronRight size={18} /></button>)}{!ORG_COMPANIES.some(c => c.name.includes(orgSearch)) && <p className="im-empty">暂无匹配的组织</p>}</div> : <div className="im-org-rows">
          {selectedCompany && <p className="im-org-caption">联系人</p>}
          {contacts.filter(c => (activeOrgTab === 'mygroups' ? c.isGroup && !leftGroups.includes(c.id) : !c.isGroup) && c.name.includes(orgSearch)).map(c => <button className="im-org-row" key={c.id} onClick={() => openChat(c)}><img src={c.avatar} alt="" /><span>{c.name}</span><ChevronRight size={18} /></button>)}
          {!contacts.some(c => (activeOrgTab === 'mygroups' ? c.isGroup && !leftGroups.includes(c.id) : !c.isGroup) && c.name.includes(orgSearch)) && <p className="im-empty">暂无匹配的联系人或群组</p>}
        </div>}
      </div>
    </div> : <div className="im-room">
      <header className="im-room-header"><img src={selectedContact.avatar} alt="" /><h2>{selectedContact.name}</h2><button title={showDetails ? '收起会话详情' : '展开会话详情'} aria-expanded={showDetails} onClick={() => setShowDetails(v => !v)}><MoreHorizontal size={22} /></button></header>
      <div className={`im-room-body ${showDetails ? 'has-details' : ''}`}>
        <div className="im-conversation">
          <div className="im-messages" aria-label="聊天消息" role="log">
            <div className="im-message-time">昨天 13:00</div>
            {isGroup && <>
              <div className="im-message im-outgoing im-call"><div className="im-call-bubble"><Phone size={17} /><span>已取消</span></div><img className="im-message-avatar im-round" src={asset('self')} alt="我" /></div>
              <div className="im-message im-incoming im-card-message"><img className="im-message-avatar" src={asset('contact-1')} alt="李明睿" /><button className="im-person-card" onClick={() => profile('黄家云', asset('card-person'))}><span><img src={asset('card-person')} alt="" /><span>黄家云</span></span><small>名片</small></button></div>
              <div className="im-message im-incoming im-info-message"><img className="im-message-avatar" src={asset('contact-1')} alt="李明睿" /><div className="im-message-bubble">消息类型：特别关注、@提醒、语音通话、视频通话、文字、图片、文件、表情、短语音，链接、合并转发的信息。</div></div>
            </>}
            {!isGroup && selectedContact.lastMessage && <div className="im-message im-incoming"><img className="im-message-avatar" src={selectedContact.avatar} alt="" /><div className="im-message-bubble">{selectedContact.lastMessage}</div></div>}
            {currentMessages.map(message => <div key={message.id} className="im-message im-outgoing im-sent"><div className="im-message-bubble">{message.file && <Paperclip size={16} />}{message.content}</div><img className="im-message-avatar im-round" src={asset('self')} alt="我" /></div>)}
            {conversationFiles.map(message => <div key={message.id} className="im-message im-outgoing im-sent"><button className="im-message-bubble" title={`下载${message.entry.name}`} onClick={() => downloadDriveFile(message.entry)}><Paperclip size={16}/><span>{message.entry.name}<small style={{display:'block',fontSize:12,color:'#53617b'}}>{message.entry.size} · 云盘文件 · 点击下载</small></span></button><img className="im-message-avatar im-round" src={asset('self')} alt="我"/></div>)}
            <div ref={messageEnd} />
          </div>
          <div className="im-composer">
            <div className="im-composer-tools">
              <button title="表情" aria-expanded={emojiOpen} onClick={() => setEmojiOpen(v => !v)}><Smile /></button>
              <button title="发送图片" onClick={() => { if (fileInput.current) { fileInput.current.accept = 'image/*'; fileInput.current.click(); } }}><ImageIcon /></button>
              <button title="发送文件" onClick={() => { if (fileInput.current) { fileInput.current.accept = ''; fileInput.current.click(); } }}><Folder /></button>
              <button title="语音消息" onClick={() => setComposerNotice('暂不支持语音消息，可发送文字、图片或文件。')}><Volume2 /></button>
              <button title="聊天记录" onClick={() => setHistoryOpen(true)}><Clock /></button>
            </div>
            {emojiOpen && <div className="im-emoji-picker">{['😊', '👍', '❤️', '🎉', '🙏', '👌'].map(emoji => <button key={emoji} onClick={() => { setInputText(t => t + emoji); setEmojiOpen(false); input.current?.focus(); }}>{emoji}</button>)}</div>}
            {composerNotice && <div className="im-composer-notice" role="status">{composerNotice}<button title="关闭提示" onClick={() => setComposerNotice('')}><X size={14} /></button></div>}
            <input type="file" ref={fileInput} hidden onChange={e => { const file = e.target.files?.[0]; if (file) send(file.name); e.target.value = ''; }} />
            <textarea aria-label="输入消息" ref={input} value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(); } }} />
            {inputText.trim() && <button className="im-send" title="发送消息" onClick={() => send()}><Send size={16} />发送</button>}
          </div>
        </div>
        {showDetails && <aside className="im-details" aria-label="会话详情">
          {isGroup ? <>
            <div className="im-members-section"><SearchBox value={memberSearch} onChange={setMemberSearch} label="搜索群成员" /><h3>成员 (4/{members.length})</h3><div className="im-members-grid">{members.filter(m => m.name.includes(memberSearch)).map((member, index) => <button key={member.name + index} title={member.name} onClick={() => profile(member.name, member.avatar)}><img src={member.avatar} alt="" /><span>{member.name}</span></button>)}<button className="im-add-member" title="添加群成员" onClick={() => { setAddSearch(''); setModal({ kind: 'add' }); }}><span><Plus size={22} /></span><span>添加</span></button></div>{memberSearch && !members.some(m => m.name.includes(memberSearch)) && <p className="im-empty">没有找到该成员</p>}</div>
            <div className="im-group-name"><span>群名称</span><p>系统管理员、内部数字员工、尚旭辉、唐学文、卢...</p></div>
            <details className="im-qr"><summary>群二维码<span><QrCode size={21} /><ChevronRight size={16} /></span></summary><p>暂无可用的群二维码</p></details>
          </> : <button className="im-private-profile" onClick={() => profile(selectedContact.name, selectedContact.avatar)}><img src={selectedContact.avatar} alt="" /><span>{selectedContact.name}</span></button>}
          <button className="im-detail-row" onClick={() => setHistoryOpen(true)}><span>查找聊天记录</span><ChevronRight size={16} /></button>
          <div className="im-detail-row"><span>置顶聊天</span><button className="im-switch" role="switch" aria-label="置顶聊天" aria-checked={pinned.includes(selectedContact.id)} onClick={() => toggle(setPinned)}><span /></button></div>
          <div className="im-detail-row"><span>消息免打扰</span><button className="im-switch" role="switch" aria-label="消息免打扰" aria-checked={muted.includes(selectedContact.id)} onClick={() => toggle(setMuted)}><span /></button></div>
          {isGroup && <div className="im-leave"><button onClick={() => setModal({ kind: 'leave' })}>退出群聊</button></div>}
        </aside>}
        {historyOpen && <aside className="im-history-panel" aria-label="聊天记录"><header><button title="关闭聊天记录" onClick={() => setHistoryOpen(false)}><ArrowLeft size={18} /></button><h3>聊天记录</h3></header><SearchBox value={historySearch} onChange={setHistorySearch} label="搜索聊天记录" />{historyMessages.filter(m => m.content.includes(historySearch)).map(m => <p key={m.id}>{m.content}</p>)}{!historyMessages.some(m => m.content.includes(historySearch)) && <p className="im-empty">暂无匹配的聊天记录</p>}</aside>}
      </div>
    </div>}
    {modal && <div className="im-modal-shade" onClick={() => setModal(null)}><section className="im-modal" role="dialog" aria-modal="true" aria-label={modal.kind === 'profile' ? '联系人资料' : modal.kind === 'add' ? '添加群成员' : '退出群聊'} onClick={e => e.stopPropagation()}><button className="im-modal-close" title="关闭弹窗" onClick={() => setModal(null)}><X size={20} /></button>
      {modal.kind === 'profile' && <><img className="im-profile-avatar" src={modal.avatar} alt="" /><h3>{modal.name}</h3><p>广新集团</p><button className="im-primary" onClick={() => { const known = contacts.find(c => c.name === modal.name); openChat(known || { id: `person-${modal.name}`, name: modal.name, avatar: modal.avatar, lastMessage: '开始新的会话', time: '刚刚' }); setModal(null); }}>发送消息</button></>}
      {modal.kind === 'add' && <><h3>添加群成员</h3><SearchBox value={addSearch} onChange={setAddSearch} label="搜索可添加的联系人" />{contacts.filter(c => !c.isGroup && c.name.includes(addSearch) && !addedMembers.some(m => m.id === c.id)).map(c => <button className="im-add-option" key={c.id} onClick={() => { setAddedMembers(items => [...items, c]); setModal(null); }}><img src={c.avatar} alt="" /><span>{c.name}</span><Plus size={18} /></button>)}</>}
      {modal.kind === 'leave' && <><h3>退出群聊</h3><p>退出后，此群将从当前会话列表中移除。</p><div className="im-modal-actions"><button onClick={() => setModal(null)}>取消</button><button className="im-primary" onClick={() => { setLeftGroups(ids => [...ids, selectedContact.id]); openChat(contacts[0]); setModal(null); }}>确认退出</button></div></>}
    </section></div>}
  </section>;
};
