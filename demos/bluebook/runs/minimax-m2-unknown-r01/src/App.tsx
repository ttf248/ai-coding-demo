import SearchBar from './components/SearchBar'
import WaterfallGrid from './components/WaterfallGrid'
import DetailView from './components/DetailView'
import { useStore } from './store/useStore'

function App() {
  const { currentView, selectedPost } = useStore()

  if (currentView === 'detail' && selectedPost) {
    return <DetailView post={selectedPost} />
  }

  return (
    <div className="min-h-screen bg-bg-gray">
      <SearchBar />
      <WaterfallGrid />
    </div>
  )
}

export default App
