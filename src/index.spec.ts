import { expect } from 'chai';
import { right, left, Either, isLeft } from "fp-ts/lib/Either"
import { pipe } from 'fp-ts/lib/function';

class TicTacToe {
    elegibility = new Elegibility();
    xTracker = new WinningPlayerTracker();
    yTracker = new WinningPlayerTracker();

    postAMove(x: number, y: number, player: string): any {
        var result = this.elegibility.isElegible(x,y,player)
        if(isLeft(result)){
            return result.left
        }
        if('X' == player && this.xTracker.trackAndCheckHasWonX(x,y)){
            return { 'winner': 'X'}
        }
        if('Y' == player && this.yTracker.trackAndCheckHasWonX(x,y)){
            return { 'winner': 'Y'}
        }
        return {'winner': 'not decided yet'}
    }
 }
 class WinningPlayerTracker {
    private rows = [0,0,0]
    private columns = [0,0,0]
    private diagonal = 0
    private upwardsDiagonal = 0

    trackAndCheckHasWonX(x: number, y: number): boolean {
        this.rows[y]++
        this.columns[x]++
        this.diagonal += x==y ? 1 : 0
        this.upwardsDiagonal += x+y==2 ? 1 :0
        if(this.rows[y] < 3 && this.columns[x] <3 && this.diagonal<3 && this.upwardsDiagonal<3){
            return false
        }
        return true
    }
 }

 class Elegibility {
    private alreadyUsed: { [id: string] : boolean; } = {};
    private lastMovePlayerWasY = true;
    public isElegible(x: number, y: number, player: string): any {
        let result: Either<any,any> = pipe( 
            //DB READ
            {"player": player, "lastMovePlayerWasY": this.lastMovePlayerWasY, "x":x , "y":y, "alreadyUsed": this.alreadyUsed},
            //
            errorIfWrongTurn,
            handlePreviousError_or_OutOfBoard,
            handlePreviousError_or_AlreadyTakenPlace
        )
        if (isLeft(result)){
            return result
        }
        //DB WRITE
        this.lastMovePlayerWasY = player === 'Y'
        this.alreadyUsed[x+""+y] = true;
        //
        return right({})
    }
 }

function errorIfWrongTurn(params): Either<any,any>{
    let { player, lastMovePlayerWasY } = params
    if(player !== 'X' && lastMovePlayerWasY ) {
        return left({'error': 'move by an incorrect player, expected X'})
    }
    return right(params)
}

function handlePreviousError_or_AlreadyTakenPlace(either: Either<any,any>): Either<any,any> {
    if(isLeft(either)){
        return either
    }
    return errorIfPlaceIsTaken(either.right)
}

function handlePreviousError_or_OutOfBoard(either: Either<any,any>): Either<any,any> {
    if(isLeft(either)){
        return either
    }
    return errorIfOutOfBoard(either.right)
}

 function errorIfOutOfBoard( params:any ):  Either<Object,Object> {
    let {x , y} = params;
    if( x > 2 || x < 0 || y > 2 || y < 0){
        return left({ 'error': 'move out of the board'})
    }
    return right(params)
}

function errorIfPlaceIsTaken(params: any): Either<Object,Object> {
    var { alreadyUsed, x, y } = params
    if(alreadyUsed[x+""+y]){
        return left({ 'error': 'move on already taken place'})
    }
    return right(params)
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
describe('TicTacToe Should', () => {
    it('prevent playing out of the board', () => {
        let tictactoe = new TicTacToe()
        expect(tictactoe.postAMove(4, 1, 'X'))
        .eql({ 'error': 'move out of the board'});
        expect(tictactoe.postAMove(-1, 1, 'X'))
        .eql({ 'error': 'move out of the board'});
        expect(tictactoe.postAMove(1, 4, 'X'))
        .eql({ 'error': 'move out of the board'});
        expect(tictactoe.postAMove(1, -1, 'X'))
        .eql({ 'error': 'move out of the board'});
    });
    it('allow playing inside of the board', () =>
    {
        let tictactoe = new TicTacToe();
        expect(tictactoe.postAMove(1, 1, 'X'))
        .eql({'winner': 'not decided yet'});
    })
    it('prevent playing two times in the same position',() => {
        let tictactoe = new TicTacToe();

        tictactoe.postAMove(1,1,'X')
        expect(tictactoe.postAMove(2,2,'X'))
        .eql({'winner': 'not decided yet'})
        expect(tictactoe.postAMove(2, 2, 'X'))
        .eql({ 'error': 'move on already taken place'});
    })
    it('prevent wrong player from posting',() => {
        let tictactoe = new TicTacToe();

        expect(tictactoe.postAMove(1,1,'Y'))
        .eql({'error': 'move by an incorrect player, expected X'})
    })
});


