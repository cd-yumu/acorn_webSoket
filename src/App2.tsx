import { useEffect, useRef, useState } from "react"
import { useWebSocket } from "./hooks/useWebSocket";
import { v4 as uuid } from "uuid";

interface Message {
  id: string;
  content: string;
}

function App2() {


  // 이것도 다른 식으로 
  //let socket:WebSocket;
  //const socketRef = useRef<WebSocket | null>(null);
  

  const [msgs, setMsgs] = useState<Message[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // useWebSocket() hook 을 사용해서 웹 소켓 연결하기
  const {sendMessage, connected} = useWebSocket("ws://192.168.0.107:9000/ws", {
    // 연결 시 
    onOpen:()=>{
      console.log("연결됨!");
    },
    // 메시지 전송 시
    onMessage:(event)=>{
      setMsgs((prevState)=>[...prevState, {id:uuid(), content:event.data}]);
    },
    // 연결 종료 시
    onClose:()=>{
      console.log("연결 끊김!")
    }
  });
  // 구조 분해 할당하여 sendMessage 와 conneted(연결 여부: true/false) 사용
  // 웹 소켓 주소와 웹 소켓 사용시 옵션 값은 뒤 오브젝트에 적는다.


  // useEffect 사용 대신 만든 Hook 사용
  //   useEffect(()=>{
  //     // 컴포넌트가 활성화 되는 시점에 웹 소켓 접속하기
  //     const socket = new WebSocket("ws://192.168.0.107:9000/ws");
  //     //const socket = new WebSocket("ws://localhost:9000/ws");
  //     // 생성된 WebSocket 의 참조값을 socketRef 에 저장해두기
  //     socketRef.current = socket;

  //     socket.onopen = () => {
  //       socket.send("hi spring boot!");
  //     };

  //     // 서버에 메시지가 도착하면 실행 할 함수 등록
  //     socket.onmessage = (event)=>{
  //       // 콘솔창에 서버가 보낸 메시지 출력
  //       console.log(event.data);
  //       /*
  //        * useEffect() 함수 안에서 이전 상태값을 사용하면서 변경할때는 
  //         setState((prevState)=>{}) 형식으로 변경해야 한다.

  //         setState((prevState)=>{
  //           여기서 prevState 값을 이용해서 새로운 상태값을 만들어서 리턴해주면 된다.
  //         })
  //        */
  //       setMsgs((prevState)=> [...prevState, {id:uuid(), content:event.data}]);
  //     };
  //   },[]);

  const handleSend = () => {
    // 입력한 메시지 읽어와서
    const msg = inputRef.current?.value;

    // 서버에 전송할 정보를 담고 있는 object
    const obj = {
      path:"/chat/send",
      data:{
        text:msg
      }
    } // 단순히 문자열이 아닌 구조화된 데이터로 보내기 위해 

    // 전송하기
    //socket.send(msg);
    //socketRef.current?.send(msg); 대신에
    // object 를 json 문자열로 변환해서 전송하기
    sendMessage(JSON.stringify(obj));
    
    // 입력창 초기화
    inputRef.current!.value = "";
  }

  const divStyle = {
    height: "300px",
    width: "500px",
    backgroundColor: "#cecece",
    padding: "10px",
    overflowY: "auto",
    scrollBehavior: "smooth"
  };

  const divRef = useRef<HTMLDivElement>(null);
  // 자동 스크롤
  useEffect(() => {
    divRef.current!.scrollTop = divRef.current!.scrollHeight;
  }, [msgs]);

  const bubbleStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "8px 12px",
    marginBottom: "8px",
    display: "inline-block",
    maxWidth: "80%",
    boxShadow: "0 1px 4px rgba(0,0,0,0.2)"
  };

  return (
    <div>
      <h2>WebSocket {connected ? "✅ 연결됨" : "❌ 끊김"}</h2>
      <input type="text" ref={inputRef} />
      <button onClick={handleSend}>전송</button>
      <div style={divStyle} ref={divRef}>
        {msgs.map(item => (
          <div key={item.id}>
            <div style={bubbleStyle}>{item.content}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App2
