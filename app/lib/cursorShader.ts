/*
 * Hero cursor shader. Same fragment shader, trail, anchor timing and dark palette as the
 * previous three.js version, rendered with raw WebGL (no three.js in the bundle).
 * Compositing matches three.js defaults: premultiplied canvas + NormalBlending.
 */

const FRAG = `precision highp float;
uniform vec2 resolution;uniform float time;uniform vec2 points[5];uniform float strengths[5];
uniform vec2 anchors[2];uniform float anchorStrengths[2];uniform float activation;uniform float ambient;
uniform vec3 colorA;uniform vec3 colorB;uniform vec3 colorC;
float rippleField(vec2 uv,vec2 point,float tOffset){float d=length(uv-point);float signal=0.0;
  for(int i=1;i<=3;i++){float fi=float(i);signal+=0.0016*fi*fi/abs(fract(time*0.065+tOffset+fi*0.03)*4.5-d*3.2+mod(uv.x+uv.y,0.24));}
  return signal*smoothstep(0.82,0.02,d);}
void main(){vec2 uv=gl_FragCoord.xy/resolution.xy;vec2 centered=uv*2.0-1.0;centered.x*=resolution.x/resolution.y;
  float field=0.0;float anchorField=0.0;float minDist=10.0;
  for(int i=0;i<5;i++){vec2 point=points[i]*2.0-1.0;point.x*=resolution.x/resolution.y;float d=length(centered-point);minDist=min(minDist,d);field+=rippleField(centered,point,float(i)*0.09)*strengths[i];}
  for(int i=0;i<2;i++){vec2 point=anchors[i]*2.0-1.0;point.x*=resolution.x/resolution.y;float d=length(centered-point);minDist=min(minDist,d);anchorField+=rippleField(centered,point,float(i)*0.17+0.31)*anchorStrengths[i];}
  field=anchorField*(ambient+0.22)+field*(ambient+activation*0.9);field=clamp(field,0.0,1.2);
  float haze=(ambient*0.4+activation)*smoothstep(0.95,0.0,minDist)*0.12;
  vec3 color=colorA*field*0.5+colorB*field*0.95+colorC*pow(field,1.35)*0.4;color+=mix(colorC,colorB,0.55)*haze;
  float alpha=clamp(field*0.84+haze,0.0,0.78);gl_FragColor=vec4(color,alpha);}`

const PALETTES = {
  dark: { a: '#f6f0e7', b: '#ff8a3d', c: '#9fb4c8', ambient: 0.34 }, // unchanged from the live site
  light: { a: '#0d0b08', b: '#b8480a', c: '#3a342d', ambient: 0.24 }, // darker ripples on the light theme
}

const hex = (h: string) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255)

/** Starts the shader inside `mount`, reacting to pointer movement over `host`. Returns a cleanup function. */
export function startCursorShader(host: HTMLElement, mount: HTMLElement): () => void {
  const canvas = document.createElement('canvas')
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.style.display = 'block'
  const gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: true })
  if (!gl) return () => {}
  mount.appendChild(canvas)

  const compile = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s }
  const program = gl.createProgram()!
  gl.attachShader(program, compile(gl.VERTEX_SHADER, 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'))
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG))
  gl.linkProgram(program)
  gl.useProgram(program)
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(program, 'p')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
  gl.enable(gl.BLEND)
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
  gl.clearColor(0, 0, 0, 0)
  const U = (n: string) => gl.getUniformLocation(program, n)

  const applyPalette = () => {
    const p = document.documentElement.dataset.theme === 'dark' ? PALETTES.dark : PALETTES.light
    gl.uniform3fv(U('colorA'), hex(p.a)); gl.uniform3fv(U('colorB'), hex(p.b)); gl.uniform3fv(U('colorC'), hex(p.c))
    gl.uniform1f(U('ambient'), p.ambient)
  }
  applyPalette()
  window.addEventListener('themechange', applyPalette)
  gl.uniform2fv(U('anchors'), [0.76, 0.67, 0.84, 0.33])
  gl.uniform1fv(U('strengths'), [1, 0.82, 0.64, 0.46, 0.3])

  const trail = Array.from({ length: 5 }, () => [0.5, 0.5])
  const target = [0.5, 0.5]
  let time = 0, activation = 0, activationTarget = 0.22, raf = 0, visible = false

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.8)
    canvas.width = mount.clientWidth * dpr
    canvas.height = mount.clientHeight * dpr
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.uniform2f(U('resolution'), canvas.width, canvas.height)
  }
  resize()
  const ro = new ResizeObserver(resize)
  ro.observe(mount)

  const setPointer = (e: PointerEvent) => {
    const r = host.getBoundingClientRect()
    target[0] = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
    target[1] = Math.min(1, Math.max(0, 1 - (e.clientY - r.top) / r.height))
    activationTarget = 1
  }
  const onLeave = () => { activationTarget = 0.22 }
  host.addEventListener('pointermove', setPointer)
  host.addEventListener('pointerenter', setPointer)
  host.addEventListener('pointerleave', onLeave)

  const draw = () => {
    time += 0.035
    activation += (activationTarget - activation) * 0.08
    // two shards alternate: B rises only after A drops to ~10%, then they swap
    const phase = (time * 0.055) % 2
    let a = 0, b = 0
    if (phase < 1) { a = 1 - Math.min(phase / 0.9, 1); b = phase <= 0.9 ? 0 : (phase - 0.9) / 0.1 }
    else { const p = phase - 1; b = 1 - Math.min(p / 0.9, 1); a = p <= 0.9 ? 0 : (p - 0.9) / 0.1 }
    trail[0][0] += (target[0] - trail[0][0]) * 0.16
    trail[0][1] += (target[1] - trail[0][1]) * 0.16
    for (let i = 1; i < trail.length; i++) {
      const k = Math.max(0.06, 0.14 - i * 0.012)
      trail[i][0] += (trail[i - 1][0] - trail[i][0]) * k
      trail[i][1] += (trail[i - 1][1] - trail[i][1]) * k
    }
    gl.uniform1f(U('time'), time)
    gl.uniform1f(U('activation'), activation)
    gl.uniform1fv(U('anchorStrengths'), [0.72 * a, 0.66 * b])
    gl.uniform2fv(U('points'), trail.flat())
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    raf = requestAnimationFrame(draw)
  }
  const start = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(draw) }
  const stop = () => { cancelAnimationFrame(raf); raf = 0 }

  // pause while the hero is off screen or the tab is hidden
  const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visible ? start() : stop() }, { threshold: 0.02 })
  io.observe(host)
  const onVisibility = () => (document.hidden ? stop() : start())
  document.addEventListener('visibilitychange', onVisibility)

  return () => {
    stop()
    io.disconnect()
    ro.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
    window.removeEventListener('themechange', applyPalette)
    host.removeEventListener('pointermove', setPointer)
    host.removeEventListener('pointerenter', setPointer)
    host.removeEventListener('pointerleave', onLeave)
    canvas.remove()
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}
