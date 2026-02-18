'use client'

import { useEffect, useRef } from 'react'
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts'

interface BondingCurveChartProps {
  tokenAddress: string
}

export function BondingCurveChart({ tokenAddress }: BondingCurveChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#d1d5db',
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      grid: {
        vertLines: { color: 'rgba(139, 92, 246, 0.1)' },
        horzLines: { color: 'rgba(139, 92, 246, 0.1)' },
      },
      timeScale: {
        borderColor: 'rgba(139, 92, 246, 0.3)',
      },
      rightPriceScale: {
        borderColor: 'rgba(139, 92, 246, 0.3)',
      },
    })

    chartRef.current = chart

    // Create area series
    const series = chart.addAreaSeries({
      lineColor: '#8b5cf6',
      topColor: 'rgba(139, 92, 246, 0.5)',
      bottomColor: 'rgba(139, 92, 246, 0.0)',
      lineWidth: 2,
    })

    seriesRef.current = series

    // Generate sample bonding curve data
    // In a real app, this would come from contract events or API
    const generateSampleData = () => {
      const data = []
      const now = Math.floor(Date.now() / 1000)
      
      for (let i = 0; i < 100; i++) {
        const timestamp = now - (100 - i) * 60 * 5 // 5 min intervals
        const supply = i * 1000000
        // Exponential curve: price = BASE_PRICE * e^(k * supply)
        const price = 0.000001 * Math.exp(supply / 10000000000)
        
        data.push({
          time: timestamp,
          value: price,
        })
      }
      
      return data
    }

    series.setData(generateSampleData())

    // Fit content
    chart.timeScale().fitContent()

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [tokenAddress])

  return (
    <div className="bg-card border border-primary/20 rounded-xl p-6 backdrop-blur-sm">
      <h2 className="text-xl font-bold mb-4">Price Chart</h2>
      <div ref={chartContainerRef} className="w-full" />
      <div className="mt-4 text-sm text-gray-400 text-center">
        Price follows exponential bonding curve
      </div>
    </div>
  )
}
