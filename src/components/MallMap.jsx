import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import ShopModal from './ShopModal';

// Simple Dijkstra for shortest path on an unweighted graph (treat edges as weight 1)
function shortestPath(graph, startId, endId) {
  if (!startId || !endId) return [];
  const dist = new Map();
  const prev = new Map();
  const visited = new Set();
  const queue = new Set(Object.keys(graph));

  for (const node of queue) dist.set(node, Infinity);
  dist.set(startId, 0);

  while (queue.size) {
    let u = null;
    let best = Infinity;
    for (const node of queue) {
      const d = dist.get(node) ?? Infinity;
      if (d < best) {
        best = d;
        u = node;
      }
    }
    if (u == null) break;
    queue.delete(u);
    visited.add(u);
    if (u === endId) break;
    const neighbors = graph[u] || [];
    for (const v of neighbors) {
      if (visited.has(v)) continue;
      const alt = (dist.get(u) ?? Infinity) + 1;
      if (alt < (dist.get(v) ?? Infinity)) {
        dist.set(v, alt);
        prev.set(v, u);
      }
    }
  }

  const path = [];
  let cur = endId;
  while (cur && prev.has(cur)) {
    path.unshift(cur);
    cur = prev.get(cur);
  }
  if (startId) path.unshift(startId);
  if (path[0] !== startId || path[path.length - 1] !== endId) return [];
  return path;
}

const defaultShops = [
  {
    id: '11031', zone: 'A', name: 'Cafe Delight', category: 'Cafe', image: 'https://images.unsplash.com/photo-1635906110734-c07851fa2f42?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxDYWZlJTIwRGVsaWdodHxlbnwwfDB8fHwxNzYyNTMxOTU2fDA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
    offers: ['20% off coffee', 'Buy 1 Get 1 pastry free'], x: 100, y: 200, width: 80, height: 50, color: '#3B82F6', neighbors: ['11032', '11041'],
  },
  {
    id: '11032', zone: 'A', name: 'Book Nook', category: 'Books', image: 'https://images.unsplash.com/photo-1635906110734-c07851fa2f42?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxDYWZlJTIwRGVsaWdodHxlbnwwfDB8fHwxNzYyNTMxOTU2fDA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
    offers: ['10% off bestsellers'], x: 220, y: 200, width: 80, height: 50, color: '#22C55E', neighbors: ['11031', '11041', '11033'],
  },
  {
    id: '11033', zone: 'A', name: 'Fresh Bites', category: 'Food Court', image: 'https://images.unsplash.com/photo-1533327325824-76bc4e62d560?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxCb29rJTIwTm9va3xlbnwwfDB8fHwxNzYyNTMxOTU3fDA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
    offers: ['Combo meals from ₹199'], x: 340, y: 200, width: 100, height: 50, color: '#EAB308', neighbors: ['11032', '11043'],
  },
  {
    id: '11041', zone: 'B', name: 'Style Hub', category: 'Fashion', image: 'https://images.unsplash.com/photo-1640209622389-f7795f0d0860?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxGcmVzaCUyMEJpdGVzfGVufDB8MHx8fDE3NjI1MzE5NTh8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
    offers: ['Flat 30% on shirts'], x: 160, y: 300, width: 90, height: 60, color: '#F87171', neighbors: ['11031', '11032', '11042'],
  },
  {
    id: '11042', zone: 'B', name: 'Toy Planet', category: 'Toys', image: 'https://images.unsplash.com/photo-1762378724772-68c054805e8c?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxTdHlsZSUyMEh1YnxlbnwwfDB8fHwxNzYyNTMxOTYxfDA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
    offers: ['Buy 2 get 1 free'], x: 270, y: 310, width: 80, height: 50, color: '#A78BFA', neighbors: ['11041', '11043'],
  },
  {
    id: '11043', zone: 'B', name: 'Home Craft', category: 'Home & Decor', image: 'https://images.unsplash.com/photo-1573993319671-2c9fd26e45f6?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxUb3klMjBQbGFuZXR8ZW58MHwwfHx8MTc2MjUzMTk2Mnww&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
    offers: ['Cushions at ₹299'], x: 380, y: 310, width: 100, height: 60, color: '#60A5FA', neighbors: ['11033', '11042', '11053'],
  },
  {
    id: '11053', zone: 'C', name: 'Green Grocer', category: 'Groceries', image: 'https://images.unsplash.com/photo-1517840545241-b491010a8af4?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxIb21lJTIwQ3JhZnR8ZW58MHwwfHx8MTc2MjUzMTk2Mnww&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
    offers: ['Fresh deals daily'], x: 500, y: 330, width: 120, height: 70, color: '#34D399', neighbors: ['11043', '11073', '11076'],
  },
  {
    id: '11073', zone: 'E', name: 'CinemaX', category: 'Entertainment', image: 'https://images.unsplash.com/photo-1609154375136-628d9d02fb42?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxHcmVlbiUyMEdyb2NlcnxlbnwwfDB8fHwxNzYyNTMxOTY0fDA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
    offers: ['Matinee specials'], x: 640, y: 280, width: 130, height: 80, color: '#F59E0B', neighbors: ['11053', '11076'],
  },
  {
    id: '11076', zone: 'F', name: 'Tech World', category: 'Electronics', image: 'https://images.unsplash.com/photo-1574923930958-9b653a0e5148?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxDaW5lbWFYfGVufDB8MHx8fDE3NjI1MzE5Njd8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
    offers: ['Flat ₹500 off on headphones'], x: 540, y: 200, width: 100, height: 60, color: '#F97316', neighbors: ['11053', '11073'],
  },
];

function buildGraph(shops) {
  const g = {};
  for (const s of shops) g[s.id] = [...s.neighbors];
  return g;
}

function usePanZoom({ initial = 0.5, min = 0.3, max = 2 }) {
  const [scale, setScale] = useState(initial);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  const onWheel = useCallback((e) => {
    e.preventDefault();
    const delta = -e.deltaY;
    const factor = delta > 0 ? 1.1 : 0.9;
    setScale((s) => Math.min(max, Math.max(min, s * factor)));
  }, [min, max]);

  const onPointerDown = useCallback((e) => {
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
  }, []);
  const onPointerMove = useCallback((e) => {
    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
  }, []);
  const onPointerUp = useCallback(() => { dragging.current = false; }, []);

  return { scale, offset, setScale, setOffset, onWheel, onPointerDown, onPointerMove, onPointerUp };
}

export default function MallMap() {
  const [shops] = useState(defaultShops);
  const [selected, setSelected] = useState(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const graph = useMemo(() => buildGraph(shops), [shops]);

  const pathIds = useMemo(() => shortestPath(graph, start?.id, end?.id), [graph, start, end]);

  const panZoom = usePanZoom({ initial: 0.6 });

  useEffect(() => {
    // Reset zoom to show all shops initially
    panZoom.setScale(0.6);
    panZoom.setOffset({ x: 0, y: 0 });
  }, []);

  const handleShopClick = (shop) => {
    setSelected(shop);
  };

  const handleVisitShop = (shop) => {
    setSelected(shop);
    setModalOpen(true);
  };

  const routeSegments = useMemo(() => {
    if (!pathIds.length) return [];
    const idToShop = new Map(shops.map(s => [s.id, s]));
    const segs = [];
    for (let i = 0; i < pathIds.length - 1; i++) {
      const a = idToShop.get(pathIds[i]);
      const b = idToShop.get(pathIds[i + 1]);
      if (!a || !b) continue;
      const ax = a.x + a.width / 2;
      const ay = a.y + a.height / 2;
      const bx = b.x + b.width / 2;
      const by = b.y + b.height / 2;
      segs.push({ ax, ay, bx, by });
    }
    return segs;
  }, [pathIds, shops]);

  const stepsText = useMemo(() => {
    if (!pathIds.length) return '';
    const idToShop = new Map(shops.map(s => [s.id, s]));
    const names = pathIds.map(id => idToShop.get(id)?.name || id);
    return `Route: ${names.join(' → ')}`;
  }, [pathIds, shops]);

  return (
    <div className="w-full bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 bg-white border rounded-lg px-3 py-2 shadow-sm">
            <div className="text-xs text-gray-500">Start</div>
            <div className="font-medium">{start?.name || '—'}</div>
          </div>
          <div className="inline-flex items-center gap-2 bg-white border rounded-lg px-3 py-2 shadow-sm">
            <div className="text-xs text-gray-500">Destination</div>
            <div className="font-medium">{end?.name || '—'}</div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => panZoom.setScale(s => Math.min(2, s * 1.1))} className="px-3 py-1.5 rounded border bg-white hover:bg-gray-50">+
            </button>
            <button onClick={() => panZoom.setScale(s => Math.max(0.3, s / 1.1))} className="px-3 py-1.5 rounded border bg-white hover:bg-gray-50">-
            </button>
            <button onClick={() => { panZoom.setScale(0.6); panZoom.setOffset({ x: 0, y: 0 }); }} className="px-3 py-1.5 rounded border bg-white hover:bg-gray-50">Reset</button>
          </div>
        </div>

        {pathIds.length > 1 && (
          <div className="text-sm text-blue-700 bg-blue-50 border border-blue-200 px-3 py-2 rounded">
            {stepsText}
          </div>
        )}

        <div
          className="relative w-full bg-white border rounded-xl shadow overflow-hidden touch-pan-y"
          style={{ height: 520 }}
          onWheel={panZoom.onWheel}
          onPointerDown={panZoom.onPointerDown}
          onPointerMove={panZoom.onPointerMove}
          onPointerUp={panZoom.onPointerUp}
          onPointerLeave={panZoom.onPointerUp}
        >
          <svg viewBox="0 0 1000 700" className="w-full h-full block">
            <rect x="0" y="0" width="1000" height="700" fill="#f8fafc" />

            <g transform={`translate(${panZoom.offset.x}, ${panZoom.offset.y}) scale(${panZoom.scale})`}>
              {/* Walkways grid background */}
              <g opacity={0.3}>
                {Array.from({ length: 20 }).map((_, i) => (
                  <line key={`v${i}`} x1={i * 50} y1={0} x2={i * 50} y2={700} stroke="#e5e7eb" strokeWidth={1} />
                ))}
                {Array.from({ length: 14 }).map((_, i) => (
                  <line key={`h${i}`} x1={0} y1={i * 50} x2={1000} y2={i * 50} stroke="#e5e7eb" strokeWidth={1} />
                ))}
              </g>

              {/* Default paths */}
              <g>
                {shops.map(s => (
                  s.neighbors.map(nid => {
                    const n = shops.find(ss => ss.id === nid);
                    if (!n) return null;
                    const x1 = s.x + s.width / 2;
                    const y1 = s.y + s.height / 2;
                    const x2 = n.x + n.width / 2;
                    const y2 = n.y + n.height / 2;
                    const key = `${s.id}-${nid}`;
                    // Draw each path once (only when s.id < nid)
                    if (s.id > nid) return null;
                    return <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D1D5DB" strokeWidth={2} />
                  })
                ))}
              </g>

              {/* Active route overlay */}
              {routeSegments.length > 0 && (
                <g>
                  {routeSegments.map((seg, idx) => (
                    <line key={idx} x1={seg.ax} y1={seg.ay} x2={seg.bx} y2={seg.by} stroke="#3B82F6" strokeWidth={4} />
                  ))}
                </g>
              )}

              {/* Shops */}
              {shops.map((shop) => (
                <g key={shop.id} transform={`translate(${shop.x}, ${shop.y})`}>
                  <motion.rect
                    initial={false}
                    whileHover={{ scale: 1.06 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                    width={shop.width}
                    height={shop.height}
                    fill={shop.color}
                    rx={8}
                    className="cursor-pointer shadow"
                    onClick={() => handleShopClick(shop)}
                  />
                  <text x={shop.width / 2} y={shop.height / 2} textAnchor="middle" dominantBaseline="middle" className="select-none pointer-events-none" fill="#0f172a" fontSize={12} fontWeight={600}>
                    {shop.zone}
                  </text>
                </g>
              ))}
            </g>
          </svg>

          {/* Shop popup */}
          {selected && (
            <div className="absolute left-4 bottom-4 sm:left-6 sm:bottom-6">
              <div className="bg-white border rounded-xl shadow-lg p-4 w-[260px]">
                <div className="font-semibold text-gray-900">{selected.name}</div>
                <div className="text-xs text-gray-500">Zone {selected.zone} • {selected.category}</div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <button
                    className="col-span-1 text-xs px-2 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                    onClick={() => setStart(selected)}
                  >
                    Start
                  </button>
                  <button
                    className="col-span-1 text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => setEnd(selected)}
                  >
                    Destination
                  </button>
                  <button
                    className="col-span-1 text-xs px-2 py-1 rounded border hover:bg-gray-50"
                    onClick={() => handleVisitShop(selected)}
                  >
                    Visit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ShopModal
        shop={selected}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onStartNavigation={(shop) => { setStart(shop); setEnd(shop); setModalOpen(false); }}
      />
    </div>
  );
}
