
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from "socket.io-client";

interface Message {
  username: string
  room: number
  text: string
}

@Injectable({
  providedIn: 'root'
})

export class SocketServiceService {

  private socket: Socket

  private _message: BehaviorSubject<string> = new BehaviorSubject('')
  message$ = this._message

  constructor() { 
    this.socket = io('http://localhost:3000')
  }

  makeConnection(user:{name:string,id:number}) {
    this.socket.on('connection-message', txt => {
      console.log(`${txt} ${user.name}`)
    })
  }

  
  joinRoom(data:{username:string,room:number}): void {
    this.socket.emit('join',data)
  }

  leaveRoom(data:{username:string,room:number}) {
    this.socket.emit('leave',data)
  }

  getJoinedUser() {
    let observable = new Observable<{username:string}> ( observer => {
      this.socket.on('user-joined', (username:string) => {
        observer.next({username:username})
      })
      return () => this.socket.disconnect()
    })
    return observable
  }

  getLeavedUser() {
    let observable = new Observable<{username:string}> ( observer => {
      this.socket.on('user-leaved', (username:string) => {
        observer.next({username:username})
      })
      return () => this.socket.disconnect()
    })
    return observable
  }
  
  sendMessage(data:Message): void {
    this.socket.emit('message', data)
  }

  getMessage() {
    let observable = new Observable<{username:string,text:string}> ( observer => {
      this.socket.on('new-message', (message:{username:string,text:string}) => {
        observer.next({username:message.username, text: message.text})
      })
      return () => this.socket.disconnect()
    })
    return observable
  }

  // disconnect(): void {}
}
