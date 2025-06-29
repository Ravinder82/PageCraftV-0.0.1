import { TemplateLayout } from '../types/builder';

export const templateLayouts: TemplateLayout[] = [
  {
    id: 'saas-standard',
    name: 'SaaS Standard',
    description: 'Classic SaaS layout with hero, features, testimonials, and pricing',
    category: 'saas',
    sections: [
      {
        id: 'header-section',
        name: 'Header',
        type: 'header',
        order: 0,
        height: 80,
        backgroundColor: '#FFFFFF',
        padding: 20,
        components: [],
        constraints: {
          maxComponents: 1,
          allowedTypes: ['text', 'button', 'image'],
          layout: 'flex'
        }
      },
      {
        id: 'hero-section',
        name: 'Hero Section',
        type: 'hero',
        order: 1,
        height: 600,
        backgroundColor: '#F8FAFC',
        padding: 60,
        components: [],
        constraints: {
          maxComponents: 1,
          allowedTypes: ['hero'],
          layout: 'flex'
        }
      },
      {
        id: 'features-section',
        name: 'Features',
        type: 'features',
        order: 2,
        height: 'auto',
        backgroundColor: '#FFFFFF',
        padding: 80,
        components: [],
        constraints: {
          maxComponents: 6,
          allowedTypes: ['feature'],
          layout: 'grid',
          columns: 3
        }
      },
      {
        id: 'testimonials-section',
        name: 'Testimonials',
        type: 'testimonials',
        order: 3,
        height: 'auto',
        backgroundColor: '#F9FAFB',
        padding: 80,
        components: [],
        constraints: {
          maxComponents: 3,
          allowedTypes: ['testimonial'],
          layout: 'grid',
          columns: 3
        }
      },
      {
        id: 'pricing-section',
        name: 'Pricing',
        type: 'pricing',
        order: 4,
        height: 'auto',
        backgroundColor: '#FFFFFF',
        padding: 80,
        components: [],
        constraints: {
          maxComponents: 4,
          allowedTypes: ['pricing'],
          layout: 'grid',
          columns: 3
        }
      },
      {
        id: 'contact-section',
        name: 'Contact',
        type: 'contact',
        order: 5,
        height: 'auto',
        backgroundColor: '#F8FAFC',
        padding: 80,
        components: [],
        constraints: {
          maxComponents: 1,
          allowedTypes: ['contact'],
          layout: 'flex'
        }
      }
    ],
    globalStyles: {
      fontFamily: 'Inter',
      primaryColor: '#3B82F6',
      secondaryColor: '#64748B',
      backgroundColor: '#FFFFFF'
    }
  },
  {
    id: 'business-professional',
    name: 'Business Professional',
    description: 'Professional business layout with services and team sections',
    category: 'business',
    sections: [
      {
        id: 'header-section',
        name: 'Header',
        type: 'header',
        order: 0,
        height: 80,
        backgroundColor: '#1E293B',
        padding: 20,
        components: [],
        constraints: {
          maxComponents: 1,
          allowedTypes: ['text', 'button', 'image'],
          layout: 'flex'
        }
      },
      {
        id: 'hero-section',
        name: 'Hero Section',
        type: 'hero',
        order: 1,
        height: 500,
        backgroundColor: '#0F172A',
        padding: 60,
        components: [],
        constraints: {
          maxComponents: 1,
          allowedTypes: ['hero'],
          layout: 'flex'
        }
      },
      {
        id: 'services-section',
        name: 'Services',
        type: 'features',
        order: 2,
        height: 'auto',
        backgroundColor: '#FFFFFF',
        padding: 80,
        components: [],
        constraints: {
          maxComponents: 4,
          allowedTypes: ['feature'],
          layout: 'grid',
          columns: 2
        }
      },
      {
        id: 'about-section',
        name: 'About Us',
        type: 'custom',
        order: 3,
        height: 'auto',
        backgroundColor: '#F1F5F9',
        padding: 80,
        components: [],
        constraints: {
          maxComponents: 3,
          allowedTypes: ['text', 'image'],
          layout: 'flex'
        }
      },
      {
        id: 'contact-section',
        name: 'Contact',
        type: 'contact',
        order: 4,
        height: 'auto',
        backgroundColor: '#FFFFFF',
        padding: 80,
        components: [],
        constraints: {
          maxComponents: 1,
          allowedTypes: ['contact'],
          layout: 'flex'
        }
      }
    ],
    globalStyles: {
      fontFamily: 'Inter',
      primaryColor: '#F97316',
      secondaryColor: '#64748B',
      backgroundColor: '#FFFFFF'
    }
  },
  {
    id: 'ecommerce-modern',
    name: 'E-commerce Modern',
    description: 'Modern e-commerce layout with product showcase and features',
    category: 'ecommerce',
    sections: [
      {
        id: 'header-section',
        name: 'Header',
        type: 'header',
        order: 0,
        height: 80,
        backgroundColor: '#FFFFFF',
        padding: 20,
        components: [],
        constraints: {
          maxComponents: 1,
          allowedTypes: ['text', 'button', 'image'],
          layout: 'flex'
        }
      },
      {
        id: 'hero-section',
        name: 'Hero Banner',
        type: 'hero',
        order: 1,
        height: 600,
        backgroundColor: '#FEF3F2',
        padding: 60,
        components: [],
        constraints: {
          maxComponents: 1,
          allowedTypes: ['hero'],
          layout: 'flex'
        }
      },
      {
        id: 'products-section',
        name: 'Featured Products',
        type: 'custom',
        order: 2,
        height: 'auto',
        backgroundColor: '#FFFFFF',
        padding: 80,
        components: [],
        constraints: {
          maxComponents: 8,
          allowedTypes: ['image', 'text', 'button'],
          layout: 'grid',
          columns: 4
        }
      },
      {
        id: 'features-section',
        name: 'Why Choose Us',
        type: 'features',
        order: 3,
        height: 'auto',
        backgroundColor: '#F9FAFB',
        padding: 80,
        components: [],
        constraints: {
          maxComponents: 3,
          allowedTypes: ['feature'],
          layout: 'grid',
          columns: 3
        }
      },
      {
        id: 'testimonials-section',
        name: 'Customer Reviews',
        type: 'testimonials',
        order: 4,
        height: 'auto',
        backgroundColor: '#FFFFFF',
        padding: 80,
        components: [],
        constraints: {
          maxComponents: 3,
          allowedTypes: ['testimonial'],
          layout: 'grid',
          columns: 3
        }
      }
    ],
    globalStyles: {
      fontFamily: 'Inter',
      primaryColor: '#DC2626',
      secondaryColor: '#64748B',
      backgroundColor: '#FFFFFF'
    }
  }
];

export const sectionTypes = [
  { type: 'header', name: 'Header', icon: 'Layout', description: 'Navigation and branding' },
  { type: 'hero', name: 'Hero', icon: 'Zap', description: 'Main banner section' },
  { type: 'features', name: 'Features', icon: 'Grid3X3', description: 'Feature showcase' },
  { type: 'testimonials', name: 'Testimonials', icon: 'MessageSquare', description: 'Customer testimonials' },
  { type: 'pricing', name: 'Pricing', icon: 'DollarSign', description: 'Pricing plans' },
  { type: 'contact', name: 'Contact', icon: 'Mail', description: 'Contact information' },
  { type: 'footer', name: 'Footer', icon: 'Layout', description: 'Footer content' },
  { type: 'custom', name: 'Custom', icon: 'Plus', description: 'Custom section' }
];