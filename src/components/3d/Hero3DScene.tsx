import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Hero3DScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 12;

    // Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return; // Fallback to CSS background if WebGL unavailable
    }

    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x4285f4, 2);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xea4335, 1.5);
    dirLight2.position.set(-5, -5, -2);
    scene.add(dirLight2);

    const dirLight3 = new THREE.DirectionalLight(0xfbbc05, 1.2);
    dirLight3.position.set(0, 5, -5);
    scene.add(dirLight3);

    // Main Group
    const group = new THREE.Group();
    scene.add(group);

    // 1. Central Golden Core Octahedron
    const coreGeo = new THREE.OctahedronGeometry(1.8, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xfbbc05,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    group.add(coreMesh);

    // 2. Wireframe Overlay Outer Diamond
    const outerWireGeo = new THREE.IcosahedronGeometry(2.6, 1);
    const outerWireMat = new THREE.MeshBasicMaterial({
      color: 0x4285f4,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const outerWireMesh = new THREE.Mesh(outerWireGeo, outerWireMat);
    group.add(outerWireMesh);

    // 3. Torus Orbit Rings
    const ring1Geo = new THREE.TorusGeometry(3.5, 0.04, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x34a853,
      metalness: 0.9,
      roughness: 0.1,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    group.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(4.2, 0.03, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xea4335,
      metalness: 0.9,
      roughness: 0.1,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    group.add(ring2);

    // 4. Floating Google DevFest Color Spheres & Cubes
    const floatingItems: THREE.Mesh[] = [];
    const colors = [0x4285f4, 0xea4335, 0xfbbc05, 0x34a853, 0xa855f7];

    for (let i = 0; i < 20; i++) {
      const isSphere = i % 2 === 0;
      const geo = isSphere 
        ? new THREE.SphereGeometry(0.2 + Math.random() * 0.2, 16, 16)
        : new THREE.BoxGeometry(0.3, 0.3, 0.3);

      const mat = new THREE.MeshStandardMaterial({
        color: colors[i % colors.length],
        metalness: 0.5,
        roughness: 0.3,
      });

      const mesh = new THREE.Mesh(geo, mat);
      const angle = (i / 20) * Math.PI * 2;
      const radius = 4.5 + Math.random() * 2.5;

      mesh.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 4,
        Math.sin(angle) * radius
      );

      group.add(mesh);
      floatingItems.push(mesh);
    }

    // Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (e.clientX - windowHalfX) / 100;
      mouseY = (e.clientY - windowHalfY) / 100;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Core rotation
      coreMesh.rotation.y = elapsedTime * 0.4;
      coreMesh.rotation.x = elapsedTime * 0.2;

      outerWireMesh.rotation.y = -elapsedTime * 0.2;
      outerWireMesh.rotation.z = elapsedTime * 0.15;

      ring1.rotation.z = elapsedTime * 0.3;
      ring2.rotation.x = elapsedTime * 0.25;

      // Floating items animation
      floatingItems.forEach((item, idx) => {
        item.position.y += Math.sin(elapsedTime * 2 + idx) * 0.003;
        item.rotation.x += 0.01;
        item.rotation.y += 0.01;
      });

      // Smooth camera tilt follow mouse
      group.rotation.y += (mouseX * 0.2 - group.rotation.y) * 0.05;
      group.rotation.x += (-mouseY * 0.2 - group.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[450px] md:h-[550px] flex items-center justify-center overflow-hidden">
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />
      {/* Decorative ambient overlays */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-google-blue/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-60 h-60 bg-google-red/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-google-yellow/20 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};
