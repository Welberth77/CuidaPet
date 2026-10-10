const base = {
  width: 24, height: 24, viewBox: "0 0 24 24", fill: "none",
  stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round",
};

export function IconPaw(p) {
  return (
    <svg {...base} {...p} stroke="none" fill="currentColor">
      <circle cx="7" cy="9" r="2" /><circle cx="12" cy="6.5" r="2" />
      <circle cx="17" cy="9" r="2" />
      <path d="M12 11c3 0 5.3 2.2 5.3 4.6 0 2-1.6 3-3.2 3-1 0-1.4-.4-2.1-.4s-1.1.4-2.1.4c-1.6 0-3.2-1-3.2-3C6.7 13.2 9 11 12 11z" />
    </svg>
  );
}
export function IconVaccine(p) {
  return (<svg {...base} {...p}><path d="M18 2l4 4M17 7l-9.5 9.5a2 2 0 01-1.3.6l-3 .3.3-3a2 2 0 01.6-1.3L13.5 3.5a2 2 0 012.8 0L17 4.2M9.5 9.5l3 3M13 6l3 3"/></svg>);
}
export function IconBath(p) {
  return (<svg {...base} {...p}><path d="M4 12h16M6 12V6a2 2 0 012-2h1M9 4a1.5 1.5 0 013 0M5 12v2a4 4 0 004 4h6a4 4 0 004-4v-2M8 21l1-2M16 21l-1-2"/></svg>);
}
export function IconUser(p) {
  return (<svg {...base} {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/></svg>);
}
export function IconBell(p) {
  return (<svg {...base} {...p}><path d="M6 9a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6M10 20a2 2 0 004 0"/></svg>);
}
export function IconPlus(p) {
  return (<svg {...base} {...p}><path d="M12 5v14M5 12h14"/></svg>);
}
export function IconHeart(p) {
  return (<svg {...base} {...p} stroke="none" fill="currentColor"><path d="M12 21C5 16 3 12 5.2 9 7 6.7 10 7.3 12 10c2-2.7 5-3.3 6.8-1 2.2 3 .2 7-6.8 12z"/></svg>);
}
export function IconArrow(p) {
  return (<svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>);
}
