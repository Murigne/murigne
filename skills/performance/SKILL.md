# Performance Skill — Murigne Platform

## Purpose
This skill guides all agents on performance optimisation for Murigne.
A financial data platform that loads slowly loses institutional users
who are accustomed to Bloomberg Terminal speeds.

Target performance benchmarks:
- Bank profile page initial load: under 2 seconds on 4G
- Screener filter response: under 300ms
- Chart rendering: 60fps on 5 years of daily data
- Sector dashboard: under 1.5 seconds on 4G
- Time to Interactive (TTI): under 3 seconds on 4G

Core Web Vitals targets (measured by Vercel Analytics):
- LCP (Largest Contentful Paint): under 2.5 seconds
- CLS (Cumulative Layout Shift): under 0.1
- INP (Interaction to Next Paint): under 200ms

## Next.js Server Components Strategy

### The Golden Rule
Render on the server everything that does not need user interaction.
Only use client components for interactive elements.
Never mark an entire page as use client.

Server Components (no use client):
- Bank profile page layout and static sections
- CAMEL ratio tables
- Financial statement tables
- Sector dashboard aggregate cards
- Bank universe table initial render
- All page layouts and navigation shell

Client Components (requires use client):
- Screener filter controls
- Stress test sliders
- Chart components (TradingView, ECharts)
- Interactive tabs
- Modal dialogs
- Any component using useState, useEffect, or browser APIs

### Component Boundary Pattern
Extract only the interactive part as a client component.
Pass server-fetched data down as props where possible.

// app/banks/[id]/page.tsx — Server Component
export default async function BankProfilePage({ params }) {
    const [bank, camelRatios, valuation] = await Promise.all([
        fetchBank(params.id),
        fetchCamelRatios(params.id),
        fetchValuation(params.id),
    ])

    return (
        <BankProfileLayout bank={bank}>
            <CamelRatioTable ratios={camelRatios} />    // Server Component
            <ValuationCharts bankId={params.id} />       // Client Component
        </BankProfileLayout>
    )
}

### Suspense and Streaming
Use Suspense boundaries to stream slow data independently.
Never block the entire page on the slowest data source.
Wrap independently loaded sections in Suspense with skeleton fallbacks.

// app/banks/[id]/page.tsx
import { Suspense } from 'react'
import { CamelRatioSkeleton } from '@/components/ui/skeletons'

export default async function BankProfilePage({ params }) {
    // Fast data — fetch immediately, no Suspense needed
    const bank = await fetchBank(params.id)

    return (
        <BankProfileLayout bank={bank}>
            {/* CAMEL ratios may be slow — stream independently */}
            <Suspense fallback={<CamelRatioSkeleton />}>
                <CamelRatioSection bankId={params.id} />
            </Suspense>
            {/* Valuation is client-side — loads after hydration */}
            <ValuationCharts bankId={params.id} />
        </BankProfileLayout>
    )
}

// CamelRatioSection is an async Server Component — fetches its own data
async function CamelRatioSection({ bankId }: { bankId: string }) {
    const ratios = await fetchCamelRatios(bankId)
    return <CamelRatioTable ratios={ratios} />
}

## Data Fetching Strategy

### Server-Side Data Fetching — App Router Pattern
Use route segment config for page-level revalidation.
Use unstable_cache for granular function-level caching.
The fetch() next.revalidate option also works but route segment
config is the idiomatic Next.js 15 App Router approach.

// Route segment revalidation — add to the page file
export const revalidate = 3600  // revalidate bank profile every hour

// For granular control — unstable_cache per data type
import { unstable_cache } from 'next/cache'

export const getCachedCamelRatios = unstable_cache(
    async (bankId: string) => fetchCamelRatios(bankId),
    ['camel-ratios'],
    { revalidate: 3600, tags: [`bank-${bankId}`] }
)

// Revalidation by data type:
// Bank profile metadata: revalidate = 3600 (1 hour)
// CAMEL ratios: revalidate = 86400 (24 hours — updated at most daily)
// Sector dashboard: revalidate = 900 (15 minutes)
// Macro data: revalidate = 21600 (6 hours)
// Admin data entry pages: export const dynamic = 'force-dynamic'

### Client-Side Data Fetching — TanStack Query
For Client Components, always use TanStack Query.
Never use useEffect + fetch directly.

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,       // 5 minutes default
            gcTime: 30 * 60 * 1000,          // 30 minutes in-memory cache
            retry: 2,
            // Do not disable refetchOnWindowFocus globally —
            // market prices and macro data benefit from it.
            // Override per-query for historical financial data:
            // { staleTime: 60 * 60 * 1000, refetchOnWindowFocus: false }
        },
    },
})

Stale times by data type:
- CAMEL ratios: 60 minutes, refetchOnWindowFocus: false
- Market prices: 15 minutes, refetchOnWindowFocus: true
- Sector aggregates: 30 minutes, refetchOnWindowFocus: false
- Macro data: 60 minutes, refetchOnWindowFocus: true
- Screener results: 2 minutes
- Valuation outputs: 30 minutes, refetchOnWindowFocus: false

### Parallel Data Fetching
Always fetch independent data in parallel.
Never chain sequential awaits for independent requests.

// Wrong — sequential, slow
const bank = await fetchBank(id)
const ratios = await fetchCamelRatios(id)
const valuation = await fetchValuation(id)

// Correct — parallel, fast
const [bank, ratios, valuation] = await Promise.all([
    fetchBank(id),
    fetchCamelRatios(id),
    fetchValuation(id),
])

## Charting Performance

### TradingView Lightweight Charts
Always set autoSize: true — never fixed pixel dimensions.
Always use the lightweight series API.
Use a CSS class for height — never inline style with fixed pixels.
Dispose the chart instance on component unmount.

import { createChart, IChartApi } from 'lightweight-charts'
import { useEffect, useRef } from 'react'

export function NimTrendChart({ data }: { data: LineData[] }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const chartRef = useRef<IChartApi | null>(null)

    useEffect(() => {
        if (!containerRef.current) return
        chartRef.current = createChart(containerRef.current, {
            autoSize: true,
            layout: {
                background: { color: 'transparent' },
                textColor: getComputedStyle(document.documentElement)
                    .getPropertyValue('--murigne-slate').trim(),
            },
        })
        const series = chartRef.current.addLineSeries({
            color: getComputedStyle(document.documentElement)
                .getPropertyValue('--murigne-navy').trim(),
        })
        series.setData(data)
        chartRef.current.timeScale().fitContent()

        return () => chartRef.current?.remove()
    }, [data])

    // Use CSS class for height — never inline fixed pixels
    // Define h-[300px] or a named class in globals.css
    return <div ref={containerRef} className="w-full h-[300px]" />
}

### Apache ECharts
Always use canvas renderer.
Always use the murigne theme — never null or default theme.
See skills/frontend-design/SKILL.md for theme import pattern.
Use CSS class for container height — never inline style with fixed pixels.
Always handle resize with ResizeObserver.
Always dispose on unmount.
Always use tree-shakeable imports — never import * as echarts from 'echarts'.

import * as echarts from 'echarts/core'
import { RadarChart } from 'echarts/charts'
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    RadarComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { murigne } from '@/lib/echarts-theme'

echarts.use([RadarChart, TitleComponent, TooltipComponent,
             LegendComponent, RadarComponent, CanvasRenderer])
echarts.registerTheme('murigne', murigne)

export function CamelRadarChart({ scores }: { scores: CamelScores }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const chartRef = useRef<echarts.ECharts | null>(null)

    useEffect(() => {
        if (!containerRef.current) return

        chartRef.current = echarts.init(
            containerRef.current,
            'murigne',           // always pass the murigne theme
            { renderer: 'canvas' }
        )
        chartRef.current.setOption(buildRadarOption(scores))

        const observer = new ResizeObserver(() => chartRef.current?.resize())
        observer.observe(containerRef.current)

        return () => {
            observer.disconnect()
            chartRef.current?.dispose()
        }
    }, [scores])

    // Use CSS class for height — never inline style with fixed pixels
    return <div ref={containerRef} className="w-full h-[400px]" />
}

## TanStack Table Virtualisation

Always use row virtualisation for tables with more than 20 rows.
Never render all rows to the DOM — only render visible rows.

import { useVirtualizer } from '@tanstack/react-virtual'

export function BankScreenerTable({ data }: { data: BankRow[] }) {
    const parentRef = useRef<HTMLDivElement>(null)
    const rowVirtualizer = useVirtualizer({
        count: data.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 48,
        overscan: 5,
    })

    return (
        <div ref={parentRef} className="h-[600px] overflow-auto">
            <div style={{ height: rowVirtualizer.getTotalSize() }}
                 className="relative">
                {rowVirtualizer.getVirtualItems().map(virtualRow => (
                    <div
                        key={virtualRow.index}
                        style={{
                            position: 'absolute',
                            top: 0,
                            transform: `translateY(${virtualRow.start}px)`,
                            height: `${virtualRow.size}px`,
                        }}
                        className="w-full"
                    >
                        <BankRow bank={data[virtualRow.index]} />
                    </div>
                ))}
            </div>
        </div>
    )
}

## Zustand State Management

Never use React Context for global state — use Zustand.
Context re-renders every consumer on any state change.
Zustand subscriptions are fine-grained — only components that
read the changed slice re-render.

// stores/screener-store.ts
import { create } from 'zustand'

interface ScreenerFilters {
    nplMax: number | null
    roeMin: number | null
    carMin: number | null
    camelScoreMax: number | null
}

interface ScreenerStore {
    filters: ScreenerFilters
    setFilter: (key: keyof ScreenerFilters, value: number | null) => void
    clearFilters: () => void
}

const defaultFilters: ScreenerFilters = {
    nplMax: null, roeMin: null, carMin: null, camelScoreMax: null,
}

export const useScreenerStore = create<ScreenerStore>((set) => ({
    filters: defaultFilters,
    setFilter: (key, value) =>
        set((state) => ({ filters: { ...state.filters, [key]: value } })),
    clearFilters: () => set({ filters: defaultFilters }),
}))

// In a component — subscribes only to nplMax, not the full filters object
const nplMax = useScreenerStore((state) => state.filters.nplMax)

## Image Optimisation
Always use Next.js Image component — never plain img tags.
Always provide width and height to prevent layout shift (CLS).
Use priority prop on above-the-fold images (bank logos in profile header).
Use lazy loading (default) for below-the-fold images.

## Bundle Size Rules
Never import an entire library when only one function is needed.
Always use tree-shakeable imports.

// Wrong — imports entire lodash
import _ from 'lodash'

// Correct — imports only sortBy
import sortBy from 'lodash/sortBy'

// Wrong — imports all of ECharts (900kb+)
import * as echarts from 'echarts'

// Correct — imports only what is used (see ECharts section above)
import * as echarts from 'echarts/core'
import { RadarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
echarts.use([RadarChart, CanvasRenderer])

// Lucide — always named imports (already tree-shakeable)
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'

## Backend Performance

### PostgreSQL Query Optimisation
Run EXPLAIN ANALYZE on all new queries before shipping.
Ensure all WHERE clause columns have indexes.
All list endpoints must use pagination — never return unbounded result sets.
Maximum page size: 100 rows.
Use the PaginatedResponse schema from skills/backend-api/SKILL.md.

### Redis Caching
Cache all computed ratio sets after first computation.
Cache-aside pattern: check cache → compute on miss → store result with TTL.
Always set TTL on every cache key — never store without expiry.
See skills/backend-api/SKILL.md for TTL values per data type.

### FastAPI Response Optimisation
Use response_model_exclude_none=True on all endpoints to exclude null fields.
Use BackgroundTasks for non-critical post-response work
(e.g. cache warm-up after admin data entry).
Use StreamingResponse for large data exports.

## Performance Checklist (complete before every bead is marked done)
- [ ] No entire page marked as use client
- [ ] Independent slow data sources wrapped in Suspense with skeleton fallback
- [ ] Parallel Promise.all used for independent server-side fetches
- [ ] TanStack Query used for all client-side data fetching
- [ ] Stale times set per data type (not global default)
- [ ] TradingView charts use autoSize: true and CSS class height
- [ ] ECharts uses murigne theme, canvas renderer, ResizeObserver, and disposes on unmount
- [ ] ECharts uses tree-shakeable imports only
- [ ] Tables with more than 20 rows use TanStack row virtualisation
- [ ] No React Context used for global state — Zustand only
- [ ] All images use Next.js Image component with width and height
- [ ] No full library imports where tree-shakeable imports exist
- [ ] EXPLAIN ANALYZE run on all new PostgreSQL queries
- [ ] All list endpoints paginated with max 100 rows
- [ ] Core Web Vitals verified: LCP < 2.5s, CLS < 0.1, INP < 200ms
