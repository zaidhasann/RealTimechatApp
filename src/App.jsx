import React, { useEffect, useRef, useState } from 'react'
import { ZIM } from 'zego-zim-web';
import bg from "./assets/images.jpeg"

function App() {
const [zimInstance,setZimInstance] = useState(null)
const [userInfo,setUserInfo] = useState(null)
const [messageText,setMessageText]= useState("")
const [messages,setMessages]= useState([])
const [selectedUser,setSelectedUser]= useState("zee")
const [isLoggedIn,setIsLoggedIn]= useState(false)
const appID = 510564230;
const tokenA = "04AAAAAGjgPvIADAAx65WMB429jIJhmwCslactH/VzCnu0+janyn7L2hxUtd8hv0Ys8wZOzOqKJKqVpWf5D8hVZ+/O3OvHRdqYKxRMdVcTRIagQRjF/lMprPpPvMd3TQWEqVBdF9J5ztvARf4sQUQT9Hb66ErcNKvoMyfCiytmnsJlDxYRz6HII49qKV2yaWynQty0L6i/LSY/k8x7Dfq2uWt0RLu+XmD1RlLUJoVBRWS0y1gVGFtAdp3BCJaaH5DRtxFRTQE=";
const tokenB = "04AAAAAGjgPyYADB7AzB4wtoe+2OrXNwCu6R7czUzM7a5l9NtONu5ekhPOtROJSUZ0hGC+koT7oQkL2AF0RsqzHdDbVgAFubdlyx1PtQv/9CNnXsBApImwwudNFjBeZFcQt/lg1Mbr4daglNGJPHV6tB5gIXKL93jf1hRFLaN+ZqI1c+u+mwuh393kUMIwRNPC3tHtp40HWItDPrKYPgThznq6M9sKfBuGk5ozLf66rlm90g3kt3yeDYAu8tJxj7AMEA3CZml7AQ==";

const messageEndRef = useRef(null)

useEffect(() => {
  const instance = ZIM.create(appID)
  setZimInstance(instance)
  instance.on('error', function (zim, errorInfo) {
    console.log('error', errorInfo.code, errorInfo.message);
});

instance.on('connectionStateChanged', function (zim, { state, event }) {
    console.log('connectionStateChanged', state, event);
    
});

instance.on('peerMessageReceived', function (zim, { messageList }) {
    setMessages(prev=>[...prev,...messageList])
});

instance.on('tokenWillExpire', function (zim, { second }) {
    console.log('tokenWillExpire', second);
    // You can call the renewToken method to renew the token. 
    // To generate a new Token, refer to the Prerequisites.
    zim.renewToken(selectedUser==="zee"?tokenA:tokenB)
        .then(function(){
            console.log("token renewed");
            
        })
        .catch(function(err){
            console.log(err);
            
        })
});

return ()=>{
  instance.destroy()
}


}, [])

useEffect(()=>{
  if(messageEndRef.current){
     messageEndRef.current.scrollIntoView({behavior:'smooth'})
  }
 

},[messages])

const handleLogin =()=>{
  const info = {userID:selectedUser,userName:selectedUser==="zee"?"zee":"robin"};
  setUserInfo(info)
  const loginToken = selectedUser==="zee"?tokenA:tokenB;
  if(zimInstance){
  
  zimInstance.login(info, loginToken)
    .then(function () {
      setIsLoggedIn(true)
        console.log("logged in");
        
    })
    .catch(function (err) {
        console.log("login failed");
        
    });
  } else {
    console.log("instance error");
    
  }
}


const handleSendMessage = () =>{
  if(!isLoggedIn) return 
  const toConversationID = selectedUser==="zee"?"robin":"zee"; // Peer user's ID.
const conversationType = 0; 
const config = { 
    priority: 1, 
};

var messageTextObj = { 
  type: 1,
  message: messageText,
  extendedData:''
};

zimInstance.sendMessage(messageTextObj, toConversationID, conversationType, config)
    .then(function ({ message }) {
        setMessages(prev=>[...prev,message])
    })
    .catch(function (err) {
        console.log(err);
        
    });
    setMessageText("");
}

const formatTime = (timestamp)=>{
  const date = new Date(timestamp)
  return date.toLocaleTimeString([],{
    hour:'2-digit',minute:'2-digit'
  })
}




  return (
    <div className='p-[20px] w-full h-[100vh] flex items-center flex-col' style={{
      backgroundImage:`url(${bg})`,
      backgroundSize: "100% 100%"
    }}>
        <h1 className='text-white font-bold text-[30px]'>Real time Chat App</h1>

        {!isLoggedIn?(
         <div className="w-[90%] max-w-[400px] h-[400px] overflow-auto p-[20px] backdrop-blur shadow-2xl bg-white
  mt-[30px] rounded-xl flex flex-col items-center justify-center gap-[30px] border-2 border-gray-500">

  <h1 className="text-[30px] font-semibold text-orange-800">Select User</h1>

  <select
    className="px-[50px] py-[5px] rounded-xl bg-orange-200 text-black"
    onChange={(e) => setSelectedUser(e.target.value)}
    value={selectedUser}
  >
    <option value="zee">Zaid</option>
    <option value="robin">Robin</option>
  </select>
<button className="p-[10px] bg-yellow-900 text-white font-semibold cursor-pointer text-black rounded-lg w-[100px]" onClick={handleLogin}>
  Login
</button>


</div>

        ):(
        <div className="w-[90%] max-w-[600px] h-[600px] overflow-auto p-[20px] backdrop-blur shadow-2xl bg-white/60
  mt-[30px] rounded-xl flex flex-col items-center justify-center gap-[30px] border-2 border-gray-500">

           <h2 className='text-black text-[20px]'>{userInfo.userName} <span className='text-gray-500'>chatting with</span> {selectedUser==="zee"?"robin":"zee"}</h2>
           <div className='w-full h-[1px] bg-gray-800'></div>
           <div className='rounded-2x1 w-full p-[15px] pb-[120px] flex flex-col gap-[10px] h-[500px] overflow-auto'>
            {messages.map((msg,i)=>{
              const isOwnMessage = msg.senderUserID===userInfo.userID;
              return <div key={i} className={`flex w-full mb-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>

               <div
  className={`px-[20px] py-[10px] shadow-lg text-green-400 ${ isOwnMessage ? "bg-[#0f1010] rounded-br-none rounded-t-2xl rounded-bl-2xl" : "bg-[#1c2124] rounded-bl-none rounded-t-2xl rounded-br-2xl"}`}>

    <div>
      {msg.message}
    </div>
                </div>
                {formatTime(msg.timestamp)}
              </div>
            })}
            <div ref={messageEndRef}/>
            <div className="flex items-center justify-center gap-[20px] w-full h-[100px] fixed bottom-0 px-[20px] bg-white/50">
  <input
    type="text"
    placeholder="message"
    className="rounded-2xl bg-gray-700 outline-none text-white px-[20px] py-[10px] placeholder-white w-full"
    onChange={(e) => setMessageText(e.target.value)}
    value={messageText}
  />
  <button className="p-[10px] bg-yellow-900 text-white rounded-2xl w-[100px] font-semibold" onClick={handleSendMessage}>
    Send
  </button>
</div>

           </div>

        </div>)}
    </div>
  )
}

export default App