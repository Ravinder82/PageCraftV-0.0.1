import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { templates, componentLibrary, templateCategories } from '../data/templates';
import { useBuilder } from '../hooks/useBuilder';
import { AIGenerator } from './AIGenerator';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<'templates' | 'components' | 'ai-generate'>('templates');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiGenerationType, setAiGenerationType] = useState<'component' | 'template' | 'layout'>('component');
  
  const { 
    addComponent, 
    loadTemplate, 
    dynamicTemplates, 
    dynamicComponents, 
    currentProject
  } = useBuilder();

  const tabs = [
    { id: 'templates' as const, label: 'Templates', icon: Icons.Layout },
    { id: 'components' as const, label: 'Components', icon: Icons.Plus },
    { id: 'ai-generate' as const, label: 'AI Create', icon: Icons.Sparkles }
  ];

  const handleComponentAdd = (type: string, dynamicComponent?: any) => {
    if (dynamicComponent) {
      // Add the dynamic component directly
      addComponent({
        ...dynamicComponent,
        position: { x: 50, y: 100 + (Math.random() * 200) }
      });
      return;
    }

    const defaultContent = {
      hero: {
        title: 'Your Amazing Title',
        subtitle: 'Compelling subtitle that converts visitors into customers',
        buttonText: 'Get Started',
        image: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      feature: {
        title: 'Amazing Feature',
        description: 'This feature will revolutionize your workflow and boost productivity',
        icon: 'Star'
      },
      text: {
        content: 'Add your text content here. You can format it with different styles and colors to match your brand.'
      },
      button: {
        text: 'Click Me',
        link: '#'
      },
      testimonial: {
        name: 'John Doe',
        role: 'CEO, Company',
        content: 'This product has transformed our business. Highly recommended!',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      pricing: {
        title: 'Pro Plan',
        price: '$29',
        period: 'month',
        features: ['Feature 1', 'Feature 2', 'Feature 3'],
        buttonText: 'Get Started'
      },
      contact: {
        title: 'Contact Us',
        subtitle: 'Get in touch with our team',
        fields: ['name', 'email', 'message']
      },
      image: {
        src: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
        alt: 'Beautiful image'
      }
    };

    const defaultStyles = {
      hero: {
        backgroundColor: '#F8FAFC',
        textColor: '#1E293B',
        buttonColor: '#3B82F6',
        padding: 60
      },
      feature: {
        backgroundColor: '#FFFFFF',
        textColor: '#1E293B',
        padding: 40
      },
      text: {
        backgroundColor: '#FFFFFF',
        textColor: '#374151',
        fontSize: 16,
        padding: 24
      },
      button: {
        backgroundColor: '#3B82F6',
        textColor: '#FFFFFF',
        borderRadius: 8,
        padding: 12
      },
      testimonial: {
        backgroundColor: '#F9FAFB',
        textColor: '#1F2937',
        padding: 32
      },
      pricing: {
        backgroundColor: '#FFFFFF',
        textColor: '#1F2937',
        accentColor: '#3B82F6',
        padding: 32
      },
      contact: {
        backgroundColor: '#F8FAFC',
        textColor: '#1F2937',
        padding: 40
      },
      image: {
        borderRadius: 8,
        padding: 0
      }
    };

    const componentSizes = {
      hero: { width: '100%', height: 600 },
      feature: { width: 350, height: 250 },
      text: { width: 400, height: 150 },
      button: { width: 200, height: 50 },
      testimonial: { width: 400, height: 200 },
      pricing: { width: 300, height: 400 },
      contact: { width: 500, height: 400 },
      image: { width: 300, height: 200 }
    };

    addComponent({
      type: type as any,
      content: defaultContent[type as keyof typeof defaultContent] || {},
      styles: defaultStyles[type as keyof typeof defaultStyles] || {
        backgroundColor: '#FFFFFF',
        textColor: '#1E293B',
        padding: 20
      },
      position: { x: 50, y: 100 + (Math.random() * 200) },
      size: componentSizes[type as keyof typeof componentSizes] || { width: 300, height: 200 }
    });
  };

  const handleTemplateSelect = (template: any) => {
    loadTemplate(template);
  };

  const handleAICreate = (type: 'component' | 'template' | 'layout') => {
    setAiGenerationType(type);
    setShowAIGenerator(true);
  };

  // Combine static and dynamic templates/components
  const allTemplates = [...templates, ...dynamicTemplates];
  const allComponents = [...componentLibrary, ...dynamicComponents.map(comp => ({
    type: comp.type,
    name: comp.type.charAt(0).toUpperCase() + comp.type.slice(1),
    icon: 'Sparkles',
    description: `AI-generated ${comp.type} component`,
    dynamicComponent: comp
  }))];

  // Filter templates by category
  const filteredTemplates = selectedCategory === 'all' 
    ? allTemplates 
    : allTemplates.filter(template => template.category === selectedCategory);

  // Get unique categories from all templates
  const availableCategories = ['all', ...Array.from(new Set(allTemplates.map(t => t.category)))];

  return (
    <>
      <motion.div
        initial={false}
        animate={{ width: isCollapsed ? 60 : 320 }}
        className="bg-white border-r border-gray-200 flex flex-col h-full shadow-sm"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Icons.Zap className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-gray-800">PageCraft</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icons.PanelLeftClose className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Tabs */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-4 py-3 border-b border-gray-100"
            >
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden lg:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="p-4"
              >
                {activeTab === 'templates' ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800">Templates</h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {filteredTemplates.length}
                      </span>
                    </div>

                    {/* Category Filter */}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-gray-700">Category</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Categories</option>
                        {availableCategories.slice(1).map(category => (
                          <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-3">
                      {filteredTemplates.map((template) => (
                        <motion.div
                          key={template.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleTemplateSelect(template)}
                          className="group cursor-pointer bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200"
                        >
                          <div className="aspect-video bg-gray-100 relative overflow-hidden">
                            <img
                              src={template.thumbnail}
                              alt={template.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            {template.isAIGenerated && (
                              <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                                <Icons.Sparkles className="w-3 h-3" />
                                <span>AI</span>
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-gray-800 text-sm">{template.name}</h4>
                              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                {template.category}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2">{template.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : activeTab === 'components' ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800">Components</h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {allComponents.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {allComponents.map((component, index) => {
                        const IconComponent = Icons[component.icon as keyof typeof Icons] as any;
                        const isDynamic = 'dynamicComponent' in component;
                        return (
                          <motion.button
                            key={`${component.type}-${index}`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              if (isDynamic) {
                                handleComponentAdd(component.type, component.dynamicComponent);
                              } else {
                                handleComponentAdd(component.type);
                              }
                            }}
                            className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left group relative"
                          >
                            {isDynamic && (
                              <div className="absolute top-1 right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-1 py-0.5 rounded-full">
                                <Icons.Sparkles className="w-2 h-2" />
                              </div>
                            )}
                            <div className="flex flex-col items-center space-y-2">
                              <div className="w-8 h-8 bg-gray-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors">
                                <IconComponent className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                              </div>
                              <div className="text-center">
                                <div className="text-xs font-medium text-gray-800">{component.name}</div>
                                <div className="text-xs text-gray-500 mt-1 line-clamp-2">{component.description}</div>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800 mb-3">AI Creator</h3>
                    
                    <div className="space-y-3">
                      <button
                        onClick={() => handleAICreate('component')}
                        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center group-hover:from-purple-200 group-hover:to-blue-200 transition-colors">
                            <Icons.Plus className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="text-left">
                            <h4 className="font-medium text-gray-800">Create Component</h4>
                            <p className="text-sm text-gray-600">Generate individual components with AI</p>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleAICreate('template')}
                        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-teal-100 rounded-lg flex items-center justify-center group-hover:from-blue-200 group-hover:to-teal-200 transition-colors">
                            <Icons.Layout className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="text-left">
                            <h4 className="font-medium text-gray-800">Create Template</h4>
                            <p className="text-sm text-gray-600">Generate complete landing page templates</p>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleAICreate('layout')}
                        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all duration-200 group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center group-hover:from-green-200 group-hover:to-emerald-200 transition-colors">
                            <Icons.Grid3X3 className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="text-left">
                            <h4 className="font-medium text-gray-800">Create Layout</h4>
                            <p className="text-sm text-gray-600">Generate structured section layouts</p>
                          </div>
                        </div>
                      </button>
                    </div>

                    {/* AI Stats */}
                    {(dynamicTemplates.length > 0 || dynamicComponents.length > 0) && (
                      <div className="mt-6 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                        <h4 className="font-medium text-purple-800 mb-2 flex items-center space-x-2">
                          <Icons.Sparkles className="w-4 h-4" />
                          <span>AI Generated Content</span>
                        </h4>
                        <div className="space-y-1 text-sm text-purple-700">
                          <div>{dynamicTemplates.length} templates created</div>
                          <div>{dynamicComponents.length} components created</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* AI Generator Modal */}
      <AIGenerator
        isOpen={showAIGenerator}
        onClose={() => setShowAIGenerator(false)}
        initialType={aiGenerationType}
        targetSection={currentProject.layout ? undefined : undefined}
      />
    </>
  );
}