import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { BuilderProvider } from './hooks/useBuilder'
import { StageProvider } from './hooks/useStage'
import { VillageStoreProvider } from './hooks/useVillageStore'
import './styles/global.scss'

const container = document.getElementById('root')
if (!container) throw new Error('Missing #root')

createRoot(container).render(
  <StrictMode>
    <VillageStoreProvider>
      <StageProvider>
        <BuilderProvider>
          <App />
        </BuilderProvider>
      </StageProvider>
    </VillageStoreProvider>
  </StrictMode>,
)
