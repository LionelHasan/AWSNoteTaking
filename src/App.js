
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TextEditor from './TextEditor';
import Layout from './Layout';
import SavedText from './SavedText';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Navigate to='/notes' />}/>
          <Route path="/notes" element={<TextEditor  />} />
          <Route path="/notes/:noteID/" element={<SavedText />} />
          <Route path="/notes/:noteID/edit/" element={<TextEditor  />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
