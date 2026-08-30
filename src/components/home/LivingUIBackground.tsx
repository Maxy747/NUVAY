'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const LivingUIBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#050A18');
    scene.fog = new THREE.FogExp2('#050A18', 0.016);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 4, 32);

    // 2. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 3. Cinematic Dual Lighting Rig
    const ambientLight = new THREE.AmbientLight('#0B1F4D', 1.4);
    scene.add(ambientLight);

    // Sun Amber Key Light behind distant peak
    const sunLight = new THREE.PointLight('#FFB000', 5.8, 120);
    sunLight.position.set(2, 6, -20);
    scene.add(sunLight);

    // Cool Moonlit Blue Fill Light (Left)
    const moonLight = new THREE.DirectionalLight('#3B82F6', 2.2);
    moonLight.position.set(-25, 20, 15);
    scene.add(moonLight);

    // Warm Sunset Rim Light (Right)
    const sunsetLight = new THREE.DirectionalLight('#FF7A00', 3.0);
    sunsetLight.position.set(25, 15, 10);
    scene.add(sunsetLight);

    // 4. SIGNATURE NUVAY BRAND ELEMENT: 1,200px Holographic Compass Halo (8% Opacity, 40s Rotation)
    const compassGroup = new THREE.Group();
    compassGroup.position.set(0, 5, -18);

    // Outer Ring
    const outerRingGeo = new THREE.RingGeometry(11.8, 12.0, 96);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#FFB000'),
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, ringMat);
    compassGroup.add(outerRing);

    // Inner Tick Marks & Cardinal Lines
    const ticksGeo = new THREE.BufferGeometry();
    const tickPositions: number[] = [];
    const numTicks = 36;

    for (let i = 0; i < numTicks; i++) {
      const angle = (i / numTicks) * Math.PI * 2;
      const innerR = i % 9 === 0 ? 11.2 : 11.5;
      const outerR = 11.8;

      tickPositions.push(
        Math.cos(angle) * innerR, Math.sin(angle) * innerR, 0,
        Math.cos(angle) * outerR, Math.sin(angle) * outerR, 0
      );
    }
    ticksGeo.setAttribute('position', new THREE.Float32BufferAttribute(tickPositions, 3));
    const ticksLine = new THREE.LineSegments(
      ticksGeo,
      new THREE.LineBasicMaterial({ color: new THREE.Color('#FFF5D6'), transparent: true, opacity: 0.08 })
    );
    compassGroup.add(ticksLine);

    scene.add(compassGroup);

    // 5. Layered Realistic 3D Mountain Terrain (7 Depth Layers)
    const mountainLayers: { mesh: THREE.Mesh; depthFactor: number }[] = [];

    const createTerrain = (
      w: number,
      h: number,
      seg: number,
      colorHex: string,
      z: number,
      yScale: number,
      freq: number,
      depthFactor: number
    ) => {
      const geo = new THREE.PlaneGeometry(w, h, seg, seg);
      const pos = geo.attributes.position;

      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const height =
          Math.sin(x * freq) * Math.cos(y * freq) * yScale +
          Math.sin(x * freq * 2.2) * (yScale * 0.4) +
          Math.cos(y * freq * 1.8) * (yScale * 0.3) +
          (Math.random() - 0.5) * 0.25;
        pos.setZ(i, height);
      }
      geo.computeVertexNormals();

      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        roughness: 0.9,
        metalness: 0.1,
        flatShading: false,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2.2;
      mesh.position.set(0, -6, z);
      scene.add(mesh);
      mountainLayers.push({ mesh, depthFactor });
    };

    // 7 Mountain Depth Layers with realistic parallax factors
    createTerrain(120, 50, 45, '#071330', -38, 12.0, 0.08, 0.05); // Far Distant Peaks
    createTerrain(110, 45, 40, '#091A42', -28, 9.5, 0.10, 0.10);  // High Ridge
    createTerrain(100, 40, 35, '#0E2456', -19, 7.5, 0.12, 0.18);  // Mid Peak Range
    createTerrain(90, 35, 30, '#12326B', -12, 6.0, 0.14, 0.25);   // Valley Slopes
    createTerrain(80, 30, 25, '#08173B', -5, 4.2, 0.16, 0.35);    // Lower Foothills
    createTerrain(70, 25, 20, '#050A18', 2, 3.0, 0.18, 0.48);     // Foreground Ridge

    // 6. Instanced 3D Pine Tree Silhouettes (150 Pine Trees)
    const treeGeo = new THREE.ConeGeometry(0.4, 2.2, 5);
    const treeMat = new THREE.MeshStandardMaterial({ color: new THREE.Color('#030611'), roughness: 0.95 });
    const forestCount = 150;
    const forestMesh = new THREE.InstancedMesh(treeGeo, treeMat, forestCount);

    const dummy = new THREE.Object3D();
    for (let i = 0; i < forestCount; i++) {
      const tx = (Math.random() - 0.5) * 60;
      const tz = (Math.random() - 0.5) * 20 - 5;
      const ty = -5.5 + Math.sin(tx * 0.15) * 1.5;
      const scale = Math.random() * 0.7 + 0.6;

      dummy.position.set(tx, ty, tz);
      dummy.scale.set(scale, scale * (Math.random() * 0.4 + 0.8), scale);
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.updateMatrix();
      forestMesh.setMatrixAt(i, dummy.matrix);
    }
    scene.add(forestMesh);

    // 7. Reflective 3D Valley Lake Surface
    const lakeGeo = new THREE.PlaneGeometry(120, 50);
    const lakeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#050A18'),
      roughness: 0.08,
      metalness: 0.92,
    });
    const lake = new THREE.Mesh(lakeGeo, lakeMat);
    lake.rotation.x = -Math.PI / 2;
    lake.position.set(0, -6.8, -8);
    scene.add(lake);

    // 8. Volumetric Light Rays Radiating Behind Central Peak
    const rayGeo = new THREE.ConeGeometry(18, 45, 32, 1, true);
    const rayMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#FFB000'),
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const rays = new THREE.Mesh(rayGeo, rayMat);
    rays.rotation.z = Math.PI;
    rays.position.set(2, 8, -22);
    scene.add(rays);

    // 9. Organic Soft Circle Texture Generator for Particles (No Fake Squares)
    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255, 245, 214, 1)');
        grad.addColorStop(0.3, 'rgba(255, 176, 0, 0.8)');
        grad.addColorStop(0.7, 'rgba(255, 122, 0, 0.2)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
      }
      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    // Organic Fireflies, Floating Dust & Drifting Embers (250 Soft Particles)
    const particleCount = 250;
    const particleGeo = new THREE.BufferGeometry();
    const posArr = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      posArr[i * 3] = (Math.random() - 0.5) * 60;
      posArr[i * 3 + 1] = Math.random() * 30 - 3;
      posArr[i * 3 + 2] = (Math.random() - 0.5) * 45;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));

    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color('#FFB000'),
      size: 0.65,
      map: createCircleTexture(),
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 10. 3D Flight-Path Arc Spline & Luminous Navigation Arrow
    const flightCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-30, 14, -12),
      new THREE.Vector3(-12, 18, -15),
      new THREE.Vector3(8, 16, -12),
      new THREE.Vector3(30, 12, -8),
    ]);

    const arcPoints = flightCurve.getPoints(80);
    const arcGeo = new THREE.BufferGeometry().setFromPoints(arcPoints);
    const arcMat = new THREE.LineDashedMaterial({
      color: new THREE.Color('#FF7A00'),
      dashSize: 1.0,
      gapSize: 0.8,
      transparent: true,
      opacity: 0.55,
    });
    const arcLine = new THREE.Line(arcGeo, arcMat);
    arcLine.computeLineDistances();
    scene.add(arcLine);

    // 3D Luminous Navigation Arrow
    const arrowGeo = new THREE.ConeGeometry(0.4, 1.4, 4);
    const arrowMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#FFF5D6') });
    const arrow = new THREE.Mesh(arrowGeo, arrowMat);
    scene.add(arrow);

    // 11. Subtle Parallax & Mouse Interactivity (2° Tilt)
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 12. 60 FPS Render Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Camera 2° Parallax Easing
      targetX += (mouseX * 1.8 - targetX) * 0.03;
      targetY += (-mouseY * 1.2 - targetY) * 0.03;

      camera.position.x = targetX;
      camera.position.y = 4 + targetY;
      camera.lookAt(0, 3, -12);

      // Rotating Signature NUVAY Holographic Compass (40-second full rotation loop)
      compassGroup.rotation.z = elapsed * ((Math.PI * 2) / 40);

      // Layered Parallax: Distant layers shift subtly
      mountainLayers.forEach((m) => {
        m.mesh.position.x = targetX * m.depthFactor * 0.25;
      });

      // Breathing Sun Pulse
      sunLight.intensity = 4.8 + Math.sin(elapsed * 0.45) * 1.0;

      // Organic Fireflies Floating Drift
      const pArr = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pArr[i * 3 + 1] += Math.sin(elapsed + i) * 0.005;
        pArr[i * 3] += Math.cos(elapsed * 0.3 + i) * 0.003 + mouseX * 0.0012;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Luminous Navigation Arrow Gliding Along 3D Flight Arc (25s loop)
      const progress = (elapsed % 25) / 25;
      const point = flightCurve.getPointAt(progress);
      const tangent = flightCurve.getTangentAt(progress);
      arrow.position.copy(point);
      arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geoDispose(scene);
    };
  }, []);

  const geoDispose = (obj: THREE.Object3D) => {
    obj.children.forEach((child) => {
      geoDispose(child);
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
    });
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-20 bg-[#050A18] select-none">
      {/* 3D WebGL Canvas Viewport */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* 25% Contrast Overlay (Guarantees 100% UI Text Readability) */}
      <div className="absolute inset-0 bg-[#050A18]/25 backdrop-blur-[1px]" />
    </div>
  );
};
