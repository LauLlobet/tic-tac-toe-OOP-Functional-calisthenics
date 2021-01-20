import { expect } from 'chai';
 
class TicTacToe {
    public Xmoves = 0
    postAMove(x: number, y: number, player: string): any {
        if(player == 'X'){
            this.Xmoves++
        }
        if(this.Xmoves < 3){
            return { 'winner': 'not decided yet'}
        }
        return { 'winner': 'X'}
    }
 }


describe('TicTacToe Should', () => {
    it('not win if theres no 3 contiguous moves', () => {
        let tictactoe = new TicTacToe()
        expect(tictactoe.postAMove(1, 1, 'X'))
        .eql({ 'winner': 'not decided yet'});
    });
    it('win if there are three contiguopus moves', () => {
        let tictactoe = new TicTacToe()
        expect(tictactoe.postAMove(0, 1, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(0, 2, 'Y')
        expect(tictactoe.postAMove(2, 1, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(2, 2, 'Y')
        expect(tictactoe.postAMove(1, 1, 'X'))
        .eql({ 'winner': 'X'});
    })
});
