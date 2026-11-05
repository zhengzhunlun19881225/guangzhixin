import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function NewsCarousel({label,resetKey,count,children}: {
  label:string;resetKey:string;count:number;children:React.ReactNode;
}) {
  const track=useRef<HTMLDivElement>(null);
  const [bounds,setBounds]=useState({overflow:false,start:true,end:true});
  useEffect(()=>{
    const node=track.current;
    if(!node)return;
    node.scrollTo({left:0,behavior:'instant'});
    const update=()=>{
      const max=node.scrollWidth-node.clientWidth;
      setBounds({overflow:max>2,start:node.scrollLeft<=2,end:node.scrollLeft>=max-2});
    };
    update();
    const observer=new ResizeObserver(update);observer.observe(node);
    node.addEventListener('scroll',update,{passive:true});
    return ()=>{observer.disconnect();node.removeEventListener('scroll',update);};
  },[resetKey,count]);
  const move=(direction:number)=>{
    const node=track.current;if(!node)return;
    const card=node.querySelector<HTMLElement>('button');if(!card)return;
    const step=card.offsetWidth+parseFloat(getComputedStyle(node).columnGap);
    const page=Math.max(1,Math.floor((node.clientWidth-20)/step))*step;
    node.scrollBy({left:direction*page,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  };
  return <div className="pn-carousel" role="region" aria-label={`${label}轮播`} aria-roledescription="轮播">
    <div className="pn-track" ref={track} tabIndex={0} aria-label={`${label}列表`} onKeyDown={e=>{
      if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowLeft'?-1:1);}
    }}>{children}</div>
    {bounds.overflow&&<>
      <button className="pn-carousel-prev" aria-label={`上一组${label}`} disabled={bounds.start} onClick={()=>move(-1)}><ChevronLeft size={18}/></button>
      <button className="pn-carousel-next" aria-label={`下一组${label}`} disabled={bounds.end} onClick={()=>move(1)}><ChevronRight size={18}/></button>
    </>}
  </div>;
}
