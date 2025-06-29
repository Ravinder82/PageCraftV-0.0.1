import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { useBuilder } from './hooks/useBuilder';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [propertiesPanelOpen, setPropertiesPanelOpen] = useState(true);
  
  const {
    deviceView,
    isPreviewMode,
    setDeviceView,
    setIsPreviewMode,
    currentProject,
    setSelectedComponent,
    saveProject,
    exportProject
  } = useBuilder();

  const handleSave = () => {
    try {
      const savedProject = saveProject();
      console.log('Project saved successfully:', savedProject.name);
      // You could show a toast notification here
    } catch (error) {
      console.error('Failed to save project:', error);
      // You could show an error notification here
    }
  };

  const handleExport = () => {
    try {
      const exportData = exportProject();
      console.log('Project exported successfully:', exportData.project.name);
      // You could show a success notification here
    } catch (error) {
      console.error('Failed to export project:', error);
      // You could show an error notification here
    }
  };

  const handleCanvasClick = () => {
    if (!isPreviewMode) {
      setSelectedComponent(null);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col bg-gray-50">
        <Header
          deviceView={deviceView}
          onDeviceViewChange={setDeviceView}
          isPreviewMode={isPreviewMode}
          onPreviewToggle={() => setIsPreviewMode(!isPreviewMode)}
          onSave={handleSave}
          onExport={handleExport}
        />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            isCollapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
          
          <div 
            className="flex-1 relative"
            onClick={handleCanvasClick}
          >
            <Canvas
              deviceView={deviceView}
              isPreviewMode={isPreviewMode}
            />
          </div>
          
          <PropertiesPanel
            isOpen={propertiesPanelOpen}
            onToggle={() => setPropertiesPanelOpen(!propertiesPanelOpen)}
          />
        </div>
      </div>
    </DndProvider>
  );
}

export default App;