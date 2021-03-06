import './App.css';
import { useState, useEffect } from 'react';
import ImageUpload from '../imageUpload/ImageUpload';
import DisplayImage from '../displayImage/DisplayImage';
import Button from '@material-ui/core/Button';

interface Test {
  greet(): any;
}

function App() {
  const [file, setFile] = useState<string>('');
  const [isSubdividing, setisSubdividing] = useState<boolean>(false);
  const [counter, setCounter] = useState(0);
  const [loading, setLoading] = useState(false);
  const [wasm, setWasm] = useState<Test | undefined>(undefined);

  useEffect(() => {
    try {
      setLoading(true);
      import('quad-tree').then(wasm => {
        setWasm(wasm);
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let intervalId: any;

    if (isSubdividing) {
      intervalId = setInterval(() => {
        console.log("subdividing")

        setCounter(counter => counter + 1);
      }, 50)
    }

    return () => clearInterval(intervalId);
  }, [isSubdividing, counter]);

  useEffect(() => {
    setisSubdividing(false);
  }, [file]);

  return (
    <div className="App">
      <header className="App-header">
        <DisplayImage imageFile={file}/>
        <div>
          <div>
            {loading ? (<div/>) : <Button variant="contained" component="label" onClick={() => wasm !== undefined && wasm.greet()}>Test me</Button>}
          </div>
          <ImageUpload setFile={setFile}/>
          {startStopButton("Start", setisSubdividing, true)}
          {startStopButton("Stop", setisSubdividing, false)}
        </div>
      </header>
    </div>
  );

  function startStopButton(text: string, update: Function, value: boolean) {
    return (
      <Button variant="contained" component="label" onClick={() => update(value)}>{text}</Button>
    )
  }
}

export default App;
