import './App.css';
import {useEffect, useRef, useState} from "react";
import * as SOCKET from './socket'
function App() {
    const [otherSocketId,setOtherSocketId]=useState('')
    const [file, setFile] = useState();
    useEffect(()=>{
        SOCKET.CreateConnection()
    },[])
    const selectFile=(e)=>{
        setFile(e.target.files[0])
    }
    return (
        <div className="App">
            <header className="App-header">
                <input onChange={selectFile} type="file" />

                <input className="box" value={otherSocketId} onChange={(e)=>{setOtherSocketId(e.target.value)}} placeholder="Put the user socketid you want to send"/>
                <button className="btn-1" onClick={()=>{
                    SOCKET.connectOtherUser(otherSocketId)
                }}>connect</button>

                <button className="btn-1" onClick={()=>{SOCKET.shareFile(file,otherSocketId)}}>send</button>
            </header>
        </div>
    );
}

export default App;