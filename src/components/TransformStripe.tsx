type TransformProps = {
    colorWhite: boolean,
    selectPiece: (e: React.MouseEvent<Element, MouseEvent>) => void,
};

export default function TransformStripe({colorWhite, selectPiece}: TransformProps) {
	return (<div className={`transform ${colorWhite === true ? 'white' : 'black'}`} onClick={selectPiece}>
        <div className="piece Queen"></div>
        <div className="piece Knight"></div>
        <div className="piece Rook"></div>
        <div className="piece Bishop"></div>
    </div>)
}
