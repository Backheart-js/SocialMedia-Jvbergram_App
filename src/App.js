import { useSelector } from 'react-redux';
import './App.css';
import { firebaseSelector } from './redux/selector';

function App() {
  const fb = useSelector(firebaseSelector);

  console.log(typeof fb.FieldValue);

  return (
    <div className="App">
      <h1 className='font-semibold'>
        
      </h1>
    </div>
  );
}

export default App;
