import { useState, useEffect } from 'react';

import { database } from '../services/firebase';

type QuestionType = {
    id: string,
    author: {
        name: string,
        avatar: string
    },
    content: string,
    isHighLighted: boolean,
    isAnswered: boolean
}

type FirebaseQuestions = Record<string, {
    author: {
        name: string,
        avatar: string
    },
    content: string,
    isHighLighted: boolean,
    isAnswered: boolean
}>

export function useRoom(roomId: string | undefined) {
    const [ questions, setQuestions ] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState('');
    
    useEffect(() => {
        const roomRef = database.ref(`/rooms/${roomId}`);

        roomRef.on("value", room => {
            const firebaseQuestions = room.val().questions as FirebaseQuestions ?? {};

            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighLighted: value.isHighLighted,
                    isAnswered: value.isAnswered
                }
            });

            setTitle(room.val().title)
            setQuestions(parsedQuestions)
        })
    }, [roomId]);

    return { questions, title }
}