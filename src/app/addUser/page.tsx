import { connectToDB } from '@/lib/mongo';
import { toBoard } from '@/fentoboard';

export default function AddUser() {
    async function onSubmit(formData: FormData) {
        'use server'
        const {db} = await connectToDB();

        await db.collection("users")
        .insertOne({
            username: formData.get("username"),
            password: formData.get("password")
        })
    }

    async function getNextMove() {
        'use server'
        toBoard('rn1q1rk1/pp2b1pp/2p2n2/3p1pB1/3P4/1QP2N2/PP1N1PPP/R4RK1 b - - 1 11');
    }
    
    // async function getNextMove(formData: FormData, url = 'https://stockfish.online/api/s/v2.php', conf = 'rn1q1rk1/pp2b1pp/2p2n2/3p1pB1/3P4/1QP2N2/PP1N1PPP/R4RK1 b - - 1 11') {
    //     'use server'
    //     fetch(`${url}?fen=${conf}&depth=12`).then(response => response.json()).then(response => console.log('OOOOOOOOOOOOO', response));
    // }
    
    return(
        <div>
            <h1>Add player</h1>
            <form action={onSubmit}>
                <div>
                    <label>USER :</label>
                    <input type="text" name="username"/>
                </div>
                <div>
                    <label>PWD :</label>
                    <input type="password" name="password"/>
                </div>
                <button type="submit">VALIDATE</button>
            </form>
            <form action={getNextMove}>
                <button type="submit">check stockfish</button>
            </form>
        </div>
    )
}