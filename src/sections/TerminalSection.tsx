import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Sparkles } from "lucide-react";

const vertexShader = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_mouseActive;
uniform vec3 u_radii;
uniform float u_speed;

float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i.x + i.y * 57.0);
  float b = hash(i.x + 1.0 + i.y * 57.0);
  float c = hash(i.x + i.y * 57.0 + 1.0);
  float d = hash(i.x + 1.0 + i.y * 57.0 + 1.0);
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float randomChar(vec2 p, float t) {
  float idx = floor(hash(p.x * 13.37 + p.y * 7.77 + t) * 62.0);
  if (idx < 26.0) return 65.0 + idx;
  else if (idx < 52.0) return 97.0 + (idx - 26.0);
  else return 48.0 + (idx - 52.0);
}

float drawGlyph(vec2 uv, float charCode) {
  float val = 0.0;
  vec2 cell = floor(uv);
  vec2 fr = fract(uv) - 0.5;
  float hashVal = hash(cell.x * 7.31 + cell.y * 13.17 + charCode * 3.7);
  val = (hashVal > 0.3 ? 0.7 : 0.0) + (hashVal > 0.85 ? 0.3 : 0.0);
  val *= smoothstep(0.45, 0.2, abs(fr.x)) * smoothstep(0.45, 0.2, abs(fr.y));
  return val;
}

float charTile(vec2 uv, float charCode, vec2 cellId, float t) {
  uv = uv * vec2(4.0, 6.0);
  uv += cellId * 0.0;
  return drawGlyph(uv, charCode) * (0.8 + 0.2 * noise(cellId * 0.5 + t * 0.2));
}

void main() {
  vec2 pixel = gl_FragCoord.xy;
  vec2 uv = pixel / u_resolution;
  float t = u_time * u_speed;
  vec2 mouseNorm = u_mouse / u_resolution;
  vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
  vec2 mouseDistance = (uv - mouseNorm) * aspect;
  float md = length(mouseDistance);
  
  float revealRadius1 = u_radii.x;
  float revealRadius2 = u_radii.y;
  float revealRadius3 = u_radii.z;
  
  vec2 cellId = floor(uv * vec2(80.0, 40.0));
  
  float charNoise1 = randomChar(cellId * 1.0 + floor(t * 60.0) * 0.1, t);
  float charNoise2 = randomChar(cellId * 2.0 + floor(t * 30.0) * 0.2, t);
  float charNoise3 = randomChar(cellId * 3.0 + floor(t * 15.0) * 0.3, t);
  
  float messageVal = 0.0;
  float cx = cellId.x / 80.0;
  float cy = cellId.y / 40.0;
  
  float wave1 = sin(cx * 20.0 + cy * 5.0 - t * 2.0) * 0.5 + 0.5;
  float wave2 = sin(cx * 15.0 - cy * 8.0 + t * 1.5) * 0.5 + 0.5;
  float wave3 = sin((cx + cy) * 12.0 - t * 1.8) * 0.5 + 0.5;
  
  float revealPhase = 0.0;
  float phase1 = 0.0;
  float phase2 = 0.0;
  float phase3 = 0.0;
  
  if (u_mouseActive > 0.5) {
    phase1 = smoothstep(revealRadius1, 0.0, md);
    phase2 = smoothstep(revealRadius2, 0.0, md);
    phase3 = smoothstep(revealRadius3, 0.0, md);
    revealPhase = max(max(phase1, phase2 * 0.7), phase3 * 0.4);
  }
  
  float noiseVal = noise(cellId * 0.8 + t * 0.5);
  
  float finalChar = 32.0;
  finalChar = mix(finalChar, charNoise1, phase1);
  if (phase2 > 0.01) {
    finalChar = mix(finalChar, charNoise2, phase2 * 0.5);
  }
  if (phase3 > 0.01) {
    finalChar = mix(finalChar, charNoise3, phase3 * 0.3);
  }
  if (revealPhase < 0.01) {
    finalChar = mix(charNoise1, charNoise3, noiseVal);
  }
  
  float glyphVal = charTile(uv * vec2(80.0, 40.0), finalChar, cellId, t);
  
  vec3 color = vec3(0.0);
  
  color += vec3(0.72, 0.53, 0.04) * phase1 * smoothstep(0.35, 0.0, md) * 0.5;
  color += vec3(0.14, 0.16, 0.20) * phase2 * smoothstep(0.25, 0.0, md) * 0.4;
  color += vec3(0.98, 0.98, 0.98) * phase3 * smoothstep(0.15, 0.0, md) * 0.35;
  
  color += vec3(0.72, 0.53, 0.04) * glyphVal * 0.6;
  
  float baseNoise = noise(cellId * 0.3 + t * 0.1) * 0.03;
  color += vec3(0.72, 0.53, 0.04) * baseNoise;
  
  gl_FragColor = vec4(color, 1.0);
}
`;

export default function TerminalSection() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const frameRef = useRef<number>(0);
  const mouseRef = useRef({ x: -100, y: -100, active: false });
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
    });
    if (!gl) return;
    glRef.current = gl;

    const compileShader = (src: string, type: number) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(vertexShader, gl.VERTEX_SHADER);
    const fs = compileShader(fragmentShader, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program error:", gl.getProgramInfoLog(program));
      return;
    }

    programRef.current = program;
    gl.useProgram(program);

    const positions = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uMouseActive = gl.getUniformLocation(program, "u_mouseActive");
    const uRadii = gl.getUniformLocation(program, "u_radii");
    const uSpeed = gl.getUniformLocation(program, "u_speed");

    gl.uniform3f(uRadii, 0.45, 0.35, 0.25);
    gl.uniform1f(uSpeed, 1.0);

    const resize = () => {
      const container = containerRef.current;
      if (!container) return;
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      mouseRef.current.x = (e.clientX - rect.left) * dpr;
      mouseRef.current.y = (rect.height - (e.clientY - rect.top)) * dpr;
    };

    const handleMouseEnter = () => { mouseRef.current.active = true; };
    const handleMouseLeave = () => { mouseRef.current.active = false; };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl.uniform1f(uMouseActive, mouseRef.current.active ? 1.0 : 0.0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  const scrollToDemo = () => {
    navigate("/demo");
  };

  return (
    <section
      id="terminal"
      ref={containerRef}
      className="relative w-full h-screen"
      style={{ background: "#030303" }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full pointer-events-none">
        <h2 className="font-display italic uppercase text-[#FAFAFA] text-4xl md:text-6xl mb-4 text-center">
          Knowledge Decryption
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#94A3B8] mb-12 text-center">
          Move your cursor to reveal
        </p>

        <div className="flex flex-col gap-3 mb-16">
          {["PRECEDENT IS CODE", "TRUTH IS NON-NEGOTIABLE", "ACCESS FOR ALL"].map(
            (msg) => (
              <div key={msg} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D9A02D]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#94A3B8]/60">
                  {msg}
                </span>
              </div>
            )
          )}
        </div>

        <div className="pointer-events-auto flex flex-col items-center gap-4">
          <button
            onClick={scrollToDemo}
            className="group font-mono text-[11px] uppercase tracking-[0.18em] bg-[#D9A02D] hover:bg-[#D9A02D]/90 text-[#030303] px-8 py-4 rounded-lg transition-all duration-300 hover:shadow-[0_0_35px_rgba(184,134,11,0.25)]"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              Try the Interactive Demo
            </span>
          </button>
          <span className="font-mono text-[10px] text-[#94A3B8]/40">
            Experience AI legal reasoning
          </span>
        </div>
      </div>
    </section>
  );
}
