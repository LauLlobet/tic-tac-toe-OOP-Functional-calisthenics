import { expect } from 'chai';
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

class SquareBoardConstraints {
    public maximumWidthAndHeight = 2;
    public minimumWidthAndheight = 0;

    isInsideBoard(x: number, y:number){
        return x > this.maximumWidthAndHeight 
        || x < this.minimumWidthAndheight
        || y > this.maximumWidthAndHeight  
        || y < this.minimumWidthAndheight
    }
}
class TTTMoveElegibility {
    private alreadyUsed: { [id: string] : boolean; } = {};
    private lastMovePlayerWasY = true;
    private boardConstraints = new SquareBoardConstraints();

    isElegible(x: number, y: number, player: string): any {
        if(player !== 'X' && this.lastMovePlayerWasY ){
            return {'message': { 'error': 'move by an incorrect player, expected X'}, 'isElegible': false};
        }
        this.lastMovePlayerWasY = player === 'Y'
        if(this.boardConstraints.isInsideBoard(x,y) ) {
            return {'message': { 'error': 'move out of the board'}, 'isElegible': false};
        }
        if(this.alreadyUsed[x+""+y]){
            return {'message': { 'error': 'move on already taken place'}, 'isElegible': false};
        }
        this.alreadyUsed[x+""+y] = true;
        return {'isElegible': true};
    }
}
class TicTacToe {
    private tttMoveEligibility = new TTTMoveElegibility();

    postAMove(x: number, y: number, player: string): any {
        var {isElegible, message}= this.tttMoveEligibility.isElegible(x,y,player);
        if(!isElegible){
            return message;
        }
        return {'status': 'OK'};
    }
 }



