import React from 'react';
import { motion } from 'framer-motion';
import { useDrag } from 'react-dnd';
import { ComponentData } from '../types/builder';
import { useBuilder } from '../hooks/useBuilder';
import * as Icons from 'lucide-react';

interface CanvasComponentProps {
  component: ComponentData;
  isSelected: boolean;
  isPreviewMode: boolean;
}

export function CanvasComponent({ component, isSelected, isPreviewMode }: CanvasComponentProps) {
  const { setSelectedComponent, deleteComponent, duplicateComponent } = useBuilder();

  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: { id: component.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !isPreviewMode,
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPreviewMode) {
      setSelectedComponent(component.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteComponent(component.id);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateComponent(component.id);
  };

  const renderComponentContent = () => {
    switch (component.type) {
      case 'hero':
        return (
          <div 
            className="relative h-full flex items-center"
            style={{ 
              backgroundColor: component.styles.backgroundColor,
              color: component.styles.textColor,
              padding: `${component.styles.padding || 60}px 2rem`
            }}
          >
            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
              <div>
                <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                  {component.content.title}
                </h1>
                <p className="text-lg lg:text-xl mb-8 opacity-80">
                  {component.content.subtitle}
                </p>
                <button
                  className="px-8 py-4 rounded-lg font-semibold text-white transition-all hover:shadow-lg transform hover:-translate-y-0.5"
                  style={{ backgroundColor: component.styles.buttonColor }}
                >
                  {component.content.buttonText}
                </button>
              </div>
              {component.content.image && (
                <div className="relative">
                  <img
                    src={component.content.image}
                    alt="Hero"
                    className="w-full h-auto rounded-2xl shadow-2xl"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 'feature':
        return (
          <div 
            className="text-center"
            style={{ 
              backgroundColor: component.styles.backgroundColor,
              color: component.styles.textColor,
              padding: `${component.styles.padding || 40}px`
            }}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icons.Star className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {component.content.title}
            </h3>
            <p className="text-gray-600">{component.content.description}</p>
          </div>
        );

      case 'text':
        return (
          <div 
            style={{ 
              backgroundColor: component.styles.backgroundColor,
              color: component.styles.textColor,
              padding: `${component.styles.padding || 24}px`,
              fontSize: `${component.styles.fontSize || 16}px`
            }}
          >
            <div className="prose max-w-none">
              <p>{component.content.content}</p>
            </div>
          </div>
        );

      case 'button':
        return (
          <div className="flex justify-center" style={{ padding: `${component.styles.padding || 12}px` }}>
            <button
              className="px-6 py-3 font-medium transition-all hover:shadow-lg transform hover:-translate-y-0.5"
              style={{ 
                backgroundColor: component.styles.backgroundColor || '#3B82F6', 
                color: component.styles.textColor || 'white',
                borderRadius: `${component.styles.borderRadius || 8}px`
              }}
            >
              {component.content.text}
            </button>
          </div>
        );

      case 'testimonial':
        return (
          <div 
            className="text-center"
            style={{ 
              backgroundColor: component.styles.backgroundColor,
              color: component.styles.textColor,
              padding: `${component.styles.padding || 32}px`
            }}
          >
            <div className="w-16 h-16 rounded-full mx-auto mb-4 overflow-hidden">
              <img
                src={component.content.avatar}
                alt={component.content.name}
                className="w-full h-full object-cover"
              />
            </div>
            <blockquote className="text-lg italic mb-4">
              "{component.content.content}"
            </blockquote>
            <div>
              <div className="font-semibold">{component.content.name}</div>
              <div className="text-sm opacity-70">{component.content.role}</div>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div 
            className="text-center border rounded-lg"
            style={{ 
              backgroundColor: component.styles.backgroundColor,
              color: component.styles.textColor,
              padding: `${component.styles.padding || 32}px`
            }}
          >
            <h3 className="text-xl font-semibold mb-2">{component.content.title}</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold">{component.content.price}</span>
              <span className="text-gray-600">/{component.content.period}</span>
            </div>
            <ul className="space-y-2 mb-6">
              {component.content.features?.map((feature: string, index: number) => (
                <li key={index} className="flex items-center justify-center">
                  <Icons.Check className="w-4 h-4 text-green-500 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className="w-full py-2 px-4 rounded-lg font-medium"
              style={{ backgroundColor: component.styles.accentColor || '#3B82F6', color: 'white' }}
            >
              {component.content.buttonText}
            </button>
          </div>
        );

      case 'contact':
        return (
          <div 
            style={{ 
              backgroundColor: component.styles.backgroundColor,
              color: component.styles.textColor,
              padding: `${component.styles.padding || 40}px`
            }}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-semibold mb-2">{component.content.title}</h3>
              <p className="text-gray-600">{component.content.subtitle}</p>
            </div>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <textarea
                placeholder="Your Message"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        );

      case 'image':
        return (
          <div style={{ padding: `${component.styles.padding || 0}px` }}>
            <img
              src={component.content.src}
              alt={component.content.alt}
              className="w-full h-full object-cover"
              style={{ borderRadius: `${component.styles.borderRadius || 8}px` }}
            />
          </div>
        );

      default:
        return (
          <div className="p-8 text-center text-gray-500">
            Component type: {component.type}
          </div>
        );
    }
  };

  const isFullWidth = component.type === 'hero';
  const componentWidth = isFullWidth ? '100%' : typeof component.size.width === 'number' ? `${component.size.width}px` : component.size.width;
  const componentHeight = typeof component.size.height === 'number' ? `${component.size.height}px` : component.size.height;

  return (
    <motion.div
      ref={!isPreviewMode ? drag : undefined}
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      style={{
        position: isFullWidth ? 'relative' : 'absolute',
        left: isFullWidth ? 0 : component.position.x,
        top: isFullWidth ? 'auto' : component.position.y,
        width: componentWidth,
        height: componentHeight,
        minHeight: componentHeight,
        cursor: isPreviewMode ? 'default' : 'move',
        zIndex: isSelected ? 10 : 1
      }}
      className={`group relative ${
        isSelected && !isPreviewMode 
          ? 'ring-2 ring-blue-500 ring-offset-2' 
          : !isPreviewMode ? 'hover:ring-1 hover:ring-blue-300 hover:ring-offset-1' : ''
      } ${isPreviewMode ? '' : 'hover:shadow-lg'} transition-all bg-white rounded-lg overflow-hidden`}
    >
      {renderComponentContent()}

      {/* Controls */}
      {isSelected && !isPreviewMode && (
        <div className="absolute -top-10 right-0 flex space-x-1 bg-white border border-gray-200 rounded-lg shadow-sm p-1">
          <button
            onClick={handleDelete}
            className="p-1 hover:bg-red-50 text-red-600 rounded transition-colors"
            title="Delete component"
          >
            <Icons.Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDuplicate}
            className="p-1 hover:bg-gray-50 text-gray-600 rounded transition-colors"
            title="Duplicate component"
          >
            <Icons.Copy className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
}