import { type } from 'os';
import copyImg from '../assets/images/copy.svg';

import '../styles/room-code.scss';

type RoomCodeProps = {
    code: string | undefined,
}

export function RoomCode(props: RoomCodeProps) {
    function copyRoomCodeToClipboard() {
        if (props.code) {
            navigator.clipboard.writeText(props.code)
        }
    }

    return (
        <button className="room-code" onClick={copyRoomCodeToClipboard}>
            <div>
                <img src={copyImg} alt="Copiar código da sala"/>
            </div>
            <span>{props.code}</span>

        </button>
    )
}