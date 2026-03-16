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

## Next.js Server Components Strategy

### The Golden Rule
Render on the server everything that does not need user interaction.
Only use client components for interactive elements.

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
Never mark an entire page as use client.
Extract only the interactive part as a client component.

// app/banks/[id]/page.tsx — Server Component (no use client)
export default async function BankProfilePage({ params }) {
    const bank = await fetchBank(params.id)
    const camelRatios = await fetchCamelRatios(params.id)

    return (
        <BankProfileLayout bank={bank}>
            <CamelRatioTable ratios={camelRatios} />  // Server Component
            <ValuationCharts bankId={params.id} />     // Client Component
        </BankProfileLayout>
    )
}

// components/charts/ValuationCharts.tsx — Client Component
'use client'
import { useQuery } from '@tanstack/react-query'

export function ValuationCharts({ bankId }) {
    const { data } = useQuery({
        queryKey: ['valuation', bankId],
        queryFn: () => fetchValuation(bankId),
    })
    // render TradingView or ECharts here
}

## Data Fetching Strategy

### Server-Side Data Fetching
For Server Components, fetch data directly in the component.
Use Next.js fetch with revalidation for pages that change infrequently.

// Revalidate bank profile every hour
const bank = await fetch(`${API_URL}/banks/${id}`, {
    next: { revalidate: 3600 }
})

// Revalidate sector dashboard every 15 minutes
const sector = await fetch(`${API_URL}/sector`, {
    next: { revalidate: 900 }
})

// No cache for admin data entry pages
const data = await fetch(`${API_URL}/admin/data`, {
    cache: 'no-store'
})

### Client-Side Data Fetching — TanStack Query
For Client Components, always use TanStack Query.
Never use useEffect + fetch directly.

Configure stale times to match data update frequency:
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,      // 5 minutes default
            gcTime: 30 * 60 * 1000,         // 30 minutes cache
            retry: 2,
            refetchOnWindowFocus: false,     // financial data does not need live refetch
        },
    },
})

Stale times by data type:
- CAMEL ratios: 60 minutes (updated at most daily)
- Market prices: 15 minutes
- Sector aggregates: 30 minutes
- Macro data: 60 minutes
- Screener results: 2 minutes (filters change frequently)
- Valuation outputs: 30 minutes

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
Always use the lightweight series API — never load the full TradingView library.
Dispose the chart instance on component unmount to prevent memory leaks.

import { createChart, IChartApi } from 'lightweight-charts'
import { useEffect, useRef } from 'react'

export function NimTrendChart({ data }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const chartRef = useRef<IChartApi | null>(null)

    useEffect(() => {
        if (!containerRef.current) return
        chartRef.current = createChart(containerRef.current, {
            autoSize: true,
            layout: {
                background: { color: 'transparent' },
                textColor: 'var(--murigne-slate)',
            },
        })
        const series = chartRef.current.addLineSeries({
            color: 'var(--murigne-navy)',
        })
        series.setData(data)
        chartRef.current.timeScale().fitContent()

        return () => {
            chartRef.current?.remove()
        }
    }, [data])

    return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />
}

### Apache ECharts
Always use canvas renderer — never SVG renderer.
Always handle resize with ResizeObserver — never window.onresize.
Always dispose the chart instance on unmount.

import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
echarts.use([CanvasRenderer])

export function CamelRadarChart({ scores }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const chartRef = useRef<echarts.ECharts | null>(null)

    useEffect(() => {
        if (!containerRef.current) return
        chartRef.current = echarts.init(containerRef.current, null, {
            renderer: 'canvas',
        })
        chartRef.current.setOption(buildRadarOption(scores))

        const observer = new ResizeObserver(() => {
            chartRef.current?.resize()
        })
        observer.observe(containerRef.current)

        return () => {
            observer.disconnect()
            chartRef.current?.dispose()
        }
    }, [scores])

    return <div ref={containerRef} style={{ width: '100%', height: '400px' }} />
}

## TanStack Table Virtualisation

Always use row virtualisation for tables with more than 20 rows.
Never render all rows to the DOM — only render visible rows.

import { useVirtualizer } from '@tanstack/react-virtual'

export function BankScreenerTable({ data }) {
    const parentRef = useRef<HTMLDivElement>(null)
    const rowVirtualizer = useVirtualizer({
        count: data.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 48,
        overscan: 5,
    })

    return (
        <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
            <div style={{ height: rowVirtualizer.getTotalSize() }}>
                {rowVirtualizer.getVirtualItems().map(virtualRow => (
                    <div
                        key={virtualRow.index}
                        style={{
                            position: 'absolute',
                            top: 0,
                            transform: `translateY(${virtualRow.start}px)`,
                            height: `${virtualRow.size}px`,
                        }}
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

export const useScreenerStore = create<ScreenerStore>((set) => ({
    filters: { nplMax: null, roeMin: null, carMin: null, camelScoreMax: null },
    setFilter: (key, value) =>
        set((state) => ({ filters: { ...state.filters, [key]: value } })),
    clearFilters: () =>
        set({ filters: { nplMax: null, roeMin: null, carMin: null, camelScoreMax: null } }),
}))

// In a component — only re-renders when nplMax changes
const nplMax = useScreenerStore((state) => state.filters.nplMax)

## Image Optimisation
Always use Next.js Image component — never plain img tags.
Always provide width and height to prevent layout shift.
Use priority prop on above-the-fold images (bank logos in header).
Use lazy loading for below-the-fold images.

## Bundle Size Rules
Never import an entire library when you only need one function.
Always use tree-shakeable imports.

// Wrong — imports entire lodash
import _ from 'lodash'
const sorted = _.sortBy(banks, 'name')

// Correct — imports only sortBy
import sortBy from 'lodash/sortBy'
const sorted = sortBy(banks, 'name')

// Wrong — imports all of ECharts
import * as echarts from 'echarts'

// Correct — imports only what you use
import * as echarts from 'echarts/core'
import { RadarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
echarts.use([RadarChart, CanvasRenderer])

## Backend Performance

### PostgreSQL Query Optimisation
Always run EXPLAIN ANALYZE on new queries before shipping.
Ensure all WHERE clause columns have indexes.
Use pagination on all list endpoints — never return unbounded result sets.
Maximum page size: 100 rows.

### Redis Caching
Cache all computed ratio sets after first computation.
Use cache-aside pattern: check cache first, compute on miss, store result.
Always set TTL on every cache key — never store without expiry.
Use pipeline for multiple Redis operations in sequence.

### FastAPI Response Optimisation
Use response_model_exclude_none=True to exclude null fields.
Use background tasks for non-critical post-response work.
Use streaming responses for large data exports.
