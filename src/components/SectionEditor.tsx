import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { TemplateSection, ComponentData } from '../types/builder';
import { sectionTypes } from '../data/templateLayouts';

interface SectionEditorProps {
  section: TemplateSection;
  components: ComponentData[];
  onUpdateSection: (sectionId: string, updates: Partial<TemplateSection>) => void;
  onDeleteSection: (sectionId: string) => void;
  isSelected: boolean;
  onSelect: () => void;
}

export function SectionEditor({
  section,
  components,
  onUpdateSection,
  onDeleteSection,
  isSelected,
  onSelect
}: SectionEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    name: section.name,
    height: section.height,
    backgroundColor: section.backgroundColor,
    padding: section.padding
  });

  const sectionComponents = components.filter(comp => 
    section.components.includes(comp.id)
  );

  const handleSave = () => {
    onUpdateSection(section.id, editValues);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValues({
      name: section.name,
      height: section.height,
      backgroundColor: section.backgroundColor,
      padding: section.padding
    });
    setIsEditing(false);
  };

  const sectionTypeInfo = sectionTypes.find(type => type.type === section.type);
  const IconComponent = sectionTypeInfo ? Icons[sectionTypeInfo.icon as keyof typeof Icons] as any : Icons.Layout;

  return (
    <motion.div
      onClick={onSelect}
      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isSelected ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            <IconComponent className={`w-4 h-4 ${
              isSelected ? 'text-blue-600' : 'text-gray-600'
            }`} />
          </div>
          
          {isEditing ? (
            <input
              type="text"
              value={editValues.name}
              onChange={(e) => setEditValues(prev => ({ ...prev, name: e.target.value }))}
              className="font-medium text-gray-800 bg-transparent border-b border-blue-300 focus:outline-none focus:border-blue-500"
              autoFocus
            />
          ) : (
            <div>
              <h3 className="font-medium text-gray-800">{section.name}</h3>
              <p className="text-xs text-gray-500 capitalize">{section.type} section</p>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1">
          {isEditing ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
                className="p-1 hover:bg-green-100 text-green-600 rounded transition-colors"
                title="Save changes"
              >
                <Icons.Check className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                className="p-1 hover:bg-red-100 text-red-600 rounded transition-colors"
                title="Cancel"
              >
                <Icons.X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="p-1 hover:bg-gray-100 text-gray-600 rounded transition-colors"
                title="Edit section"
              >
                <Icons.Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSection(section.id);
                }}
                className="p-1 hover:bg-red-100 text-red-600 rounded transition-colors"
                title="Delete section"
              >
                <Icons.Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Section Properties */}
      {isEditing && (
        <div className="space-y-3 mb-3 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Height</label>
              <input
                type="text"
                value={editValues.height}
                onChange={(e) => setEditValues(prev => ({ 
                  ...prev, 
                  height: e.target.value === 'auto' ? 'auto' : parseInt(e.target.value) || 'auto'
                }))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                placeholder="auto or number"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Padding</label>
              <input
                type="number"
                value={editValues.padding}
                onChange={(e) => setEditValues(prev => ({ ...prev, padding: parseInt(e.target.value) || 0 }))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Background Color</label>
            <div className="flex space-x-2">
              <input
                type="color"
                value={editValues.backgroundColor}
                onChange={(e) => setEditValues(prev => ({ ...prev, backgroundColor: e.target.value }))}
                className="w-10 h-8 border border-gray-300 rounded"
              />
              <input
                type="text"
                value={editValues.backgroundColor}
                onChange={(e) => setEditValues(prev => ({ ...prev, backgroundColor: e.target.value }))}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Section Stats */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4 text-gray-600">
          <div className="flex items-center space-x-1">
            <Icons.Box className="w-3 h-3" />
            <span>{sectionComponents.length} components</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icons.Maximize className="w-3 h-3" />
            <span>{section.height === 'auto' ? 'Auto' : `${section.height}px`}</span>
          </div>
        </div>
        
        {section.constraints.maxComponents && (
          <div className={`text-xs px-2 py-1 rounded-full ${
            sectionComponents.length >= section.constraints.maxComponents
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700'
          }`}>
            {sectionComponents.length}/{section.constraints.maxComponents}
          </div>
        )}
      </div>

      {/* Component List */}
      {sectionComponents.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex flex-wrap gap-1">
            {sectionComponents.map(component => (
              <div
                key={component.id}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
              >
                {component.type}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}