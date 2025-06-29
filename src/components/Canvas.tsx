import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDrop } from 'react-dnd';
import { useBuilder } from '../hooks/useBuilder';
import { CanvasComponent } from './CanvasComponent';
import { TemplateLayoutSelector } from './TemplateLayoutSelector';
import { SectionEditor } from './SectionEditor';
import { DeviceView } from '../types/builder';
import * as Icons from 'lucide-react';

interface CanvasProps {
  deviceView: DeviceView;
  isPreviewMode: boolean;
}

export function Canvas({ deviceView, isPreviewMode }: CanvasProps) {
  const { 
    currentProject, 
    selectedComponent, 
    moveComponent, 
    setSelectedComponent,
    generateWithAI,
    setCurrentProject,
    loadTemplateLayout,
    updateSection,
    deleteSection,
    addComponentToSection
  } = useBuilder();

  const [showLayoutSelector, setShowLayoutSelector] = useState(false);
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'layout' | 'design'>('design');

  const [{ isOver }, drop] = useDrop({
    accept: 'component',
    drop: (item: any, monitor) => {
      if (!monitor.didDrop()) {
        const offset = monitor.getClientOffset();
        const canvasRect = document.getElementById('canvas')?.getBoundingClientRect();
        if (offset && canvasRect) {
          const x = Math.max(0, offset.x - canvasRect.left - 100);
          const y = Math.max(0, offset.y - canvasRect.top - 50);
          
          // If we have a layout and sections, try to add to appropriate section
          if (currentProject.layout && selectedSection) {
            addComponentToSection(item.id, selectedSection, { x, y });
          } else {
            moveComponent(item.id, { x, y });
          }
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  const getCanvasWidth = () => {
    switch (deviceView) {
      case 'mobile': return 375;
      case 'tablet': return 768;
      case 'desktop': return 1200;
      default: return 1200;
    }
  };

  const canvasWidth = getCanvasWidth();

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedComponent(null);
      setSelectedSection(null);
    }
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      setAiError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setAiError(null);

    try {
      const result = await generateWithAI(aiPrompt, 'template');
      
      const templateComponents = result.components.map((comp: any) => ({
        ...comp,
        id: `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }));

      setCurrentProject(prev => ({
        ...prev,
        name: result.name,
        components: templateComponents,
        lastModified: new Date()
      }));

      setSelectedComponent(null);
      setShowAIPrompt(false);
      setAiPrompt('');
    } catch (error) {
      setAiError(error instanceof Error ? error.message : 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderLayoutMode = () => {
    if (!currentProject.layout) {
      return (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icons.Layout className="w-12 h-12 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Choose a Template Layout</h3>
            <p className="text-gray-600 mb-6">
              Select a structured layout to organize your components into sections
            </p>
            <button
              onClick={() => setShowLayoutSelector(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 font-medium mx-auto"
            >
              <Icons.Layout className="w-5 h-5" />
              <span>Choose Layout</span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Layout Structure</h3>
            <p className="text-sm text-gray-600">{currentProject.layout.name} - {currentProject.layout.description}</p>
          </div>
          <button
            onClick={() => setShowLayoutSelector(true)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <Icons.RefreshCw className="w-4 h-4" />
            <span>Change Layout</span>
          </button>
        </div>

        <div className="space-y-3">
          {currentProject.layout.sections
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <SectionEditor
                key={section.id}
                section={section}
                components={currentProject.components}
                onUpdateSection={updateSection}
                onDeleteSection={deleteSection}
                isSelected={selectedSection === section.id}
                onSelect={() => setSelectedSection(section.id)}
              />
            ))}
        </div>
      </div>
    );
  };

  const renderDesignMode = () => {
    if (currentProject.layout) {
      // Render sections with components
      return (
        <div className="relative">
          {currentProject.layout.sections
            .sort((a, b) => a.order - b.order)
            .map((section) => {
              const sectionComponents = currentProject.components.filter(comp => 
                section.components.includes(comp.id)
              );

              return (
                <motion.div
                  key={section.id}
                  className={`relative border-2 border-dashed transition-all duration-200 ${
                    selectedSection === section.id 
                      ? 'border-blue-400 bg-blue-50/30' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{
                    backgroundColor: section.backgroundColor,
                    padding: `${section.padding}px`,
                    minHeight: section.height === 'auto' ? '100px' : `${section.height}px`
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSection(section.id);
                  }}
                >
                  {/* Section Label */}
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-700 border border-gray-200">
                    {section.name}
                  </div>

                  {/* Section Components */}
                  {section.constraints.layout === 'grid' ? (
                    <div 
                      className="grid gap-4 h-full"
                      style={{ 
                        gridTemplateColumns: `repeat(${section.constraints.columns || 1}, 1fr)`,
                        paddingTop: '2rem'
                      }}
                    >
                      {sectionComponents.map((component) => (
                        <div key={component.id} className="relative">
                          <CanvasComponent
                            component={component}
                            isSelected={selectedComponent === component.id}
                            isPreviewMode={isPreviewMode}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="relative h-full" style={{ paddingTop: '2rem' }}>
                      {sectionComponents.map((component) => (
                        <CanvasComponent
                          key={component.id}
                          component={component}
                          isSelected={selectedComponent === component.id}
                          isPreviewMode={isPreviewMode}
                        />
                      ))}
                    </div>
                  )}

                  {/* Empty Section Placeholder */}
                  {sectionComponents.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
                      <div className="text-center">
                        <Icons.Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Drop components here</p>
                        {section.constraints.allowedTypes && (
                          <p className="text-xs mt-1">
                            Accepts: {section.constraints.allowedTypes.join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
        </div>
      );
    }

    // Original free-form canvas
    const heroComponents = currentProject.components.filter(comp => comp.type === 'hero');
    const otherComponents = currentProject.components.filter(comp => comp.type !== 'hero');

    return (
      <>
        <div className="relative z-10">
          {heroComponents.map((component) => (
            <CanvasComponent
              key={component.id}
              component={component}
              isSelected={selectedComponent === component.id}
              isPreviewMode={isPreviewMode}
            />
          ))}
        </div>

        <div className="relative z-10" style={{ minHeight: otherComponents.length > 0 ? '500px' : '0' }}>
          {otherComponents.map((component) => (
            <CanvasComponent
              key={component.id}
              component={component}
              isSelected={selectedComponent === component.id}
              isPreviewMode={isPreviewMode}
            />
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="flex-1 bg-gray-50 flex flex-col overflow-auto relative">
      {/* Canvas Controls */}
      {!isPreviewMode && (
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('design')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'design'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Design
              </button>
              <button
                onClick={() => setViewMode('layout')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'layout'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Layout
              </button>
            </div>

            {currentProject.layout && (
              <div className="text-sm text-gray-600">
                {currentProject.layout.sections.length} sections • {currentProject.components.length} components
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {!currentProject.layout && (
              <button
                onClick={() => setShowLayoutSelector(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Icons.Layout className="w-4 h-4" />
                <span>Add Layout</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Canvas Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          ref={drop}
          id="canvas"
          onClick={handleCanvasClick}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ width: canvasWidth }}
          className={`bg-white shadow-xl rounded-lg overflow-hidden relative min-h-screen ${
            isOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
          }`}
        >
          {/* Grid overlay for design mode */}
          {!isPreviewMode && viewMode === 'design' && !currentProject.layout && (
            <div 
              className="absolute inset-0 pointer-events-none opacity-10 z-0"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #3B82F6 1px, transparent 1px),
                  linear-gradient(to bottom, #3B82F6 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />
          )}

          {/* Render based on view mode */}
          {viewMode === 'layout' ? renderLayoutMode() : renderDesignMode()}

          {/* Empty state for design mode */}
          {viewMode === 'design' && currentProject.components.length === 0 && !currentProject.layout && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icons.Sparkles className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Start Building</h3>
                <p className="text-gray-600 mb-6">
                  Choose a template layout or start with AI generation
                </p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => setShowLayoutSelector(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
                  >
                    <Icons.Layout className="w-5 h-5" />
                    <span>Choose Layout</span>
                  </button>
                  
                  <button
                    onClick={() => setShowAIPrompt(true)}
                    className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
                  >
                    <Icons.Sparkles className="w-5 h-5" />
                    <span>Generate with AI</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Device indicator */}
          <div className="absolute top-4 right-4 bg-black/10 backdrop-blur-sm rounded-full px-3 py-1 z-30">
            <span className="text-sm font-medium text-gray-700 capitalize">{deviceView}</span>
          </div>
        </motion.div>
      </div>

      {/* Template Layout Selector */}
      <TemplateLayoutSelector
        isOpen={showLayoutSelector}
        onClose={() => setShowLayoutSelector(false)}
        onSelectLayout={(layout) => {
          loadTemplateLayout(layout);
          setShowLayoutSelector(false);
          setViewMode('layout');
        }}
        currentLayout={currentProject.layout}
      />

      {/* AI Prompt Modal */}
      {showAIPrompt && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Generate with AI</h3>
              <button
                onClick={() => {
                  setShowAIPrompt(false);
                  setAiPrompt('');
                  setAiError(null);
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Icons.X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your landing page
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g., Create a modern SaaS landing page with hero, features, and pricing"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {aiError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icons.AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-700">{aiError}</span>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={handleAIGenerate}
                  disabled={isGenerating || !aiPrompt.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <Icons.Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Icons.Sparkles className="w-4 h-4" />
                      <span>Generate</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowAIPrompt(false);
                    setAiPrompt('');
                    setAiError(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}