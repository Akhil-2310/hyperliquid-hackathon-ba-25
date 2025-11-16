'use client'

import { SearchBar } from './search-bar'
import { LavaMetricsCompact } from './lava-metrics'
import { Activity } from 'lucide-react'

export function DashboardHeader() {
  return (
    <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center animate-glow">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">
                HyperPulse
              </h1>
              <p className="text-xs text-muted-foreground">
                Powered by Lava Network
              </p>
            </div>
          </div>
          
          <div className="flex-1 max-w-2xl">
            <SearchBar />
          </div>

          <LavaMetricsCompact />
        </div>
      </div>
    </header>
  )
}
