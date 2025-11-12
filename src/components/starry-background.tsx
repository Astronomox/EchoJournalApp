"use client";

import React, { useRef, useEffect } from 'react';
import { useTheme } from '@/components/providers';

const StarryBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let stars: any[] = [];
    const numStars = 150;
    let mouse = { x: width / 2, y: height / 2 };

    class Star {
      x: number;
      y: number;
      z: number;
      x_proj: number;
      y_proj: number;
      radius: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * width - width / 2;
        this.y = Math.random() * height - height / 2;
        this.z = Math.random() * width;
        this.x_proj = 0;
        this.y_proj = 0;
        this.radius = 0;
        this.opacity = 0;
      }

      project() {
        const factor = width / this.z;
        this.x_proj = this.x * factor + width / 2;
        this.y_proj = this.y * factor + height / 2;
        this.radius = factor * 1.5;
        this.opacity = 1 - (this.z / width);
      }

      draw(context: CanvasRenderingContext2D) {
        this.project();
        if (this.x_proj > 0 && this.x_proj < width && this.y_proj > 0 && this.y_proj < height) {
          context.beginPath();
          const twinkle = Math.random() > 0.995;
          const starColor = theme.startsWith('theme-dark') || theme === 'dark' || theme === 'theme-neon' ? `255, 255, 255` : `0, 0, 0`;
          context.fillStyle = `rgba(${starColor}, ${twinkle ? this.opacity * (Math.random() * 0.5 + 0.5) : this.opacity})`;
          context.arc(this.x_proj, this.y_proj, this.radius, 0, 2 * Math.PI);
          context.fill();
        }
      }

      update() {
        this.z -= 0.2;
        if (this.z < 1) {
          this.z = width;
          this.x = Math.random() * width - width / 2;
          this.y = Math.random() * height - height / 2;
        }
      }
    }

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
      
      constructor(x:number, y:number) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.life = 1;
        this.color = `hsla(${Math.random() * 360}, 100%, 70%, ${this.life})`;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.02;
      }

      draw(context: CanvasRenderingContext2D) {
        context.fillStyle = `hsla(${Math.random() * 360}, 100%, 70%, ${this.life})`;
        context.beginPath();
        context.arc(this.x, this.y, 2, 0, Math.PI * 2);
        context.fill();
      }
    }

    let particles: Particle[] = [];

    function createBurst(x: number, y: number) {
      for(let i=0; i<30; i++) {
        particles.push(new Particle(x, y));
      }
    }


    function init() {
      for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
      }
    }

    function animate() {
      ctx!.clearRect(0, 0, width, height);

      // Parallax effect
      const centerX = width / 2;
      const centerY = height / 2;
      const moveX = (mouse.x - centerX) * 0.005;
      const moveY = (mouse.y - centerY) * 0.005;

      ctx!.save();
      ctx!.translate(moveX, moveY);

      stars.forEach(star => {
        star.update();
        star.draw(ctx!);
      });

      ctx!.restore();

      particles.forEach((p, index) => {
        p.update();
        p.draw(ctx!);
        if(p.life <= 0) {
          particles.splice(index, 1);
        }
      });


      requestAnimationFrame(animate);
    }

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width;
      canvas!.height = height;
      stars = [];
      init();
    }
    
    function handleMouseMove(e: MouseEvent) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }
    
    function handleClick(e: MouseEvent) {
        createBurst(e.clientX, e.clientY);
    }

    init();
    animate();

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      aria-hidden="true"
    />
  );
};

export default StarryBackground;
