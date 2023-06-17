import { Socket } from 'socket.io-client'

export interface IStartGame {
  start: boolean
  symbol: 'x' | 'o'
}
export type IPlayMatrix = Array<Array<string | null>>

class GameService {
  public async joinGameRoom(socket: Socket, roomId: string): Promise<boolean> {
    return new Promise((rs, rj) => {
      socket.emit('join_game', { roomId })
      socket.on('room_joined', () => rs(true))
      socket.on('room_join_error', ({ error }) => rj(error))
    })
  }

  public async gameOn(socket: Socket): Promise<boolean> {
    return new Promise((rs, rj) => {
      socket.emit('gameOn')
      socket.on('gameTurnedOn', () => rs(true))
      socket.on('gameTurnedOn_error', () => rj(false))
    })
  }
  public async gameOff(socket: Socket): Promise<boolean> {
    return new Promise((rs, rj) => {
      socket.emit('gameOff')
      socket.on('gameTurnedOn', () => rs(true))
      socket.on('gameTurnedOn_error', () => rj(false))
    })
  }

  public async updateGame(socket: Socket, gameMatrix: IPlayMatrix) {
    socket.emit('update_game', { matrix: gameMatrix })
  }

  public async onGameUpdate(socket: Socket, listener: (matrix: IPlayMatrix) => void) {
    socket.on('on_game_update', ({ matrix }) => listener(matrix))
  }

  public async onGameStatus(socket: Socket, listener: (data: any) => void) {
    socket.on('status', listener)
  }

  public async onGameOffTime(socket: Socket, listener: (data: any) => void) {
    socket.on('gameOffTime', listener)
  }

  public async getGameStatus(socket: Socket) {
    socket.emit('getStatus')
  }

  public async trackResult(socket: Socket, listener: (data: any) => void) {
    socket.on('result', listener)
  }

  public async onStartGame(socket: Socket, listener: (data: any) => void) {
    socket.on('gameOn', listener)
  }
  public async onStartEnd(socket: Socket, listener: () => void) {
    socket.on('gameOff', listener)
  }

  public async gameWin(socket: Socket, message: string) {
    socket.emit('game_win', { message })
  }
  public async endConnection(socket: Socket) {
    socket.emit('disconnectNow')
  }

  public async onGameWin(socket: Socket, listener: (message: string) => void) {
    socket.on('on_game_win', ({ message }) => listener(message))
  }
}

export default new GameService()
