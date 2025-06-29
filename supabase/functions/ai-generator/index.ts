const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userPrompt, target, context } = await req.json()

    if (!userPrompt || !target) {
      return new Response(
        JSON.stringify({ error: 'Missing userPrompt or target parameter' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Enhanced system prompts for different targets
    const systemPrompts = {
      component: `You are a JSON generator for landing page components. You MUST respond with ONLY valid JSON, no explanations.

Return a JSON object matching this exact structure:

{
  "id": "component_" + timestamp + "_" + randomString,
  "type": "feature",
  "content": {
    "title": "Component Title",
    "description": "Component description"
  },
  "styles": {
    "backgroundColor": "#FFFFFF",
    "textColor": "#1E293B",
    "padding": 40
  },
  "position": { "x": 100, "y": 150 },
  "size": { "width": 350, "height": 250 },
  "isAIGenerated": true
}

Component types available: hero, feature, testimonial, pricing, contact, text, image, button

Content structure by type:
- hero: { title, subtitle, buttonText, image }
- feature: { title, description, icon }
- testimonial: { name, role, content, avatar }
- pricing: { title, price, period, features[], buttonText }
- contact: { title, subtitle, fields[] }
- text: { content }
- image: { src, alt }
- button: { text, link }

CRITICAL RULES:
- Respond with ONLY the JSON object
- No markdown code blocks
- No explanations or additional text
- Use real Pexels URLs for images
- Generate unique IDs with timestamps
- Set appropriate sizes and positions`,

      template: `You are a JSON generator for landing page templates. You MUST respond with ONLY valid JSON, no explanations.

Return a JSON object matching this exact structure:

{
  "id": "template_" + timestamp + "_" + randomString,
  "name": "Template Name",
  "category": "saas",
  "thumbnail": "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=400",
  "description": "Brief description",
  "isAIGenerated": true,
  "components": [
    {
      "id": "hero_" + timestamp + "_" + randomString,
      "type": "hero",
      "content": {
        "title": "Main Title",
        "subtitle": "Subtitle text",
        "buttonText": "Call to Action",
        "image": "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      "styles": {
        "backgroundColor": "#F8FAFC",
        "textColor": "#1E293B",
        "buttonColor": "#3B82F6",
        "padding": 60
      },
      "position": { "x": 0, "y": 0 },
      "size": { "width": "100%", "height": 600 },
      "isAIGenerated": true
    }
  ]
}

Categories: saas, business, ecommerce, portfolio, agency, blog

CRITICAL RULES:
- Respond with ONLY the JSON object
- No markdown code blocks
- No explanations or additional text
- Use real Pexels URLs
- Generate unique IDs with timestamps
- Hero components must have width: "100%" and height: 600
- Include 3-6 components for a complete template`,

      layout: `You are a JSON generator for template layouts. You MUST respond with ONLY valid JSON, no explanations.

Return a JSON object matching this exact structure:

{
  "id": "layout_" + timestamp + "_" + randomString,
  "name": "Layout Name",
  "description": "Layout description",
  "category": "saas",
  "isAIGenerated": true,
  "sections": [
    {
      "id": "section_" + timestamp + "_" + randomString,
      "name": "Hero Section",
      "type": "hero",
      "order": 1,
      "height": 600,
      "backgroundColor": "#F8FAFC",
      "padding": 60,
      "components": [],
      "constraints": {
        "maxComponents": 1,
        "allowedTypes": ["hero"],
        "layout": "flex"
      }
    }
  ],
  "globalStyles": {
    "fontFamily": "Inter",
    "primaryColor": "#3B82F6",
    "secondaryColor": "#64748B",
    "backgroundColor": "#FFFFFF"
  }
}

Section types: header, hero, features, testimonials, pricing, contact, footer, custom
Layout types: flex, grid, absolute
Height: number or "auto"

CRITICAL RULES:
- Respond with ONLY the JSON object
- No markdown code blocks
- No explanations or additional text
- Generate unique IDs with timestamps
- Include 4-7 sections for a complete layout
- Set appropriate constraints for each section`
    }

    const systemPrompt = systemPrompts[target as keyof typeof systemPrompts]
    
    if (!systemPrompt) {
      return new Response(
        JSON.stringify({ error: 'Invalid target. Must be "template", "component", or "layout"' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Enhanced prompt with context
    let enhancedPrompt = `Generate a ${target} for: ${userPrompt}.`
    
    if (context) {
      if (context.currentLayout) {
        enhancedPrompt += ` Current layout has ${context.currentLayout.sections.length} sections.`
      }
      if (context.existingComponents && context.existingComponents.length > 0) {
        enhancedPrompt += ` Existing components: ${context.existingComponents.map(c => c.type).join(', ')}.`
      }
      if (context.targetSection) {
        enhancedPrompt += ` Target section: ${context.targetSection}.`
      }
    }
    
    enhancedPrompt += ' Remember: respond with ONLY valid JSON, no other text.'

    // Call OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
        "HTTP-Referer": "https://pagecraft-builder.netlify.app",
        "X-Title": "PageCraft Landing Page Builder",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "anthropic/claude-3.5-sonnet",
        "messages": [
          {
            "role": "system",
            "content": systemPrompt
          },
          {
            "role": "user",
            "content": enhancedPrompt
          }
        ],
        "temperature": 0.3,
        "max_tokens": 3000
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenRouter API error:', errorText)
      return new Response(
        JSON.stringify({ error: 'AI service unavailable', details: errorText }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const aiResponse = await response.json()
    const aiContent = aiResponse.choices?.[0]?.message?.content

    if (!aiContent) {
      return new Response(
        JSON.stringify({ error: 'No content received from AI' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Raw AI Response:', aiContent)

    // Clean and extract JSON
    function cleanAndParseJSON(text: string): any {
      // Remove any markdown code blocks
      let cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '')
      
      // Remove any leading/trailing whitespace
      cleaned = cleaned.trim()
      
      // Find the first { and last }
      const firstBrace = cleaned.indexOf('{')
      const lastBrace = cleaned.lastIndexOf('}')
      
      if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
        throw new Error('No valid JSON object found')
      }
      
      const jsonStr = cleaned.substring(firstBrace, lastBrace + 1)
      return JSON.parse(jsonStr)
    }

    // Try to parse the AI response as JSON
    try {
      const parsedContent = cleanAndParseJSON(aiContent)
      
      // Validate the structure
      if (target === 'template') {
        if (!parsedContent.id || !parsedContent.name || !parsedContent.components) {
          throw new Error('Invalid template structure')
        }
      } else if (target === 'component') {
        if (!parsedContent.id || !parsedContent.type || !parsedContent.content) {
          throw new Error('Invalid component structure')
        }
      } else if (target === 'layout') {
        if (!parsedContent.id || !parsedContent.name || !parsedContent.sections) {
          throw new Error('Invalid layout structure')
        }
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: parsedContent
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      console.error('Raw content:', aiContent)
      
      // Return enhanced fallback responses
      const fallbackData = target === 'template' ? {
        id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: "AI Generated Template",
        category: "saas",
        thumbnail: "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "AI generated landing page template",
        isAIGenerated: true,
        components: [
          {
            id: `hero_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: "hero",
            content: {
              title: "Welcome to Our Platform",
              subtitle: "Transform your business with our innovative solutions",
              buttonText: "Get Started",
              image: "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=800"
            },
            styles: {
              backgroundColor: "#F8FAFC",
              textColor: "#1E293B",
              buttonColor: "#3B82F6",
              padding: 60
            },
            position: { x: 0, y: 0 },
            size: { width: "100%", height: 600 },
            isAIGenerated: true
          }
        ]
      } : target === 'layout' ? {
        id: `layout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: "AI Generated Layout",
        description: "AI generated section layout",
        category: "saas",
        isAIGenerated: true,
        sections: [
          {
            id: `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: "Hero Section",
            type: "hero",
            order: 1,
            height: 600,
            backgroundColor: "#F8FAFC",
            padding: 60,
            components: [],
            constraints: {
              maxComponents: 1,
              allowedTypes: ["hero"],
              layout: "flex"
            }
          }
        ],
        globalStyles: {
          fontFamily: "Inter",
          primaryColor: "#3B82F6",
          secondaryColor: "#64748B",
          backgroundColor: "#FFFFFF"
        }
      } : {
        id: `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: "feature",
        content: {
          title: "Amazing Feature",
          description: "This feature will help you achieve your goals"
        },
        styles: {
          backgroundColor: "#FFFFFF",
          textColor: "#1E293B",
          padding: 40
        },
        position: { x: 100, y: 150 },
        size: { width: 350, height: 250 },
        isAIGenerated: true
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: fallbackData,
          warning: 'Used fallback due to AI parsing error'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})