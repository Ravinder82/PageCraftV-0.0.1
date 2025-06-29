import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { templateLayouts } from '../data/templateLayouts';
import { TemplateLayout } from '../types/builder';

interface TemplateLayoutSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLayout: (layout: TemplateLayout) => void;
  currentLayout?: TemplateLayout;
}

export function TemplateLayoutSelector({ 
  isOpen, 
  onClose, 
  onSelectLayout, 
  currentLayout 
}: TemplateLayoutSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(templateLayouts.map(layout => layout.category)))];
  const filteredLayouts = selectedCategory === 'all' 
    ? templateLayouts 
    : templateLayouts.filter(layout => layout.category === selectedCategory);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Choose Template Layout</h2>
              <p className="text-gray-600 mt-1">Select a layout structure for your landing page</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icons.X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex space-x-2 mt-4">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Layouts Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLayouts.map((layout) => (
              <motion.div
                key={layout.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectLayout(layout)}
                className={`cursor-pointer bg-white border-2 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg ${
                  currentLayout?.id === layout.id 
                    ? 'border-blue-500 ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {/* Layout Preview */}
                <div className="aspect-video bg-gray-50 p-4">
                  <div className="h-full bg-white rounded border border-gray-200 overflow-hidden">
                    {layout.sections.map((section, index) => (
                      <div
                        key={section.id}
                        className="border-b border-gray-100 last:border-b-0 flex items-center justify-center text-xs text-gray-500"
                        style={{
                          height: section.height === 'auto' ? '40px' : `${Math.min(section.height / 10, 60)}px`,
                          backgroundColor: section.backgroundColor,
                          minHeight: '20px'
                        }}
                      >
                        {section.name}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Layout Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{layout.name}</h3>
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {layout.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{layout.description}</p>
                  
                  {/* Sections Count */}
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Icons.Layout className="w-3 h-3" />
                      <span>{layout.sections.length} sections</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icons.Palette className="w-3 h-3" />
                      <span>{layout.globalStyles.primaryColor}</span>
                    </div>
                  </div>

                  {currentLayout?.id === layout.id && (
                    <div className="mt-3 flex items-center space-x-2 text-blue-600">
                      <Icons.Check className="w-4 h-4" />
                      <span className="text-sm font-medium">Currently Active</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Choose a layout to organize your components into structured sections
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}