import { useState, useCallback, useEffect } from 'react';
import { ComponentData, Project, DeviceView, Template, TemplateLayout, TemplateSection, AIGenerationRequest, AIGenerationResult } from '../types/builder';

// Storage keys
const STORAGE_KEYS = {
  CURRENT_PROJECT: 'pagecraft_current_project',
  DYNAMIC_TEMPLATES: 'pagecraft_dynamic_templates',
  DYNAMIC_COMPONENTS: 'pagecraft_dynamic_components',
  USER_SETTINGS: 'pagecraft_user_settings'
};

// Default project structure
const createDefaultProject = (): Project => ({
  id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  name: 'New Project',
  components: [],
  settings: {
    theme: 'light',
    primaryColor: '#3B82F6',
    fontFamily: 'Inter'
  },
  lastModified: new Date()
});

// Storage utilities
const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save to localStorage (${key}):`, error);
  }
};

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects for projects
      if (key === STORAGE_KEYS.CURRENT_PROJECT && parsed.lastModified) {
        parsed.lastModified = new Date(parsed.lastModified);
      }
      return parsed;
    }
  } catch (error) {
    console.error(`Failed to load from localStorage (${key}):`, error);
  }
  return defaultValue;
};

export function useBuilder() {
  // Initialize states with data from localStorage
  const [currentProject, setCurrentProject] = useState<Project>(() => 
    loadFromStorage(STORAGE_KEYS.CURRENT_PROJECT, createDefaultProject())
  );

  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [deviceView, setDeviceView] = useState<DeviceView>('desktop');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  // AI-generated content states
  const [dynamicTemplates, setDynamicTemplates] = useState<Template[]>(() =>
    loadFromStorage(STORAGE_KEYS.DYNAMIC_TEMPLATES, [])
  );
  
  const [dynamicComponents, setDynamicComponents] = useState<ComponentData[]>(() =>
    loadFromStorage(STORAGE_KEYS.DYNAMIC_COMPONENTS, [])
  );

  // Auto-save current project to localStorage
  useEffect(() => {
    const projectToSave = {
      ...currentProject,
      lastModified: new Date()
    };
    saveToStorage(STORAGE_KEYS.CURRENT_PROJECT, projectToSave);
  }, [currentProject]);

  // Auto-save dynamic templates to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.DYNAMIC_TEMPLATES, dynamicTemplates);
  }, [dynamicTemplates]);

  // Auto-save dynamic components to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.DYNAMIC_COMPONENTS, dynamicComponents);
  }, [dynamicComponents]);

  // Project management functions
  const createNewProject = useCallback(() => {
    const newProject = createDefaultProject();
    setCurrentProject(newProject);
    setSelectedComponent(null);
  }, []);

  const saveProject = useCallback(() => {
    const updatedProject = {
      ...currentProject,
      lastModified: new Date()
    };
    setCurrentProject(updatedProject);
    return updatedProject;
  }, [currentProject]);

  const loadProject = useCallback((project: Project) => {
    setCurrentProject({
      ...project,
      lastModified: new Date(project.lastModified)
    });
    setSelectedComponent(null);
  }, []);

  // Reset builder to initial state
  const resetBuilder = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    
    setCurrentProject(createDefaultProject());
    setDynamicTemplates([]);
    setDynamicComponents([]);
    setSelectedComponent(null);
    setDeviceView('desktop');
    setIsPreviewMode(false);
  }, []);

  const addComponent = useCallback((component: Omit<ComponentData, 'id'>) => {
    const newComponent: ComponentData = {
      ...component,
      id: `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    setCurrentProject(prev => ({
      ...prev,
      components: [...prev.components, newComponent],
      lastModified: new Date()
    }));

    setSelectedComponent(newComponent.id);
  }, []);

  const updateComponent = useCallback((id: string, updates: Partial<ComponentData>) => {
    setCurrentProject(prev => ({
      ...prev,
      components: prev.components.map(comp => 
        comp.id === id ? { ...comp, ...updates } : comp
      ),
      lastModified: new Date()
    }));
  }, []);

  const deleteComponent = useCallback((id: string) => {
    setCurrentProject(prev => {
      // Remove component from sections if layout exists
      const updatedLayout = prev.layout ? {
        ...prev.layout,
        sections: prev.layout.sections.map(section => ({
          ...section,
          components: section.components.filter(compId => compId !== id)
        }))
      } : prev.layout;

      return {
        ...prev,
        components: prev.components.filter(comp => comp.id !== id),
        layout: updatedLayout,
        lastModified: new Date()
      };
    });
    
    if (selectedComponent === id) {
      setSelectedComponent(null);
    }
  }, [selectedComponent]);

  const moveComponent = useCallback((id: string, position: { x: number; y: number }) => {
    updateComponent(id, { position });
  }, [updateComponent]);

  const loadTemplate = useCallback((template: Template) => {
    const templateComponents = template.components.map(comp => ({
      ...comp,
      id: `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }));

    setCurrentProject(prev => ({
      ...prev,
      name: template.name,
      components: templateComponents,
      layout: template.layout,
      lastModified: new Date()
    }));

    setSelectedComponent(null);
  }, []);

  const duplicateComponent = useCallback((id: string) => {
    const component = currentProject.components.find(comp => comp.id === id);
    if (component) {
      const duplicatedComponent: ComponentData = {
        ...component,
        id: `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        position: {
          x: component.position.x + 20,
          y: component.position.y + 20
        }
      };

      setCurrentProject(prev => ({
        ...prev,
        components: [...prev.components, duplicatedComponent],
        lastModified: new Date()
      }));

      setSelectedComponent(duplicatedComponent.id);
    }
  }, [currentProject.components]);

  // Template Layout Management
  const loadTemplateLayout = useCallback((layout: TemplateLayout) => {
    setCurrentProject(prev => ({
      ...prev,
      layout: {
        ...layout,
        sections: layout.sections.map(section => ({
          ...section,
          components: [] // Start with empty sections
        }))
      },
      components: [], // Clear existing components when loading new layout
      lastModified: new Date()
    }));
    setSelectedComponent(null);
  }, []);

  const updateSection = useCallback((sectionId: string, updates: Partial<TemplateSection>) => {
    setCurrentProject(prev => {
      if (!prev.layout) return prev;

      return {
        ...prev,
        layout: {
          ...prev.layout,
          sections: prev.layout.sections.map(section =>
            section.id === sectionId ? { ...section, ...updates } : section
          )
        },
        lastModified: new Date()
      };
    });
  }, []);

  const deleteSection = useCallback((sectionId: string) => {
    setCurrentProject(prev => {
      if (!prev.layout) return prev;

      const sectionToDelete = prev.layout.sections.find(s => s.id === sectionId);
      if (!sectionToDelete) return prev;

      // Remove components that belong to this section
      const componentsToRemove = sectionToDelete.components;
      const updatedComponents = prev.components.filter(comp => 
        !componentsToRemove.includes(comp.id)
      );

      return {
        ...prev,
        components: updatedComponents,
        layout: {
          ...prev.layout,
          sections: prev.layout.sections.filter(section => section.id !== sectionId)
        },
        lastModified: new Date()
      };
    });
  }, []);

  const addComponentToSection = useCallback((componentData: Omit<ComponentData, 'id'> | string, sectionId: string, position?: { x: number; y: number }) => {
    if (!currentProject.layout) return;

    const section = currentProject.layout.sections.find(s => s.id === sectionId);
    if (!section) return;

    // If it's a string, it's an existing component ID being moved
    if (typeof componentData === 'string') {
      const componentId = componentData;
      const component = currentProject.components.find(c => c.id === componentId);
      if (!component) return;

      // Check if component type is allowed in this section
      if (section.constraints.allowedTypes && 
          !section.constraints.allowedTypes.includes(component.type)) {
        console.warn(`Component type ${component.type} not allowed in section ${section.name}`);
        return;
      }

      // Check max components limit
      if (section.constraints.maxComponents && 
          section.components.length >= section.constraints.maxComponents) {
        console.warn(`Section ${section.name} has reached maximum components limit`);
        return;
      }

      // Update component position and section
      updateComponent(componentId, { 
        sectionId,
        position: position || component.position
      });

      // Add component to section
      updateSection(sectionId, {
        components: [...section.components, componentId]
      });
    } else {
      // It's new component data
      const newComponent: ComponentData = {
        ...componentData,
        id: `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sectionId,
        position: position || { x: 0, y: 0 }
      };

      // Check constraints
      if (section.constraints.allowedTypes && 
          !section.constraints.allowedTypes.includes(newComponent.type)) {
        console.warn(`Component type ${newComponent.type} not allowed in section ${section.name}`);
        return;
      }

      if (section.constraints.maxComponents && 
          section.components.length >= section.constraints.maxComponents) {
        console.warn(`Section ${section.name} has reached maximum components limit`);
        return;
      }

      // Add component to project
      setCurrentProject(prev => ({
        ...prev,
        components: [...prev.components, newComponent],
        lastModified: new Date()
      }));

      // Add component to section
      updateSection(sectionId, {
        components: [...section.components, newComponent.id]
      });

      setSelectedComponent(newComponent.id);
    }
  }, [currentProject, updateComponent, updateSection]);

  // AI-generated content management
  const addDynamicTemplate = useCallback((template: Template) => {
    const templateWithId = {
      ...template,
      id: `ai_template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    setDynamicTemplates(prev => [...prev, templateWithId]);
    return templateWithId;
  }, []);

  const addDynamicComponent = useCallback((component: ComponentData) => {
    const componentWithId = {
      ...component,
      id: `ai_component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    setDynamicComponents(prev => [...prev, componentWithId]);
    return componentWithId;
  }, []);

  const removeDynamicTemplate = useCallback((id: string) => {
    setDynamicTemplates(prev => prev.filter(template => template.id !== id));
  }, []);

  const removeDynamicComponent = useCallback((id: string) => {
    setDynamicComponents(prev => prev.filter(component => component.id !== id));
  }, []);

  // Enhanced AI Generation function
  const generateWithAI = useCallback(async (
    userPrompt: string, 
    target: 'template' | 'component' | 'layout',
    context?: AIGenerationRequest['context']
  ): Promise<AIGenerationResult> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-generator`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userPrompt,
          target,
          context
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        return {
          success: false,
          error: result.error || 'AI generation failed'
        };
      }

      return {
        success: true,
        data: result.data,
        metadata: {
          generatedAt: new Date(),
          prompt: userPrompt,
          type: target
        }
      };
    } catch (error) {
      console.error('AI generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'AI generation failed'
      };
    }
  }, []);

  // Export/Import functionality
  const exportProject = useCallback(() => {
    const exportData = {
      project: currentProject,
      dynamicTemplates,
      dynamicComponents,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return exportData;
  }, [currentProject, dynamicTemplates, dynamicComponents]);

  const importProject = useCallback((importData: any) => {
    try {
      if (importData.project) {
        setCurrentProject({
          ...importData.project,
          lastModified: new Date()
        });
      }
      
      if (importData.dynamicTemplates) {
        setDynamicTemplates(prev => [...prev, ...importData.dynamicTemplates]);
      }
      
      if (importData.dynamicComponents) {
        setDynamicComponents(prev => [...prev, ...importData.dynamicComponents]);
      }
      
      setSelectedComponent(null);
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  }, []);

  // Get storage usage info
  const getStorageInfo = useCallback(() => {
    const info = {
      currentProject: JSON.stringify(currentProject).length,
      dynamicTemplates: JSON.stringify(dynamicTemplates).length,
      dynamicComponents: JSON.stringify(dynamicComponents).length,
      total: 0
    };
    
    info.total = info.currentProject + info.dynamicTemplates + info.dynamicComponents;
    
    return {
      ...info,
      totalKB: Math.round(info.total / 1024 * 100) / 100,
      projectCount: 1,
      templateCount: dynamicTemplates.length,
      componentCount: dynamicComponents.length
    };
  }, [currentProject, dynamicTemplates, dynamicComponents]);

  return {
    // Core state
    currentProject,
    selectedComponent,
    deviceView,
    isPreviewMode,
    dynamicTemplates,
    dynamicComponents,
    
    // State setters
    setSelectedComponent,
    setDeviceView,
    setIsPreviewMode,
    setCurrentProject,
    
    // Project management
    createNewProject,
    saveProject,
    loadProject,
    resetBuilder,
    
    // Component operations
    addComponent,
    updateComponent,
    deleteComponent,
    moveComponent,
    duplicateComponent,
    loadTemplate,
    
    // Layout management
    loadTemplateLayout,
    updateSection,
    deleteSection,
    addComponentToSection,
    
    // AI-generated content
    addDynamicTemplate,
    addDynamicComponent,
    removeDynamicTemplate,
    removeDynamicComponent,
    generateWithAI,
    
    // Import/Export
    exportProject,
    importProject,
    
    // Storage info
    getStorageInfo
  };
}