import type { ReactNode } from 'react'

interface CorporateLayoutProps {
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
  background?: 'default' | 'branded' | 'minimal'
  showFooter?: boolean
  companyName?: string
}

export function CorporateLayout({ 
  children, 
  maxWidth = 'md',
  background = 'default',
  showFooter = true,
  companyName = "Yaldabaoth Ficticious Bank"
}: CorporateLayoutProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  }

  const backgroundClasses = {
    default: 'bg-gradient-to-br from-slate-50 via-white to-slate-100',
    branded: 'bg-gradient-to-br from-green-50 via-white to-green-50',
    minimal: 'bg-white'
  }

  return (
    <div className={`min-h-screen ${backgroundClasses[background]} flex items-center justify-center p-4`}>
      <div className={`w-full ${maxWidthClasses[maxWidth]}`}>
        {children}
        
        {showFooter && (
          <div className="mt-8 text-center">
            <p className="text-xs text-[var(--corporate-text-muted)]">
              © 2025 {companyName}. Todos os direitos reservados.
            </p>
            <div className="flex items-center justify-center gap-4 mt-2 text-xs text-[var(--corporate-text-muted)]">
              <a href="#" className="hover:text-[var(--corporate-text-secondary)] transition-colors">
                Política de Privacidade
              </a>
              <span>•</span>
              <a href="#" className="hover:text-[var(--corporate-text-secondary)] transition-colors">
                Termos de Uso
              </a>
              <span>•</span>
              <a href="#" className="hover:text-[var(--corporate-text-secondary)] transition-colors">
                Suporte
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
