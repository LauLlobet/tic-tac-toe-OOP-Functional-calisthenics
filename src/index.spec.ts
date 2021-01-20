import { expect } from 'chai';
import { right, left, Either, isLeft } from "fp-ts/lib/Either"
import { pipe } from 'fp-ts/lib/function';



 /*
    ({} → nil) no code at all → code that employs nil
    (nil → constant)
    (constant → constant+) a simple constant to a more complex constant
    (constant → scalar) replacing a constant with a variable or an argument
    (statement → statements) adding more unconditional statements.
    (unconditional → if) splitting the execution path
    (scalar → array)
    (array → container)
    (statement → tail-recursion)
    (if → while)
    (statement → non-tail-recursion)
    (expression → function) replacing an expression with a function or algorithm
📌  (variable → assignment) replacing the value of a variable.
    (case) adding a case (or else) to an existing switch or if
*/

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
        .eql({ 'status': 'OK'});
    })
    it('prevent playing two times in the same position',() => {
        let tictactoe = new TicTacToe();

        tictactoe.postAMove(1,1,'X')
        expect(tictactoe.postAMove(2,2,'X'))
        .eql({'status':"OK"})
        expect(tictactoe.postAMove(2, 2, 'X'))
        .eql({ 'error': 'move on already taken place'});
    })
    it('prevent wrong player from posting',() => {
        let tictactoe = new TicTacToe();

        expect(tictactoe.postAMove(1,1,'Y'))
        .eql({'error': 'move by an incorrect player, expected X'})
    })
});
class TicTacToe {
    private alreadyUsed: { [id: string] : boolean; } = {};
    private lastMovePlayerWasY = true;
    postAMove(x: number, y: number, player: string): any {
        let result: Either<any,any> = pipe( 
            //DB READ
            {"player": player, "lastMovePlayerWasY": this.lastMovePlayerWasY, "x":x , "y":y, "alreadyUsed": this.alreadyUsed},
            //
            errorIfWrongTurn,
            handlePreviousError_or_OutOfBoard,
            handlePreviousError_or_AlreadyTakenPlace
        )
        if (isLeft(result)){
            return result.left
        }
        //DB WRITE
        this.lastMovePlayerWasY = player === 'Y'
        this.alreadyUsed[x+""+y] = true;
        //
        return { 'status': 'OK'}
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


