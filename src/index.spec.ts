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
        let result: Either<Object,Object> = pipe( 
            {"player": player, "lastMovePlayerWasY": this.lastMovePlayerWasY},
            this.errorIfWrongTurn
        )
        if (isLeft(result)){
            return result.left
        }

        this.lastMovePlayerWasY = player === 'Y'
        if( x > 2 || x < 0 || y > 2 || y < 0){
            return { 'error': 'move out of the board'}
        }
        if(this.alreadyUsed[x+""+y]){
            return { 'error': 'move on already taken place'}
        }
        this.alreadyUsed[x+""+y] = true;
        return { 'status': 'OK'}
    }

    errorIfWrongTurn({ player, lastMovePlayerWasY }): Either<Object,Object>{
        if(player !== 'X' && lastMovePlayerWasY ) {
            return left({'error': 'move by an incorrect player, expected X'})
        }
        return right("")
    }
 }



