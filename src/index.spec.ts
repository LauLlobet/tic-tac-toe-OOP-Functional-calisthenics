import { expect } from 'chai';
 
class TicTacToe {
    postAMove(x: number, y: number, position: string): any {
        return null
    }
 }


describe('TicTacToe Should', () => {
    it('not win if theres no 3 contiguous moves', () => {
        let tictactoe = new TicTacToe()
        expect(tictactoe.postAMove(1, 1, 'X'))
        .eql({ 'winner': 'not decided yet'});
    });
});
