import React, { useRef, useEffect } from 'react';
import rough from 'roughjs';
import { cn } from '../lib/utils';

interface RoughCardProps {
  children: React.ReactNode;
  className?: string;
  color?: string;       // 填充颜色
  stroke?: string;      // 边框颜色
  roughness?: number;   // 粗糙度 (PDF建议 1.5-2.5) [cite: 74]
  bowing?: number;      // 弯曲度
  fillStyle?: 'hachure' | 'solid' | 'zigzag' | 'cross-hatch' | 'dots'; // 填充样式
}

export const RoughCard = ({ 
  children, 
  className, 
  color = '#FFF0F5',   // 默认淡粉
  stroke = '#4B5B76',  // 默认深灰蓝描边
  roughness = 2.5,
  bowing = 1.5,
  fillStyle = 'hachure' 
}: RoughCardProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (svgRef.current && containerRef.current) {
      const svg = svgRef.current;
      const rc = rough.svg(svg);
      
      // 清除旧的绘制
      while (svg.lastChild) {
        svg.removeChild(svg.lastChild);
      }

      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;

      // 调整 SVG 大小
      svg.setAttribute('width', width.toString());
      svg.setAttribute('height', height.toString());

      // 绘制手绘矩形 [cite: 133]
      const node = rc.rectangle(4, 4, width - 8, height - 8, {
        roughness: roughness,
        bowing: bowing,
        stroke: stroke,
        strokeWidth: 2,
        fill: color,
        fillStyle: fillStyle, 
        fillWeight: 1,      // 填充密度
        hachureGap: 6,      // 排线间距
      });

      svg.appendChild(node);
    }
  }, [color, stroke, roughness, bowing, fillStyle, children]); 
  // 注意：children 变化可能导致高度变化，需要重绘

  return (
    <div ref={containerRef} className={cn("relative p-6", className)}>
      {/* 背景层：手绘 SVG */}
      <svg 
        ref={svgRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        style={{ overflow: 'visible' }} 
      />
      
      {/* 内容层 */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};