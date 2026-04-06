import { useState, useEffect, useRef, useCallback } from "react";

const DEAD_TECH = [
  { id: 1, name: "Nikola Motors", year: "2020", tagline: "The truck that couldn't.", cause: "CEO filmed a truck rolling downhill and called it a working prototype. Gravity-powered vehicles are technically green, though.", category: "Automotive", img: "🚛" },
  { id: 2, name: "Fisker", year: "2024", tagline: "Died twice, beautifully.", cause: "Built gorgeous EVs nobody could buy. Went bankrupt, came back, went bankrupt again. Some things are just born to be beautiful corpses.", category: "Automotive", img: "⚡" },
  { id: 3, name: "Apple Car (Project Titan)", year: "2024", tagline: "A decade of nothing.", cause: "Apple spent 10 years and billions designing a car, then quietly killed it. Even Apple's trash can is more real than this was.", category: "Automotive", img: "🍎" },
  { id: 4, name: "Faraday Future", year: "2024", tagline: "The EV that was always 'almost ready.'", cause: "Spent nearly a decade promising a revolutionary luxury EV. Delivered approximately nothing. The ultimate vaporware on wheels.", category: "Automotive", img: "🔮" },
  { id: 5, name: "Lordstown Motors", year: "2023", tagline: "Fraud with a pickup truck.", cause: "Faked pre-orders, misled investors, built an electric truck that barely existed. The Fyre Festival of EVs.", category: "Automotive", img: "🏭" },
  { id: 6, name: "Theranos", year: "2018", tagline: "Blood, lies, and a black turtleneck.", cause: "Elizabeth Holmes convinced the world she could run 200+ tests from a single drop of blood. She could not. Now she's in prison. The blood was fake but the fraud was very real.", category: "Tech", img: "🩸" },
  { id: 7, name: "Quibi", year: "2020", tagline: "$1.75B for 10-minute videos nobody wanted.", cause: "Jeffrey Katzenberg bet that people would pay for short-form video content on phones. TikTok was free. Quibi lasted 6 months. The money lasted less.", category: "Tech", img: "📱" },
  { id: 8, name: "Google+", year: "2019", tagline: "Google's loneliest party.", cause: "Google tried to build a social network by forcing everyone to join. It's like throwing a party where attendance is mandatory but nobody talks to each other.", category: "Tech", img: "👻" },
  { id: 9, name: "Juicero", year: "2017", tagline: "The $400 bag squeezer.", cause: "A WiFi-connected juicer that squeezed proprietary juice bags. Then someone discovered you could just squeeze the bags with your hands. $120M in funding, defeated by fingers.", category: "Tech", img: "🧃" },
  { id: 10, name: "Vine", year: "2017", tagline: "Died so TikTok could live.", cause: "Twitter bought it, starved it, killed it. Six-second videos were ahead of their time. Every TikTok creator owes Vine a royalty check.", category: "Tech", img: "🌿" },
  { id: 11, name: "Clippy", year: "2007", tagline: "Microsoft's most aggressive coworker.", cause: "A sentient paperclip that interrupted your work to ask if you needed help writing a letter. Nobody asked for this. Everyone remembers it. Chaotic neutral energy.", category: "Tech", img: "📎" },
  { id: 12, name: "Zune", year: "2012", tagline: "The iPod's sadder cousin.", cause: "Microsoft's music player was actually decent. But 'actually decent' doesn't beat cultural dominance. Brought a knife to a thermonuclear war.", category: "Tech", img: "🎵" },
  { id: 13, name: "MoviePass", year: "2019", tagline: "Unlimited movies, limited math.", cause: "Offered unlimited movie tickets for $10/month. Lost money on literally every customer. The business model was 'pray.' Prayers were not answered.", category: "Tech", img: "🎬" },
  { id: 14, name: "Google Reader", year: "2013", tagline: "The one that still hurts.", cause: "Google killed the best RSS reader ever made because it didn't fit their social strategy. A decade later, people are still mad. Rightfully.", category: "Tech", img: "📰" },
  { id: 15, name: "Segway", year: "2020", tagline: "Was supposed to replace walking.", cause: "Steve Jobs said it would be bigger than the PC. Instead it became the official vehicle of mall cops and guided tours. Not a failure — just a different kind of success.", category: "Tech", img: "🛴" },
];

/* ---- pixel sprites ---- */
const SKIER_DOWN = [[3,0],[4,0],[2,1],[3,1],[4,1],[5,1],[3,2],[4,2],[2,3],[3,3],[4,3],[5,3],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[3,5],[4,5],[2,6],[3,6],[4,6],[5,6],[3,7],[4,7],[2,8],[3,8],[4,8],[5,8],[1,9],[2,9],[5,9],[6,9]];
const SKIER_LEFT = [[2,0],[3,0],[1,1],[2,1],[3,1],[4,1],[2,2],[3,2],[1,3],[2,3],[3,3],[4,3],[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[2,5],[3,5],[1,6],[2,6],[3,6],[4,6],[2,7],[3,7],[1,8],[2,8],[3,8],[0,9],[1,9],[4,9],[5,9]];
const SKIER_RIGHT = [[4,0],[5,0],[3,1],[4,1],[5,1],[6,1],[4,2],[5,2],[3,3],[4,3],[5,3],[6,3],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[4,5],[5,5],[3,6],[4,6],[5,6],[6,6],[4,7],[5,7],[4,8],[5,8],[6,8],[2,9],[3,9],[6,9],[7,9]];
const TREE_PX = [[3,0],[4,0],[2,1],[3,1],[4,1],[5,1],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[2,4],[3,4],[4,4],[5,4],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[3,7],[4,7],[3,8],[4,8],[3,9],[4,9]];
const TOMB_PX = [[2,0],[3,0],[4,0],[5,0],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[1,3],[2,3],[4,3],[5,3],[6,3],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[1,5],[2,5],[4,5],[5,5],[6,5],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[2,7],[3,7],[4,7],[5,7]];
const ROCK_PX = [[2,0],[3,0],[4,0],[1,1],[2,1],[3,1],[4,1],[5,1],[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[1,3],[2,3],[3,3],[4,3],[5,3],[2,4],[3,4],[4,4]];

function buildYeti() {
  const px = [];
  const r = ["   ########   ","  ##########  "," ## ###### ## "," ## ###### ## "," ############ ","  ##########  ","  ##########  ","  ##########  "," ############ "," ## ###### ## "," ## ###### ## ","  ##########  ","   ########   ","    ##  ##    ","   ##    ##   ","  ###    ###  "];
  for (let y = 0; y < r.length; y++) for (let x = 0; x < r[y].length; x++) if (r[y][x] === "#") px.push([x, y]);
  return px;
}
const YETI_PX = buildYeti();

function dp(ctx, px, ox, oy, color, sc) {
  ctx.fillStyle = color;
  px.forEach(function(p) { ctx.fillRect(ox + p[0] * sc, oy + p[1] * sc, sc, sc); });
}

/* ---- skull logo ---- */
function SkullLogo(props) {
  var sz = props.size || 48;
  return (
    <svg onClick={props.onClick} width={sz} height={sz} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ cursor: props.onClick ? "pointer" : "default", ...(props.style || {}) }}>
      <rect x="8" y="4" width="16" height="2" fill="#39ff14"/><rect x="6" y="6" width="2" height="2" fill="#39ff14"/>
      <rect x="24" y="6" width="2" height="2" fill="#39ff14"/><rect x="4" y="8" width="2" height="2" fill="#39ff14"/>
      <rect x="26" y="8" width="2" height="2" fill="#39ff14"/><rect x="4" y="10" width="24" height="2" fill="#39ff14"/>
      <rect x="4" y="12" width="4" height="4" fill="#39ff14"/><rect x="12" y="12" width="8" height="4" fill="#39ff14"/>
      <rect x="24" y="12" width="4" height="4" fill="#39ff14"/><rect x="8" y="12" width="4" height="4" fill="#0a0a0a"/>
      <rect x="20" y="12" width="4" height="4" fill="#0a0a0a"/><rect x="4" y="16" width="24" height="2" fill="#39ff14"/>
      <rect x="6" y="18" width="20" height="2" fill="#39ff14"/><rect x="8" y="20" width="4" height="2" fill="#39ff14"/>
      <rect x="14" y="20" width="4" height="2" fill="#39ff14"/><rect x="20" y="20" width="4" height="2" fill="#39ff14"/>
      <rect x="10" y="22" width="2" height="2" fill="#39ff14"/><rect x="16" y="22" width="2" height="2" fill="#39ff14"/>
      <rect x="22" y="22" width="2" height="2" fill="#39ff14"/>
    </svg>
  );
}

/* ---- CRT scan lines (CSS only, no canvas) ---- */
function ScanLines() {
  return <div style={{ position:"fixed", top:0, left:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:9998, background:"repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)" }} />;
}

/* ---- glitch text effect ---- */
function GlitchText(props) {
  const [g, setG] = useState(false);
  useEffect(function() {
    var iv = setInterval(function() { setG(true); setTimeout(function() { setG(false); }, 150); }, 4000);
    return function() { clearInterval(iv); };
  }, []);
  return (
    <span style={{ position:"relative", display:"inline-block" }}>
      {g && <span style={{ position:"absolute", left:2, top:1, color:"#ff0040", clipPath:"inset(10% 0 60% 0)", opacity:0.8 }}>{props.children}</span>}
      {g && <span style={{ position:"absolute", left:-2, top:-1, color:"#00d4ff", clipPath:"inset(50% 0 10% 0)", opacity:0.8 }}>{props.children}</span>}
      {props.children}
    </span>
  );
}

/* ---- fullscreen ski game overlay ---- */
function SkiFreeOverlay(props) {
  var canvasRef = useRef(null);
  var gRef = useRef({ st:"ready", sk:{x:0,y:100,d:0}, obs:[], yeti:null, sc:0, spd:2.5, fr:0, keys:{}, hi:0, W:800, H:600 });
  var animRef = useRef(null);
  var [gState, setGState] = useState("ready");
  var [score, setScore] = useState(0);
  var [hi, setHi] = useState(0);

  useEffect(function() {
    try {
      window.storage.get("deadair-ski-hi").then(function(r) {
        if (r) { var v = parseInt(r.value); gRef.current.hi = v; setHi(v); }
      }).catch(function(){});
    } catch(e) {}
  }, []);

  useEffect(function() {
    var c = canvasRef.current; if (!c) return;
    function resize() { c.width = window.innerWidth; c.height = window.innerHeight; gRef.current.W = c.width; gRef.current.H = c.height; }
    resize(); window.addEventListener("resize", resize);
    return function() { window.removeEventListener("resize", resize); };
  }, []);

  function spawn() {
    var g = gRef.current;
    var types = ["tree","tree","tree","tomb","tomb","rock"];
    var t = types[Math.floor(Math.random()*types.length)];
    return { x: Math.random()*(g.W-60)+30, y: g.H+Math.random()*100, t:t, w:t==="rock"?14:16, h:t==="rock"?10:20 };
  }

  function start() {
    var g = gRef.current;
    g.st = "playing"; g.sk = {x:g.W/2, y:100, d:0}; g.obs = []; g.yeti = null; g.sc = 0; g.spd = 2.5; g.fr = 0;
    for (var i = 0; i < 12; i++) { var o = spawn(); o.y = 200+Math.random()*g.H; g.obs.push(o); }
    setGState("playing"); setScore(0);
  }

  function die(g) {
    g.st = "dead"; setGState("dead");
    if (g.sc > g.hi) { g.hi = g.sc; setHi(g.sc); try { window.storage.set("deadair-ski-hi", String(g.sc)); } catch(e){} }
  }

  useEffect(function() {
    function loop() {
      var c = canvasRef.current; if (!c) { animRef.current = requestAnimationFrame(loop); return; }
      var ctx = c.getContext("2d");
      var g = gRef.current; var W = g.W; var H = g.H;
      if (g.st !== "playing") { animRef.current = requestAnimationFrame(loop); return; }
      g.fr++; g.sc += Math.floor(g.spd); g.spd = Math.min(8, 2.5+g.sc/800); setScore(g.sc);
      var ms = 4;
      if (g.keys["ArrowLeft"]||g.keys["a"]) { g.sk.x -= ms; g.sk.d = -1; }
      else if (g.keys["ArrowRight"]||g.keys["d"]) { g.sk.x += ms; g.sk.d = 1; }
      else { g.sk.d = 0; }
      g.sk.x = Math.max(10, Math.min(W-26, g.sk.x));
      for (var i = 0; i < g.obs.length; i++) g.obs[i].y -= g.spd;
      g.obs = g.obs.filter(function(o){ return o.y > -40; });
      if (g.fr % Math.max(8,25-Math.floor(g.sc/500)) === 0) g.obs.push(spawn());
      if (g.sc > 3000 && !g.yeti) g.yeti = {x:W/2, y:H+60};
      if (g.yeti) {
        var dx = g.sk.x-g.yeti.x, dy = g.sk.y-g.yeti.y, dist = Math.sqrt(dx*dx+dy*dy);
        if (dist > 0) { g.yeti.x += (dx/dist)*g.spd*0.55; g.yeti.y += (dy/dist)*g.spd*0.55; }
        if (Math.abs(g.sk.x-g.yeti.x)<20 && Math.abs(g.sk.y-g.yeti.y)<24) die(g);
      }
      for (var j = 0; j < g.obs.length; j++) {
        var ob = g.obs[j];
        if (g.sk.x+8>ob.x && g.sk.x<ob.x+ob.w && g.sk.y+20>ob.y && g.sk.y<ob.y+ob.h) { die(g); break; }
      }
      ctx.fillStyle = "#0a0a0a"; ctx.fillRect(0,0,W,H);
      g.obs.forEach(function(ob) {
        if (ob.t==="tree") { dp(ctx,TREE_PX,ob.x,ob.y,"#1a8a1a",2); }
        else if (ob.t==="tomb") { dp(ctx,TOMB_PX,ob.x,ob.y,"#707070",2); ctx.fillStyle="#39ff14"; ctx.font="6px 'Press Start 2P'"; ctx.fillText("RIP",ob.x+4,ob.y+12); }
        else { dp(ctx,ROCK_PX,ob.x,ob.y,"#505050",2); }
      });
      var spr = g.sk.d<0?SKIER_LEFT:g.sk.d>0?SKIER_RIGHT:SKIER_DOWN;
      dp(ctx,spr,g.sk.x,g.sk.y,"#39ff14",2);
      if (g.yeti) {
        var pulse = Math.sin(g.fr*0.15)*0.3+0.7;
        dp(ctx,YETI_PX,g.yeti.x-14,g.yeti.y-16,"rgba(234,67,53,"+pulse+")",3);
        ctx.fillStyle="rgba(66,133,244,"+pulse+")"; ctx.font="bold 18px sans-serif"; ctx.fillText("G",g.yeti.x+2,g.yeti.y+10);
      }
      ctx.fillStyle="rgba(10,10,10,0.8)"; ctx.fillRect(0,0,W,36);
      ctx.fillStyle="#39ff14"; ctx.font="12px 'Press Start 2P'"; ctx.fillText("DIST: "+g.sc+"m",16,24);
      ctx.fillStyle="#555"; ctx.font="10px 'Press Start 2P'"; ctx.fillText("ESC TO EXIT",W-160,24);
      if (g.sc>2500&&!g.yeti) { ctx.fillStyle="#ff0040"; ctx.font="12px 'Press Start 2P'"; ctx.fillText("SOMETHING IS COMING...",W/2-140,24); }
      if (g.yeti&&g.fr%30<15) { ctx.fillStyle="#ff0040"; ctx.font="12px 'Press Start 2P'"; ctx.fillText("GOOGLE IS CHASING YOU",W/2-140,24); }
      animRef.current = requestAnimationFrame(loop);
    }
    animRef.current = requestAnimationFrame(loop);
    return function() { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  useEffect(function() {
    function dn(e) { if (e.key==="Escape"){props.onClose();return;} gRef.current.keys[e.key]=true; if(["ArrowLeft","ArrowRight"," "].indexOf(e.key)>=0)e.preventDefault(); }
    function up(e) { gRef.current.keys[e.key]=false; }
    window.addEventListener("keydown",dn); window.addEventListener("keyup",up);
    return function() { window.removeEventListener("keydown",dn); window.removeEventListener("keyup",up); };
  }, [props.onClose]);

  var tRef = useRef(null);
  function ts(e) { tRef.current=e.touches[0].clientX; }
  function tm(e) { if(!tRef.current)return; var d=e.touches[0].clientX-tRef.current; if(d<-5){gRef.current.keys["ArrowLeft"]=true;gRef.current.keys["ArrowRight"]=false;}else if(d>5){gRef.current.keys["ArrowRight"]=true;gRef.current.keys["ArrowLeft"]=false;} tRef.current=e.touches[0].clientX; }
  function te() { tRef.current=null;gRef.current.keys["ArrowLeft"]=false;gRef.current.keys["ArrowRight"]=false; }

  var ov = {position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"};
  var btn = {padding:"14px 32px",fontFamily:"'Press Start 2P',monospace",fontSize:11,background:"#39ff14",color:"#0a0a0a",border:"none",borderRadius:4,cursor:"pointer"};
  return (
    <div style={{position:"fixed",inset:0,zIndex:10000,background:"#0a0a0a"}}>
      <canvas ref={canvasRef} onTouchStart={ts} onTouchMove={tm} onTouchEnd={te} style={{display:"block",width:"100%",height:"100%",imageRendering:"pixelated",touchAction:"none"}} />
      {gState==="ready"&&<div style={Object.assign({},ov,{background:"rgba(10,10,10,0.9)"})}>
        <SkullLogo size={64}/>
        <h2 style={{fontFamily:"'Press Start 2P',monospace",fontSize:18,color:"#39ff14",margin:"16px 0 8px",textShadow:"0 0 20px rgba(57,255,20,0.4)"}}>DEAD RUN</h2>
        <p style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:14,color:"#c0c0c0",marginBottom:4}}>Ski through the graveyard of dead tech.</p>
        <p style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:13,color:"#d4d4d4",marginBottom:24}}>Dodge the tombstones. Outrun Google.</p>
        <button onClick={start} style={btn}>▶ START</button>
        <p style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:"#808080",marginTop:20}}>← → arrow keys or swipe to steer</p>
        <button onClick={props.onClose} style={{marginTop:16,background:"transparent",border:"1px solid #555",color:"#808080",fontFamily:"'Press Start 2P',monospace",fontSize:8,padding:"8px 16px",borderRadius:4,cursor:"pointer"}}>ESC TO EXIT</button>
      </div>}
      {gState==="dead"&&<div style={Object.assign({},ov,{background:"rgba(10,10,10,0.9)"})}>
        <div style={{fontSize:48,marginBottom:12}}>💀</div>
        <h3 style={{fontFamily:"'Press Start 2P',monospace",fontSize:16,color:"#ff0040",marginBottom:12}}>GAME OVER</h3>
        <p style={{fontFamily:"'Press Start 2P',monospace",fontSize:12,color:"#c0c0c0",marginBottom:4}}>DISTANCE: {score}m</p>
        <p style={{fontFamily:"'Press Start 2P',monospace",fontSize:9,color:"#808080",marginBottom:16}}>BEST: {hi}m</p>
        {gRef.current.yeti&&score>0&&<p style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:13,color:"#ff0040",marginBottom:16,fontStyle:"italic"}}>Google got you. It gets everyone eventually.</p>}
        <div style={{display:"flex",gap:12}}>
          <button onClick={start} style={btn}>TRY AGAIN</button>
          <button onClick={props.onClose} style={Object.assign({},btn,{background:"transparent",border:"1px solid #39ff14",color:"#39ff14"})}>EXIT</button>
        </div>
      </div>}
    </div>
  );
}

/* ---- hot or not swiper ---- */
function HotOrNotSwiper(props) {
  var items = props.items;
  var [idx, setIdx] = useState(0);
  var [votes, setVotes] = useState({});
  var [dir, setDir] = useState(null);
  var [showRes, setShowRes] = useState(false);
  var [resMode, setResMode] = useState(false);
  var [sx, setSx] = useState(null);
  var [dx, setDx] = useState(0);

  useEffect(function() {
    try {
      window.storage.get("dat-votes").then(function(r) { if (r) setVotes(JSON.parse(r.value)); }).catch(function(){});
    } catch(e) {}
  }, []);

  function save(v) { try { window.storage.set("dat-votes", JSON.stringify(v)); } catch(e){} }

  function vote(d) {
    if (idx >= items.length) return;
    var item = items[idx]; var key = "i-"+item.id;
    setDir(d);
    setTimeout(function() {
      var f = d==="right"?"hot":"not"; var prev = votes[key]||{hot:0,not:0};
      var nv = Object.assign({}, votes); nv[key] = Object.assign({}, prev); nv[key][f] = prev[f]+1;
      setVotes(nv); save(nv); setShowRes(true);
      setTimeout(function() { setDir(null); setShowRes(false); setIdx(function(i){return i+1;}); }, 800);
    }, 300);
  }

  function onTS(e) { setSx(e.touches[0].clientX); }
  function onTM(e) { if (sx !== null) setDx(e.touches[0].clientX - sx); }
  function onTE() { if (Math.abs(dx)>80) vote(dx>0?"right":"left"); setSx(null); setDx(0); }

  if (resMode) {
    var sorted = items.slice().sort(function(a,b) {
      var va = votes["i-"+a.id]||{hot:0,not:0}; var vb = votes["i-"+b.id]||{hot:0,not:0};
      var pa = va.hot+va.not>0?va.hot/(va.hot+va.not):0;
      var pb = vb.hot+vb.not>0?vb.hot/(vb.hot+vb.not):0;
      return pb-pa;
    });
    return (
      <div style={{maxWidth:500,margin:"0 auto"}}>
        <h3 style={{fontFamily:"'Press Start 2P',monospace",color:"#39ff14",fontSize:14,marginBottom:24,textAlign:"center"}}>RESURRECTION RANKINGS</h3>
        {sorted.map(function(item,i) {
          var v = votes["i-"+item.id]||{hot:0,not:0}; var tot = v.hot+v.not; var pct = tot>0?Math.round(v.hot/tot*100):0;
          return (
            <div key={item.id} style={{display:"flex",alignItems:"center",gap:12,marginBottom:12,padding:"10px 14px",background:"rgba(57,255,20,0.05)",border:"1px solid rgba(57,255,20,0.15)",borderRadius:4}}>
              <span style={{fontFamily:"'Press Start 2P',monospace",fontSize:10,color:"#39ff14",minWidth:28}}>#{i+1}</span>
              <span style={{fontSize:22,minWidth:32}}>{item.img}</span>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:9,color:"#e0e0e0"}}>{item.name}</div>
                <div style={{marginTop:6,height:6,background:"rgba(255,255,255,0.1)",borderRadius:3,overflow:"hidden"}}>
                  <div style={{height:"100%",width:pct+"%",background:pct>60?"#39ff14":pct>40?"#f0e040":"#ff0040",borderRadius:3,transition:"width 0.5s"}} />
                </div>
              </div>
              <span style={{fontFamily:"'Press Start 2P',monospace",fontSize:10,color:pct>50?"#39ff14":"#ff0040"}}>{tot>0?pct+"%":"—"}</span>
            </div>
          );
        })}
        <button onClick={function(){setResMode(false);setIdx(0);}} style={{marginTop:20,width:"100%",padding:"12px 20px",fontFamily:"'Press Start 2P',monospace",fontSize:10,background:"transparent",color:"#39ff14",border:"1px solid #39ff14",borderRadius:4,cursor:"pointer"}}>↻ VOTE AGAIN</button>
      </div>
    );
  }

  if (idx >= items.length) {
    return (
      <div style={{textAlign:"center",padding:40}}>
        <div style={{fontSize:48,marginBottom:16}}>⚰️</div>
        <h3 style={{fontFamily:"'Press Start 2P',monospace",color:"#39ff14",fontSize:14,marginBottom:12}}>ALL VOTES CAST</h3>
        <p style={{color:"#d4d4d4",fontFamily:"'IBM Plex Mono',monospace",marginBottom:24}}>The dead have been judged.</p>
        <button onClick={function(){setResMode(true);}} style={{padding:"14px 28px",fontFamily:"'Press Start 2P',monospace",fontSize:11,background:"#39ff14",color:"#0a0a0a",border:"none",borderRadius:4,cursor:"pointer",letterSpacing:1}}>VIEW DAT →</button>
      </div>
    );
  }

  var item = items[idx];
  var cv = votes["i-"+item.id]||{hot:0,not:0};
  var tot = cv.hot+cv.not;

  return (
    <div style={{maxWidth:420,margin:"0 auto",userSelect:"none"}}>
      <div style={{textAlign:"center",marginBottom:16}}><span style={{fontFamily:"'Press Start 2P',monospace",fontSize:9,color:"#a0a0a0"}}>{idx+1} / {items.length}</span></div>
      <div onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={onTE}
        style={{position:"relative",background:"linear-gradient(180deg,#111 0%,#0a0a0a 100%)",border:dir==="right"?"2px solid #39ff14":dir==="left"?"2px solid #ff0040":"2px solid rgba(57,255,20,0.3)",borderRadius:8,padding:"32px 28px",minHeight:340,display:"flex",flexDirection:"column",justifyContent:"space-between",transform:dir==="right"?"translateX(120%) rotate(12deg)":dir==="left"?"translateX(-120%) rotate(-12deg)":"translateX("+dx+"px) rotate("+dx*0.05+"deg)",opacity:dir?0:1,transition:dir?"all 0.3s ease-out":dx?"none":"all 0.2s ease"}}>
        {dx>40&&<div style={{position:"absolute",top:20,right:20,fontFamily:"'Press Start 2P',monospace",fontSize:14,color:"#39ff14",transform:"rotate(12deg)",border:"2px solid #39ff14",padding:"4px 10px",borderRadius:4}}>HOT</div>}
        {dx<-40&&<div style={{position:"absolute",top:20,left:20,fontFamily:"'Press Start 2P',monospace",fontSize:14,color:"#ff0040",transform:"rotate(-12deg)",border:"2px solid #ff0040",padding:"4px 10px",borderRadius:4}}>NOT</div>}
        <div>
          <div style={{fontSize:56,textAlign:"center",marginBottom:16,filter:"drop-shadow(0 0 20px rgba(57,255,20,0.3))"}}>{item.img}</div>
          <span style={{fontFamily:"'Press Start 2P',monospace",fontSize:8,color:"#39ff14",letterSpacing:2,textTransform:"uppercase"}}>{item.category} • {item.year}</span>
          <h3 style={{fontFamily:"'Press Start 2P',monospace",fontSize:16,color:"#e0e0e0",margin:"8px 0",lineHeight:1.4}}>{item.name}</h3>
          <p style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:13,color:"#c0c0c0",fontStyle:"italic",margin:"4px 0 16px"}}>{item.tagline}</p>
        </div>
        <div>
          <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:8,color:"#ff0040",marginBottom:6,letterSpacing:1}}>CAUSE OF DEATH:</div>
          <p style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12,color:"#d4d4d4",lineHeight:1.6,margin:0}}>{item.cause}</p>
        </div>
        {showRes&&tot>1&&<div style={{position:"absolute",bottom:12,right:16,fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:"#d4d4d4"}}>{Math.round(cv.hot/tot*100)}% say resurrect</div>}
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:24,marginTop:24}}>
        <button onClick={function(){vote("left");}} style={{width:72,height:72,borderRadius:"50%",border:"2px solid #ff0040",background:"rgba(255,0,64,0.1)",fontSize:24,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>💀</button>
        <button onClick={function(){vote("right");}} style={{width:72,height:72,borderRadius:"50%",border:"2px solid #39ff14",background:"rgba(57,255,20,0.1)",fontSize:24,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>🔋</button>
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:40,marginTop:10}}>
        <span style={{fontFamily:"'Press Start 2P',monospace",fontSize:7,color:"#ff0040",letterSpacing:1}}>LET IT ROT</span>
        <span style={{fontFamily:"'Press Start 2P',monospace",fontSize:7,color:"#39ff14",letterSpacing:1}}>RESURRECT</span>
      </div>
    </div>
  );
}

/* ==== MAIN APP ==== */
export default function DeadAirTech() {
  var [email, setEmail] = useState("");
  var [subscribed, setSubscribed] = useState(false);
  var [cursor, setCursor] = useState(true);
  var [bootText, setBootText] = useState("");
  var [booted, setBooted] = useState(false);
  var [section, setSection] = useState("home");
  var [game, setGame] = useState(false);
  var swiperRef = useRef(null);

  var bootLines = ["> INITIALIZING DEAD_AIR_TECH v0.0.1...","> SCANNING TECH GRAVEYARD... 293 PRODUCTS FOUND","> LOADING OBITUARIES...","> POURING ONE OUT FOR GOOGLE READER...","> SYSTEM READY. BROADCASTING NOTHING, TO NO ONE, BEAUTIFULLY."];

  useEffect(function() {
    var blink = setInterval(function(){setCursor(function(c){return !c;});}, 530);
    var li = 0, ci = 0, txt = "";
    var typer = setInterval(function() {
      if (li >= bootLines.length) { clearInterval(typer); setTimeout(function(){setBooted(true);}, 600); return; }
      if (ci < bootLines[li].length) { txt += bootLines[li][ci]; setBootText(txt); ci++; }
      else { txt += "\n"; setBootText(txt); li++; ci = 0; }
    }, 22);
    return function() { clearInterval(blink); clearInterval(typer); };
  }, []);

  function handleSub(e) { e.preventDefault(); if (email.indexOf("@") >= 0) setSubscribed(true); }
  function goSwiper() { setSection("swiper"); setTimeout(function(){ if(swiperRef.current) swiperRef.current.scrollIntoView({behavior:"smooth"}); }, 100); }

  var pillars = [
    {icon:"⚰️",title:"THE GRAVEYARD",desc:"Weekly obituaries for dead tech. What happened, why it mattered, and whether it deserved its fate."},
    {icon:"🔧",title:"THE JUNKYARD",desc:"Community-submitted abandoned side projects. Your beautiful, broken, half-finished masterpieces."},
    {icon:"🔥",title:"HOT OR NOT",desc:"Swipe right to resurrect, left to let it rot. The people decide which dead tech deserves another shot."},
    {icon:"📡",title:"THE STATIC",desc:"Weekly newsletter. Sharp analysis wrapped in juvenile humor. Like a TED Talk given by someone who just ripped one."},
  ];

  if (!booted) return (
    <div>
      <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24,background:"#0a0a0a"}}>
        <div style={{maxWidth:620,width:"100%",fontFamily:"'Press Start 2P',monospace",fontSize:10,lineHeight:2.2,color:"#39ff14",whiteSpace:"pre-wrap"}}>{bootText}{cursor?"█":" "}</div>
      </div>
    </div>
  );

  return (
    <div>
      <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{__html: [
        "*{margin:0;padding:0;box-sizing:border-box}",
        "body{background:#0a0a0a}",
        "::selection{background:#39ff14;color:#0a0a0a}",
        "::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#0a0a0a}::-webkit-scrollbar-thumb{background:#39ff14;border-radius:3px}",
        "@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}",
        "@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}",
        "@keyframes hintPulse{0%,100%{opacity:0.25}50%{opacity:0.65}}",
        ".fade-up{animation:fadeUp .6s ease forwards}",
      ].join("\n")}} />

      <ScanLines />

      {game && <SkiFreeOverlay onClose={function(){setGame(false);}} />}

      <div onClick={function(){setGame(true);}} style={{position:"fixed",bottom:16,right:16,zIndex:99,fontFamily:"'Press Start 2P',monospace",fontSize:7,color:"#39ff14",background:"rgba(10,10,10,0.8)",border:"1px solid rgba(57,255,20,0.15)",padding:"8px 12px",borderRadius:4,cursor:"pointer",animation:"hintPulse 3s ease infinite",letterSpacing:1}}>
        ⛷️ CLICK SKULL TO PLAY
      </div>

      <div style={{minHeight:"100vh",background:"#0a0a0a",color:"#e0e0e0",fontFamily:"'IBM Plex Mono',monospace",position:"relative"}}>

        {/* NAV */}
        <nav style={{position:"sticky",top:0,zIndex:100,background:"rgba(10,10,10,0.92)",backdropFilter:"blur(10px)",borderBottom:"1px solid rgba(57,255,20,0.15)",padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <SkullLogo size={28} onClick={function(){setGame(true);}} />
            <span style={{fontFamily:"'Press Start 2P',monospace",fontSize:11,color:"#39ff14",letterSpacing:1,cursor:"pointer"}} onClick={function(){setSection("home");}}>DEAD AIR</span>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {[["home","HOME"],["swiper","HOT OR NOT"],["about","ABOUT"],["subscribe","SUBSCRIBE"]].map(function(pair) {
              return <button key={pair[0]} style={{fontFamily:"'Press Start 2P',monospace",fontSize:8,color:section===pair[0]?"#39ff14":"#909090",background:section===pair[0]?"rgba(57,255,20,0.1)":"transparent",border:"none",padding:"6px 12px",cursor:"pointer",letterSpacing:1,borderRadius:3}} onClick={function(){setSection(pair[0]);if(pair[0]==="swiper")goSwiper();}}>{pair[1]}</button>;
            })}
          </div>
        </nav>

        {/* HERO */}
        {(section==="home"||section==="subscribe") && (
          <div className="fade-up" style={{textAlign:"center",padding:"80px 24px 60px",position:"relative",zIndex:1}}>
            <SkullLogo size={64} onClick={function(){setGame(true);}} style={{filter:"drop-shadow(0 0 8px rgba(57,255,20,0.3))"}} />
            <h1 style={{fontFamily:"'Press Start 2P',monospace",fontSize:"clamp(20px,4vw,36px)",color:"#39ff14",margin:"20px 0 16px",lineHeight:1.4,textShadow:"0 0 30px rgba(57,255,20,0.4)"}}><GlitchText>DEAD AIR TECHNOLOGIES</GlitchText></h1>
            <p style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:"clamp(13px,2vw,16px)",color:"#c0c0c0",maxWidth:600,margin:"0 auto 32px",lineHeight:1.7}}>Where dead tech, abandoned projects, and failed ideas get the funeral they deserve — and occasionally, an unexpected resurrection.</p>
            <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
              <button style={{padding:"14px 32px",fontFamily:"'Press Start 2P',monospace",fontSize:11,background:"#39ff14",color:"#0a0a0a",border:"none",borderRadius:4,cursor:"pointer",letterSpacing:1,boxShadow:"0 0 20px rgba(57,255,20,0.3)"}} onClick={goSwiper}>▶ PLAY HOT OR NOT</button>
              <button style={{padding:"14px 32px",fontFamily:"'Press Start 2P',monospace",fontSize:11,background:"transparent",color:"#39ff14",border:"1px solid #39ff14",borderRadius:4,cursor:"pointer",letterSpacing:1}} onClick={function(){setSection("subscribe");}}>📡 GET THE STATIC</button>
            </div>
          </div>
        )}

        {/* HOT OR NOT */}
        {(section==="home"||section==="swiper") && (
          <div>
            <hr style={{border:"none",borderTop:"1px solid rgba(57,255,20,0.12)",margin:"0 24px"}} />
            <div ref={swiperRef} style={{padding:"60px 24px",maxWidth:800,margin:"0 auto",position:"relative",zIndex:1}}>
              <p style={{fontFamily:"'Press Start 2P',monospace",fontSize:8,color:"#ff0040",textAlign:"center",letterSpacing:3,marginBottom:4,animation:"pulse 2s infinite"}}>● LIVE</p>
              <h2 style={{fontFamily:"'Press Start 2P',monospace",fontSize:14,color:"#39ff14",textAlign:"center",marginBottom:8,letterSpacing:2}}>HOT OR NOT: DEAD TECH EDITION</h2>
              <p style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:13,color:"#d4d4d4",textAlign:"center",marginBottom:40}}>Resurrect it or let it rot? You decide. Swipe or tap.</p>
              <HotOrNotSwiper items={DEAD_TECH} />
            </div>
          </div>
        )}

        {/* ABOUT */}
        {(section==="home"||section==="about") && (
          <div>
            <hr style={{border:"none",borderTop:"1px solid rgba(57,255,20,0.12)",margin:"0 24px"}} />
            <div style={{padding:"60px 24px",maxWidth:800,margin:"0 auto",position:"relative",zIndex:1}}>
              <h2 style={{fontFamily:"'Press Start 2P',monospace",fontSize:14,color:"#39ff14",textAlign:"center",marginBottom:8,letterSpacing:2}}>WHAT WE DO HERE</h2>
              <p style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:13,color:"#d4d4d4",textAlign:"center",marginBottom:40}}>Four ways to honor the dead.</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:20}}>
                {pillars.map(function(p,i) {
                  return (
                    <div key={i} style={{background:"rgba(10,10,10,0.85)",border:"1px solid rgba(57,255,20,0.12)",borderRadius:6,padding:24}}>
                      <div style={{fontSize:28,marginBottom:12}}>{p.icon}</div>
                      <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:10,color:"#39ff14",marginBottom:8}}>{p.title}</div>
                      <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12,color:"#c0c0c0",lineHeight:1.6}}>{p.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* NEWSLETTER */}
        {(section==="home"||section==="subscribe") && (
          <div>
            <hr style={{border:"none",borderTop:"1px solid rgba(57,255,20,0.12)",margin:"0 24px"}} />
            <div style={{padding:"60px 24px",maxWidth:800,margin:"0 auto",textAlign:"center",position:"relative",zIndex:1}}>
              <h2 style={{fontFamily:"'Press Start 2P',monospace",fontSize:14,color:"#39ff14",textAlign:"center",marginBottom:8,letterSpacing:2}}>📡 THE STATIC</h2>
              <p style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:13,color:"#d4d4d4",textAlign:"center",marginBottom:40}}>Weekly obituaries for dead tech. Free forever. Like Google Reader should've been.</p>
              {subscribed ? (
                <div className="fade-up" style={{padding:32,border:"1px solid #39ff14",borderRadius:8,background:"rgba(57,255,20,0.05)"}}>
                  <div style={{fontSize:40,marginBottom:12}}>💀✉️</div>
                  <p style={{fontFamily:"'Press Start 2P',monospace",fontSize:12,color:"#39ff14",marginBottom:8}}>YOU'RE IN THE GRAVEYARD.</p>
                  <p style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:13,color:"#c0c0c0"}}>First edition of The Static incoming. How about DAT? Try not to die before it arrives.</p>
                </div>
              ) : (
                <form onSubmit={handleSub} style={{display:"flex",gap:8,maxWidth:460,margin:"0 auto",flexWrap:"wrap",justifyContent:"center"}}>
                  <input type="email" placeholder="your@email.com" value={email} onChange={function(e){setEmail(e.target.value);}} style={{flex:1,minWidth:220,padding:"14px 16px",fontFamily:"'IBM Plex Mono',monospace",fontSize:14,background:"rgba(57,255,20,0.05)",border:"1px solid rgba(57,255,20,0.3)",borderRadius:4,color:"#e0e0e0",outline:"none"}} required />
                  <button type="submit" style={{padding:"14px 32px",fontFamily:"'Press Start 2P',monospace",fontSize:10,background:"#39ff14",color:"#0a0a0a",border:"none",borderRadius:4,cursor:"pointer",letterSpacing:1,boxShadow:"0 0 20px rgba(57,255,20,0.3)"}}>SUBSCRIBE →</button>
                </form>
              )}
              <p style={{marginTop:16,fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:"#808080"}}>No spam. The AI slop stays in the dead products we roast, not in the newsletter. Unsubscribe anytime — unlike Google's products, we respect your choices.</p>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer style={{textAlign:"center",padding:"40px 24px",borderTop:"1px solid rgba(57,255,20,0.1)",position:"relative",zIndex:1}}>
          <SkullLogo size={24} onClick={function(){setGame(true);}} />
          <p style={{fontFamily:"'Press Start 2P',monospace",fontSize:8,color:"#666",marginTop:12,letterSpacing:1}}>DEAD AIR TECHNOLOGIES © 2026</p>
          <p style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:13,color:"#c0c0c0",marginTop:12,fontStyle:"italic"}}>DAT's all, folks.</p>
          <p style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:"#808080",marginTop:6,fontStyle:"italic"}}>Broadcasting nothing, to no one, beautifully.</p>
          <p style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:"#666",marginTop:16}}>deadairtech.com</p>
          <div style={{marginTop:32,padding:"20px 24px",borderTop:"1px solid rgba(57,255,20,0.08)",maxWidth:560,margin:"32px auto 0"}}>
            <p style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:"#555",lineHeight:1.8,textAlign:"center"}}>DISCLAIMER: Dead Air Technologies is a parody and humor site. All commentary, obituaries, and roasts are satirical in nature. We are not affiliated with any of the companies, products, or spectacular failures mentioned herein. If something we wrote hurt your feelings, please remember that we roast because we love — and also because it's really, really funny. Do not get your panties in a wad. No actual tech products were harmed in the making of this site. They were already dead.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}