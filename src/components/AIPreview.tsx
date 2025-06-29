import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { ComponentData, Template, TemplateLayout } from '../types/builder';
import { CanvasComponent } from './CanvasComponent';

interface AIPreviewProps {
  content: ComponentData | Template | TemplateLayout;
  type: 'component' | 'template' | 'layout';
  onAccept: () => void;
  onRegenerate: () => void;
  onClose: () => void;
}

export function AIPreview({ content, type, onAccept, onRegenerate, onClose }: AIPreviewProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');

  const renderComponentPreview = (component: ComponentData) => {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <CanvasComponent
          component={component}
          isSelected={false}
          isPreviewMode={true}
        />
      </div>
    );
  };

  const renderTemplatePreview = (template: Template) => {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-2">{template.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{template.description}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>{template.components.length} components</span>
            <span className="capitalize">{template.category}</span>
          </div>
        </div>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {template.components.map((component, index) => (
            <div key={index} className="bg-white rounded border border-gray-200 overflow-hidden">
              <div className="p-2 bg-gray-50 border-b border-gray-200">
                <span className="text-xs font-medium text-gray-600 capitalize">
                  {component.type} Component
                </span>
              </div>
              <div className="p-2">
                <CanvasComponent
                  component={component}
                  isSelected={false}
                  isPreviewMode={true}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLayoutPreview = (layout: TemplateLayout) => {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-2">{layout.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{layout.description}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>{layout.sections.length} sections</span>
            <span className="capitalize">{layout.category}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-3 bg-gray-50 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">Layout Structure</span>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              {layout.sections
                .sort((a, b) => a.order - b.order)
                .map((section) => (
                  <div
                    key={section.id}
                    className="border border-gray-200 rounded-lg p-3"
                    style={{ backgroundColor: section.backgroundColor }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{section.name}</span>
                      <span className="text-xs text-gray-500 capitalize">{section.type}</span>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>Height: {section.height === 'auto' ? 'Auto' : `${section.height}px`}</div>
                      <div>Layout: {section.constraints.layout || 'flex'}</div>
                      {section.constraints.maxComponents && (
                        <div>Max components: {section.constraints.maxComponents}</div>
                      )}
                      {section.constraints.allowedTypes && (
                        <div>Allowed: {section.constraints.allowedTypes.join(', ')}</div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCodeView = () => {
    return (
      <div className="bg-gray-900 text-gray-100 rounded-lg overflow-hidden">
        <div className="p-3 bg-gray-800 border-b border-gray-700">
          <span className="text-sm font-medium">Generated Code</span>
        </div>
        <pre className="p-4 text-xs overflow-auto max-h-96 font-mono">
          {JSON.stringify(content, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Preview Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
              <Icons.CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Generated Successfully!</h3>
              <p className="text-xs text-gray-600">
                {type === 'component' && 'Component ready to add'}
                {type === 'template' && 'Template ready to load'}
                {type === 'layout' && 'Layout ready to apply'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <Icons.X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('preview')}
            className={`flex-1 py-1 px-3 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'preview'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`flex-1 py-1 px-3 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'code'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Code
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {viewMode === 'preview' ? (
          <div>
            {type === 'component' && renderComponentPreview(content as ComponentData)}
            {type === 'template' && renderTemplatePreview(content as Template)}
            {type === 'layout' && renderLayoutPreview(content as TemplateLayout)}
          </div>
        ) : (
          renderCodeView()
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex space-x-3">
          <button
            onClick={onAccept}
            className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white py-2 px-4 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
          >
            <Icons.Check className="w-4 h-4" />
            <span>Accept & Add</span>
          </button>
          <button
            onClick={onRegenerate}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <Icons.RefreshCw className="w-4 h-4" />
            <span>Regenerate</span>
          </button>
        </div>
        
        {/* Metadata */}
        {(content as any).metadata && (
          <div className="mt-3 text-xs text-gray-500">
            Generated at {new Date((content as any).metadata.generatedAt).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}