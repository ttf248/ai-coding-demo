import { useEffect } from 'react'
import { SearchBar } from './components/SearchBar'
import { Waterfall } from './components/Waterfall'
import { useStore } from './store/useStore'

function App() {
  const { refresh } = useStore()

  useEffect(() => {
    // 初始加载数据
    refresh()
  }, [refresh])

  return (
    <div className="min-h-screen bg-gray-100">
      <SearchBar />
      <Waterfall />
    </div>
  )
}

export default App
