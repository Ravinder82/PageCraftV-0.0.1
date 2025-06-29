export interface ComponentData {
  id: string;
  type: 'hero' | 'feature' | 'testimonial' | 'pricing' | 'contact' | 'text' | 'image' | 'button';
  content: Record<string, any>;
  styles: Record<string, any>;
  position: { x: number; y: number };
  size: { width: number | string; height: number | string };
  sectionId?: string; // New: Links component to a specific section
  isAIGenerated?: boolean; // New: Marks AI-generated components
  aiPrompt?: string; // New: Stores the original AI prompt
}

export interface TemplateSection {
  id: string;
  name: string;
  type: 'header' | 'hero' | 'features' | 'testimonials' | 'pricing' | 'contact' | 'footer' | 'custom';
  order: number;
  height: number | 'auto';
  backgroundColor: string;
  padding: number;
  components: string[]; // Component IDs in this section
  constraints: {
    maxComponents?: number;
    allowedTypes?: ComponentData['type'][];
    layout?: 'flex' | 'grid' | 'absolute';
    columns?: number;
  };
}

export interface TemplateLayout {
  id: string;
  name: string;
  description: string;
  category: string;
  sections: TemplateSection[];
  globalStyles: {
    fontFamily: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
  };
  isAIGenerated?: boolean; // New: Marks AI-generated layouts
  aiPrompt?: string; // New: Stores the original AI prompt
}

export interface Template {
  id: string;
  name: string;
  category: 'business' | 'portfolio' | 'ecommerce' | 'saas' | 'agency' | 'blog';
  thumbnail: string;
  components: ComponentData[];
  description: string;
  layout?: TemplateLayout; // New: Template can have a predefined layout
  isAIGenerated?: boolean; // New: Marks AI-generated templates
  aiPrompt?: string; // New: Stores the original AI prompt
}

export interface Project {
  id: string;
  name: string;
  components: ComponentData[];
  layout?: TemplateLayout; // New: Project can have an active layout
  settings: {
    theme: 'light' | 'dark';
    primaryColor: string;
    fontFamily: string;
  };
  lastModified: Date;
}

export type DeviceView = 'desktop' | 'tablet' | 'mobile';

export interface PreviewMode {
  isActive: boolean;
  type: 'component' | 'template' | 'layout' | 'full';
  targetId?: string;
  data?: any; // Preview data for AI-generated content
}

export interface AIGenerationRequest {
  prompt: string;
  type: 'component' | 'template' | 'layout';
  context?: {
    existingComponents?: ComponentData[];
    currentLayout?: TemplateLayout;
    targetSection?: string;
  };
}

export interface AIGenerationResult {
  success: boolean;
  data?: ComponentData | Template | TemplateLayout;
  error?: string;
  suggestions?: string[];
  metadata?: {
    generatedAt: Date;
    prompt: string;
    type: string;
  };
}