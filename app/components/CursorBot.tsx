'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface CursorBotProps {
  className?: string;
}

export function CursorBot({ className = '' }: CursorBotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const botRef = useRef<THREE.Group | null>(null);
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const botPositionRef = useRef({ x: 0, y: 0 });
  const targetPositionRef = useRef({ x: 0, y: 0 });
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create bot group
    const bot = new THREE.Group();
    scene.add(bot);
    botRef.current = bot;

    // Bot body (grey)
    const bodyGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.6);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x606060,
      metalness: 0.3,
      roughness: 0.6,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = -0.15;
    body.castShadow = true;
    body.receiveShadow = true;
    bot.add(body);

    // Bot head (white)
    const headGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({
      color: 0xf0f0f0,
      metalness: 0.1,
      roughness: 0.5,
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 0.95;
    head.castShadow = true;
    head.receiveShadow = true;
    bot.add(head);

    // Left eye (orange)
    const eyeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0xff8c00,
      emissive: 0xff8c00,
      emissiveIntensity: 0.2,
    });
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.15, 1.3, 0.45);
    leftEye.castShadow = true;
    bot.add(leftEye);

    // Right eye (orange)
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.15, 1.3, 0.45);
    rightEye.castShadow = true;
    bot.add(rightEye);

    // Left pupil (black)
    const pupilGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftPupil.position.set(-0.15, 1.3, 0.62);
    bot.add(leftPupil);

    // Right pupil (black)
    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    rightPupil.position.set(0.15, 1.3, 0.62);
    bot.add(rightPupil);

    // Bot base (dark grey)
    const baseGeometry = new THREE.BoxGeometry(1.4, 0.15, 0.9);
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a3a3a,
      metalness: 0.4,
      roughness: 0.7,
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -1;
    base.castShadow = true;
    base.receiveShadow = true;
    bot.add(base);

    // Mouse tracking
    const onMouseMove = (event: MouseEvent) => {
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      const normalizedX = (x - 0.5) * 2;
      const normalizedY = -(y - 0.5) * 2;

      targetRotationRef.current.y = normalizedX * Math.PI * 0.25;
      targetRotationRef.current.x = normalizedY * Math.PI * 0.15;

      targetPositionRef.current.x = normalizedX * 1.2;
      targetPositionRef.current.y = normalizedY * 0.8;
    };

    // Handle resize
    const onResize = () => {
      if (!container || !camera || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      if (bot) {
        bot.rotation.y += (targetRotationRef.current.y - bot.rotation.y) * 0.1;
        bot.rotation.x += (targetRotationRef.current.x - bot.rotation.x) * 0.1;

        botPositionRef.current.x += (targetPositionRef.current.x - botPositionRef.current.x) * 0.08;
        botPositionRef.current.y += (targetPositionRef.current.y - botPositionRef.current.y) * 0.08;

        bot.position.x = botPositionRef.current.x;
        bot.position.y = botPositionRef.current.y;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className={className} style={{ width: '100%', height: '100%' }} />;
}
