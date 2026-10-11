"use client";
import {useEffect,useRef,useState} from "react";
import {skills} from "@/lib/data";
const icons:Record<string,string>={"HTML5":"◇","CSS3":"◈","JavaScript":"JS","TypeScript":"TS","React":"⚛","Next.js":"N","React Native":"RN","Node.js":"⬢","MongoDB":"M","Firebase":"F","Git & GitHub":"⑂","Tailwind CSS":"T"};
export default function SkillShowcase(){
 const [selected,setSelected]=useState("All");const [visible,setVisible]=useState(false);
 const root=useRef<HTMLDivElement>(null);
 const groups=["All","Frontend","Language","Framework","Mobile","Backend","Database","Styling","Tools"];
 useEffect(()=>{const el=root.current;if(!el)return;const obs=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){setVisible(true);obs.disconnect()}},{threshold:.1});obs.observe(el);return()=>obs.disconnect()},[]);
 return <div ref={root}><div className="skill-toolbar" role="group" aria-label="Filter technology categories">{groups.map(g=><button aria-pressed={selected===g} key={g} onClick={()=>setSelected(g)} className={selected===g?"active":""}>{g}</button>)}</div><div className="skill-showcase">{skills.filter(s=>selected==="All"||s.group===selected).map((s,i)=><article className="skill-tile" key={s.name} style={{animationDelay:`${Math.min(i,12)*45}ms`}}><div className="skill-tile-top"><span className="skill-glyph" aria-hidden="true">{icons[s.name]||"✦"}</span><span className="skill-category">{s.group}</span></div><div className="skill-dial" style={{"--value":visible?s.level:0} as React.CSSProperties}><div className="skill-dial-inner"><strong>{s.level}<small>%</small></strong><span>FAMILIARITY</span></div></div><div className="skill-tile-bottom"><h3>{s.name}</h3><span className="skill-tile-arrow">↗</span></div></article>)}</div><p className="skill-disclaimer">These scores are personal learning estimates, not certifications or independently assessed skills.</p></div>
}
