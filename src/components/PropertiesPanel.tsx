import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useBuilder } from '../hooks/useBuilder';

interface PropertiesPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function PropertiesPanel({ isOpen, onToggle }: PropertiesPanelProps) {
  const { currentProject, selectedComponent, updateComponent } = useBuilder();

  const selectedComponentData = currentProject.components.find(
    comp => comp.id === selectedComponent
  );

  const handleContentUpdate = (field: string, value: any) => {
    if (selectedComponent && selectedComponentData) {
      updateComponent(selectedComponent, {
        content: {
          ...selectedComponentData.content,
          [field]: value
        }
      });
    }
  };

  const handleStyleUpdate = (field: string, value: any) => {
    if (selectedComponent && selectedComponentData) {
      updateComponent(selectedComponent, {
        styles: {
          ...selectedComponentData.styles,
          [field]: value
        }
      });
    }
  };

  const handleSizeUpdate = (field: 'width' | 'height', value: number) => {
    if (selectedComponent && selectedComponentData) {
      updateComponent(selectedComponent, {
        size: {
          ...selectedComponentData.size,
          [field]: value
        }
      });
    }
  };

  const handlePositionUpdate = (field: 'x' | 'y', value: number) => {
    if (selectedComponent && selectedComponentData) {
      updateComponent(selectedComponent, {
        position: {
          ...selectedComponentData.position,
          [field]: value
        }
      });
    }
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: isOpen ? 320 : 60 }}
      className="bg-white border-l border-gray-200 flex flex-col h-full shadow-sm"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-semibold text-gray-800"
            >
              Properties
            </motion.h2>
          )}
        </AnimatePresence>
        <button
          onClick={onToggle}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Icons.PanelRightClose className={`w-4 h-4 transition-transform ${isOpen ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4"
            >
              {selectedComponentData ? (
                <div className="space-y-6">
                  {/* Component Info */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-800 mb-3">Component</h3>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Icons.Layout className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm capitalize">{selectedComponentData.type}</div>
                          <div className="text-xs text-gray-500">ID: {selectedComponentData.id.slice(-8)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Position & Size */}
                  {selectedComponentData.type !== 'hero' && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-800 mb-3">Position & Size</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">X</label>
                          <input
                            type="number"
                            value={selectedComponentData.position.x}
                            onChange={(e) => handlePositionUpdate('x', parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Y</label>
                          <input
                            type="number"
                            value={selectedComponentData.position.y}
                            onChange={(e) => handlePositionUpdate('y', parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Width</label>
                          <input
                            type="number"
                            value={typeof selectedComponentData.size.width === 'number' ? selectedComponentData.size.width : 300}
                            onChange={(e) => handleSizeUpdate('width', parseInt(e.target.value) || 300)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Height</label>
                          <input
                            type="number"
                            value={typeof selectedComponentData.size.height === 'number' ? selectedComponentData.size.height : 200}
                            onChange={(e) => handleSizeUpdate('height', parseInt(e.target.value) || 200)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Content Settings */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-800 mb-3">Content</h3>
                    <div className="space-y-4">
                      {selectedComponentData.type === 'hero' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                              type="text"
                              value={selectedComponentData.content.title || ''}
                              onChange={(e) => handleContentUpdate('title', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                            <textarea
                              value={selectedComponentData.content.subtitle || ''}
                              onChange={(e) => handleContentUpdate('subtitle', e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                            <input
                              type="text"
                              value={selectedComponentData.content.buttonText || ''}
                              onChange={(e) => handleContentUpdate('buttonText', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                            <input
                              type="text"
                              value={selectedComponentData.content.image || ''}
                              onChange={(e) => handleContentUpdate('image', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="https://..."
                            />
                          </div>
                        </>
                      )}

                      {selectedComponentData.type === 'feature' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                              type="text"
                              value={selectedComponentData.content.title || ''}
                              onChange={(e) => handleContentUpdate('title', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                              value={selectedComponentData.content.description || ''}
                              onChange={(e) => handleContentUpdate('description', e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </>
                      )}

                      {selectedComponentData.type === 'text' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Text Content</label>
                          <textarea
                            value={selectedComponentData.content.content || ''}
                            onChange={(e) => handleContentUpdate('content', e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      )}

                      {selectedComponentData.type === 'button' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                            <input
                              type="text"
                              value={selectedComponentData.content.text || ''}
                              onChange={(e) => handleContentUpdate('text', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                            <input
                              type="text"
                              value={selectedComponentData.content.link || ''}
                              onChange={(e) => handleContentUpdate('link', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="https://..."
                            />
                          </div>
                        </>
                      )}

                      {selectedComponentData.type === 'testimonial' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                              type="text"
                              value={selectedComponentData.content.name || ''}
                              onChange={(e) => handleContentUpdate('name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <input
                              type="text"
                              value={selectedComponentData.content.role || ''}
                              onChange={(e) => handleContentUpdate('role', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial</label>
                            <textarea
                              value={selectedComponentData.content.content || ''}
                              onChange={(e) => handleContentUpdate('content', e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                            <input
                              type="text"
                              value={selectedComponentData.content.avatar || ''}
                              onChange={(e) => handleContentUpdate('avatar', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="https://..."
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Style Settings */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-800 mb-3">Styling</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                        <div className="flex space-x-2">
                          <input
                            type="color"
                            value={selectedComponentData.styles.backgroundColor || '#FFFFFF'}
                            onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
                            className="w-12 h-10 border border-gray-300 rounded-lg"
                          />
                          <input
                            type="text"
                            value={selectedComponentData.styles.backgroundColor || '#FFFFFF'}
                            onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                        <div className="flex space-x-2">
                          <input
                            type="color"
                            value={selectedComponentData.styles.textColor || '#000000'}
                            onChange={(e) => handleStyleUpdate('textColor', e.target.value)}
                            className="w-12 h-10 border border-gray-300 rounded-lg"
                          />
                          <input
                            type="text"
                            value={selectedComponentData.styles.textColor || '#000000'}
                            onChange={(e) => handleStyleUpdate('textColor', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      {(selectedComponentData.type === 'hero' || selectedComponentData.type === 'button') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Button Color</label>
                          <div className="flex space-x-2">
                            <input
                              type="color"
                              value={selectedComponentData.styles.buttonColor || '#3B82F6'}
                              onChange={(e) => handleStyleUpdate('buttonColor', e.target.value)}
                              className="w-12 h-10 border border-gray-300 rounded-lg"
                            />
                            <input
                              type="text"
                              value={selectedComponentData.styles.buttonColor || '#3B82F6'}
                              onChange={(e) => handleStyleUpdate('buttonColor', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Padding</label>
                        <input
                          type="number"
                          value={selectedComponentData.styles.padding || 20}
                          onChange={(e) => handleStyleUpdate('padding', parseInt(e.target.value) || 20)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icons.MousePointer className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-800 mb-2">No Component Selected</h3>
                  <p className="text-sm text-gray-600">
                    Select a component on the canvas to edit its properties.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}