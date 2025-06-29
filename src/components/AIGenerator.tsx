import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useBuilder } from '../hooks/useBuilder';
import { AIPreview } from './AIPreview';
import { ComponentData, TemplateLayout, Template } from '../types/builder';

interface AIGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'component' | 'template' | 'layout';
  targetSection?: string;
}

export function AIGenerator({ isOpen, onClose, initialType = 'component', targetSection }: AIGeneratorProps) {
  const { 
    generateWithAI, 
    currentProject, 
    addComponent, 
    loadTemplate, 
    loadTemplateLayout,
    addComponentToSection,
    addDynamicTemplate,
    addDynamicComponent
  } = useBuilder();

  const [generationType, setGenerationType] = useState<'component' | 'template' | 'layout'>(initialType);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [suggestions] = useState([
    'Modern hero section with gradient background',
    'Feature cards with icons and descriptions',
    'Customer testimonial with photo and quote',
    'Pricing table with 3 tiers',
    'Contact form with validation',
    'SaaS landing page with hero and features',
    'E-commerce product showcase',
    'Business professional layout'
  ]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedContent(null);

    try {
      const context = {
        existingComponents: currentProject.components,
        currentLayout: currentProject.layout,
        targetSection
      };

      const result = await generateWithAI(prompt, generationType, context);
      
      if (result.success) {
        setGeneratedContent({
          ...result.data,
          isAIGenerated: true,
          aiPrompt: prompt,
          metadata: result.metadata
        });
        setShowPreview(true);
      } else {
        setError(result.error || 'Generation failed');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAccept = () => {
    if (!generatedContent) return;

    try {
      switch (generationType) {
        case 'component':
          if (targetSection) {
            addComponentToSection(generatedContent, targetSection);
          } else {
            addComponent(generatedContent);
          }
          addDynamicComponent(generatedContent);
          break;
          
        case 'template':
          loadTemplate(generatedContent);
          addDynamicTemplate(generatedContent);
          break;
          
        case 'layout':
          loadTemplateLayout(generatedContent);
          break;
      }
      
      onClose();
      setGeneratedContent(null);
      setPrompt('');
      setShowPreview(false);
    } catch (error) {
      setError('Failed to apply generated content');
    }
  };

  const handleRegenerate = () => {
    setGeneratedContent(null);
    setShowPreview(false);
    handleGenerate();
  };

  const getPlaceholder = () => {
    switch (generationType) {
      case 'component':
        return targetSection 
          ? `Create a ${targetSection} component...`
          : 'Describe the component you want to create...';
      case 'template':
        return 'Describe the complete landing page template...';
      case 'layout':
        return 'Describe the layout structure you need...';
      default:
        return 'Describe what you want to create...';
    }
  };

  const getExamples = () => {
    switch (generationType) {
      case 'component':
        return [
          'Hero section with call-to-action button',
          'Feature card with icon and description',
          'Customer testimonial with avatar',
          'Pricing card with features list'
        ];
      case 'template':
        return [
          'SaaS landing page with hero, features, and pricing',
          'E-commerce store with product showcase',
          'Business agency with services and portfolio',
          'Blog template with article layout'
        ];
      case 'layout':
        return [
          'Modern SaaS layout with 5 sections',
          'E-commerce layout with product grid',
          'Portfolio layout with gallery section',
          'Business layout with team section'
        ];
      default:
        return [];
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                <Icons.Sparkles className="w-6 h-6 text-purple-600" />
                <span>AI Generator</span>
              </h2>
              <p className="text-gray-600 mt-1">Create components, templates, and layouts with AI</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icons.X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Generation Type Selector */}
          <div className="flex space-x-2 mt-4">
            {(['component', 'template', 'layout'] as const).map(type => (
              <button
                key={type}
                onClick={() => setGenerationType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                  generationType === type
                    ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border border-purple-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type === 'component' && <Icons.Plus className="w-4 h-4" />}
                {type === 'template' && <Icons.Layout className="w-4 h-4" />}
                {type === 'layout' && <Icons.Grid3X3 className="w-4 h-4" />}
                <span className="capitalize">{type}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex h-[70vh]">
          {/* Input Panel */}
          <div className="w-1/2 p-6 border-r border-gray-200 overflow-y-auto">
            <div className="space-y-6">
              {/* Prompt Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe what you want to create
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={getPlaceholder()}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
                />
              </div>

              {/* Context Info */}
              {targetSection && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icons.Target className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      Creating for: {targetSection} section
                    </span>
                  </div>
                </div>
              )}

              {/* Examples */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Example prompts
                </label>
                <div className="space-y-2">
                  {getExamples().map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setPrompt(example)}
                      className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Suggestions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick suggestions
                </label>
                <div className="flex flex-wrap gap-2">
                  {suggestions.slice(0, 6).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setPrompt(suggestion)}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs hover:bg-purple-200 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
              >
                {isGenerating ? (
                  <>
                    <Icons.Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Icons.Sparkles className="w-5 h-5" />
                    <span>Generate {generationType}</span>
                  </>
                )}
              </button>

              {/* Error Display */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icons.AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-700">{error}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="w-1/2 bg-gray-50">
            <AnimatePresence mode="wait">
              {showPreview && generatedContent ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full"
                >
                  <AIPreview
                    content={generatedContent}
                    type={generationType}
                    onAccept={handleAccept}
                    onRegenerate={handleRegenerate}
                    onClose={() => setShowPreview(false)}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex items-center justify-center"
                >
                  <div className="text-center max-w-sm">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icons.Eye className="w-10 h-10 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Preview Area</h3>
                    <p className="text-gray-600 text-sm">
                      Generated content will appear here for preview before adding to your project
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}