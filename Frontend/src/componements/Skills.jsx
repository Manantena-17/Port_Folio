// src/components/Skills.jsx — Tailwind
import React, { useEffect, useRef, useState, memo, useMemo } from 'react';

const DEFAULT_SKILLS = [
  { name: 'React',       level: 90, color: '#61dafb', icon: '⚛️' },
  { name: 'JavaScript',  level: 85, color: '#f7df1e', icon: '🟨' },
  { name: 'HTML/CSS',    level: 95, color: '#e34f26', icon: '🎨' },
  { name: 'Node.js',     level: 75, color: '#68a063', icon: '🟢' },
  { name: 'MongoDB',     level: 70, color: '#47a248', icon: '🍃' },
  { name: 'Git',         level: 80, color: '#f05033', icon: '🔧' },
];

function useInView(options = { threshold: 0.2 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true);
        obs.unobserve(e.target);
      }
    }, options);
    obs.observe(el);
    return () => obs.disconnect();
  }, [options]);
  return [ref, inView];
}

function SkillBar({ name, level, color, icon, animate, index }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (!animate) return;
    const duration = 1500;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayed(Math.round(eased * level));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animate, level]);

  return (
    <li
      className="animate-[fadeIn_0.5s_ease_both]"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="inline-flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 text-sm">
          {icon && <span aria-hidden="true">{icon}</span>}
          {name}
        </span>
        <span
          className="text-sm font-bold tabular-nums transition-colors"
          style={{ color }}
        >
          {displayed}%
        </span>
      </div>

      <div
        role="progressbar"
        aria-label={`Niveau en ${name}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={animate ? level : 0}
        className="relative h-3 rounded-full overflow-hidden
                   bg-slate-200 dark:bg-slate-700
                   shadow-inner"
      >
        <div
          className="h-full rounded-full transition-[width] duration-[1400ms]
                     ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            width: animate ? `${level}%` : '0%',
            background: `linear-gradient(90deg, ${color}cc, ${color})`,
            boxShadow: `0 0 12px ${color}80`,
            transitionDelay: `${index * 90}ms`,
          }}
        />
      </div>
    </li>
  );
}

function Skills({ skills = DEFAULT_SKILLS, title = 'Mes Compétences' }) {
  const [ref, inView] = useInView();
  const average = useMemo(
    () => (skills.length ? Math.round(skills.reduce((s, k) => s + k.level, 0) / skills.length) : 0),
    [skills]
  );

  return (
    <section
      ref={ref}
      aria-labelledby="skills-title"
      className="max-w-2xl mx-auto my-8 p-8 rounded-2xl
                 bg-white dark:bg-slate-800
                 shadow-md"
    >
      <header className="text-center mb-8">
        <h2
          id="skills-title"
          className="text-3xl font-extrabold tracking-tight
                     text-slate-900 dark:text-slate-100 mb-2"
        >
          {title}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Niveau moyen :{' '}
          <strong className="text-amber-500 font-extrabold">
            {inView ? average : 0}%
          </strong>
        </p>
      </header>

      <ul className="grid gap-6">
        {skills.map((skill, i) => (
          <SkillBar key={skill.name} {...skill} index={i} animate={inView} />
        ))}
      </ul>
    </section>
  );
}

export default memo(Skills);