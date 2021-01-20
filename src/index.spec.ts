import { expect } from 'chai';

/*
👌 Only one level of indentation per method
👌 Don’t use the ELSE keyword
👌 Wrap all primitives and strings
👌 First class collections (wrap all collections)
👌 Only one dot per line dog.Body.Tail.Wag() => dog.ExpressHappiness()
👌 No abbreviations
   Keep all entities small
👌 [10 files per package, 
👌  50 lines per class, 
    5 lines per method, 
👌  2 arguments per method]
   No classes with more than two instance variables
   No public getters/setters/properties
*/

class TicTacToe {
    private xPlayerTracker = new WinningPlayerTracker();
    private oPlayerTracker = new WinningPlayerTracker();    
    private moveEligibilityChecker = new MoveElegibilityChecker();

    postAMove(moveColumn: number, moveRow: number, movePlayerSymbolString: string): any {
        var move = new MovePosition(moveColumn,moveRow)
        var movePlayerSymbol : Symbol = movePlayerSymbolString == O.ssymbol() ? new O() : new X();
        var {isValidMove, invalidMoveMessage} = this.moveEligibilityChecker.isElegible(move,movePlayerSymbol);
        if(!isValidMove){
            return invalidMoveMessage;
        }
        if(X.equals(movePlayerSymbol) && this.xPlayerTracker.trackAndCheckIfHasWon(move)){
            return { 'winner': X.ssymbol()}
        }
        if(O.equals(movePlayerSymbol) && this.oPlayerTracker.trackAndCheckIfHasWon(move)){
            return { 'winner': O.ssymbol()}
        }
        return {'winner': 'not decided yet'}
    }
 }

 class MoveElegibilityChecker {
    private alreadyUsedMove: { [moveId: string] : boolean; } = {};
    private isOLastMove = true;
    isElegible(movePosition: MovePosition, movePlayerSymbol: Symbol): any {
        if(O.equals(movePlayerSymbol) && this.isOLastMove ){
            return {'invalidMoveMessage': { 'error': 'move by an incorrect player, expected X'}, 'isValidMove': false};
        }
        this.isOLastMove = O.equals(movePlayerSymbol)
        if(Board.isOutsideRange(movePosition)){
            return {'invalidMoveMessage': { 'error': 'move out of the board'}, 'isValidMove': false};
        }
        if(this.alreadyUsedMove[movePosition.id()]){
            return {'invalidMoveMessage': { 'error': 'move on already taken place'}, 'isValidMove': false};
        }
        this.alreadyUsedMove[movePosition.id()] = true;
        return {'isValidMove': true};
    }
}
 class WinningPlayerTracker {
    private accumulatedSymbolsPerRow : AccumulatedSymbolsPerAxis= new AccumulatedSymbolsPerAxis();
    private accumulatedSymbolsPerColumn : AccumulatedSymbolsPerAxis= new AccumulatedSymbolsPerAxis();
    private accumulatedSymbolsInDownwardsDiagonal = 0
    private accumulatedSymbolsInUpwardsDiagonal = 0

    trackAndCheckIfHasWon(move: MovePosition): boolean {
        this.accumulatedSymbolsPerRow.accumulateOneMoreAt(move.row)
        this.accumulatedSymbolsPerColumn.accumulateOneMoreAt(move.column)
        this.accumulatedSymbolsInDownwardsDiagonal += move.isInAscendingDiagonal() ? 1 : 0
        this.accumulatedSymbolsInUpwardsDiagonal += move.isInDescendingDiagonal() ? 1 :0
        if(    this.accumulatedSymbolsPerRow.isFullOn(move.row)
            || this.accumulatedSymbolsPerColumn.isFullOn(move.column)
            || this.accumulatedSymbolsInDownwardsDiagonal >=  Board.rowColumnAndDiagonalLength()
            || this.accumulatedSymbolsInUpwardsDiagonal >=  Board.rowColumnAndDiagonalLength()){
            return true
        }
        return false
    }
 }

 class AccumulatedSymbolsPerAxis {
    private accumulatedSymbolsPerAxis = [0,0,0]
    public accumulateOneMoreAt(positionInAxis: number){
        this.accumulatedSymbolsPerAxis[positionInAxis]++
    }
    public isFullOn(positionInAxis: number): boolean{
        return this.accumulatedSymbolsPerAxis[positionInAxis] >=  Board.rowColumnAndDiagonalLength()
    }
 }
 class Board {
    static isOutsideRange(movePosition: MovePosition){
        return movePosition.column > 2 || movePosition.column < 0 || movePosition.row > 2 || movePosition.row < 0;
    }
    static rowColumnAndDiagonalLength(){
        return 3;
    }
}

 class MovePosition {
    isInDescendingDiagonal():boolean {
        return this.column+this.row==2
    }
    isInAscendingDiagonal():boolean {
       return this.row==this.column 
    }
    column: number; 
    row: number; 
    constructor(column: number, row: number){ this.column = column; this.row = row}
    id():string{return this.column+"-"+this.row} 
}

interface Symbol {symbol: string}
class X implements Symbol {static ssymbol(){return 'X'}; symbol='X' ; static equals(symbol :Symbol){return symbol.symbol == this.ssymbol()} }
class O implements Symbol {static ssymbol(){return 'O'}; symbol='O' ; static equals(symbol :Symbol){return symbol.symbol == this.ssymbol()} }




describe('TicTacToe Should', () => {
    it('not win if theres no 3 contiguous moves', () => {
        let tictactoe = new TicTacToe()
        expect(tictactoe.postAMove(0, 1, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(0, 2, 'O')
        tictactoe.postAMove(1, 1, 'X')
        tictactoe.postAMove(1, 2, 'O')
        expect(tictactoe.postAMove(1, 0, 'X'))
        .eql({ 'winner': 'not decided yet'});

    });
    it('win if there are three contiguopus moves on a first row', () => {
        let tictactoe = new TicTacToe()
        expect(tictactoe.postAMove(0, 1, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(0, 2, 'O')
        expect(tictactoe.postAMove(2, 1, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(2, 2, 'O')
        expect(tictactoe.postAMove(1, 1, 'X'))
        .eql({ 'winner': 'X'});
    })
    it('win if there are three contiguopus moves on a second row', () => {
        let tictactoe = new TicTacToe()
        expect(tictactoe.postAMove(0, 2, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(0, 0, 'O')
        expect(tictactoe.postAMove(2, 2, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(2, 0, 'O')
        expect(tictactoe.postAMove(1, 2, 'X'))
        .eql({ 'winner': 'X'});
    })
    it('win if there are three contiguopus moves on a third row', () => {
        let tictactoe = new TicTacToe()
        expect(tictactoe.postAMove(0, 0, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(0, 1, 'O')
        expect(tictactoe.postAMove(2, 0, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(2, 1, 'O')
        expect(tictactoe.postAMove(1, 0, 'X'))
        .eql({ 'winner': 'X'});
    })
    it('win if there are three contiguopus moves on a first column', () => {
        let tictactoe = new TicTacToe()
        expect(tictactoe.postAMove(1, 0, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(2, 0, 'O')
        expect(tictactoe.postAMove(1, 2, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(2, 2, 'O')
        expect(tictactoe.postAMove(1, 1, 'X'))
        .eql({ 'winner': 'X'});
    })
    it('win if there are three contiguopus moves on a second column', () => {
        let tictactoe = new TicTacToe()
        expect(tictactoe.postAMove(2, 0, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(0, 0, 'O')
        expect(tictactoe.postAMove(2, 2, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(0, 2, 'O')
        expect(tictactoe.postAMove(2, 1, 'X'))
        .eql({ 'winner': 'X'});
    })
    it('win if there are three contiguopus moves on a third column', () => {
        let tictactoe = new TicTacToe()
        expect(tictactoe.postAMove(0, 0, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(1, 0, 'O')
        expect(tictactoe.postAMove(0, 2, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(1, 2, 'O')
        expect(tictactoe.postAMove(0, 1, 'X'))
        .eql({ 'winner': 'X'});
    })
    it('win if there are three contiguopus moves on a downwards diagonal', () => {
        let tictactoe = new TicTacToe()
        expect(tictactoe.postAMove(0, 0, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(0, 2, 'O')
        expect(tictactoe.postAMove(2, 2, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(1, 2, 'O')
        expect(tictactoe.postAMove(1, 1, 'X'))
        .eql({ 'winner': 'X'});
    })
    it('win if there are three contiguopus moves on a upwards diagonal', () => {
        let tictactoe = new TicTacToe()
        expect(tictactoe.postAMove(2, 0, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(1, 2, 'O')
        expect(tictactoe.postAMove(0, 2, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(2, 1, 'O')
        expect(tictactoe.postAMove(1, 1, 'X'))
        .eql({ 'winner': 'X'});
    })

    it('do not win if there are ">" shape done with two diagonals', () => {
        let tictactoe = new TicTacToe()
        expect(tictactoe.postAMove(0, 0, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(1, 2, 'O')
        expect(tictactoe.postAMove(1, 1, 'X'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(2, 1, 'O')
        expect(tictactoe.postAMove(0, 1, 'X'))
        .eql({ 'winner': 'not decided yet'});
    })

    //Y PLAYER WINS
    it('not win if theres no 3 contiguous moves', () => {
        let tictactoe = new TicTacToe()
        tictactoe.postAMove(2, 2, 'X')
        expect(tictactoe.postAMove(0, 1, 'O'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(0, 2, 'X')
        tictactoe.postAMove(1, 1, 'O')
        tictactoe.postAMove(1, 2, 'X')
        expect(tictactoe.postAMove(1, 0, 'O'))
        .eql({ 'winner': 'not decided yet'});

    });
    it('win if there are three contiguopus moves on a first row', () => {
        let tictactoe = new TicTacToe()
        tictactoe.postAMove(0, 0, 'X')
        expect(tictactoe.postAMove(0, 1, 'O'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(0, 2, 'X')
        expect(tictactoe.postAMove(2, 1, 'O'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(2, 2, 'X')
        expect(tictactoe.postAMove(1, 1, 'O'))
        .eql({ 'winner': 'O'});
    })
    it('win if there are three contiguopus moves on a second row', () => {
        let tictactoe = new TicTacToe()
        tictactoe.postAMove(1, 1, 'X')
        expect(tictactoe.postAMove(0, 2, 'O'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(0, 0, 'X')
        expect(tictactoe.postAMove(2, 2, 'O'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(2, 0, 'X')
        expect(tictactoe.postAMove(1, 2, 'O'))
        .eql({ 'winner': 'O'});
    })
    it('win if there are three contiguopus moves on a third row', () => {
        let tictactoe = new TicTacToe()
        tictactoe.postAMove(1, 1, 'X')
        expect(tictactoe.postAMove(0, 0, 'O'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(0, 1, 'X')
        expect(tictactoe.postAMove(2, 0, 'O'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(2, 1, 'X')
        expect(tictactoe.postAMove(1, 0, 'O'))
        .eql({ 'winner': 'O'});
    })
    it('win if there are three contiguopus moves on a first column', () => {
        let tictactoe = new TicTacToe()
        tictactoe.postAMove(0, 0, 'X')
        expect(tictactoe.postAMove(1, 0, 'O'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(2, 0, 'X')
        expect(tictactoe.postAMove(1, 2, 'O'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(2, 2, 'X')
        expect(tictactoe.postAMove(1, 1, 'O'))
        .eql({ 'winner': 'O'});
    })
    it('win if there are three contiguopus moves on a second column', () => {
        let tictactoe = new TicTacToe()
        tictactoe.postAMove(1, 1, 'X')
        expect(tictactoe.postAMove(2, 0, 'O'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(0, 0, 'X')
        expect(tictactoe.postAMove(2, 2, 'O'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(0, 2, 'X')
        expect(tictactoe.postAMove(2, 1, 'O'))
        .eql({ 'winner': 'O'});
    })
    it('win if there are three contiguopus moves on a third column', () => {
        let tictactoe = new TicTacToe()
        tictactoe.postAMove(2, 2, 'X')
        expect(tictactoe.postAMove(0, 0, 'O'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(1, 0, 'X')
        expect(tictactoe.postAMove(0, 2, 'O'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(1, 2, 'X')
        expect(tictactoe.postAMove(0, 1, 'O'))
        .eql({ 'winner': 'O'});
    })
    it('win if there are three contiguopus moves on a downwards diagonal', () => {
        let tictactoe = new TicTacToe()
        tictactoe.postAMove(1, 0, 'X')
        expect(tictactoe.postAMove(0, 0, 'O'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(0, 2, 'X')
        expect(tictactoe.postAMove(2, 2, 'O'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(1, 2, 'X')
        expect(tictactoe.postAMove(1, 1, 'O'))
        .eql({ 'winner': 'O'});
    })
    it('win if there are three contiguopus moves on a upwards diagonal', () => {
        let tictactoe = new TicTacToe()
        tictactoe.postAMove(1, 0, 'X')
        expect(tictactoe.postAMove(2, 0, 'O'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(1, 2, 'X')
        expect(tictactoe.postAMove(0, 2, 'O'))
        .eql({ 'winner': 'not decided yet'});
        tictactoe.postAMove(2, 1, 'X')
        expect(tictactoe.postAMove(1, 1, 'O'))
        .eql({ 'winner': 'O'});
    });
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
        .eql({"winner": "not decided yet"});
    })
    it('prevent playing two times in the same position',() => {
        let tictactoe = new TicTacToe();

        tictactoe.postAMove(1,1,'X')
        expect(tictactoe.postAMove(2,2,'X'))
        .eql({"winner": "not decided yet"})
        expect(tictactoe.postAMove(2, 2, 'X'))
        .eql({ 'error': 'move on already taken place'});
    })
    it('prevent wrong player from posting',() => {
        let tictactoe = new TicTacToe();

        expect(tictactoe.postAMove(1,1,'O'))
        .eql({'error': 'move by an incorrect player, expected X'})
    })
});
