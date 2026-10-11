import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

// One shared entrance so every section moves with the same timing.
export function Reveal({
  children,
  delay = 0,
  className,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'li' | 'section' | 'article'
}) {
  const reduce = useReducedMotion()
  const Tag = motion[as]
  if (reduce) return <Tag className={className}>{children}</Tag>
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  )
}

export function SectionHead({ id, kicker, title, intro }: { id?: string; kicker: string; title: string; intro?: string }) {
  return (
    <div className="mb-12 grid gap-6 md:mb-16 md:grid-cols-12">
      <Reveal className="md:col-span-4">
        <p className="flex items-center gap-3 text-sm text-faint">
          <span className="h-px w-8 bg-line-2" aria-hidden="true" />
          {kicker}
        </p>
      </Reveal>
      <div className="md:col-span-8">
        <Reveal>
          <h2 id={id} className="font-display text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-balance">
            {title}
          </h2>
        </Reveal>
        {intro && (
          <Reveal delay={0.08}>
            <p className="mt-5 max-w-2xl text-lg text-dim text-pretty">{intro}</p>
          </Reveal>
        )}
      </div>
    </div>
  )
}
