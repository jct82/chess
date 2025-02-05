import { render, screen, fireEvent } from '@testing-library/react';
import AddBoard from '@/app/board/page';
import { getGame, setGame } from '@/utils/fentoboard';


// Mocking du module fentoboard et des composants externes
jest.mock('../../utils/fentoboard', () => ({
	getGame: jest.fn(),
	setGame: jest.fn(),
  }));

describe('AddBoard', () => {
	beforeEach(() => {
		// Simulation d'un jeu de départ pour les tests
		(setGame as jest.Mock).mockReturnValue([
		  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
		  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
		  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
		  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
		  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
		  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
		  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
		  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
		]);
	  });
	test('les pièces doivent se déplacer lorsqu\'elles sont cliquées', () => {
		render(<AddBoard/>);

		const board = screen.getByTestId('chess-board');
		fireEvent.mouseDown(board, { clientX: 50, clientY: 100 });
		setTimeout(() => {
			fireEvent.mouseUp(board, { clientX: 50, clientY: 200 });
		}, 500);

		expect(setGame).toHaveBeenCalled();
	});
});