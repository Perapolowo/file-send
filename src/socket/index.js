import socketClient from 'socket.io-client'
let otherUser;
let socket
let fileShare={}
let _chunk
let _buffer
let _metadata
export const CreateConnection=()=>{
    socket=socketClient('http://localhost:5000')

    socket.on('connection',()=>{
        console.log('socketid',socket.id)
        window.mySocketId=socket.id
    })

    socket.on('sender',(data)=>{
        console.log('data',data)
        window.senderSocketId=data.senderId
    })

    
    socket.on('send-file-meta-data',(data)=>{
        console.log(data)
        fileShare.metadata=data.metadata
        fileShare.transmitted=0
        fileShare.buffer=[]
        socket.emit('start-file-transfer',{
            to:data.from
        })
    })
    
    socket.on('start-file-transfer',(data)=>{
        console.log('durum',data)
        fileTransfer()

    })

    socket.on('incoming-file',(data)=>{
        fileShare.buffer.push(data.buffer)
        fileShare.transmitted+=data.buffer.byteLength
        console.log(fileShare.transmitted)
        console.log(fileShare.metadata)
        console.log(fileShare.buffer)

        if(fileShare.transmitted == fileShare.metadata.total_buffer_size){
            const f= new File(fileShare.buffer, fileShare.metadata.filename, { lastModified: new Date().getTime(), type: 'image/jpg' })
            console.log('file',f)
            const blob=new Blob(fileShare.buffer,{type:'image/jpg'})
            const a = document.createElement('a');
            document.body.appendChild(a);
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileShare.metadata.filename;
            a.click();
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }, 0)
            console.log('(new Blob(fileShare.buffer)',(new Blob(fileShare.buffer)))
            fileShare={}
        }else{
            socket.emit('start-file-transfer',{
                to:data.from
            })
        }
    })

}

export const fileTransfer=()=>{
    _chunk=_buffer.slice(0,_metadata.buffer_size)
    _buffer=_buffer.slice(_metadata.buffer_size,_buffer.length)
    if(_chunk.length!=0){
        console.log('c',_chunk)
        socket.emit('sending-file',{
            to:otherUser,
            buffer:_chunk,
            from:window.mySocketId
        })
    }
}

export const sendUserFile=(metadata,buffer,otherSocketId)=>{
    _metadata=metadata
    _buffer=buffer
    console.log('metada',metadata)
    console.log('buffer',buffer)
    socket.emit('send-file-meta-data',{
        from:window.mySocketId,
        metadata,
        to:otherSocketId
    })
}
export const shareFile=(file,otherSocketId)=>{
    let reader=new FileReader()
    reader.onload=(e)=>{
        let buffer=new Uint8Array(reader.result)
        sendUserFile({
            filename:file.name,
            total_buffer_size:buffer.length,
            buffer_size:1024
        },buffer,otherSocketId)
    }

    reader.readAsArrayBuffer(file)


}

export const connectOtherUser=(otherSocketId)=>{
    otherUser=otherSocketId
    socket.emit('sender',{
        to:otherSocketId,
        senderId:window.mySocketId
    })
}