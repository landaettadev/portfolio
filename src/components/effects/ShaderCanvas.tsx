import React, { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../hooks/useSpotlight';

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

/**
 * Full-size WebGL canvas running one fragment shader.
 * Uniforms: r (resolution px), t (seconds), m (smoothed pointer 0..1 over the parent).
 * Renders only while visible; with reduced motion it draws a single frame.
 */
const ShaderCanvas: React.FC<{ frag: string; className?: string; still?: number }> = ({ frag, className = '', still = 4 }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas?.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    if (!canvas || !gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(prog, 'r');
    const uT = gl.getUniformLocation(prog, 't');
    const uM = gl.getUniformLocation(prog, 'm');

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      canvas.width = Math.max(1, canvas.clientWidth * dpr);
      canvas.height = Math.max(1, canvas.clientHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let mx = 0.5, my = 0.5, tx = 0.5, ty = 0.5;
    const host = canvas.parentElement;
    const onMove = (e: PointerEvent) => {
      const b = canvas.getBoundingClientRect();
      tx = (e.clientX - b.left) / b.width;
      ty = (e.clientY - b.top) / b.height;
    };
    host?.addEventListener('pointermove', onMove);

    const reduced = prefersReducedMotion();
    let raf = 0;
    let visible = false;
    const t0 = performance.now();
    const draw = () => {
      mx += (tx - mx) * 0.05;
      my += (ty - my) * 0.05;
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform1f(uT, reduced ? still : (performance.now() - t0) / 1000);
      gl.uniform2f(uM, mx, my);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (visible && !reduced) raf = requestAnimationFrame(draw);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) draw();
    });
    io.observe(canvas);
    draw();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      host?.removeEventListener('pointermove', onMove);
    };
  }, [frag, still]);

  return <canvas ref={ref} aria-hidden="true" className={`absolute inset-0 h-full w-full ${className}`} />;
};

export default ShaderCanvas;

/** Silky aurora curtains: folded light bands drifting over the horizon. */
export const AURORA_FRAG = `precision highp float;
uniform vec2 r;uniform float t;uniform vec2 m;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.03;a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/r;
  float x=uv.x*r.x/r.y;
  vec3 col=vec3(0.);
  for(int i=0;i<3;i++){
    float fi=float(i);
    float s=t*(.04+fi*.012);
    float w=fbm(vec2(x*.7+fi*3.1+s,s*.5+fi));
    float center=.66+fi*.08+.07*sin(x*1.1+t*.1+fi*2.)+(w-.5)*.22+(m.x-.5)*.04;
    float d=uv.y-center;
    // soft lower edge, long fading upper veil like real aurora curtains
    float band=d<0.?exp(-d*d*260.):exp(-d*d*(22.+fi*8.));
    float folds=.62+.38*sin(x*5.5+w*7.+t*.25+fi*1.7);
    float rays=.88+.12*sin(x*55.+w*20.);
    float curtain=band*folds*rays;
    vec3 c=fi<.5?vec3(.37,.92,.83):fi<1.5?vec3(.55,.36,.96):vec3(.2,.83,.6);
    col+=c*curtain*(fi<.5?.5:fi<1.5?.42:.28);
  }
  col*=smoothstep(.3,.55,uv.y);
  gl_FragColor=vec4(col,1.);
}`;

/** Concentric interference rings that bend around the pointer. */
export const RINGS_FRAG = `precision highp float;
uniform vec2 r;uniform float t;uniform vec2 m;
void main(){
  vec2 uv=(gl_FragCoord.xy*2.-r)/min(r.x,r.y);
  vec2 q=uv-(m-.5)*vec2(.6,-.4);
  float d=length(q);
  float a=atan(q.y,q.x);
  float warp=sin(a*3.+t*.35)*.08+sin(a*5.-t*.22)*.04;
  vec3 col=vec3(0.);
  for(int i=0;i<3;i++){
    float fi=float(i);
    float w=sin((d+warp)*18.-t*1.1-fi*.55);
    col[i]+=pow(max(w,0.),28.);
  }
  vec3 glow=vec3(.37,.92,.83),volt=vec3(.55,.36,.96),leaf=vec3(.2,.83,.6);
  vec3 c=glow*col.r+volt*col.g*1.1+leaf*col.b*.5;
  c*=smoothstep(1.7,.15,d)*.9;
  c+=vec3(.039,.024,.094)+volt*.06*smoothstep(1.2,0.,d);
  gl_FragColor=vec4(c,1.);
}`;

/** Soft night clouds drifting slowly, tinted violet → teal, with faint moonlit tops. */
export const CLOUDS_FRAG = `precision highp float;
uniform vec2 r;uniform float t;uniform vec2 m;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<6;i++){v+=a*n(p);p=p*2.02+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/r;
  vec2 p=uv*vec2(r.x/r.y,1.)*1.8+(m-.5)*vec2(.12,-.08);
  float q=fbm(p+vec2(t*.025,t*.01));
  float c=fbm(p*1.35+vec2(q*1.7+t*.04,q*.9-t*.015));
  float cloud=smoothstep(.38,.82,c);
  float tops=smoothstep(.58,.92,fbm(p*2.4+vec2(t*.05,0.)));
  vec3 base=vec3(.039,.024,.094);
  vec3 tint=mix(vec3(.36,.24,.68),vec3(.17,.52,.5),smoothstep(.15,.95,uv.x+(q-.5)*.6));
  vec3 col=base+tint*cloud*.5+vec3(.82,.78,1.)*tops*cloud*.1;
  col*=.7+.3*smoothstep(0.,.9,uv.y);
  gl_FragColor=vec4(col,1.);
}`;
