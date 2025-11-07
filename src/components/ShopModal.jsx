import React from 'react';
import { X, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShopModal({ shop, isOpen, onClose, onStartNavigation }) {
  return (
    <AnimatePresence>
      {isOpen && shop && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50"
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-xl"
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-10 inline-flex items-center justify-center rounded-full p-2 bg-white/90 shadow hover:bg-white"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
              {shop.image ? (
                <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full grid place-items-center text-gray-400">No image</div>
              )}
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{shop.name}</h3>
                  <p className="text-sm text-gray-500">Zone {shop.zone} • {shop.category}</p>
                </div>
              </div>

              {shop.description && (
                <p className="mt-3 text-gray-700 text-sm">{shop.description}</p>
              )}

              {shop.offers?.length ? (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900">Current offers</h4>
                  <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-gray-700">
                    {shop.offers.map((o, i) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onStartNavigation?.(shop)}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Navigation className="w-4 h-4" />
                  Start Navigation to This Shop
                </button>
                <button onClick={onClose} className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50">Close</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
