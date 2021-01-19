import { expect } from 'chai';
 
class TicTacToe {
    postAMove(x: number, y: number, position: string): any {
        return { 'error': 'move out of the board'}
    }
 }


describe('TicTacToe Should', () => {
    it('prevent playing out of the board', () => {
        let tictactoe = new TicTacToe()
        expect(tictactoe.postAMove(4, 1, 'X'))
        .eql({ 'error': 'move out of the board'});
    });
    it('allow playing inside of the board', () =>
    {
        let tictactoe = new TicTacToe();
        expect(tictactoe.postAMove(1, 1, 'X'))
        .eql({ 'status': 'OK'});
    })
});
