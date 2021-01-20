import { expect } from 'chai';

/*
👌 Only one level of indentation per method
👌 Don’t use the ELSE keyword
   Wrap all primitives and strings
   First class collections (wrap all collections)
👌 Only one dot per line dog.Body.Tail.Wag() => dog.ExpressHappiness()
👌 No abbreviations
   Keep all entities small
👌 [10 files per package, 
👌  50 lines per class, 
    5 lines per method, 
    2 arguments per method]
   No classes with more than two instance variables
👌 No public getters/setters/properties
*/
class TicTacToe {
    private xPlayerTracker = new WinningPlayerTracker();
    private oPlayerTracker = new WinningPlayerTracker();    
    private moveEligibilityChecker = new MoveElegibilityChecker();

    postAMove(moveColumn: number, moveRow: number, movePlayerSymbol: string): any {
        var {isValidMove, invalidMoveMessage} = this.moveEligibilityChecker.isElegible(moveColumn,moveRow,movePlayerSymbol);
        if(!isValidMove){
            return invalidMoveMessage;
        }
        if('X' == movePlayerSymbol && this.xPlayerTracker.trackAndCheckIfHasWon(moveColumn,moveRow)){
            return { 'winner': 'X'}
        }
        if('O' == movePlayerSymbol && this.oPlayerTracker.trackAndCheckIfHasWon(moveColumn,moveRow)){
            return { 'winner': 'O'}
        }
        return {'winner': 'not decided yet'}
    }
 }

 class MoveElegibilityChecker {
    private alreadyUsedMove: { [moveId: string] : boolean; } = {};
    private isPreviousMoveO = true;
    isElegible(moveColumn: number, moveRow: number, movePlayerSymbol: string): any {
        if(movePlayerSymbol !== 'X' && this.isPreviousMoveO ){
            return {'invalidMoveMessage': { 'error': 'move by an incorrect player, expected X'}, 'isValidMove': false};
        }
        this.isPreviousMoveO = movePlayerSymbol === 'O'
        if( moveColumn > 2 || moveColumn < 0 || moveRow > 2 || moveRow < 0){
            return {'invalidMoveMessage': { 'error': 'move out of the board'}, 'isValidMove': false};
        }
        if(this.alreadyUsedMove[moveColumn+""+moveRow]){
            return {'invalidMoveMessage': { 'error': 'move on already taken place'}, 'isValidMove': false};
        }
        this.alreadyUsedMove[moveColumn+""+moveRow] = true;
        return {'isValidMove': true};
    }
}
 class WinningPlayerTracker {
    private accumulatedSymbolsPerRow = [0,0,0]
    private accumulatedSymbolsPerColumn = [0,0,0]
    private accumulatedSymbolsInDownwardsDiagonal = 0
    private accumulatedSymbolsInUpwardsDiagonal = 0

    trackAndCheckIfHasWon(newSymbolColumn: number, newSymbolRow: number): boolean {
        this.accumulatedSymbolsPerRow[newSymbolRow]++
        this.accumulatedSymbolsPerColumn[newSymbolColumn]++
        this.accumulatedSymbolsInDownwardsDiagonal += newSymbolColumn==newSymbolRow ? 1 : 0
        this.accumulatedSymbolsInUpwardsDiagonal += newSymbolColumn+newSymbolRow==2 ? 1 :0
        if(this.accumulatedSymbolsPerRow[newSymbolRow] < 3 
            && this.accumulatedSymbolsPerColumn[newSymbolColumn] <3 
            && this.accumulatedSymbolsInDownwardsDiagonal<3 
            && this.accumulatedSymbolsInUpwardsDiagonal<3){
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
