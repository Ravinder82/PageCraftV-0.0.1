import { Template } from '../types/builder';

export const templates: Template[] = [
  {
    id: 'saas-startup',
    name: 'SaaS Startup',
    category: 'saas',
    thumbnail: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Modern SaaS landing page with hero, features, and pricing',
    components: [
      {
        id: 'hero-1',
        type: 'hero',
        content: {
          title: 'Build Better Software Faster',
          subtitle: 'The complete development platform for teams that ship',
          buttonText: 'Start Free Trial',
          image: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        styles: {
          backgroundColor: '#F8FAFC',
          textColor: '#1E293B',
          buttonColor: '#3B82F6',
          padding: 60
        },
        position: { x: 0, y: 0 },
        size: { width: '100%', height: 600 }
      }
    ]
  },
  {
    id: 'business-agency',
    name: 'Business Agency',
    category: 'business',
    thumbnail: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Professional agency website with portfolio showcase',
    components: [
      {
        id: 'hero-2',
        type: 'hero',
        content: {
          title: 'Strategic Digital Solutions',
          subtitle: 'We help businesses grow through innovative digital strategies',
          buttonText: 'Get Started',
          image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        styles: {
          backgroundColor: '#0F172A',
          textColor: '#FFFFFF',
          buttonColor: '#F97316',
          padding: 60
        },
        position: { x: 0, y: 0 },
        size: { width: '100%', height: 600 }
      }
    ]
  },
  {
    id: 'ecommerce-store',
    name: 'E-commerce Store',
    category: 'ecommerce',
    thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Modern e-commerce landing page with product showcase',
    components: [
      {
        id: 'hero-3',
        type: 'hero',
        content: {
          title: 'Premium Quality Products',
          subtitle: 'Discover our curated collection of exceptional items',
          buttonText: 'Shop Now',
          image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        styles: {
          backgroundColor: '#FEF3F2',
          textColor: '#7C2D12',
          buttonColor: '#DC2626',
          padding: 60
        },
        position: { x: 0, y: 0 },
        size: { width: '100%', height: 600 }
      }
    ]
  }
];

// Template categories for AI-generated templates
export const templateCategories = {
  'saas': {
    name: 'SaaS Templates',
    description: 'AI-generated SaaS landing pages',
    icon: 'Zap'
  },
  'business': {
    name: 'Business Templates', 
    description: 'Professional business websites',
    icon: 'Building'
  },
  'ecommerce': {
    name: 'E-commerce Templates',
    description: 'Online store landing pages',
    icon: 'ShoppingCart'
  },
  'portfolio': {
    name: 'Portfolio Templates',
    description: 'Creative portfolio websites',
    icon: 'User'
  },
  'agency': {
    name: 'Agency Templates',
    description: 'Digital agency websites',
    icon: 'Users'
  },
  'blog': {
    name: 'Blog Templates',
    description: 'Content-focused websites',
    icon: 'FileText'
  }
};

export const componentLibrary = [
  {
    type: 'hero',
    name: 'Hero Section',
    icon: 'Zap',
    description: 'Eye-catching hero with title, subtitle, and CTA'
  },
  {
    type: 'feature',
    name: 'Features',
    icon: 'Grid3X3',
    description: 'Showcase your product features and benefits'
  },
  {
    type: 'testimonial',
    name: 'Testimonials',
    icon: 'MessageSquare',
    description: 'Social proof from satisfied customers'
  },
  {
    type: 'pricing',
    name: 'Pricing',
    icon: 'DollarSign',
    description: 'Clear pricing tiers and plans'
  },
  {
    type: 'contact',
    name: 'Contact Form',
    icon: 'Mail',
    description: 'Contact form for lead generation'
  },
  {
    type: 'text',
    name: 'Text Block',
    icon: 'Type',
    description: 'Formatted text content'
  },
  {
    type: 'image',
    name: 'Image',
    icon: 'Image',
    description: 'High-quality images and graphics'
  },
  {
    type: 'button',
    name: 'Button',
    icon: 'MousePointer',
    description: 'Call-to-action buttons'
  }
];