import { useState, useCallback } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { BRANCH_DATA, type BranchData } from '../../data/branchData';

// World atlas — countries level, always available via CDN
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface Props {
  selectedBranch: BranchData;
  onBranchSelect: (branch: BranchData) => void;
}

const profitColor = (profit: number) => {
  if (profit >= 3000000) return '#10b981';
  if (profit >= 1000000) return '#06b6d4';
  return '#f59e0b';
};

// India center
const DEFAULT_CENTER: [number, number] = [82.5, 21.0];
const DEFAULT_ZOOM = 4;

// Custom label positions to prevent overlapping for cities in close proximity
const LABEL_OFFSETS: Record<string, { x: number; y: number; textAnchor: 'start' | 'middle' | 'end' }> = {
  chennai:   { x: 3.5,  y: 0.8,  textAnchor: 'start' },  // to the right
  vellore:   { x: -3.5, y: 2.2,  textAnchor: 'end' },    // bottom-left
  tirupati:  { x: 0,    y: -3.8, textAnchor: 'middle' }, // top
  bengaluru: { x: -3.5, y: 0.8,  textAnchor: 'end' },    // to the left
  hyderabad: { x: 3.5,  y: 0.8,  textAnchor: 'start' },  // to the right
  jaipur:    { x: 0,    y: 4.8,  textAnchor: 'middle' }, // bottom
  ahmedabad: { x: 0,    y: 4.8,  textAnchor: 'middle' }, // bottom
};

export default function IndiaBranchMap({ selectedBranch, onBranchSelect }: Props) {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [hoveredBranch, setHoveredBranch] = useState<BranchData | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleZoomIn  = useCallback(() => setZoom(z => Math.min(z + 1, 12)), []);
  const handleZoomOut = useCallback(() => setZoom(z => Math.max(z - 1, 1)), []);
  const handleReset   = useCallback(() => { setZoom(DEFAULT_ZOOM); setCenter(DEFAULT_CENTER); }, []);

  return (
    <div className="relative w-full h-full bg-[#04080f] overflow-hidden">

      {/* ── Composable World Map ── */}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: DEFAULT_CENTER, scale: 150 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup
          zoom={zoom}
          center={center}
          onMoveEnd={({ zoom: z, coordinates }: any) => {
            setZoom(z);
            setCenter(coordinates as [number, number]);
          }}
          minZoom={1}
          maxZoom={12}
        >
          {/* World countries */}
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => {
                // India (id 356) gets a subtle highlight
                const isIndia = geo.id === '356';
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isIndia ? '#0d2040' : '#080f1e'}
                    stroke={isIndia ? '#1e4a8a' : '#0d1f38'}
                    strokeWidth={isIndia ? 0.8 : 0.3}
                    style={{
                      default: { outline: 'none' },
                      hover:   { fill: isIndia ? '#102a52' : '#0a1428', outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* Branch Markers */}
          {BRANCH_DATA.map((branch) => {
            const isSelected = selectedBranch.id === branch.id;
            const isHovered  = hoveredBranch?.id === branch.id;
            const color = profitColor(branch.profit);
            
            // Base radius in map units
            const r = Math.max(1.8, Math.min(3.2, branch.headCount / 120));

            // Dynamic scaling based on zoom factor to keep markers/labels screen-size constant
            const zoomFactor = zoom / 4;
            const markerRadius = r / zoomFactor;
            const strokeWidth = (isSelected ? 0.5 : 0.3) / zoomFactor;
            const fontSize = 2.4 / zoomFactor;

            // Offset configuration for labels to prevent collision/cluttering
            const offset = LABEL_OFFSETS[branch.id] || { x: 0, y: r + 3.5, textAnchor: 'middle' as const };
            const textX = offset.x / zoomFactor;
            const textY = offset.y / zoomFactor;
            const textAnchor = offset.textAnchor;

            return (
              <Marker
                key={branch.id}
                coordinates={branch.coordinates}
                onClick={() => onBranchSelect(branch)}
                onMouseEnter={(e: any) => {
                  setHoveredBranch(branch);
                  const svg  = (e.target as Element).closest('svg');
                  const rect = svg?.getBoundingClientRect();
                  if (rect) setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                }}
                onMouseLeave={() => setHoveredBranch(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Pulse rings — selected */}
                {isSelected && <>
                  <circle r={(r * 5) / zoomFactor}  fill="none" stroke={color} strokeWidth={0.4 / zoomFactor} opacity={0.15} />
                  <circle r={(r * 3.5) / zoomFactor} fill="none" stroke={color} strokeWidth={0.6 / zoomFactor} opacity={0.25} />
                  <circle r={(r * 2.5) / zoomFactor} fill="none" stroke={color} strokeWidth={0.8 / zoomFactor} opacity={0.4}  />
                </>}

                {/* Glow halo */}
                <circle r={(r * 2) / zoomFactor} fill={color} opacity={isSelected ? 0.18 : isHovered ? 0.12 : 0.05} />

                {/* Main marker */}
                <circle
                  r={markerRadius}
                  fill={isSelected ? color : `${color}cc`}
                  stroke={isSelected ? '#fff' : color}
                  strokeWidth={strokeWidth}
                />

                {/* Inner dot */}
                <circle r={(r * 0.35) / zoomFactor} fill="#fff" opacity={isSelected ? 1 : 0.5} />

                {/* City label */}
                <text
                  textAnchor={textAnchor}
                  x={textX}
                  y={textY}
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: `${fontSize}px`,
                    fontWeight: isSelected ? '700' : '500',
                    fill: isSelected ? '#fff' : '#8899bb',
                    pointerEvents: 'none',
                  }}
                >
                  {branch.city}
                </text>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* ── Zoom Controls (top-right) ── */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 bg-[#060c1e]/90 backdrop-blur-md border border-white/10 rounded-lg flex items-center justify-center text-slate-300 hover:text-emerald-400 hover:border-emerald-500/30 transition-all shadow-lg"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 bg-[#060c1e]/90 backdrop-blur-md border border-white/10 rounded-lg flex items-center justify-center text-slate-300 hover:text-emerald-400 hover:border-emerald-500/30 transition-all shadow-lg"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleReset}
          className="w-8 h-8 bg-[#060c1e]/90 backdrop-blur-md border border-white/10 rounded-lg flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-500/30 transition-all shadow-lg"
          title="Reset View"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        {/* Zoom level indicator */}
        <div className="w-8 h-6 bg-[#060c1e]/80 border border-white/8 rounded-md flex items-center justify-center">
          <span className="text-[9px] text-slate-500 font-mono">{zoom}x</span>
        </div>
      </div>

      {/* ── Branch count + drag hint ── */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
        <div className="bg-[#060c1e]/85 backdrop-blur-md border border-white/8 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5">
          <MapPin className="w-3 h-3 text-emerald-400" />
          <span className="text-[10px] text-slate-200 font-semibold">{BRANCH_DATA.length} AGS Branches · India</span>
        </div>
        <div className="bg-[#060c1e]/70 border border-white/5 rounded-lg px-2 py-1">
          <span className="text-[8.5px] text-slate-500">Drag to pan · Scroll to zoom</span>
        </div>
      </div>

      {/* ── Profit legend ── */}
      <div className="absolute bottom-3 left-3 flex flex-col gap-1.5 bg-[#060c1e]/85 backdrop-blur-md border border-white/8 rounded-xl px-2.5 py-2 z-10">
        <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Profit Scale</p>
        {[
          { color: '#10b981', label: '> ₹3M  High' },
          { color: '#06b6d4', label: '₹1–3M  Mid' },
          { color: '#f59e0b', label: '< ₹1M  Growth' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color, boxShadow: `0 0 5px ${l.color}` }} />
            <span className="text-[9px] text-slate-400">{l.label}</span>
          </div>
        ))}
      </div>

      {/* ── Hover Tooltip ── */}
      <AnimatePresence>
        {hoveredBranch && hoveredBranch.id !== selectedBranch.id && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.1 }}
            className="absolute z-30 pointer-events-none"
            style={{
              left: Math.min(tooltipPos.x + 16, 290),
              top:  Math.max(tooltipPos.y - 100, 8),
            }}
          >
            <div className="bg-[#060c1e]/96 backdrop-blur-xl border border-white/10 rounded-xl px-3.5 py-2.5 shadow-2xl min-w-[170px]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: profitColor(hoveredBranch.profit), boxShadow: `0 0 6px ${profitColor(hoveredBranch.profit)}` }} />
                <p className="text-xs font-bold text-white">{hoveredBranch.city}</p>
                <span className="text-[9px] text-slate-400 ml-auto">{hoveredBranch.state}</span>
              </div>
              <div className="space-y-1.5">
                {[
                  { label: 'Headcount', value: hoveredBranch.headCount.toLocaleString(), cls: 'text-slate-100' },
                  { label: 'Revenue', value: `$${(hoveredBranch.revenue / 1e6).toFixed(1)}M`, cls: 'text-emerald-400' },
                  { label: 'Net Profit', value: `$${(hoveredBranch.profit / 1e6).toFixed(1)}M`, cls: 'text-indigo-400' },
                  { label: 'SLA', value: `${hoveredBranch.slaCompliance}%`, cls: hoveredBranch.slaCompliance >= 90 ? 'text-emerald-400' : 'text-amber-400' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between text-[10px]">
                    <span className="text-slate-400">{row.label}</span>
                    <span className={`font-bold ${row.cls}`}>{row.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-[9px] text-cyan-400 mt-2 font-semibold border-t border-white/5 pt-1.5">Click to filter dashboard →</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
