import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { DeviceView } from '../types/builder';
import { useBuilder } from '../hooks/useBuilder';

interface HeaderProps {
  deviceView: DeviceView;
  onDeviceViewChange: (view: DeviceView) => void;
  isPreviewMode: boolean;
  onPreviewToggle: () => void;
  onSave: () => void;
  onExport: () => void;
}

export function Header({
  deviceView,
  onDeviceViewChange,
  isPreviewMode,
  onPreviewToggle,
  onSave,
  onExport
}: HeaderProps) {
  const { 
    currentProject, 
    createNewProject, 
    resetBuilder, 
    exportProject, 
    importProject,
    getStorageInfo 
  } = useBuilder();
  
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [showStorageInfo, setShowStorageInfo] = useState(false);
  const [projectName, setProjectName] = useState(currentProject.name);

  const deviceViews: { view: DeviceView; icon: keyof typeof Icons; label: string }[] = [
    { view: 'desktop', icon: 'Monitor', label: 'Desktop' },
    { view: 'tablet', icon: 'Tablet', label: 'Tablet' },
    { view: 'mobile', icon: 'Smartphone', label: 'Mobile' }
  ];

  const handleProjectNameChange = (newName: string) => {
    setProjectName(newName);
    // Update project name in the builder
    const updatedProject = { ...currentProject, name: newName, lastModified: new Date() };
    // This would need to be handled by the parent component or through a context
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importData = JSON.parse(e.target?.result as string);
            if (importProject(importData)) {
              alert('Project imported successfully!');
            } else {
              alert('Failed to import project. Please check the file format.');
            }
          } catch (error) {
            alert('Invalid file format. Please select a valid PageCraft export file.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const storageInfo = getStorageInfo();
  const lastSaved = currentProject.lastModified;
  const timeSinceLastSave = Math.floor((Date.now() - lastSaved.getTime()) / 1000 / 60);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm relative">
      {/* Left side - Project info */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={projectName}
            onChange={(e) => handleProjectNameChange(e.target.value)}
            onBlur={() => handleProjectNameChange(projectName)}
            className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:bg-gray-50 rounded px-2 py-1 min-w-0"
            placeholder="Project Name"
          />
          <button
            onClick={() => setShowProjectMenu(!showProjectMenu)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <Icons.ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        
        <div className="text-sm text-gray-500">
          {timeSinceLastSave === 0 ? 'Saved just now' : 
           timeSinceLastSave === 1 ? 'Saved 1 minute ago' :
           timeSinceLastSave < 60 ? `Saved ${timeSinceLastSave} minutes ago` :
           'Saved over an hour ago'}
        </div>
      </div>

      {/* Project Menu Dropdown */}
      {showProjectMenu && (
        <div className="absolute top-full left-6 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-2">
            <button
              onClick={() => {
                createNewProject();
                setShowProjectMenu(false);
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Icons.Plus className="w-4 h-4 text-gray-600" />
              <span className="text-sm">New Project</span>
            </button>
            
            <button
              onClick={() => {
                handleImport();
                setShowProjectMenu(false);
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Icons.Upload className="w-4 h-4 text-gray-600" />
              <span className="text-sm">Import Project</span>
            </button>
            
            <button
              onClick={() => {
                exportProject();
                setShowProjectMenu(false);
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Icons.Download className="w-4 h-4 text-gray-600" />
              <span className="text-sm">Export Project</span>
            </button>
            
            <hr className="my-2" />
            
            <button
              onClick={() => {
                setShowStorageInfo(!showStorageInfo);
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Icons.HardDrive className="w-4 h-4 text-gray-600" />
              <span className="text-sm">Storage Info</span>
            </button>
            
            <button
              onClick={() => {
                if (confirm('This will clear all data including your current project, templates, and components. Are you sure?')) {
                  resetBuilder();
                  setShowProjectMenu(false);
                }
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-red-50 rounded-lg transition-colors text-red-600"
            >
              <Icons.Trash2 className="w-4 h-4" />
              <span className="text-sm">Clear All Data</span>
            </button>
          </div>
        </div>
      )}

      {/* Storage Info Modal */}
      {showStorageInfo && (
        <div className="absolute top-full left-6 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Storage Information</h3>
            <button
              onClick={() => setShowStorageInfo(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Icons.X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Current Project:</span>
              <span className="font-medium">{Math.round(storageInfo.currentProject / 1024 * 100) / 100} KB</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">AI Templates:</span>
              <span className="font-medium">{storageInfo.templateCount} items ({Math.round(storageInfo.dynamicTemplates / 1024 * 100) / 100} KB)</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">AI Components:</span>
              <span className="font-medium">{storageInfo.componentCount} items ({Math.round(storageInfo.dynamicComponents / 1024 * 100) / 100} KB)</span>
            </div>
            
            <hr />
            
            <div className="flex justify-between font-semibold">
              <span>Total Storage:</span>
              <span>{storageInfo.totalKB} KB</span>
            </div>
            
            <div className="text-xs text-gray-500 mt-2">
              Data is stored locally in your browser. Export your project to create backups.
            </div>
          </div>
        </div>
      )}

      {/* Center - Device views */}
      <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
        {deviceViews.map(({ view, icon, label }) => {
          const IconComponent = Icons[icon] as any;
          return (
            <button
              key={view}
              onClick={() => onDeviceViewChange(view)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                deviceView === view
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
              title={label}
            >
              <IconComponent className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onPreviewToggle}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
            isPreviewMode
              ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Icons.Eye className="w-4 h-4" />
          <span>{isPreviewMode ? 'Edit' : 'Preview'}</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={onSave}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            <Icons.Save className="w-4 h-4" />
            <span>Save</span>
          </button>

          <button
            onClick={onExport}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Icons.Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 border-l border-gray-200 pl-3">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Icons.Share2 className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Icons.Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Click outside to close menus */}
      {(showProjectMenu || showStorageInfo) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowProjectMenu(false);
            setShowStorageInfo(false);
          }}
        />
      )}
    </header>
  );
}