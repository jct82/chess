import { pieceTranslate } from "../utils/Models";

type WritePosProps = { 
    course: string
};

export default function WritePos({course}: WritePosProps) {
	const courseStep = course.split('_');
	let newCourseStep: Array<string[]> = [];
	courseStep.forEach((_, i) => {
		if (i % 2 === 0) {
			i < courseStep.length - 1 ?
			newCourseStep.push([courseStep[i], courseStep[i + 1]]) :
			newCourseStep.push([courseStep[i]]);
		}
	});
	/**
	 * Split infos contained in a string as separated strings info parsed for chess game
	 * @param c string of character containing piece type, abcissa position, ordinate position
	 * @returns object parding string as separate information string: piece type abbreviation, chessbaord position letter and number
	 */
	const parseCourse = (c: string) => {
		const equalIdx = c.indexOf('=');
		if (equalIdx < 0) return classicCourse(c);
		const currentPlay = c.slice(0, equalIdx - c.length);
		const transform = c.slice(equalIdx - c.length + 1);
		return {...classicCourse(currentPlay), transform: transform};
	}

	const classicCourse = (c: string) => {
		const pieceClassName: string = c.slice(0, -6);
		const posStart: string = String.fromCharCode(Number(c.slice(-4, -3)) + 65).toLowerCase() + Math.abs(Number(c.slice(-5, -4)) - 8);
		const posEnd: string = String.fromCharCode(Number(c.slice(-1)) + 65).toLowerCase() + Math.abs(Number(c.slice(-2, -1)) - 8);
		return {pieceClassName, posStart, posEnd, transform: ''}
	}

	return (
		<div className="course">
			{newCourseStep.map((c, i) => {
				const roundWhite = parseCourse(c[0]);
				const roundBlack = c.length === 2 ? parseCourse(c[1]) : undefined;
				return (
					<div key={`rp${i}`} className="round">{i + 1}.
						<span className={`color ${pieceTranslate[roundWhite.pieceClassName]}`}>
							<span>{roundWhite.posStart}</span>{' - '}<span>{roundWhite.posEnd}</span>
							{roundWhite.transform.length > 0 && <span className={`change ${pieceTranslate[roundWhite.transform]}`}> = </span>}
						</span>
						{roundBlack &&
						<span className={`color ${pieceTranslate[roundBlack.pieceClassName]}`}>
							<span>{roundBlack.posStart}</span>{' - '}<span>{roundBlack.posEnd}</span>
							{roundBlack.transform.length > 0 && <span className={`change ${pieceTranslate[roundBlack.transform]}`}></span>}
						</span>}
					</div>
				);	
			})}
		</div>
	)
}


