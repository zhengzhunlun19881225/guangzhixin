/** Preset artwork cropped from the image-settings reference supplied by the user. */
export const AGENT_IMAGES = [
  '水母', '虎鲸', '海豚', '深海鲸鱼', '海底鲸鱼', '海龟', '珊瑚鱼群', '未来都市',
  '蓝色夜城', '科技之城', '落日城市', '科技青年', '阳光少年', '智能少女', '紫发女孩', '蝠鲼',
].map((name, index) => ({ name, src: `assets/agent-avatars/avatar-${String(index + 1).padStart(2, '0')}.jpg` }));

export function isAgentImage(value: unknown): value is string {
  return typeof value === 'string' && (AGENT_IMAGES.some(image => image.src === value)
    || (value.length <= 400_000 && /^data:image\/(?:png|jpeg);base64,[A-Za-z0-9+/]+={0,2}$/.test(value)));
}

export type AgentImageSource = { src: string; width: number; height: number; type: 'image/png' | 'image/jpeg' };
export type AgentImageCrop = { x: number; y: number; size: number };
export function initialAgentCrop(source: AgentImageSource, fraction = .6): AgentImageCrop {
  const size = Math.min(source.width, source.height) * fraction;
  return { x: (source.width - size) / 2, y: (source.height - size) / 2, size };
}
export async function decodeAgentImage(src: string): Promise<AgentImageSource> {
  const image = new Image(); image.src = src;
  try { await image.decode(); } catch { throw new Error('图片无法读取，请上传有效的 PNG 或 JPEG 图片。'); }
  if (!image.naturalWidth || !image.naturalHeight) throw new Error('图片尺寸无效，请重新上传。');
  return { src, width: image.naturalWidth, height: image.naturalHeight, type: src.startsWith('data:image/png') ? 'image/png' : 'image/jpeg' };
}
/** Read uploads into a temporary crop draft; only the confirmed result is stored. */
export async function readAgentImage(file: File): Promise<AgentImageSource> {
  if (!['image/png', 'image/jpeg'].includes(file.type)) throw new Error('请选择 PNG、JPG 或 JPEG 图片。');
  if (file.size > 5 * 1024 * 1024) throw new Error('图片不能超过5MB，请压缩后重新上传。');
  const data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('图片读取失败，请重新上传。'));
    reader.readAsDataURL(file);
  });
  return decodeAgentImage(data);
}
export async function cropAgentImage(source: AgentImageSource, crop: AgentImageCrop): Promise<string> {
  const image = new Image(); image.src = source.src; await image.decode();
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = Math.min(256, Math.max(1, Math.round(crop.size)));
  const context = canvas.getContext('2d');
  if (!context) throw new Error('当前浏览器无法处理图片，请选择预设图片。');
  context.drawImage(image, crop.x, crop.y, crop.size, crop.size, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL(source.type, .9);
}
