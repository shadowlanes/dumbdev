/**
 * Centralized configuration for all mini apps in the catalog
 * Add new apps here to automatically include them in navigation
 */

export interface App {
  id: string
  name: string
  icon: string
  description: string
  link: string
  category: string
  status: 'active' | 'coming-soon' | 'beta'
  hasInternalNav: boolean // true if app has its own sidebar navigation
}

export const appCategories = {
  'color-tools': {
    id: 'color-tools',
    name: 'Color Tools',
    order: 1
  },
  'http-network': {
    id: 'http-network',
    name: 'HTTP & Network',
    order: 2
  },
  'development-utils': {
    id: 'development-utils',
    name: 'Development Utils',
    order: 3
  }
}

export const apps: App[] = [
  {
    id: 'http-codes',
    name: 'HTTP Codes',
    icon: '🔍',
    description: 'Quickly lookup and understand HTTP status codes with real-time search and detailed explanations',
    link: '/http-codes/',
    category: 'http-network',
    status: 'active',
    hasInternalNav: true
  },
  {
    id: 'color-palette-extractor',
    name: 'Color Palette Extractor',
    icon: '🎨',
    description: 'Extract beautiful color palettes from images using Vibrant.js',
    link: '/color-palette-extractor/',
    category: 'color-tools',
    status: 'active',
    hasInternalNav: false
  },
  {
    id: 'color-palette-generator',
    name: 'Color Palette Generator',
    icon: '🌈',
    description: 'Generate harmonious color palettes based on color theory principles',
    link: '/color-palette-generator/',
    category: 'color-tools',
    status: 'coming-soon',
    hasInternalNav: false
  }
]

/**
 * Get apps grouped by category
 */
export function getAppsByCategory() {
  const grouped: Record<string, App[]> = {}
  
  apps.forEach(app => {
    if (!grouped[app.category]) {
      grouped[app.category] = []
    }
    grouped[app.category].push(app)
  })
  
  return grouped
}

/**
 * Generate navigation items for top nav dropdown
 */
export function getNavItems() {
  return apps.map(app => ({
    text: `${app.icon} ${app.name}`,
    link: app.link
  }))
}

/**
 * Generate sidebar items for Apps Directory
 * Used by apps that don't have their own internal navigation
 */
export function getAppsDirectorySidebar() {
  const grouped = getAppsByCategory()
  const sidebar: any[] = []
  
  // Sort categories by order
  const sortedCategories = Object.keys(grouped).sort((a, b) => {
    return (appCategories[a as keyof typeof appCategories]?.order || 999) - 
           (appCategories[b as keyof typeof appCategories]?.order || 999)
  })
  
  sortedCategories.forEach(categoryId => {
    const category = appCategories[categoryId as keyof typeof appCategories]
    const categoryApps = grouped[categoryId]
    
    sidebar.push({
      text: category.name,
      items: categoryApps.map(app => ({
        text: `${app.icon} ${app.name}`,
        link: app.link
      }))
    })
  })
  
  return sidebar
}

