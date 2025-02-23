import { JSX } from "react";

const pieceTranslate: Record<string, string> = {
	Pawn: 'p',
	Rook: 'r',
	Knight: 'n',
	Bishop: 'b',
	Queen: 'q',
	King: 'k'
}

/**
 * Split infos contained in a string as separated strings info parsed for chess game
 * @param c string of character containing piece type, abcissa position, ordinate position
 * @returns object parding string as separate information string: piece type abbreviation, chessbaord position letter and number
 */
function parseCourse(c: string) {
	const pieceClassName: string = c.slice(0, -6);
	const posStart: string = String.fromCharCode(Number(c.slice(-4, -3)) + 65).toLowerCase() + Math.abs(Number(c.slice(-5, -4)) - 8);
	const posEnd: string = String.fromCharCode(Number(c.slice(-1)) + 65).toLowerCase() + Math.abs(Number(c.slice(-2, -1)) - 8);
	return {pieceClassName, posStart, posEnd}
}

export function courseToJSX(course: string): JSX.Element[] {
	const courseStep = course.split('_');
	const courseJSX: JSX.Element[] = courseStep.map((_, i) => {
		if (i % 2 === 0) {
			const roundWhite = parseCourse(courseStep[i]);
			const roundBlack = courseStep[i + 1] ? parseCourse(courseStep[i + 1]) : undefined;
			return (
				<div className="round">{i / 2 + 1}.
					<span className={`color ${pieceTranslate[roundWhite.pieceClassName]}`}>
						<span>{roundWhite.posStart}</span>{' - '}<span>{roundWhite.posEnd}</span>
					</span>
					{roundBlack &&
					<span className={`color ${pieceTranslate[roundBlack.pieceClassName]}`}>
						<span>{roundBlack.posStart}</span>{' - '}<span>{roundBlack.posEnd}</span>
					</span>}
				</div>
			);					
		} else {
			return (<></>)
		}
	});
	return courseJSX;
}


