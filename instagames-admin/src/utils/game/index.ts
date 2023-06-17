import { Socket } from 'socket.io-client';

import { Game } from '@/store/game';

export interface IStartGame {
  start: boolean;
  symbol: 'x' | 'o';
}
export type IPlayMatrix = Array<Array<string | null>>;

class GameService {
  public async gameOn(socket: Socket): Promise<boolean> {
    return new Promise((rs, rj) => {
      socket.emit('gameOn');
    });
  }
  public async gameOff(socket: Socket): Promise<boolean> {
    return new Promise((rs, rj) => {
      socket.emit('gameOff');
    });
  }

  public async onGameStatus(socket: Socket, listener: (data: any) => void) {
    socket.on('status', listener);
  }
  public async getGameStatus(socket: Socket) {
    socket.emit('getStatus');
  }

  public async declareResult(
    socket: Socket,
    number: number,
    amount: number,
    winningRatio: number
  ) {
    socket.emit('result', number, amount, winningRatio);
  }

  public async trackResult(socket: Socket, listener: (data: any) => void) {
    socket.on('result', listener);
  }
  public async onStartGame(socket: Socket, listener: (data: Game) => void) {
    socket.on('gameOn', listener);
  }
  public async onGameOffTime(socket: Socket, listener: (data: any) => void) {
    socket.on('gameOffTime', listener);
  }

  public async onStartEnd(socket: Socket, listener: () => void) {
    socket.on('gameOff', listener);
  }

  public async gameWin(socket: Socket, message: string) {
    socket.emit('game_win', { message });
  }
  public async endConnection(socket: Socket) {
    socket.emit('disconnectNow');
  }

  public async onGameWin(socket: Socket, listiner: (message: string) => void) {
    socket.on('on_game_win', ({ message }) => listiner(message));
  }
}

export default new GameService();
