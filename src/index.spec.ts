import { expect } from 'chai';
 
class TicTacToe {
    xTracker = new WinningPlayerTracker();
    yTracker = new WinningPlayerTracker();

    postAMove(x: number, y: number, player: string): any {
        if('X' == player){
            if(this.xTracker.trackAndCheckHasWonX(x,y)){
                return { 'winner': 'X'}
            }
        }
        if('Y' == player){
            if(this.yTracker.trackAndCheckHasWonX(x,y)){
                return { 'winner': 'Y'}
            }
        }
        return {'winner': 'not decided yet'}
    }
 }

 class WinningPlayerTracker {
    public rows = [0,0,0]
    public columns = [0,0,0]
    public diagonal = 0
    public upwardsDiagonal = 0
    trackAndCheckHasWonX(x: number, y: number): any {
        this.rows[y] = this.rows[y] +1
        this.columns[x] = this.columns[x] +1
        this.diagonal += x==y ? 1 : 0
        this.upwardsDiagonal += x+y==2 ? 1 :0
        if(this.rows[y] < 3 && this.columns[x] <3 && this.diagonal<3 && this.upwardsDiagonal < 3){
            return false
        }
        return true
    }
 }


describe('TicTacToe Should', () => {
    it('not win if theres no 3 contiguous moves', () => {
        let tictactoe = new TicTacToe()
        expect(tictactoe.postAMove(0, 1, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(0, 2, 'Y')
        tictactoe.postAMove(1, 1, 'X')
        tictactoe.postAMove(1, 2, 'Y')
        expect(tictactoe.postAMove(1, 0, 'X'))
        .eql({ 'winner': 'not decided yet'});

    });
    it('win if there are three contiguopus moves on a first row', () => {
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
    it('win if there are three contiguopus moves on a second row', () => {
        let tictactoe = new TicTacToe()
        expect(tictactoe.postAMove(0, 2, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(0, 0, 'Y')
        expect(tictactoe.postAMove(2, 2, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(2, 0, 'Y')
        expect(tictactoe.postAMove(1, 2, 'X'))
        .eql({ 'winner': 'X'});
    })
    it('win if there are three contiguopus moves on a third row', () => {
        let tictactoe = new TicTacToe()
        expect(tictactoe.postAMove(0, 0, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(0, 1, 'Y')
        expect(tictactoe.postAMove(2, 0, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(2, 1, 'Y')
        expect(tictactoe.postAMove(1, 0, 'X'))
        .eql({ 'winner': 'X'});
    })
    it('win if there are three contiguopus moves on a first column', () => {
        let tictactoe = new TicTacToe()
        expect(tictactoe.postAMove(1, 0, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(2, 0, 'Y')
        expect(tictactoe.postAMove(1, 2, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(2, 2, 'Y')
        expect(tictactoe.postAMove(1, 1, 'X'))
        .eql({ 'winner': 'X'});
    })
    it('win if there are three contiguopus moves on a second column', () => {
        let tictactoe = new TicTacToe()
        expect(tictactoe.postAMove(2, 0, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(0, 0, 'Y')
        expect(tictactoe.postAMove(2, 2, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(0, 2, 'Y')
        expect(tictactoe.postAMove(2, 1, 'X'))
        .eql({ 'winner': 'X'});
    })
    it('win if there are three contiguopus moves on a third column', () => {
        let tictactoe = new TicTacToe()
        expect(tictactoe.postAMove(0, 0, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(1, 0, 'Y')
        expect(tictactoe.postAMove(0, 2, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(1, 2, 'Y')
        expect(tictactoe.postAMove(0, 1, 'X'))
        .eql({ 'winner': 'X'});
    })
    it('win if there are three contiguopus moves on a downwards diagonal', () => {
        let tictactoe = new TicTacToe()
        expect(tictactoe.postAMove(0, 0, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(0, 2, 'Y')
        expect(tictactoe.postAMove(2, 2, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(1, 2, 'Y')
        expect(tictactoe.postAMove(1, 1, 'X'))
        .eql({ 'winner': 'X'});
    })
    it('win if there are three contiguopus moves on a upwards diagonal', () => {
        let tictactoe = new TicTacToe()
        expect(tictactoe.postAMove(2, 0, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(1, 2, 'Y')
        expect(tictactoe.postAMove(0, 2, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(2, 1, 'Y')
        expect(tictactoe.postAMove(1, 1, 'X'))
        .eql({ 'winner': 'X'});
    })

    it('do not win if there are ">" shape done with two diagonals', () => {
        let tictactoe = new TicTacToe()
        expect(tictactoe.postAMove(0, 0, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(1, 2, 'Y')
        expect(tictactoe.postAMove(1, 1, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(2, 1, 'Y')
        expect(tictactoe.postAMove(0, 1, 'X'))
        .eql({ 'winner': 'not decided yet'});
    })

    //Y PLAYER WINS
    it('not win if theres no 3 contiguous moves', () => {
        let tictactoe = new TicTacToe()
        tictactoe.postAMove(2, 2, 'X')
        expect(tictactoe.postAMove(0, 1, 'Y'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(0, 2, 'X')
        tictactoe.postAMove(1, 1, 'Y')
        tictactoe.postAMove(1, 2, 'X')
        expect(tictactoe.postAMove(1, 0, 'Y'))
        .eql({ 'winner': 'not decided yet'});

    });
    it('win if there are three contiguopus moves on a first row', () => {
        let tictactoe = new TicTacToe()
        tictactoe.postAMove(0, 0, 'X')
        expect(tictactoe.postAMove(0, 1, 'Y'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(0, 2, 'X')
        expect(tictactoe.postAMove(2, 1, 'Y'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(2, 2, 'X')
        expect(tictactoe.postAMove(1, 1, 'Y'))
        .eql({ 'winner': 'Y'});
    })
    it('win if there are three contiguopus moves on a second row', () => {
        let tictactoe = new TicTacToe()
        tictactoe.postAMove(1, 1, 'X')
        expect(tictactoe.postAMove(0, 2, 'Y'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(0, 0, 'X')
        expect(tictactoe.postAMove(2, 2, 'Y'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(2, 0, 'X')
        expect(tictactoe.postAMove(1, 2, 'Y'))
        .eql({ 'winner': 'Y'});
    })
    it('win if there are three contiguopus moves on a third row', () => {
        let tictactoe = new TicTacToe()
        tictactoe.postAMove(1, 1, 'X')
        expect(tictactoe.postAMove(0, 0, 'Y'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(0, 1, 'X')
        expect(tictactoe.postAMove(2, 0, 'Y'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(2, 1, 'X')
        expect(tictactoe.postAMove(1, 0, 'Y'))
        .eql({ 'winner': 'Y'});
    })
    it('win if there are three contiguopus moves on a first column', () => {
        let tictactoe = new TicTacToe()
        tictactoe.postAMove(0, 0, 'X')
        expect(tictactoe.postAMove(1, 0, 'Y'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(2, 0, 'X')
        expect(tictactoe.postAMove(1, 2, 'Y'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(2, 2, 'X')
        expect(tictactoe.postAMove(1, 1, 'Y'))
        .eql({ 'winner': 'Y'});
    })
    it('win if there are three contiguopus moves on a second column', () => {
        let tictactoe = new TicTacToe()
        tictactoe.postAMove(1, 1, 'X')
        expect(tictactoe.postAMove(2, 0, 'Y'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(0, 0, 'X')
        expect(tictactoe.postAMove(2, 2, 'Y'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(0, 2, 'X')
        expect(tictactoe.postAMove(2, 1, 'Y'))
        .eql({ 'winner': 'Y'});
    })
    it('win if there are three contiguopus moves on a third column', () => {
        let tictactoe = new TicTacToe()
        tictactoe.postAMove(2, 2, 'X')
        expect(tictactoe.postAMove(0, 0, 'Y'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(1, 0, 'X')
        expect(tictactoe.postAMove(0, 2, 'Y'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(1, 2, 'X')
        expect(tictactoe.postAMove(0, 1, 'Y'))
        .eql({ 'winner': 'Y'});
    })
    it('win if there are three contiguopus moves on a downwards diagonal', () => {
        let tictactoe = new TicTacToe()
        tictactoe.postAMove(1, 0, 'X')
        expect(tictactoe.postAMove(0, 0, 'Y'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(0, 2, 'X')
        expect(tictactoe.postAMove(2, 2, 'Y'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(1, 2, 'X')
        expect(tictactoe.postAMove(1, 1, 'Y'))
        .eql({ 'winner': 'Y'});
    })
    it('win if there are three contiguopus moves on a upwards diagonal', () => {
        let tictactoe = new TicTacToe()
        tictactoe.postAMove(1, 0, 'X')
        expect(tictactoe.postAMove(2, 0, 'Y'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(1, 2, 'X')
        expect(tictactoe.postAMove(0, 2, 'Y'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(2, 1, 'X')
        expect(tictactoe.postAMove(1, 1, 'Y'))
        .eql({ 'winner': 'Y'});
    })
});
